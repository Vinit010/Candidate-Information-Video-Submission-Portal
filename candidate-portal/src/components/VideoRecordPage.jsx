import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoRecord.css";


const VideoRecordPage = () => {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState("");
  const [time, setTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const chunks = useRef([]);
  const navigate = useNavigate();

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current.srcObject = stream;
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunks.current = [];

    mediaRecorder.ondataavailable = (e) => chunks.current.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);
    };

    setRecording(true);
    mediaRecorder.start();
    let counter = 0;
    const timer = setInterval(() => {
      counter++;
      setTime(counter);
      if (counter >= 90) {
        stopRecording();
        clearInterval(timer);
      }
    }, 1000);
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current.stop();
    const tracks = videoRef.current.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h2>🎥 Record Your Video</h2>
        <p>
          Please record a short introduction video (max 90 seconds):
          <br />- Introduce yourself <br />- Why this position <br />- Experience summary
        </p>
        <video ref={videoRef} autoPlay muted className="preview-video" />
        {videoURL && (
          <div>
            <h4>Recorded Video:</h4>
            <video src={videoURL} controls className="preview-video" />
          </div>
        )}
        <div className="button-group">
          {!recording && <button onClick={startRecording}>Start Recording</button>}
          {recording && <button onClick={stopRecording}>Stop Recording</button>}
          <button onClick={() => navigate("/review")}>Next</button>
        </div>
        <p>⏱ Duration: {time}s / 90s</p>
      </div>
    </div>
  );
};

export default VideoRecordPage;
