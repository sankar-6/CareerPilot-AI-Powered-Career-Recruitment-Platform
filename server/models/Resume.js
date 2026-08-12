const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One resume per user
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    // AI Analysis results (embedded)
    analysis: {
      score: { type: Number, default: null },
      strengths: { type: [String], default: [] },
      improvements: { type: [String], default: [] },
      detectedSkills: { type: [String], default: [] },
      missingSkills: { type: [String], default: [] },
    },
    // Extracted PDF text content (persisted for cloud deployments)
    extractedText: {
      type: String,
      default: '',
    },
    analyzedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model('Resume', resumeSchema);
