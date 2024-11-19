'use client';

import { createConversation } from '@/app/actions/create-conversation';
import { GenericPromptInput } from './generic';
import { PromptFormInputs } from '@/types';
import { useRouter } from 'next/navigation';

export function HomePromptInput() {
  const router = useRouter();
  console.log('home page-------------->'); 

  // onSubmit hanlder to create a new conversation in the DB based on the user's prompt and then redirect to that conversation's page using the UUID
  const onSubmitHandler = async (data: PromptFormInputs) => {
    const { uuid } = await createConversation(data.prompt);
    console.log('uuid from HomePromptInput', uuid); 
    router.push(`/${uuid}`);
  };

  return <GenericPromptInput onSubmitHandler={onSubmitHandler} />;
}
