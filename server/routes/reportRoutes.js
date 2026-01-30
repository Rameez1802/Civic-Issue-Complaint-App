import { Router } from 'express';
import multer from 'multer';
// Import 'path' utilities to create absolute paths
import path, { extname, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import Report from '../models/Report.js';
import { protect } from '../middleware/authMiddleware.js';

// Get the directory name of the current module (e.g., /path/to/server/routes)
const __dirname = dirname(fileURLToPath(import.meta.url));
// Go up one level to the 'server' directory and then into 'uploads'
const UPLOADS_DIR = join(__dirname, '../uploads');

const router = Router();

// Multer config for file uploads
const storage = multer.diskStorage({
  // --- CHANGE 2: Use the absolute path variable here ---
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

// @desc    Get report statistics (total, pending, resolved counts)
// @route   GET /api/reports/stats
router.get('/stats',protect, async (req, res) => {
  try {
    // Run all count queries in parallel for better performance
    const [total, pending, resolved] = await Promise.all([
      Report.countDocuments({user: req.user._id}),
      Report.countDocuments({user: req.user._id, status: 'Pending' }),
      Report.countDocuments({user: req.user._id, status: 'Resolved' })
    ]);

    res.json({ total, pending, resolved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a new report
// @route   POST /api/reports
router.post('/',protect, upload.single('image'), async (req, res) => {
  try {
    const { title, location, landmark, description } = req.body;
    if (!title || !location) {
      return res.status(400).json({ message: 'Title and location are required' });
    }
    let imageUrl = null;
    if (req.file) {
      const base = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      imageUrl = `${base}/uploads/${req.file.filename}`;
    }
    const report = new Report({ title, location, landmark, description, imageUrl, user: req.user._id, });
    await report.save();
    return res.status(201).json({ message: 'Report created', report });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get reports, with optional status filtering
// @route   GET /api/reports
router.get('/',protect, async (req, res) => {
  try {
    const filter = {user: req.user._id};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update a report's status
// @route   PATCH /api/reports/:id
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    await report.save();
    res.json({ message: 'Report status updated', report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;