const express = require('express');
const bodyParser = require('body-parser');
const { getAiResponse } = require('./aiService'); // Assuming this is a separate module for interacting with Groq Llama
const cors = require('cors'); // Import the CORS middleware

const app = express();
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(
  cors({
    origin: 'http://localhost:3000', // Allow requests from your frontend origin
    methods: 'GET,POST', // Allowed HTTP methods
    credentials: true, // Allow cookies or authentication headers
  })
);
const fs = require('fs');
const path = require('path');

// Path to the JSON file where the conversations will be saved
const dbFilePath = path.join(__dirname, 'conversations.json');
// Simulating in-memory "database" for conversations
let conversationsDb = {}; // In-memory storage


const mutex = new Map();

const lockConversation = (key) => {
  if (mutex.has(key)) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!mutex.has(key)) {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });
  }
  mutex.set(key, true);
};

const unlockConversation = (key) => {
  mutex.delete(key);
};



// Helper function to get conversation from "database"
const getConversationFromDb = async (pk, sk) => {
  // const conversationKey = `${pk}:${sk}`;
  // return conversationsDb[conversationKey] || null;
  try {
    const data = fs.readFileSync(dbFilePath);
    const conversationsDb = JSON.parse(data);
    const conversationKey = `${pk}:${sk}`;
    return conversationsDb[conversationKey] || null;
  } catch (error) {
    console.error('Error reading from database file:', error);
    return null;
  }
};

// Helper function to save conversation to "database"
const saveConversationToDb = async (conversation) => {
  // const conversationsDb = readConversationsFromFile(); // Read current conversations from file
  const conversationKey = `${conversation.pk}:${conversation.sk}`;

  // Save or update the conversation
  conversationsDb[conversationKey] = conversation;

  // Write the updated conversations back to the JSON file
  fs.writeFileSync(dbFilePath, JSON.stringify(conversationsDb, null, 2)); // Save the data to file with pretty-print
};

app.post('/start-conversation', async (req, res) => {
  // console.log('Received request to start conversation:', req.body);
  const { pk, sk, uuid, createdAt, updatedAt, title, conversation, status } = req.body;

  try {
    // Simulating storing conversation object in the "database"
    const newConversation = {
      pk,
      sk,
      uuid,
      createdAt,
      updatedAt,
      title,
      conversation,
      status,
    };

    // Call LLM to generate AI response
    const aiResponse = await getAiResponse(newConversation);
    // console.log('aiResponse-->', aiResponse);

    // Update conversation with AI's response
    newConversation.conversation.push({
      author: 'AI',
      content: aiResponse,
    });

    // Store the new conversation in the "database"
    await saveConversationToDb(newConversation);

    return res.status(200).json(newConversation);
  } catch (error) {
    console.error('Error handling conversation:', error);
    res.status(500).json({ error: 'Failed to process conversation' });
  }
});

app.post('/continue-conversation', async (req, res) => {
  const { pk, sk, prompt } = req.body;
  const key = `${pk}:${sk}`;
  
  await lockConversation(key); // Lock the conversation
  
  try {
    const conversation = await getConversationFromDb(pk, sk);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const updatedConversation = JSON.parse(JSON.stringify(conversation));

    // Append the new user prompt to the cloned conversation
    updatedConversation.conversation.push({
      author: pk, // User's primary key
      content: prompt,
    });

    // console.log('conversation after appending-->', updatedConversation);
    const aiResponse = await getAiResponse(updatedConversation);
    updatedConversation.conversation.push({ author: 'AI', content: aiResponse });
    
    await saveConversationToDb(updatedConversation);

    res.status(200).json(updatedConversation);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process conversation' });
  } finally {
    unlockConversation(key); // Unlock the conversation
  }
});


const getConversationFromDbUsingUuid = async (uuid) => {
  const conversations = Object.values(conversationsDb);
  return conversations.find((conv) => conv.uuid === uuid);
};
app.get('/conversation/:uuid', async (req, res) => {
  const { uuid } = req.params;
  // console.log('Received request to fetch conversation:', uuid);
  try {
  
    // Loop through all conversations and find the one with the matching UUID
    const conversation = await getConversationFromDbUsingUuid(uuid);
    
    // console.log("first conversation for the uuid-->", conversation);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Return the conversation data
    return res.status(200).json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});


// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
