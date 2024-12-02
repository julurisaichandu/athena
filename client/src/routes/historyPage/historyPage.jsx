import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import "./historyPage.css";

const HistoryPage = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chat-overviews`, {
        credentials: "include",
      }).then((res) => res.json()),
    staleTime: 0, // Data becomes stale immediately, triggering refetch on return
    cacheTime: Infinity, // Keeps data cached but allows refetch on remount
    refetchOnWindowFocus: false, // Refetches when the window regains focus
    refetchOnMount: true, // Refetches when the component is mounted again
  });

  // console.log("History page called -> Data:", data);
//  const isLoading = false;
//   const  error = false;

  return (
    <div>
      <h1>History Page</h1>

      <div className="cards-container">
        {isLoading ? (
          "Loading..."
        ) : error ? (
          "Something went wrong!"
        ) : (
          data?.map((chat) => (
            <div className="card" key={chat._id}>
              <Link to={`/dashboard/chats/${chat._id}`} className="card-link">
                <h3 className="card-title">{chat.title}</h3>
                <hr />
                <p className="card-summary">{chat.summary}</p>
                <hr />
                <p className="card-date">
                  Last Modified: {new Date(chat.last_modified).toLocaleString()}
                </p>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;

