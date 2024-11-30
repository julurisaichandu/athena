import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faHistory, faDatabase, faQuestionCircle, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import "./chatList.css";

const ChatList = () => {
  return (
    <div className="chatList">
      {/* <span className="title">DASHBOARD</span> */}
      <Link to="/dashboard">
        <FontAwesomeIcon icon={faComments} className="link-icon" /> Create a new Chat
      </Link>
      <Link to="/history">
        <FontAwesomeIcon icon={faClockRotateLeft} className="link-icon" /> History
      </Link>
      <Link to="/">
        <FontAwesomeIcon icon={faDatabase} className="link-icon" /> Database Visualizer
      </Link>
      <Link to="/Help">
        <FontAwesomeIcon icon={faQuestionCircle} className="link-icon" /> Help
      </Link>
      {/* <hr /> */}
      {/* <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span>Get unlimited access to all features</span>
        </div>
      </div> */}
    </div>
  );
};

export default ChatList;
