import express from "express";
import cors from "cors";
import path from "path";
import url, { fileURLToPath } from "url";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import model from "./lib/gemini.js";

const port = process.env.PORT || 3000;
const app = express();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
};



app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;

  try {
    // CREATE A NEW CHAT
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
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

      res.status(201).send(newChat._id);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating chat!");
  }
});

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  console.log("UserChats");
  const userId = req.auth.userId;
  console.log(userId);
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

// POST endpoint to send the text to the model and get a response
app.post('/api/generate-response', async (req, res) => {
  try {
    const { history, text } = req.body;

    const chat = model.startChat({
      history: history?.map(({ role, parts }) => ({
        role,
        parts: [{ text: parts[0].text }],
      })),
      generationConfig: {
        // Optional configuration for generating responses, e.g., max tokens
      },
    });

    // Initialize the model and send the text to it
    const rslt = await chat.sendMessage([text]);
    const response = await rslt.response.text();
    console.log(response);
    res.status(200).send({ answer: response });
  } catch (err) {
    console.error('Error generating response:', err);
    res.status(500).json({ error: 'Something went wrong with the model' });
  }
});


// import Chat from "./models/chat.js";
// import model from "./lib/gemini.js";

const generateChatSummary = async (chatId, userId) => {
  try {
    // Fetch chat history for the given chatId and userId
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      throw new Error("Chat not found");
    }

    // Format history for the model
    const formattedHistory = chat.history.map(({ role, parts }) => ({
      role,
      parts: [{ text: parts[0].text }],
    }));

    // Initialize the model chat session
    const modelChat = model.startChat({
      history: formattedHistory,
      generationConfig: {
      },
    });

    // Generate summary by sending a custom prompt
    const prompt = `Please summarize this conversation in 30 words:`;
    const response = await modelChat.sendMessage([prompt]);

    const summary = await response.response.text();

    return summary;
  } catch (error) {
    console.error("Error generating chat summary:", error);
    throw error;
  }
};

export default generateChatSummary;


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
        const title = summary.length > 50 ? summary.substring(0, 50) + "..." : summary;

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

    console.log(overviews);

    // Filter out any null entries (if a chat no longer exists)
    res.status(200).send(overviews.filter(Boolean));
  } catch (err) {
    console.error("Error fetching chat overviews:", err);
    res.status(500).send("Error fetching chat overviews!");
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});






// PRODUCTION
// app.use(express.static(path.join(__dirname, "../client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// });

// app.get("/", async (req, res) => {
//   console.log("Hello World!");
//   res.status(200).send({ message: "Hello World!" });
// });

app.listen(port, () => {
  connect();
  console.log("Server running on 3000");
});