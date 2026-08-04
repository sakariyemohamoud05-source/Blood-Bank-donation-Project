import Donor from '../models/Donor.js';

// Create a new donor
export const createDonor = async (req, res) => {
  try {
    if (req.body.email) {
      const existingDonor = await Donor.findOne({ email: req.body.email });

      if (existingDonor) {
        return res.status(409).json({ message: 'A donor with this email already exists' });
      }
    }

    const donor = new Donor(req.body);
    await donor.save();

    res.status(201).json({
      message: 'Donor created successfully',
      donor,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all donors
export const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one donor by ID
export const getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update donor information
export const updateDonor = async (req, res) => {
  try {
    if (req.body.email) {
      const duplicateDonor = await Donor.findOne({
        email: req.body.email,
        _id: { $ne: req.params.id },
      });

      if (duplicateDonor) {
        return res.status(409).json({ message: 'A donor with this email already exists' });
      }
    }

    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json({
      message: 'Donor updated successfully',
      donor,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete donor
export const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json({ message: 'Donor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search donors by name or blood type
export const searchDonors = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.json([]);
    }

    const donors = await Donor.find({
      $or: [
        { fullName: { $regex: query, $options: 'i' } },
        { bloodType: { $regex: query, $options: 'i' } },
      ],
    });

    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a donor's donation history
export const getDonationHistory = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json({
      donorId: donor._id,
      donationHistory: donor.donationHistory || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
