
// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { Link } from "react-router-dom";
// import "./historyPage.css";

// const HistoryPage = () => {
//   const { isPending, error, data } = useQuery({
//         queryKey: ["userChats"],
//         queryFn: () =>
//           fetch(`${import.meta.env.VITE_API_URL}/api/chat-overviews`, {
//             credentials: "include",
//           }).then((res) => res.json()),
//       });

//   // const isPending = false;
//   // const  error = false;
// const mock_data = [{_id: '674a744086c39ab4eca506d4', last_modified: '2024-11-30T03:03:13.717Z', title: 'The conversation began with two greetings ("hi"). ...', summary: 'The conversation began with two greetings ("hi"). … a request to summarize the conversation itself.\n', createdAt: '2024-11-30T02:10:42.800Z'},

// {_id: '674a744386c39ab4eca506db', last_modified: '2024-11-30T02:11:26.688Z', title: 'A brief, friendly exchange initiated with two "hi"...', summary: 'A brief, friendly exchange initiated with two "hi" greetings, followed by an offer of assistance.\n', createdAt: '2024-11-30T02:10:42.800Z'},

// {_id: '674a749986c39ab4eca50705', last_modified: '2024-11-30T02:12:46.080Z', title: 'A brief conversation began with two "hi" greetings...', summary: 'A brief conversation began with two "hi" greetings…of assistance.  No other details were exchanged.\n', createdAt: '2024-11-30T02:10:42.800Z'},

// {_id: '674a74bc86c39ab4eca50722', last_modified: '2024-11-30T02:14:13.522Z', title: 'The conversation consisted of three greetings exch...', summary: 'The conversation consisted of three greetings exch… participants.  No other information was shared.\n', createdAt: '2024-11-30T02:10:42.800Z'},

// {_id: '674a74fa86c39ab4eca50763', last_modified: '2024-11-30T02:14:18.905Z', title: 'A brief, informal conversation started with two "h...', summary: 'A brief, informal conversation started with two "hi" greetings, followed by an offer of assistance.\n', createdAt: '2024-11-30T02:10:42.800Z'},

// {_id: '674a750b86c39ab4eca5078d', last_modified: '2024-11-30T02:14:37.844Z', title: 'The conversation began with a user asking if they ...', summary: 'The conversation began with a user asking if they …sion on subjective morality and self-reflection.\n', createdAt: '2024-11-30T02:10:42.800Z'},
 
// {_id: '674a756186c39ab4eca507a9', last_modified: '2024-11-30T02:16:01.323Z', title: 'The conversation consisted only of a single greeti...', summary: 'The conversation consisted only of a single greeting: "hi".  No other content was provided.\n', createdAt: '2024-11-30T02:10:42.800Z'},

// {_id: '674a758f86c39ab4eca507b8', last_modified: '2024-11-30T02:16:52.948Z', title: 'The conversation began with a question about the c...', summary: 'The conversation began with a question about the c…on requests and ultimately ended inconclusively.\n', createdAt: '2024-11-30T02:10:42.800Z'},

// {_id: '674a764686c39ab4eca507f3', last_modified: '2024-11-30T02:19:51.738Z', title: 'The conversation began with two greetings ("hi"). ...', summary: `The conversation began with two greetings ("hi"). …is summary is itself the conversation's summary.\n`, createdAt: '2024-11-30T02:10:42.800Z'},

// {_id: '674a76a686c39ab4eca50832', last_modified: '2024-11-30T02:21:32.055Z', title: 'The conversation began with pleasantries,  "How ar...', summary: 'The conversation began with pleasantries,  "How ar…scribed my functionality and offered assistance.\n', createdAt: '2024-11-30T02:10:42.800Z'},

// {_id: '674a76f2efbfe5cbbcf2f0cd', last_modified: '2024-11-30T02:22:49.414Z', title: 'The conversation began with two greetings ("hi"). ...', summary: `The conversation began with two greetings ("hi"). …is summary is itself the conversation's summary.\n`, createdAt: '2024-11-30T02:22:35.715Z'},
//     ]
// console.log("history page called----------------------------------->");
//   return (
//     <div>
//       <h1>History Page</h1>

//       <div className="cards-container">
//         {isPending ? (
//           "Loading..."
//         ) : error ? (
//           "Something went wrong!"
//         ) : (
//           data?.map((chat) => (
//             <div className="card" key={chat._id}>
//               <Link to={`/dashboard/chats/${chat._id}`} className="card-link">
//                 <h3 className="card-title">{chat.title}</h3>
//                 <hr />
//                 <p className="card-summary">{chat.summary}</p>
//                 <hr />
//                 <p className="card-date">
//                   Last Modified: {new Date(chat.last_modified).toLocaleString()}
//                 </p>
//               </Link>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };


// export default HistoryPage;


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

  console.log("History page called -> Data:", data);

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

