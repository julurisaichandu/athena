'use client';

import { useState } from 'react';

interface Patient {
  name: string;
  age: number;
  diagnosis: string;
  lastDateOfAttendance: string;
  otherDetails: string;
}

const mockData: Patient[] = [
  {
    name: 'John Doe',
    age: 45,
    diagnosis: 'Hypertension',
    lastDateOfAttendance: '2024-10-10',
    otherDetails: 'Follow-up required in 2 weeks',
  },
  {
    name: 'Jane Smith',
    age: 50,
    diagnosis: 'Diabetes',
    lastDateOfAttendance: '2024-09-20',
    otherDetails: 'Controlled with medication',
  },
  {
    name: 'Alice Johnson',
    age: 38,
    diagnosis: 'Asthma',
    lastDateOfAttendance: '2024-08-15',
    otherDetails: 'Using inhalers regularly',
  },
  // Add more mock data as needed
];

export default function PatientTable() {
  const [patients, setPatients] = useState(mockData);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter the patients based on the search query
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.otherDetails.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Patient Data Visualization</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name, Diagnosis, or Other Details"
          className="p-2 border rounded-md w-full"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Table to Display Patients */}
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Patient Name</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Diagnosed With</th>
            <th className="border p-2">Last Date of Attendance</th>
            <th className="border p-2">Other Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient, index) => (
            <tr key={index}>
              <td className="border p-2">{patient.name}</td>
              <td className="border p-2">{patient.age}</td>
              <td className="border p-2">{patient.diagnosis}</td>
              <td className="border p-2">{patient.lastDateOfAttendance}</td>
              <td className="border p-2">{patient.otherDetails}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
