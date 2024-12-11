# Athena - Patients records retrieval and Visualization AI

Athena is an intelligent application that enables doctors to interact with medical data of their patients through a conversational interface. It helps doctors by answering queries, navigating chat history for easy access, and providing a visual representation of the patients database.

<div style="text-align: center;">
<img src="https://github.com/user-attachments/assets/ee63ac8f-5905-4049-8576-f45f0d40798e" width="75%" height="75%" alt="athena-main-page.png" style="align:centre"/></div>


## Features
- **Chat with the Database**: Users can interact with the database through a chat interface, asking questions and receiving answers.
- **Chat History**: Navigate and explore previous conversations for review or further insights.
- **Database Visualization**: Explore the database visually to see the details of patient data such as names, diagnoses, medication records, etc.
- **Help Section**: An FAQ section to help users understand how to use the application and details explaining each page.

## Prerequisites
- Node.js v14.x or higher
- npm
- Gemini API key for AI chat responses
- MongoDB API for database
- Clerk authenticator API key

## Setup & Installation
Follow these steps to get the application running on your local machine:

### 1. Clone the Repository
```bash
git clone https://github.com/julurisaichandu/athena.git
cd athena # navigate into athena directory
```
### 2. Install dependencies
```bash
cd client   # navigate into client directory and install dependencies
npm install

cd backend   # navigate into backend directory and install dependencies
npm install

```

### 3. Set Up Environment variables

### Backend
Create a .env file in the backend directory root and define the following variables:

```bash
MONGO = mongodb+srv://<username>:<password>@cluster0.a2vyk.mongodb.net/?retryWrites=true&w=majority&appName=<clusetername> # more information for api given below

CLIENT_URL = <frontend-url> # eg. http://localhost:5173

CLERK_PUBLISHABLE_KEY = <pk.....>   # get from clerk website, starts with pk, more information for api given below
CLERK_SECRET_KEY = <sk....>    # get from clerk website, starts with sk, more information for api given below

VITE_GEMINI_PUBLIC_KEY = <Gemini API key>    # get form gemini website, more instructions for setting up gemini api key is mentioned below
```
### Frontend
create .env inside client folder
```bash

VITE_API_URL = <backend url> # eg. "http://localhost:3000"
VITE_GEMINI_PUBLIC_KEY = <Gemini API key>  # get form gemini website, same as the VITE_GEMINI_PUBLIC_KEY

VITE_CLERK_PUBLISHABLE_KEY = <pk.....>   # get from clerk website, same as CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY = <sk....>    # get from clerk website, same as CLERK_SECRET_KEY
```
some environment variables are same in both backend and client .env files

#### For setting up Clerk authenticator API:
- Create your clerk account using this quick start tutorial from clerk docs- https://clerk.com/docs/quickstarts/setup-clerk
- visit this site to get the publishable and secret keys info in the third step,"set environment" section - https://clerk.com/docs/references/nodejs/overview
- now paste the same in the front end and backend .env files. Check that names of both the keys for backend and frontend are different, however the values are same.

#### For getting the gemini api key:
- visit the google developers website - https://ai.google.dev/gemini-api/docs/api-key
- click on the get gemini api key button and after redirecting to the ai studio, you can generate your api key by clicking the "get api key" button.
- paste the api key into the backend .env file at "VITE_GEMINI_PUBLIC_KEY" 
- sometims you need to login into google cloud account to be able to get the gemini api key
- gemini models rate limits - https://ai.google.dev/gemini-api/docs/models/gemini#gemini-1.5-flash

#### For getting MongoDb API:
- Go to given link of mongodb docs and follow the section named "Create a free MongoDB Atlas cluster and load the sample data" and create a free mongodb cluster- https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database
- Remember your username and password for conenction in the next step
- In the nextwork access tab on the left, make the api access from all the ip address. for that, click on "add ip address" and select allow access from everywhere and then confirm. 
- Now after creating a mongodb cluster, click the connect button in the overview page and go to drivers section and  you can find a string to connect to the cluster if you scrolldown in the drivers section. fill your username and password in the place holders
- In the nextwork access tab on the left, make the api access from all the ip address. for that, click on "add ip address" and select allow access from everywhere and then confirm. 


### 5. Running the frontend
```bash
cd client # navigate only if not already inside the root of client
npm run dev
```
### 6. Running the backend
from the root folder, go to backend directory and run expressjs backend
```bash
cd backend  # now your current dir location should be athena/backend. navigate only if not already inside the root of backend
npm run start
```

## Tech Stack
- React.js
- HTML, CSS
- Clerk
- MongoDB
- Gemini API
- Expressjs

# Screen shots
There are screenshots of our project in the screenshots folder in the athena directory


# Video for final submission
#### Drive Link - 
- https://drive.google.com/file/d/1JsrE1EWyfPQi8SQmJSOPeF7fnMeftEiO/view?usp=sharing

# Contributors:
Saichandu Juluri & Pranav Kompally
