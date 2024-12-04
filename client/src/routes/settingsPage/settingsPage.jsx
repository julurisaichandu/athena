import React, { useState } from "react";
import "./settingsPage.css";

const settingsPage = () => {
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [mongoDbApiKey, setMongoDbApiKey] = useState("");
//   const [theme, setTheme] = useState("light");
//   const [language, setLanguage] = useState("en");
  
  const handleApiKeyChange = (e) => setGoogleApiKey(e.target.value);
//   const handleThemeChange = (e) => setTheme(e.target.value);
//   const handleLanguageChange = (e) => setLanguage(e.target.value);

  const saveSettings = () => {
    localStorage.setItem("settings", JSON.stringify({ googleApiKey, mongoDbApiKey }));
    alert("Settings saved!");
  };

  const loadSettings = () => {
    const savedSettings = JSON.parse(localStorage.getItem("settings")) || {};
    setGoogleApiKey(savedSettings.googleApiKey || "");
    setMongoDbApiKey(savedSettings.mongoDbApiKey || "");
    // setTheme(savedSettings.theme || "light");
    // setLanguage(savedSettings.language || "en");
  };

//   React.useEffect(() => {
//     loadSettings();
//   }, []);

  return (
    <div className="settings">
      <h2>Settings</h2>
      
      <div className="setting-item">
        <label>Google API Key:</label>
        <input
          type="text"
          value={googleApiKey}
          onChange={handleApiKeyChange}
          placeholder="Enter your Gemini API Key"
        />
      </div>

          
      <div className="setting-item">
        <label>Mongo DB API</label>
        <input
          type="text"
          value={mongoDbApiKey}
          onChange={handleApiKeyChange}
          placeholder="Enter your Mongo DB API Key"
        />
      </div>
      

      {/* <div className="setting-item">
        <label>Theme:</label>
        <select value={theme} onChange={handleThemeChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div> */}

      {/* <div className="setting-item">
        <label>Language:</label>
        <select value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div> */}

      <div className="setting-actions">
        <button onClick={saveSettings}>Save</button>
      </div>
    </div>
  );
};

export default settingsPage;
