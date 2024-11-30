import { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // const chat = model.startChat({
  //   history: 
  //     data?.history.map(({ role, parts }) => ({
  //       role,
  //       parts: [{ text: parts[0].text }],
  //     })),
    
  //   generationConfig: {
  //     // maxOutputTokens: 100,
  //   },
  // });

  const endRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
  
    mutationFn: ({ question, answer }) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setQuestion("");
          setAnswer("");
       
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const add = async (text, isInitial) => {
    console.log("add triggered with text:", text);
    if (!isInitial) setQuestion(text);
  
    try {
      console.log("Sending message...");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate-response`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history: data?.history || [], // Send the chat history to the backend
          text, // Send the user input to the backend
        }),
      });
  
      const result = await response.json();
      console.log("Result from backend:", result);
  
      setAnswer(result.answer); // Update the answer state
  
      // Immediately call mutation with the latest question and answer
      mutation.mutate({ question: text, answer: result.answer });
    } catch (err) {
      console.error("Error in add function:", err);
    }
  }

  const handleSubmit = async (e) => {
    console.log("handleSubmit triggered with text:", e.target.text.value);
    e.preventDefault();
    console.log("in handle submit");
    const text = e.target.text.value;
    if (!text) return;

    add(text, false);
  };

  // IN PRODUCTION WE DON'T NEED IT
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
    console.log("in use effect, is initial true");

        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);
  // console.log("data", data);

  return (
    <>
      {/* ADD NEW CHAT */}
   
      {question && <div className="message user">{question}</div>}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        {/* <input id="file" type="file" multiple={false} hidden /> */}
        <input type="text" name="text" placeholder="Ask anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
