'use client';

import { updateConversation } from '@/app/actions/db/update-conversation';
import { GenericPromptInput } from './generic';
import { PromptFormInputs } from '@/types';
import { useConversation } from '@/context/conversation-context';

interface IProps {
  uuid: string;
}

export function ConversationPromptInput({ uuid }: IProps) {
  const { setConversation,conversation, isGenerating } = useConversation();
  // const mockConversation = {
  //   uuid: 'd685c485-6173-492c-9ee0-92500cd24aba',
  //   pk: 'user-123',
  //   sk: 'mock-sk',
  //   createdAt: '2024-01-01T00:00:00Z',
  //   updatedAt: '2024-01-01T01:00:00Z',
  //   title: 'Mock Conversation',
  //   conversation: [
  //     { author: 'ai', content: 'Hello, Dr. John! How can I assist you today?' },
  //     { author: 'user-123', content: 'Hi, could you provide me with the details of patient "X"?' },
  //     { author: 'user-123', content: 'Thank you for the details!' },
  //     { author: 'ai', content: 'You’re welcome, Dr. John. Feel free to reach out if you have any further questions!' },
  //   ],
  //   status: 'ACTIVE' as 'ACTIVE' | 'DEPRECATED'
  // };

  // onSubmit handler to update the conversation in the DB with the user's new prompt and update the data in context
  const onSubmitHandler = async (data: PromptFormInputs) => {
    const updatedConversation = await updateConversation(uuid, data.prompt, conversation?.pk);
    setConversation(updatedConversation);
  };

  return (
    <GenericPromptInput
      onSubmitHandler={onSubmitHandler}
      isGenerating={isGenerating}
    />
  );
}
