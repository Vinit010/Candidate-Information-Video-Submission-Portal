// backend/routes/uploadRoutes.js
import express from "express";
import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";
import dotenv from "dotenv";
import Candidate from "../models/Candidate.js";

dotenv.config();
const router = express.Router();

const mongoURI = process.env.MONGO_URI;

// create storage - multer-gridfs-storage chooses bucket based on file
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    const isPdf = file.mimetype === "application/pdf";
    const isVideo = file.mimetype.startsWith("video/");
    if (isPdf) {
      return {
        filename: `${Date.now()}_${file.originalname}`,
        bucketName: "resumes",
      };
    } else if (isVideo) {
      return {
        filename: `${Date.now()}_${file.originalname}`,
        bucketName: "videos",
      };
    } else {
      // reject other types
      return null;
    }
  },
});

// limits: resume 5MB, video up to 50MB (adjust as needed)
const upload = multer({
  storage,
  limits: {
    fileSize: 60 * 1024 * 1024, // allow up to 60MB for uploader; we'll check specific files in handler
  },
});

// multipart fields: resume (1) and video (1)
const cpUpload = upload.fields([{ name: "resume", maxCount: 1 }, { name: "video", maxCount: 1 }]);

router.post("/upload", cpUpload, async (req, res) => {
  try {
    // files are in req.files
    const files = req.files || {};
    const resumeFile = files.resume && files.resume[0];
    const videoFile = files.video && files.video[0];

    // basic server-side validations
    if (!resumeFile) return res.status(400).json({ error: "Resume is required (PDF ≤ 5MB)" });
    if (resumeFile.contentType !== "application/pdf" && resumeFile.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Resume must be a PDF" });
    }
    if (resumeFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "Resume file too large (max 5MB)" });
    }

    if (!videoFile) return res.status(400).json({ error: "Video is required" });
    // you can check mimetype e.g. video/webm or video/mp4
    if (!videoFile.mimetype.startsWith("video/")) {
      return res.status(400).json({ error: "Video file is not a valid video" });
    }
    // video size check: 60 MB limit (adjustable)
    if (videoFile.size > 60 * 1024 * 1024) {
      return res.status(400).json({ error: "Video file too large" });
    }

    // Save candidate doc
    const {
      firstName,
      lastName,
      positionApplied,
      currentPosition,
      experience,
    } = req.body;

    const candidate = new Candidate({
      firstName,
      lastName,
      positionApplied,
      currentPosition,
      experience: Number(experience) || 0,
      resumeUrl: resumeFile.filename,
      videoUrl: videoFile.filename,
    });

    await candidate.save();

    return res.status(201).json({ message: "Application saved", candidateId: candidate._id });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Server upload error", details: err.message });
  }
});

export default router;
