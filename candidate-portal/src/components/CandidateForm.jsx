import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./CandidateForm.css";

const CandidateForm = ({ onNext }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    positionApplied: "",
    currentPosition: "",
    experience: "",
    resume: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.positionApplied)
      newErrors.positionApplied = "Position is required";
    if (!formData.currentPosition)
      newErrors.currentPosition = "Current position is required";
    if (!formData.experience)
      newErrors.experience = "Experience is required";
    if (!formData.resume)
      newErrors.resume = "Resume is required";
    else if (formData.resume.type !== "application/pdf")
      newErrors.resume = "Only PDF files are allowed";
    else if (formData.resume.size > 5 * 1024 * 1024)
      newErrors.resume = "File size must be ≤ 5MB";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onNext(formData);
  };

  return (
    <div className="page-wrapper">
      <div className="form-box">
        <h2 className="form-title">Candidate Information Form</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
            />
            {errors.firstName && <Alert variant="danger">{errors.firstName}</Alert>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
            />
            {errors.lastName && <Alert variant="danger">{errors.lastName}</Alert>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Position Applied For</Form.Label>
            <Form.Control
              type="text"
              name="positionApplied"
              value={formData.positionApplied}
              onChange={handleChange}
              placeholder="Enter position"
            />
            {errors.positionApplied && <Alert variant="danger">{errors.positionApplied}</Alert>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Current Position</Form.Label>
            <Form.Control
              type="text"
              name="currentPosition"
              value={formData.currentPosition}
              onChange={handleChange}
              placeholder="Enter current position"
            />
            {errors.currentPosition && <Alert variant="danger">{errors.currentPosition}</Alert>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Experience (in years)</Form.Label>
            <Form.Control
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Enter experience"
            />
            {errors.experience && <Alert variant="danger">{errors.experience}</Alert>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Resume (PDF ≤ 5MB)</Form.Label>
            <Form.Control type="file" name="resume" onChange={handleChange} />
            {errors.resume && <Alert variant="danger">{errors.resume}</Alert>}
          </Form.Group>

          <Button variant="primary" type="submit">
            Next
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CandidateForm;
