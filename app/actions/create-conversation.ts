'use server';

// import { db } from '@/config';
import { conversationSchema } from '@/schema';
import { IPromptStatus } from '@/types';
// import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { currentUser } from '@clerk/nextjs';
import { randomUUID } from 'crypto';

export const createConversation = async (prompt: string) => {
  console.log('create-Conversation------------------>', prompt);
  const currentUserData = await currentUser();

  if (!currentUserData) {
    throw new Error('User not found');
  }

  // Generate a randomUUID for the new conversation this will be used for the page UUID
  const uuid = randomUUID();
  const conversationUuid = `CONVERSATION#${uuid}`;
  // console.log('conversationUuid', conversationUuid);
  // Build the input for creating the new item in the DB
  const createBody = {
    pk: `USER#${currentUserData?.id}`,
    sk: conversationUuid,
    uuid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: `${prompt.slice(0, 20)}...`,
    conversation: [
      {
        author: `USER#${currentUserData?.id}`,
        content: prompt,
      },
    ],
    status: IPromptStatus.ACTIVE,
  };

  async function createAndStore(body: any){
    try {
      console.log("create and store", `${process.env.NEXT_PUBLIC_API_URL}/start-conversation`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/start-conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        throw new Error('Failed to start conversation');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }
  // console.log('createBody', conversationSchema.parse(createBody));
  try {
    console.log('createBody and store body ===============>', createBody);
    createAndStore(createBody);
    // Create the item in the DB using the prepared body
    // await db.send(
    //   new PutCommand({
    //     TableName: process.env.DB_TABLE_NAME,
    //     Item: createBody,
    //     ReturnValues: 'ALL_OLD',
    //   })
    // );

    // Return the created data to the frontend
    return conversationSchema.parse(createBody);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create conversation');
  }
};
