import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import UserFeedbacks from "./models/feedback.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {manual_system_instruction, context} from "./lib/gemini.js";
import summarizer_model from "./lib/gemini_summarizer.js";
import fs from "fs";
import ICUDataManager from "./lib/db_merger.js";
import path from "path";
import {
  GoogleGenerativeAI,

} from "@google/generative-ai";
const port = process.env.PORT || 3000;
const app = express();
const dataManager = new ICUDataManager("uploads");

const UPLOAD_DIR = './uploads';

const GOOGLE_API_KEY = process.env.VITE_GEMINI_PUBLIC_KEY;
const MONGO_DB_API_KEY = process.env.MONGO;
console.log("server running");
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

const connect = async () => {
  try {
    await mongoose.connect(MONGO_DB_API_KEY);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};

/**remove this method afterwards */
// Endpoint to drop all collections
app.delete("/api/drop-database", async (req, res) => {
  try {
    const collections = ['chats', 'userchats', 'userFeedbacks']; // Add collection names here
    
    for (const collectionName of collections) {
      const collectionExists = await mongoose.connection.db
        .listCollections({ name: collectionName })
        .hasNext();
      
      if (collectionExists) {
        await mongoose.connection.db.dropCollection(collectionName);
        console.log(`Dropped collection: ${collectionName}`);
      } else {
        console.log(`Collection ${collectionName} does not exist`);
      }
    }

    res.status(200).json({
      success: true,
      message: "Collections dropped successfully",
    });
  } catch (err) {
    console.error("Error dropping collections:", err);
    res.status(500).json({
      success: false,
      error: "Failed to drop collections",
      details: err.message,
    });
  }
});




app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  // api to create a new chat
  const userId = req.auth.userId;
  const { text, initialMessage, answer } = req.body;

  console.log("POST /api/chats called with text:", text, "initialMessage:", initialMessage, "answer:", answer);
  try {
    // CREATE A NEW CHAT
    const newChat = new Chat({
      userId,
      history: initialMessage 
        ? [{ role: "user", parts: [{ text }] },
        { role: "model", parts: [{ text: answer }] }  // Store initial answer
      ]
        : []
    });
    const savedChat = await newChat.save();

    // CHECK IF THE USERCHATS EXISTS
    const userChats = await UserChats.find({ userId: userId });

    // IF DOESN'T EXIST CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChats.save();
    } else {
      // IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );

    }
      console.log("Chat created with id: from backend", newChat._id);
      res.status(201).send(newChat._id);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating chat!");
  }
});

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  try {
    const userChats = await UserChats.find({ userId });
    res.status(200).send(userChats[0].chats);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching userchats!");
  }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });

    res.status(200).send(chat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chat!");
  }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  console.log("PUT /api/chats/:id");
  const userId = req.auth.userId;

  const { question, answer } = req.body;
  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }] }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updatedChat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding conversation!");
  }
});

async function getUserModelConfiguration(userId) {
  const userFeedback = await UserFeedbacks.findOne({ userId });

  
  return {
    systemInstruction: userFeedback?.systemInstruction || 'reply every answer starting with athena:',
    model: 'gemini-1.5-flash'
  };
}


// POST endpoint to send the text to the model and get a response
app.post('/api/generate-response', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { history, text } = req.body;
    const userId = req.auth.userId;
    // Retrieve user-specific model configuration
    const userModelConfig = await getUserModelConfiguration(userId);

    // Initialize model with user's specific configuration
    const model = genAI.getGenerativeModel({
      model: userModelConfig.model,
      systemInstruction: userModelConfig.systemInstruction + "\n STRICTLY FOLLOW BELOW INSTRUCTIONS ASWELL" + `::CONTEXT::\n${context}'\n'${manual_system_instruction}`
      // systemInstruction: userModelConfig.systemInstruction
    });

    
    const chat = model.startChat({
      history: history?.map(({ role, parts }) => ({
        role,
        parts: [{ text: parts[0].text }],
      }
    )),    });

    // Initialize the model and send the text to it
    const rslt = await chat.sendMessage([text]);
    const response = await rslt.response.text();
    res.status(200).send({ answer: response });
  } catch (err) {
    console.error('Error generating response:', err);
    res.status(500).json({ error: 'Something went wrong with the model' });
  }
});


export function generateRefinedSystemInstruction(feedbacks) {
  const aggregatedFeedback = feedbacks.map(fb => 
    `Feedback (Importance: ${fb.importance}): ${fb.message}`
  ).join('\n');

  return `
    REFINED RESPONSE GUIDELINES:
    ${aggregatedFeedback}

    Additional Refinement Principles:
    1. STRICTLY FOLLOW THE FEEDBACK GIVEN ABOVE
    2. Incorporate user feedback for continuous improvement
    3. Adapt communication style based on user preferences

  `;
}

app.post('/api/feedback', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { message, importance } = req.body;
    const userId = req.auth.userId;

    // Find or create user feedback document
    let userFeedback = await UserFeedbacks.findOne({ userId });

    // If userFeedback doesn't exist, create a new one
    if (!userFeedback) {
      userFeedback = new UserFeedbacks({
        userId,
        feedbacks: [],
        systemInstruction: 'Default system instruction',  // Initial system instruction
        lastUpdated: new Date(),
      });
    }

    // Create the new feedback object
    const newFeedback = {
      message,
      importance,
    };

    // Add the new feedback to the feedbacks array
    userFeedback.feedbacks.push(newFeedback);

    // Optionally, you can limit to the last 5 feedbacks
    const refinedInstruction = generateRefinedSystemInstruction(
      userFeedback.feedbacks.slice(-5) // Use last 5 feedbacks to generate system instruction
    );

    // Update the system instruction and lastUpdated fields
    userFeedback.systemInstruction = refinedInstruction;
    userFeedback.lastUpdated = new Date();

    // Save the updated feedback document
    await userFeedback.save();

    // Respond to the client
    res.status(200).json({
      message: 'Feedback processed successfully',
      success: true,
    });
  } catch (error) {
    console.error('Feedback processing error:', error);
    res.status(500).json({ error: 'Feedback processing failed' });
  }
});



const generateChatSummary = async (chatId, userId) => {
  try {
    // Fetch chat history for the given chatId and userId
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      throw new Error("Chat not found");
    }

    // Format history for the model
    const formattedHistory = chat.history.slice(0, 2).map(({ role, parts }) => ({
      role,
      parts: [{ text: parts[0].text }],
    }));

    // Initialize the model chat session
    const modelChat = summarizer_model.startChat({
      history: formattedHistory,
      generationConfig: {
      },
    });

    // Generate summary by sending a custom prompt
    const prompt = `Summarize this conversation in 15 words`;
    const response = await modelChat.sendMessage([prompt]);

    const summary = await response.response.text();

    return summary;
  } catch (error) {
    console.error("Error generating chat summary:", error);
    throw error;
  }
};

// GET endpoint to fetch chat overviews for history page
app.get("/api/chat-overviews", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    // Fetch the user's chat list
    const userChats = await UserChats.findOne({ userId });

    if (!userChats || !userChats.chats.length) {
      return res.status(200).send([]); // No chats available
    }

    // Prepare the chat overviews
    const overviews = await Promise.all(
      userChats.chats.map(async (chat) => {
        const chatData = await Chat.findOne({ _id: chat._id, userId });
        if (!chatData) return null;

        // Generate summary using the model function
        const summary = await generateChatSummary(chatData._id, userId);

        // Create a good title for the chat (could be based on the summary or some other logic)
        const title = summary.length > 15 ? summary.substring(0, 15) + "..." : summary;

        // Return chat overview object
        return {
          _id: chatData._id,
          last_modified: chatData.updatedAt,
          title,
          summary,
          createdAt: chat.createdAt,
        };
      })
    );

    // Filter out any null entries (if a chat no longer exists)
    res.status(200).send(overviews.filter(Boolean));
  } catch (err) {
    console.error("Error fetching chat overviews:", err);
    res.status(500).send("Error fetching chat overviews!");
  }
});


//get the merged db
app.get('/api/view-db', async (req, res) => {
  try {
      const data = await dataManager.getData();
      const uniqueCatarogicalValuesForFilters = dataManager.getUniqueCategoricalValues();
      res.json({ data, uniqueCatarogicalValuesForFilters });

      // res.json(data);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch ICU data' });
  }
});

import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = UPLOAD_DIR;
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use original filename, allowing overwrite
    const fileName = file.originalname;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // If file exists, remove it before uploading new version
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    cb(null, fileName);
  }
});

const upload = multer({ 
  storage: storage, 
  fileFilter: (req, file, cb) => {
    // Validate CSV file
    const allowedMimeTypes = ['text/csv', 'application/vnd.ms-excel'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!'), false);
    }
  }
});

//get the merged db
app.post('/api/store-csv', upload.single('file'), async (req, res) => {
  try {
 
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded or invalid file type' 
      });
    }
    
    // Get list of files in the upload directory
    const uploadDir = UPLOAD_DIR;
    const fileNames = fs.readdirSync(uploadDir)
      .filter(file => 
        path.extname(file).toLowerCase() === '.csv'
      );


    console.log('File uploaded successfully:', req.file.path);
    
    res.status(200).json({ 
      success: true, 
      message: 'File uploaded successfully', 
      filename: req.file.filename,
      filePath: req.file.path,
      files: fileNames
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload file',
      details: error.message 
    });
  }
});

app.get('/api/existing-csv-files', (req, res) => {
  try {
    const uploadDir = UPLOAD_DIR;
    
    // Check if upload directory exists
    if (!fs.existsSync(uploadDir)) {
      return res.status(200).json({ 
        success: true,
        existingFiles: [] 
      });
    }

    const fileNames = fs.readdirSync(uploadDir)
      .filter(file => 
        path.extname(file).toLowerCase() === '.csv'
      );

    res.status(200).json({ 
      success: true,
      existingFiles: fileNames 
    });
  } catch (error) {
    console.error('Error fetching existing CSV files:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve CSV files',
      existingFiles: [] 
    });
  }
});

app.delete('/api/delete-csv', (req, res) => {
  const { filename } = req.body;
  const uploadDir = UPLOAD_DIR;
  const filePath = path.join(uploadDir, filename);

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found' 
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.status(200).json({ 
      success: true, 
      message: 'File deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete file',
      error: error.message 
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});




// future work

// PRODUCTION
// app.use(express.static(path.join(__dirname, "../client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// });

app.get("/", async (req, res) => {
  console.log("Hello World!");
  res.status(200).send({ message:await fs.promises.readdir("patients_json_data") });
});

app.listen(port, () => {
  connect();
  console.log("Server running on 3000");
});