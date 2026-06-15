// POST /api/upload — receives a single file, stores it in Blob Storage,
// and returns the blob name so the client can reference it when generating.
const express = require('express');
const multer = require('multer');
const { uploadBuffer } = require('../services/blob');

const router = express.Router();

// Hold the upload in memory so we can forward it straight to Blob Storage.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 40 * 1024 * 1024 }, // 40 MB — matches the frontend limit
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file was uploaded.' });
    }

    const blobName = await uploadBuffer(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Return both so /api/generate knows the blob AND the original extension.
    res.json({ blobName, fileName: req.file.originalname });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ error: 'Failed to upload the file.' });
  }
});

module.exports = router;
