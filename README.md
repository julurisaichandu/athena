# Athena - Medical Document and Report Analysis

Athena is an intelligent application that enables users to interact with medical data through a conversational interface. It helps patients and doctors by answering queries, generating reports, navigating chat history, and providing a visual representation of the database.

## Features
- **Chat with the Database**: Users can interact with the database through a chat interface, asking questions and receiving answers.
- **Generate Reports**: Users can generate reports related to a patient by chatting with the system.
- **Chat History**: Navigate and explore previous conversations for review or further insights.
- **Database Visualization**: Explore the database visually to see the details of patient data such as names, diagnoses, attendance records, etc.
- **Help Section**: An FAQ section to help users understand how to use the application and troubleshoot common issues.

## Prerequisites
- Node.js v14.x or higher
- npm or yarn
- MongoDB (for production or local environment setup)
- OpenAI or similar API key for AI responses (optional, depending on your setup)

## Setup & Installation
Follow these steps to get the application running on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/julurisaichandu/athena.git
cd athena
```
### 2. Install dependencies
```bash
npm install
```

### 3. Set Up Environment variables
#### for authentication
To do this, first, paste the ENVs you copied from the Clerk dashboard into your `.env.local` file from earlier so it now looks something like this.
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<get this from clerk>"
CLERK_SECRET_KEY="<get this from clerk>"
```
follow this blog for authentication setup - https://conermurphy.com/blog/how-to-build-your-own-chatgpt-clone-using-clerk-aws-bedrock

#### for backend
Create a .env file in the root directory and define the following variables:

```bash
NEXT_PUBLIC_API_URL = "http://localhost:<backend port>"

In athena/backend/index.js, fill the GROQ_API_KEY and PORT variables.
```
if these doesnt work by keeping these in .env.local, try to create .env file in the root folder and copy paste these values.

### 5. Running the frontend
run frontend using this below command

```bash
npm run dev
```
### 6. Running the backend
from the root folder, go to backend directory and run expressjs backend
```bash
cd backend  # now your current dir location should be athena/backend
node index.js
```

## Tech Stack

- Next.js
- Tailwind CSS & Shadcn/ui
- Clerk

# Screen shots
There are screenshots of our project int he screenshots folder in the athena directory

# feedback plan
Please refer to feedbackplan.pdf file in the the athena directory

## Note
We took refrerence from this project
https://conermurphy.com/blog/how-to-build-your-own-chatgpt-clone-using-clerk-aws-bedrock