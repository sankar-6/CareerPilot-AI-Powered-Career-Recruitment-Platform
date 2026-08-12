const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    requiredSkills: {
      type: [String],
      required: [true, 'At least one required skill must be specified'],
      validate: {
        validator: (v) => v.length > 0,
        message: 'At least one required skill must be specified',
      },
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    salary: {
      type: String,
      trim: true,
      default: 'Not Disclosed',
    },
    experience: {
      type: String,
      required: [true, 'Experience level is required'],
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
      required: [true, 'Job type is required'],
    },
    applicationDeadline: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and filtering
jobSchema.index({ title: 'text', company: 'text', description: 'text' });
jobSchema.index({ recruiterId: 1 });
jobSchema.index({ isActive: 1, createdAt: -1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ location: 1 });

module.exports = mongoose.model('Job', jobSchema);
