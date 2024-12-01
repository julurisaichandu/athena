import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import fs from "fs";
import path from "path";

const cachedPatientsContext = null;

async function getPatientsDetails() {
  if (cachedPatientsContext) {
    console.log("Returning cached context");
    return cachedPatientsContext;
  }
  try {
    const inputDirectory = "patients_json_data";
    // Get all files in the directory
    const files = await fs.promises.readdir(inputDirectory);

    // Filter for JSON files
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    const jsonData = [];

    // Read and parse each JSON file
    for (const jsonFile of jsonFiles) {
      const filePath = path.join(inputDirectory, jsonFile);
      const fileContents = await fs.promises.readFile(filePath, 'utf-8');
      jsonData.push(...JSON.parse(fileContents));
    }

    // Convert JSON data to a string context
    const cachedContext = jsonData.map(entry => JSON.stringify(entry)).join('\n');
    console.log("Context generated and cached");
    return cachedContext;

  } catch (error) {
    console.error('Error reading JSON files:', error);
    throw error;
  }

}


const safetySetting = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_PUBLIC_KEY);
const context = await getPatientsDetails();
const system_instruction = `
    STRICT RESPONSE GUIDELINES:
    1. ONLY use information directly present in the provided context above.
    2. If ANY requested information is NOT in the context:
       - Respond with "Information not available in the provided context."
       - DO NOT generate, guess, or fabricate any details.
    3. Match the response format exactly to the user's request.
    4. If unsure about any part of the response, state that explicitly.
    5. Prioritize accuracy over completeness.
    
    CRITICAL RULES:
    - NEVER invent or assume any information
    - ALWAYS cite the source of information when possible
    - If context is insufficient, clearly state the limitation
    - Maintain patient confidentiality and privacy at all times
    
    FORMATTING INSTRUCTIONS:
    - Use clear, precise language
    - Directly quote context when applicable
    - Use [REDACTED] for any sensitive information
    `;
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  safetySetting,
  systemInstruction: `::CONTEXT::\n${context}'\n'${system_instruction}`,

});
const  tokens = await model.countTokens(`::CONTEXT::\n${context}'\n'${system_instruction}`);
console.log("tokens count---------------------------->", tokens);
export default model;
