import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ApplicantCard({ applicant, onRatingChange }) {
  const navigate = useNavigate();

  const handleRatingChange = (newRating) => {
    onRatingChange(applicant.email, newRating);
  };

  const handleSendMessage = () => {
    navigate(`/chat/${applicant.email}`);
  };

  return (
    <div className="flex bg-white p-4 mb-4 rounded-md shadow-md">
      <div className="flex-1">
        <h2 className="text-xl font-semibold">{applicant.name}</h2>
        <p>{applicant.email}</p>
        <div className="flex flex-wrap">
          {applicant.skills.map((skill, index) => (
            <span
              key={index}
              className="mr-2 mt-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
        <div>
          <h3 className="mt-4 text-lg font-semibold">Education:</h3>
          {applicant.institutions.map((edu, index) => (
            <p key={index}>
              {edu.name} ({edu.startYear} - {edu.endYear || "Present"})
            </p>
          ))}
        </div>
        <a
          href={applicant.resumeUrl}
          className="inline-block mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          download
        >
          Download Resume
        </a>
        <button
          onClick={handleSendMessage}
          className="block mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Send Message
        </button>
      </div>
      <div className="flex items-center ml-4">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            onClick={() => handleRatingChange(index + 1)}
            className={`w-6 h-6 cursor-pointer ${
              index < (applicant.rating || 0) ? "text-yellow-500" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    </div>
  );
}

function ApplicantPage() {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/other", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setApplicants(data);
        } else {
          console.error("Fetched data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };
    fetchApplicants();
  }, []);

  const handleRatingChange = (email, newRating) => {
    const updatedApplicants = applicants.map((applicant) =>
      applicant.email === email ? { ...applicant, rating: newRating } : applicant
    );
    setApplicants(updatedApplicants);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-8 text-center">Job Applicants</h1>
        {applicants.length > 0 ? (
          applicants.map((applicant, index) => (
            <ApplicantCard key={index} applicant={applicant} onRatingChange={handleRatingChange} />
          ))
        ) : (
          <p className="text-center">No applicants found.</p>
        )}
      </div>
    </div>
  );
}

export default ApplicantPage;