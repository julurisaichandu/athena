'use client';

import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  questionId: string;
  expandedQuestion: string | null;
  onToggleAnswer: (questionId: string) => void;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  questionId,
  expandedQuestion,
  onToggleAnswer,
}) => {
  return (
    <div>
      <button
        className="w-full text-left text-lg font-semibold text-gray-700 p-4 border border-gray-300 rounded-md"
        onClick={() => onToggleAnswer(questionId)}
      >
        {question}
      </button>
      {expandedQuestion === questionId && (
        <p className="mt-2 text-gray-600">{answer}</p>
      )}
    </div>
  );
};

const HelpPage: React.FC = () => {
  // State to track which FAQ item is expanded
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // Function to toggle the expansion of a question
  const toggleAnswer = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const faqs = [
    {
      id: 'question1',
      question: 'What is this platform about?',
      answer: 'This platform helps users manage and track their daily tasks efficiently. You can create, update, and delete tasks easily.',
    },
    {
      id: 'question2',
      question: 'How do I create a new task?',
      answer: 'To create a new task, click on the "New Task" button at the top of the dashboard, fill in the task details, and hit "Save".',
    },
    {
      id: 'question3',
      question: 'Can I edit or delete a task after creating it?',
      answer: 'Yes, you can easily edit or delete any task from the task list. Just click on the task and you\'ll see options to edit or delete it.',
    },
    {
      id: 'question4',
      question: 'Is my data secure on this platform?',
      answer: 'Yes, we use encryption to ensure the security of your data. Your information is stored safely on secure servers.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-8">
      {/* Big Heading */}
      <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>

      {/* FAQ Section */}
      <div className="space-y-6">
        {faqs.map((faq) => (
          <FAQItem
            key={faq.id}
            question={faq.question}
            answer={faq.answer}
            questionId={faq.id}
            expandedQuestion={expandedQuestion}
            onToggleAnswer={toggleAnswer}
          />
        ))}
      </div>
    </div>
  );
};

export default HelpPage;
