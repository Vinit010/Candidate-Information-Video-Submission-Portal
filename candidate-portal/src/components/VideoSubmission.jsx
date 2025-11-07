import React, { useRef, useState, useEffect } from "react";
import { Button, Alert, Spinner } from "react-bootstrap";
import "./VideoSubmission.css";

const VideoSubmission = ({ onSubmit }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Request webcam access
    const getMediaStream = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(userStream);
        videoRef.current.srcObject = userStream;
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Please allow camera and microphone access!");
      } finally {
        setLoading(false);
      }
    };

    getMediaStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    if (!stream) return;
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    setRecordedChunks([]);
    setIsRecording(true);
    mediaRecorder.start();

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) setRecordedChunks((prev) => [...prev, event.data]);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);
      setIsRecording(false);
    };

    // Auto-stop after 90 seconds
    setTimeout(() => {
      if (mediaRecorder.state !== "inactive") mediaRecorder.stop();
    }, 90000);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
  };

  const handleSubmit = () => {
    if (!videoURL) {
      setError("Please record your video before submitting.");
      return;
    }

    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const videoFile = new File([blob], "candidate_video.webm", {
      type: "video/webm",
    });

    onSubmit(videoFile);
  };

  return (
    <div className="video-page">
      <div className="video-container">
        <h2 className="video-title">🎥 Video Submission</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <video ref={videoRef} autoPlay muted className="preview-video" />
        )}

        <div className="btn-group">
          {!isRecording && (
            <Button variant="success" onClick={startRecording}>
              Start Recording
            </Button>
          )}
          {isRecording && (
            <Button variant="warning" onClick={stopRecording}>
              Stop Recording
            </Button>
          )}
        </div>

        {videoURL && (
          <div className="preview-section">
            <h5>Preview Your Recording</h5>
            <video src={videoURL} controls className="recorded-video" />
            <Button
              variant="danger"
              onClick={() => {
                setVideoURL("");
                setRecordedChunks([]);
              }}
              className="mt-2"
            >
              Re-record
            </Button>
          </div>
        )}

        <Button
          variant="primary"
          onClick={handleSubmit}
          className="mt-3 submit-btn"
        >
          Submit Video
        </Button>
      </div>
    </div>
  );
};

export default VideoSubmission;
