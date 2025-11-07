import Candidate from "../models/Candidate.js";

export const submitApplication = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      positionApplied,
      currentPosition,
      experience,
    } = req.body;

    const resume = req.files["resume"] ? req.files["resume"][0].filename : null;
    const video = req.files["video"] ? req.files["video"][0].filename : null;

    const candidate = new Candidate({
      firstName,
      lastName,
      positionApplied,
      currentPosition,
      experience,
      resumeUrl: resume,
      videoUrl: video,
    });

    await candidate.save();
    res.status(201).json({ message: "Application submitted successfully", candidate });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Server error while submitting application" });
  }
};
