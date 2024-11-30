import "./chatPage.css";
import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faRobot } from '@fortawesome/free-solid-svg-icons';

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

  console.log(data);

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
                  {/* User Icon */}
                  {message.role === "user" && (
                    <FontAwesomeIcon icon={faUser} className="user-icon" />
                  )}
                  {/* AI Icon */}
                  {message.role != "user"  && (
                    <FontAwesomeIcon icon={faRobot} className="ai-icon" />
                  )}

                  {/* Message Text */}
                  <div className="message-content">
                    <Markdown>{message.parts[0].text}</Markdown>
                  </div>
                </div>
              ))}

          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
