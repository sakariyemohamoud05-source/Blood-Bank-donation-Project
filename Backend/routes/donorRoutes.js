import express from 'express';
import {
  createDonor,
  getAllDonors,
  getDonorById,
  updateDonor,
  deleteDonor,
  searchDonors,
  getDonationHistory,
} from '../controllers/donorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createDonor);
router.get('/', protect, getAllDonors);
router.get('/search', protect, searchDonors);
router.get('/:id', protect, getDonorById);
router.put('/:id', protect, updateDonor);
router.delete('/:id', protect, deleteDonor);
router.get('/:id/donation-history', protect, getDonationHistory);

export default router;
