import { HomePromptInput } from '@/components/prompt-inputs/home';

export default function Home() {
  console.log('app/page.tsx');
  return (
    <main className="flex h-full flex-col items-center justify-between p-12">
      <div className="flex flex-col items-center gap-1 my-auto">
        <h1 className="font-bold text-2xl">Hello Doctor, How can I help you today?</h1>
        <p>Ask me anything about your patients!</p>
      </div>
      <HomePromptInput />
    </main>
  );
}
