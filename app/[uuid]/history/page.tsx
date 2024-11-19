'use client';

interface ConversationCardProps {
  name: string;
  lastEdited: string;
  info: string;
}

function ConversationCard({ name, lastEdited, info }: ConversationCardProps) {
    return (
      <div className="border rounded-lg p-6 shadow-md bg-gray-100 hover:shadow-lg transition-all m-4">
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-sm text-gray-500">Last Edited: {lastEdited}</p>
        <p className="text-sm mt-2 text-gray-700">{info}</p>
      </div>
    );
  }
  

export default function ConversationHistory() {
  // Mock data for the history of conversations
  const conversations = [
    {
      name: 'Conversation with AI Assistant',
      lastEdited: '2024-11-17',
      info: 'Discussed ideas about AI and its applications in healthcare.',
    },
    {
      name: 'Project Discussion',
      lastEdited: '2024-11-16',
      info: 'Talked about the requirements for the Athena project.',
    },
    {
      name: 'General Inquiry',
      lastEdited: '2024-11-15',
      info: 'Asked about the implementation of a chatbot interface.',
    },
  ];
//   import React from 'react';

//   const HelloWorld: React.FC = () => {
//       return (
//           <div>
//               <h1>Hello, World!</h1>
//           </div>
//       );
//   };
  
//   export default HelloWorld;
  return (
<div className="container mx-auto p-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {conversations.map((conversation, index) => (
      <ConversationCard
        key={index}
        name={conversation.name}
        lastEdited={conversation.lastEdited}
        info={conversation.info}
      />
    ))}
  </div>
</div>

  );
}
