import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CandidateForm from "./components/CandidateForm";
import VideoInstructions from "./components/VideoInstructions";
import VideoSubmission from "./components/VideoSubmission";
import ReviewPage from "./components/ReviewPage";

function App() {
  const [page, setPage] = useState(1);
  const [candidateData, setCandidateData] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  // Step 1 → Candidate Info Form
  const handleNext = (formData) => {
    setCandidateData(formData);
    setPage(2);
  };

  // Step 2 → Video Instructions
  const handleProceedToVideo = () => {
    setPage(3);
  };

  // Step 3 → Video Submission
  const handleVideoSubmit = (file) => {
    setVideoFile(file);
    setPage(4);
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 text-primary fw-bold">
        🎯 Candidate Registration Portal
      </h2>

      {page === 1 && <CandidateForm onNext={handleNext} />}
      {page === 2 && <VideoInstructions onProceed={handleProceedToVideo} />}
      {page === 3 && <VideoSubmission onSubmit={handleVideoSubmit} />}
      {page === 4 && (
        <ReviewPage
          candidateData={candidateData}
          videoFile={videoFile}
        />
      )}

      <div className="text-center mt-4">
        <p>
          Step <strong>{page}</strong> of <strong>4</strong>
        </p>
      </div>
    </div>
  );
}

export default App;
