import mongoose from 'mongoose';

// Donor schema
const donorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    address: {
      type: String,
      trim: true,
    },
    isEligible: {
      type: Boolean,
      default: true,
    },
    lastDonationDate: {
      type: Date,
    },
    donationHistory: [
      {
        date: { type: Date },
        location: { type: String },
        quantity: { type: Number },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

// This method checks whether a donor is eligible based on the 90-day rule.
donorSchema.methods.checkEligibility = function () {
  if (!this.lastDonationDate) {
    return true;
  }

  const today = new Date();
  const ninetyDaysAgo = new Date(today);
  ninetyDaysAgo.setDate(today.getDate() - 90);

  return this.lastDonationDate <= ninetyDaysAgo;
};

const Donor = mongoose.model('Donor', donorSchema);

export default Donor;

/*
Example controller usage:

const Donor = require("../models/Donor");

// Create Donor
exports.createDonor = async (req, res) => {
  try {
    const donor = new Donor(req.body);
    await donor.save();
    res.status(201).json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Donor
exports.updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Donor
exports.deleteDonor = async (req, res) => {
  try {
    await Donor.findByIdAndDelete(req.params.id);
    res.json({ message: "Donor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search Donor by name or blood type
exports.searchDonor = async (req, res) => {
  try {
    const { query } = req.query;
    const donors = await Donor.find({
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { bloodType: { $regex: query, $options: "i" } },
      ],
    });
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get donation history
exports.getDonationHistory = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    res.json(donor ? donor.donationHistory : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/
