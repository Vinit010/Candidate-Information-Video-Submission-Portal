import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  positionApplied: String,
  currentPosition: String,
  experience: Number,
  resumeUrl: String, // filename in GridFS resumes bucket
  videoUrl: String,  // filename in GridFS videos bucket
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Candidate", candidateSchema);
