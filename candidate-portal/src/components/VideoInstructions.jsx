import React from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import "./VideoInstructions.css";

const VideoInstructions = ({ onProceed }) => {
  return (
    <div className="instructions-page">
      <Card className="instructions-card">
        <h2 className="title">🎥 Video Recording Instructions</h2>
        <p className="subtitle">
          Before recording, please carefully read the following:
        </p>

        <ListGroup variant="flush" className="instruction-list">
          <ListGroup.Item>🔹 Introduce yourself briefly.</ListGroup.Item>
          <ListGroup.Item>🔹 Explain why you're interested in this position.</ListGroup.Item>
          <ListGroup.Item>🔹 Highlight your relevant experience.</ListGroup.Item>
          <ListGroup.Item>🔹 Share your long-term career goals.</ListGroup.Item>
        </ListGroup>

        <div className="requirements">
          <h5>📋 Video Recording Requirements</h5>
          <ul>
            <li>Ensure your camera and microphone are working.</li>
            <li>Recording duration must not exceed <b>90 seconds</b>.</li>
            <li>You can review and re-record if needed.</li>
          </ul>
        </div>

        <Button variant="primary" className="proceed-btn" onClick={onProceed}>
          Proceed to Record Video 🎬
        </Button>
      </Card>
    </div>
  );
};

export default VideoInstructions;
