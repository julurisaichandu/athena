import React, { useState, useEffect } from 'react';
import './dbVisualizerPage.css'; // Import the updated CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft,faDownload } from '@fortawesome/free-solid-svg-icons';



const DbVisualizerPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [uniqueCategoricalValues, setUniqueCategoricalValues] = useState(null);
    const [filters, setFilters] = useState({
        admissionId: '',
        patientId: '',
        gender: '',
        ageGroup: '',
        // lengthOfStayRange: [0, 30],
        specialty: '',
        location: '',
    });

    const downloadFilteredData = (data) => {
        if (!data.length) {
          alert('No data to download!');
          return;
        }
        // Convert filtered data to JSON
        const jsonContent = JSON.stringify(data, null, 2);
      
        // Create download link
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'filtered_patients_data.json');
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

    useEffect(() => {
        const fetchDbData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/view-db`);
                const res = await response.json();
                if(!res.data || !res.uniqueCatarogicalValuesForFilters) {
                    throw new Error("try to check the uploaded files. Check if they have proper names and in proper format and reload the page again");
                }
                setData(res.data);
                setUniqueCategoricalValues(res.uniqueCatarogicalValuesForFilters);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchDbData();
    }, []);

    const handleRowClick = (row) => {
        setSelectedRow(row);
    };

    const handleBack = () => {
        setSelectedRow(null);
    };


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    // range change code, do not remove it
    // const handleRangeChange = (e) => {
    //     const { name, value } = e.target;
    //     console.log (value.split(',').map(Number) );
    //     setFilters({
    //         ...filters,
    //         [name]: value.split(',').map(Number),
    //     });
    // };

    const filterData = () => {
        return data.filter((row) => {
            // Apply filters to data here
  
            return (
                (filters.admissionId === '' || row.admissionid.includes(filters.admissionId)) &&
                (filters.patientId === '' || row.patientid.includes(filters.patientId)) &&
                (filters.gender === '' || row.gender === filters.gender) &&
                (filters.ageGroup === '' || row.agegroup === filters.ageGroup) &&
                // (Number(row.lengthofstay) <= filters.lengthOfStayRange[0]) &&
                (filters.specialty === '' || row.specialty === filters.specialty) &&
                (filters.location === '' || row.location === filters.location)

            );
        });
    };

    const filteredData = filterData();


    if (loading) return <div className="loading-btn">Loading ICU Data...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="db-visualizer-container">
            <div className="summary">
                <h2>Dataset Overview</h2>
                <p>Total Admissions: {data.length}</p>
            </div>
            {/* <h1 className="title"></h1> */}

             {/* Filter Section */}
             {!selectedRow && <div className="filters">
                <input
                    type="text"
                    name="admissionId"
                    placeholder="Search by Admission ID"
                    value={filters.admissionId}
                    onChange={handleFilterChange}
                />
                <input
                    type="text"
                    name="patientId"
                    placeholder="Search by Patient ID"
                    value={filters.patientId}
                    onChange={handleFilterChange}
                />
                <select name="gender" value={filters.gender} onChange={handleFilterChange}>
                {uniqueCategoricalValues?.gender?.map((sex) => (
                            <option key={sex} value={sex}>
                                {sex}
                            </option>
                        ))}
                    
                </select>
                <select name="ageGroup" value={filters.ageGroup} onChange={handleFilterChange}>
                    <option value="">All Age Groups</option>
                    {uniqueCategoricalValues
                        ?.ageGroup?.map((ageGroup) => {
                            return (
                                <option key={ageGroup} value={ageGroup}>
                                    {ageGroup}
                                </option>
                            );
                        })}
       
                </select>
                <select name="specialty" value={filters.specialty} onChange={handleFilterChange}>
                    <option value="">All Specialties</option>
                    {uniqueCategoricalValues?.specialty?.map((specialty) => (
                            <option key={specialty} value={specialty}>
                                {specialty}
                            </option>
                        ))}
                </select>
                <select name="location" value={filters.location} onChange={handleFilterChange}>
                    <option value="">All Locations</option>
                    {uniqueCategoricalValues?.location?.map((loc) => (
                            <option key={loc} value={loc}>
                                {loc}
                            </option>
                        ))}
                </select>
                {/* <div className="range-label">Length of Stay:
                <input
                    type="range"
                    name="lengthOfStayRange"
                    min="0"
                    max="30"
                    value={filters.lengthOfStayRange}
                    step="1"
                    onChange={handleRangeChange}
                    style={{ width: '200px' }}
                />
                <span>{filters.lengthOfStayRange[0]} - {filters.lengthOfStayRange[1]} Days</span>
                </div> */}
               

                
            </div>}


            {!selectedRow ? (
                <>
   
                    <div className="db-table-container">
                    <div className="count-and-download">
                        <p>Count: {filteredData.length}</p>
                        <button 
                            onClick={() => downloadFilteredData(filteredData)}
                            className="download-btn"
                            title="Download Filtered Data"
                        >
                            Export Data
                            <FontAwesomeIcon icon={faDownload} />
                        </button>
                        </div>
                    <table className="db-table">
                        <thead>
                            <tr>
                                <th>Admission ID</th>
                                <th>Patient ID</th>
                                <th>Gender</th>
                                <th>Age Group</th>
                                <th>Length of Stay</th>
                                <th>Specialty</th>
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row) => (
                                <tr
                                    key={row.admissionid}
                                    onClick={() => handleRowClick(row)}
                                    className="clickable-row"
                                >
                                    <td>{row.admissionid}</td>
                                    <td>{row.patientid}</td>
                                    <td>{row.gender}</td>
                                    <td>{row.agegroup}</td>
                                    <td>{row.lengthofstay}</td>
                                    <td>{row.specialty}</td>
                                    <td>{row.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </>
            ) : (
                <div className="details-container">
                    <button onClick={handleBack} className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span style={{marginleft: "9px", fontSize: "115%"}}>
                    Back to List
                    </span>
                    </button>
                    <h2>Details for Admission ID: {selectedRow.admissionid}</h2>
                    <div className="details-section">
                        <h3>Medications</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Item</th>
                                    <th>Category</th>
                                    <th>Rate</th>
                                    <th>Administered</th>
                                    <th>Start</th>
                                    <th>Stop</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedRow.medications.map((med, index) => (
                                    <tr key={index}>
                                        <td>{med.orderid}</td>
                                        <td>{med.item}</td>
                                        <td>{med.ordercategory}</td>
                                        <td>{med.rate}</td>
                                        <td>{med.administered}</td>
                                        <td>{med.start}</td>
                                        <td>{med.stop}</td>
                                    </tr>
                                ))}
                            </tbody>


                        </table>
                        
                        <h3>Procedures</h3>
          <table border="1" width="100%" cellPadding="5">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Item</th>
                <th>Category</th>
                <th>Registered At</th>
              </tr>
            </thead>
            <tbody>
              {selectedRow.procedures.map((proc, index) => (
                <tr key={index}>
                  <td>{proc.orderid}</td>
                  <td>{proc.item}</td>
                  <td>{proc.ordercategoryname}</td>
                  <td>{proc.registeredat}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Processes</h3>
          <table border="1" width="100%" cellPadding="5">
            <thead>
              <tr>
                <th>Item</th>
                <th>Start</th>
                <th>Stop</th>
              </tr>
            </thead>
            <tbody>
              {selectedRow.processes.map((proc, index) => (
                <tr key={index}>
                  <td>{proc.item}</td>
                  <td>{proc.start}</td>
                  <td>{proc.stop}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Results</h3>
          <table border="1" width="100%" cellPadding="5">
            <thead>
              <tr>
                <th>Item</th>
                <th>Value</th>
                <th>Comment</th>
                <th>Measured At</th>
              </tr>
            </thead>
            <tbody>
              {selectedRow.results.map((result, index) => (
                <tr key={index}>
                  <td>{result.item}</td>
                  <td>{result.value}</td>
                  <td>{result.comment}</td>
                  <td>{result.measuredat}</td>
                </tr>
              ))}
            </tbody>
            </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DbVisualizerPage;
