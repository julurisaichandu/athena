import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./dashboardPage.css";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (text) => {

          // Generate response before creating chat
    const responseResult = await fetch(`${import.meta.env.VITE_API_URL}/api/generate-response`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        history: [], 
        text 
      }),
    });

    const { answer } = await responseResult.json();
    console.log("Answer from dashboard:", answer);

      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          text,
          answer,
          initialMessage: true // Add a flag to prevent duplicate storage
        }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      console.log("Chat created with id:", id);
      navigate(`/dashboard/chats/${id}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    mutation.mutate(text);
  };
  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <h1>Athena</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="" />
            <span>History</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="" />
            <span>Help</span>
          </div>
          <div className="option">
            <img src="/code.png" alt="" />
            <span>Data visualizer</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder="Search patients data..." />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
