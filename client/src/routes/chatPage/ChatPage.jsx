import React, { useState } from "react";
import "./chatPage.css";
import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  const [feedbackTarget, setFeedbackTarget] = useState(null);

  const openFeedback = (message) => {
    setFeedbackTarget(message);
  };

  const closeFeedback = () => {
    setFeedbackTarget(null);
  };

  const submitFeedback = async (feedback) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedback),
      });
      const result = await response.json();

      if (result.success) {
        alert("Feedback submitted successfully!");
        closeFeedback();
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      alert("Failed to submit feedback!");
    }
  };

  console.log("Chat page called -> Data:", data);

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {isPending
            ? "Loading..."
            : error
            ? "Something went wrong!"
            : data?.history?.map((message, i) => (
              <div
              className={message.role === "user" ? "message user" : "message ai"}
              key={i}
            >
              {/* User or AI Icon */}
              <FontAwesomeIcon
                icon={message.role === "user" ? faUser : faRobot}
                className={message.role === "user" ? "user-icon" : "ai-icon"}
              />
            
              {/* Message Text */}
              <div className="message-content">
                <Markdown>{message.parts[0].text}</Markdown>
              </div>
            
              {/* Feedback Icons */}
              {message.role !== "user" && (
                <div className="feedback-container">
                  {/* Thumbs-Up Icon */}
                  <FontAwesomeIcon
                    icon={faThumbsUp} // Replace with `faThumbsUp` if you have FontAwesome Pro
                    className="feedback-icon"
                    onClick={() => openFeedback(message)}
                    title="Thumbs Up"
                  />
            
                  {/* Thumbs-Down Icon */}
                  <FontAwesomeIcon
                    icon={faThumbsDown} // Replace with `faThumbsDown` if you have FontAwesome Pro
                    className="feedback-icon"
                    onClick={() => openFeedback(message)}
                    title="Thumbs Down"
                  />
                </div>
              )}
            </div>
            
              ))}

          {data && <NewPrompt data={data} />}
        </div>

        {/* Feedback Card */}
        {feedbackTarget && (
          <div className="feedback-card">
            <h3>Provide Feedback</h3>
            <textarea
              placeholder="Write your feedback..."
              onChange={(e) =>
                setFeedbackTarget({
                  ...feedbackTarget,
                  message: e.target.value,
                })
              }
              value={feedbackTarget.message || ""}
            ></textarea>
            <label>
            Importance: 
              <div className="importance-buttons">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    className={`importance-btn ${feedbackTarget.importance === num ? 'selected' : ''}`}
                    onClick={() =>
                      setFeedbackTarget({
                        ...feedbackTarget,
                        importance: num,
                      })
                    }
                  >
                    {num}
                  </button>
                ))}
              </div>
            </label>

    
            <div className="feedback-buttons">
            <button style={{background:"#cd5656"}} onClick={closeFeedback}>Cancel</button>
            <button style={{background:"#4caf50"}} onClick={() => submitFeedback(feedbackTarget)}>Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;


