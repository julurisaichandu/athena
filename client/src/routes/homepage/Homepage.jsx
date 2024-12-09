import { Link } from "react-router-dom";
import "./homepage.css";

const Homepage = () => {

  return (
    <div className="homepage">
      <img src="/orbital.png" alt="some-image-orbital" className="orbital" />
      <div className="left">
        <h1>Athena</h1>
        <h2>Supercharge your patients data search using Athena</h2>
        <h3>
        Athena is an intelligent application that enables users to interact with medical data through a conversational interface. 
        It helps patients and doctors by answering queries, generating reports, navigating chat history, and providing a visual database representation.
        </h3>
        <Link to="/dashboard">Get Started</Link>
      </div>
      <div className="terms">
        <img src="/logo.png" alt="athena-logo" />
        {/* <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div> */}
      </div>
    </div>
  );
};

export default Homepage;
