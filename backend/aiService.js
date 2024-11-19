const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: "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" });

async function getAiResponse(conversation) {
  // try {
    // console.log("Generating AI response for conversation:", conversation);
    const prompt = conversation.conversation[conversation.conversation.length - 1].content;    
    console.log("prompt-->", prompt);
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192", // specify model
    });

    // console.log("chat completion output from groq-->",completion.choices[0].message.content);
    return completion.choices[0].message.content;
  // } catch (error) {
  //   console.error("Error generating AI response:", error);
  //   throw new Error("Failed to generate AI response");
  // }
}

module.exports = { getAiResponse };  // Use CommonJS syntax
