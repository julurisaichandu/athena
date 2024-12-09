import React, { useState } from 'react';
import './helpPage.css'; // Import the CSS for styling

const HelpPage = () => {
    const [openIndex, setOpenIndex] = useState(null); // Track which question is open

    const toggleQuestion = (index) => {
        setOpenIndex(openIndex === index ? null : index); // Toggle the open question
    };

    const helpData = [
        {
            question: "How do I filter patient data?",
            answer: "You can filter patient data by using the available filters such as Admission ID, Patient ID, Gender, Age Group, Specialty, and Location. Simply select or type in the filter criteria to narrow down the list of patients."
        },
        {
            question: "How can I view detailed information about a patient?",
            answer: "Click on any row in the table to view detailed information about a patient's medications, procedures, processes, and results."
        },
        {
            question: "Can I export patient data?",
            answer: "Currently, exporting patient data is not available, but it's a feature we plan to add in the future."
        },
        {
            question: "What does the patient data include?",
            answer: "The patient data includes Admission ID, Patient ID, Gender, Age Group, Length of Stay, Specialty, Location, and detailed medical information such as Medications, Procedures, Processes, and Results."
        },
        {
            question: "How can I search for specific patient information?",
            answer: "You can use the search functionality in the filter section to search by Admission ID or Patient ID. Additionally, you can select various filter options like Gender, Age Group, and Specialty to refine your search."
        }
    ];

    return (
        <div className="help-container">
            <h2 className="help-title">Help page</h2>
            <div className="help-description">
                <h3>How to use the app:</h3>
                <p>This app allows doctors to easily visualize and manage patient data. You can filter the dataset based on various criteria, view detailed information for each patient, and navigate through their medical history.</p>
                <h3>
                    Create a New Chat Page
                </h3>
                <p>You can ask about your patients using the chat feature in this page and also give feedback</p>
                <h3>
                    History Page
                </h3>
                <p>Stores all the previous chats history. User can click on each chat history can visit the chat and continue to chat about the patient</p>
                <h3>
                    Database Visuaalizer Page
                </h3>
                <p>User can visualize, filter and download patients details in the form of tables. User can click on each user and get more details about theie medications etc.</p>
                <h3>FAQs</h3>
                <h3>
                    Help Page
                </h3>
                <p>User can get information about features of the app and also some frequently asked questions</p>
                <h3>
                    Upload button
                </h3>
                <p>Users can add new patients data into the data base and search about them</p>
            </div>
            <div className="help-list">
                {helpData.map((help, index) => (
                    <div key={index} className="help-item">
                        <div className="help-question" onClick={() => toggleQuestion(index)}>
                            <h4>{help.question}</h4>
                            <span className={`help-toggle ${openIndex === index ? 'open' : ''}`}>+</span>
                        </div>
                        {openIndex === index && <div className="help-answer"><p>{help.answer}</p></div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HelpPage;
