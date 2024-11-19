export const getOneConversation = async (uuid:any) => {
    try {
      // Send a GET request to your backend API to fetch the conversation using the uuid
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversation/${uuid}`, {
        method: 'GET', // Assuming your backend has an endpoint for fetching a conversation by UUID
      });

      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }

      // Parse the response as JSON
      const data = await response.json();

      // Set the conversation state with the fetched data
    //   setConversation(data);
    return data
    }
    catch (error) {
      console.error('Error fetching FIRST conversation:', error);
      throw error;
    }
}