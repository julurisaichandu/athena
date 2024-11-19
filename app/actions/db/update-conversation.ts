// /app/actions/send-query.ts

export const updateConversation = async (uuid: string, prompt: string, userId: string|undefined) => {
    const body = {
    pk: userId,
      sk: `CONVERSATION#${uuid}`,
      prompt: prompt,
    };
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/continue-conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send query');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error sending query:', error);
      throw error;
    }
  };
  