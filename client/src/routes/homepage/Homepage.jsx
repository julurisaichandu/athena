import { Link } from "react-router-dom";
import "./homepage.css";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

const Homepage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");

  return (
    <div className="homepage">
      <img src="/orbital.png" alt="" className="orbital" />
      <div className="left">
        <h1>Athena</h1>
        <h2>Supercharge your patients data search using Athena</h2>
        <h3>
        Athena is an intelligent application that enables users to interact with medical data through a conversational interface. 
        It helps patients and doctors by answering queries, generating reports, navigating chat history, and providing a visual database representation.
        </h3>
        <Link to="/dashboard">Get Started</Link>
      </div>
      {/* <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="" className="bot" />

        </div>
      </div> */}
      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
