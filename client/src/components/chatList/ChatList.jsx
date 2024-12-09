import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { faComments, faTrash, faSpinner, faFileUpload, faDatabase, faQuestionCircle, faClockRotateLeft, faFile } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


import "./chatList.css";

const ChatList = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);

  const drop = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/drop-database`, {
        method: 'DELETE',
      });
      const result = await response.json();
  
      if (result.success) {
        alert("Database dropped successfully!");
        setExistingFiles([]); // Clear existing files
        reloadDBPage();
      } else {
        alert(result.message || "Failed to drop the database");
      }
    } catch (error) {
      console.error("Error dropping the database:", error);
      alert("Error dropping the database.");
    }
  };
  
  
  const reloadDBPage = () => {

    // Reload the page to reflect the changes
    // future changes
  // navigate('/db-visualizer', { replace: true });
  };


  const handleFileDelete = async (fileName) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/delete-csv`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: fileName })
      });

      const result = await response.json();

      if (result.success) {
        // Remove the file from the existing files list
        setExistingFiles(existingFiles.filter(file => file !== fileName));
        reloadDBPage();
        alert(`${fileName} deleted successfully`);
      } else {
        alert(result.message || 'Failed to delete the file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting the file');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      setLoading(true);
      
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/store-csv`, {
          method: "POST",
          body: formData,
        });
        const responseJson = await response.json();
        
        if (responseJson.success) {
          alert("CSV uploaded and processed successfully!");
          // Update existing files list
          reloadDBPage();
          setExistingFiles(responseJson.files || []);
        } else {
          alert("Failed to process the CSV file.");
        }
      } catch (error) {
        console.error("Error uploading CSV file:", error);
        alert("Error uploading the file.");
      } finally {
        setLoading(false);
        e.target.value = null;
      }
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  // Fetch existing files on component mount
  useEffect(() => {
    const fetchExistingFiles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/existing-csv-files`);
        const data = await response.json();
        setExistingFiles(data.existingFiles || []);
      } catch (error) {
        console.error("Error fetching existing files:", error);
      }
    };

    fetchExistingFiles();
  }, []);

  return (
    <div className="chatList">
      <Link to="/dashboard">
        <FontAwesomeIcon icon={faComments} className="link-icon" /> Create a new Chat
      </Link>
      <Link to="/history">
        <FontAwesomeIcon icon={faClockRotateLeft} className="link-icon" /> History
      </Link>
      <Link to="/db-visualizer">
        <FontAwesomeIcon icon={faDatabase} className="link-icon" /> Database Visualizer
      </Link>
      <Link to="/help">
        <FontAwesomeIcon icon={faQuestionCircle} className="link-icon" /> Help
      </Link>
      {/* <button onClick={drop} className="drop-database-btn">Drop Database</button> */}

      <hr />

      {/* Existing Files Section */}
      <div className="existing-files-section">
        <h4>Uploaded CSV Files</h4>
        {existingFiles.length > 0 ? (
          <ul className="existing-files-list">
            {existingFiles.map((fileName, index) => (
              <li key={index} className="existing-file-item">
                <div className="file-info">
                  <FontAwesomeIcon icon={faFile} className="file-icon" />
                  {fileName}
                </div>
                {/**Do not remove this code. This can ube used for deletion of datasets */}
                {/* <button 
                  onClick={() => handleFileDelete(fileName)}
                  className="delete-file-btn"
                  title="Delete File"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button> */}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-files-message">No CSV files uploaded yet</p>
        )}
      </div>

      {/* CSV Upload Section */}
      <div className="csv-upload">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="csv-input"
          id="csvFileInput"
          style={{ display: "none" }}
        />
        <label 
          htmlFor="csvFileInput" 
          className={`upload-btn ${loading ? 'loading' : ''}`}
        >
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} className="loading-icon fa-spin" />
          ) : (
            <>
              <FontAwesomeIcon icon={faFileUpload} className="upload-icon" /> 
              Upload Patients Data
            </>
          )}
        </label>
      </div>

      <div>
      <b>Disclaimer: <br></br></b>This tool is designed to assist you but may occasionally produce incorrect or incomplete information. Please review all outputs carefully and consult a professional for critical decisions.
      </div>
    </div>
  );
};

export default ChatList;