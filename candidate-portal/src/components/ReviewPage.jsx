// src/components/ReviewPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { Button, Alert, Spinner, ProgressBar } from "react-bootstrap";
// import { API_BASE_URL } from "../api"; // create this file (see earlier) or replace with "http://localhost:5001/api"
import "../../src/components/ReviewPage.css";

const ReviewPage = ({ candidateData, resumeFile, videoFile, onBack }) => {
  const [error, setError] = useState("");
  const [videoDuration, setVideoDuration] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const recordedVideoRef = useRef(null);

  useEffect(() => {
    // get duration of the video blob/file
    if (!videoFile) return;
    const url = URL.createObjectURL(videoFile);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.src = url;
    v.onloadedmetadata = () => {
      setVideoDuration(v.duration);
      URL.revokeObjectURL(url);
    };
    v.onerror = () => {
      setError("Unable to read video metadata.");
    };
  }, [videoFile]);

  const validateBeforeSubmit = () => {
    setError("");
    // resume checks
    if (!resumeFile) {
      setError("Resume file missing. Please upload in the form page.");
      return false;
    }
    if (resumeFile.type !== "application/pdf") {
      setError("Resume must be a PDF.");
      return false;
    }
    if (resumeFile.size > 5 * 1024 * 1024) {
      setError("Resume exceeds 5 MB.");
      return false;
    }

    // video checks
    if (!videoFile) {
      setError("No recorded video found. Please record your video.");
      return false;
    }
    // check file size limit (server-side also enforces)
    const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB, adapt if needed
    if (videoFile.size > MAX_VIDEO_BYTES) {
      setError("Video file is too large. Please keep under 50 MB.");
      return false;
    }
    if (videoDuration === null) {
      setError("Unable to determine video duration. Try reloading or re-recording.");
      return false;
    }
    if (videoDuration > 90) {
      setError("Video exceeds 90 seconds. Please record again within 90 seconds.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMsg("");
    if (!validateBeforeSubmit()) return;

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      // Append candidate fields
      formData.append("firstName", candidateData.firstName);
      formData.append("lastName", candidateData.lastName);
      formData.append("positionApplied", candidateData.position);
      formData.append("currentPosition", candidateData.currentPosition);
      formData.append("experience", candidateData.experience);

      // Append files
      formData.append("resume", resumeFile, resumeFile.name);
      // videoFile might be a Blob; supply a filename
      formData.append("video", videoFile, videoFile.name || "candidate_video.webm");

      // Use XMLHttpRequest for progress events
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE_URL}/upload`); 

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        };

        xhr.onload = () => {
          setUploading(false);
          if (xhr.status >= 200 && xhr.status < 300) {
            setSuccessMsg("Application submitted successfully!");
            resolve(xhr.response);
          } else {
            setError(`Upload failed: ${xhr.statusText || xhr.responseText}`);
            reject(new Error(xhr.statusText || xhr.responseText));
          }
        };

        xhr.onerror = () => {
          setUploading(false);
          setError("Network error during upload. Try again.");
          reject(new Error("Network error"));
        };

        xhr.send(formData);
      });
    } catch (err) {
      console.error(err);
      if (!error) setError("Unexpected error during submission.");
    } finally {
      setUploading(false);
    }
  };

  const renderResumeLink = () => {
    // If resumeFile is a File (not yet uploaded) allow download via objectURL
    if (resumeFile && resumeFile instanceof File) {
      const blobUrl = URL.createObjectURL(resumeFile);
      return (
        <a href={blobUrl} download={resumeFile.name} className="btn btn-outline-primary">
          Download Resume (Local)
        </a>
      );
    }

    // If resume is already uploaded and candidateData.resumeUrl contains a filename/path on server
    if (candidateData && candidateData.resumeUrl) {
      return (
        <a
          href={`${API_BASE_URL}/file/resumes/${encodeURIComponent(candidateData.resumeUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-primary"
        >
          Download Resume
        </a>
      );
    }

    return <span className="text-muted">No resume file available</span>;
  };

  return (
    <div className="review-page">
      <div className="card mx-auto" style={{ maxWidth: 820 }}>
        <div className="card-body">
          <h3 className="card-title mb-3">Review & Submit</h3>

          {error && <Alert variant="danger">{error}</Alert>}
          {successMsg && <Alert variant="success">{successMsg}</Alert>}

          <div className="mb-3">
            <h5>Candidate Details</h5>
            <p><strong>First Name:</strong> {candidateData?.firstName}</p>
            <p><strong>Last Name:</strong> {candidateData?.lastName}</p>
            <p><strong>Position Applied For:</strong> {candidateData?.position}</p>
            <p><strong>Current Position:</strong> {candidateData?.currentPosition}</p>
            <p><strong>Experience (Years):</strong> {candidateData?.experience}</p>
          </div>

          <div className="mb-3">
            <h5>Resume</h5>
            {renderResumeLink()}
          </div>

          <div className="mb-3">
            <h5>Recorded Video</h5>
            {videoFile ? (
              <video
                ref={recordedVideoRef}
                controls
                src={URL.createObjectURL(videoFile)}
                style={{ width: "100%", maxHeight: 480, borderRadius: 8 }}
              />
            ) : (
              <p className="text-muted">No recorded video available.</p>
            )}
            {videoDuration && (
              <p className="small mt-2 text-muted">Video duration: {Math.round(videoDuration)}s</p>
            )}
          </div>

          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={onBack} disabled={uploading}>
              Back
            </Button>

            <div style={{ flex: 1 }}>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={uploading}
                className="w-100"
              >
                {uploading ? "Uploading..." : "Confirm & Submit"}
              </Button>
              {uploading && (
                <>
                  <ProgressBar now={progress} label={`${progress}%`} className="mt-2" />
                  <small className="text-muted">Do NOT close the window while uploading.</small>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
