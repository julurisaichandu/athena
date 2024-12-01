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
- OpenAI or similar API key for AI responses (optional, depending on your setup)(we have used groq)

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
<!-- #### for authentication
To do this, first, paste the ENVs you copied from the Clerk dashboard into your `.env.local` file from earlier so it now looks something like this.
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<get this from clerk>"
CLERK_SECRET_KEY="<get this from clerk>"
```
follow this blog for authentication setup - https://conermurphy.com/blog/how-to-build-your-own-chatgpt-clone-using-clerk-aws-bedrock
-->
#### for backend
Create a .env file in the backend directory and define the following variables:

```bash
MONGO = mongodb+srv://<username>:<password>@cluster0.a2vyk.mongodb.net/?retryWrites=true&w=majority&appName=<clusetername>
CLIENT_URL = <frontend-url> in mycase it is - http://localhost:5173


CLERK_PUBLISHABLE_KEY= "get from clerk website, started with pk"
CLERK_SECRET_KEY= "get from clerk website, startes with sk"

VITE_GEMINI_PUBLIC_KEY ="get form gemini website"
```
#### for frontend
create .env inside client folder
```bash
VITE_CLERK_PUBLISHABLE_KEY=<"get from clerk website, started with pk>
VITE_API_URL = <backend url> , in my case it is "http://localhost:3000"
VITE_GEMINI_PUBLIC_KEY = "get form gemini website"

VITE_CLERK_PUBLISHABLE_KEY="get from clerk website, started with pk"
CLERK_SECRET_KEY="get from clerk website, startes with sk"
```
some are same in both backend and frontend .env

for setting up clerk credentials:
- create your clerk account using this quick start tutorial from clerk docs- https://clerk.com/docs/quickstarts/setup-clerk
- visit this site to get the publishable and secret keys info in the third step,"set environment" section - https://clerk.com/docs/references/nodejs/overview
- now paste the same in the front end and backend .env files. Check that names of both the keys for backend and frontend are different, howveer the values are same.

for getting the gemini api key:
- visit the google developers website - https://ai.google.dev/gemini-api/docs/api-key
- click on the get gemini api key button and after redirecting to the ai studio, you can generate your api key by clicking the "get api key" button.
- paste the api key into the backend .env file at "VITE_GEMINI_PUBLIC_KEY" 

for getting mongodb api:
- go to this page of mongodb docs and follow the section named "Create a free MongoDB Atlas cluster and load the sample data" and create a free mongodb cluster- https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database
- Remember your username and password for conenction in the next step
- in the nextwork access tab on the left, make the api access from all the ip address. for that, click on "add ip address" and select allow access from everywhere and then confirm. 
- now after creating a mongodb cluster, click the connect button in the overview page and go to drivers section and  you can find a string to connect to the cluster if you scrolldown in the drivers section. fill your username and password in the place holders
- in the nextwork access tab on the left, make the api access from all the ip address. for that, click on "add ip address" and select allow access from everywhere and then confirm. 


gemini models rate limits - https://ai.google.dev/gemini-api/docs/models/gemini#gemini-1.5-flash


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
We took reference from this project
https://conermurphy.com/blog/how-to-build-your-own-chatgpt-clone-using-clerk-aws-bedrock

Contributors:
Saichandu Juluri & Pranav Kompally
