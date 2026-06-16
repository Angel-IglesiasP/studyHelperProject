// POST /api/generate — the main pipeline.
// Body: { notes?, blobName?, fileName? }  (at least one of notes / blobName)
//   1. if a file was uploaded, download it from Blob and extract its text
//   2. combine that with any pasted notes
//   3. send the combined text to the LLM
//   4. return { summary, keywords, questions }
const express = require('express');
const { downloadBuffer } = require('../services/blob');
const { extractText } = require('../services/extract');
const { generateStudyGuide } = require('../services/llm');

const router = express.Router();

// Rough guard so a huge document doesn't blow past the model's token limit.
// (A smarter version would chunk + summarize; this is fine for an MVP.)
const MAX_CHARS = 30000;

router.post('/generate', async (req, res) => {
  try {
    const { notes, blobName, fileName } = req.body;

    let documentText = '';

    // Step 1 + 2: if a file was uploaded, pull it back and extract its text.
    if (blobName) {
      const buffer = await downloadBuffer(blobName);
      documentText = await extractText(buffer, fileName || blobName);
    }

    // Combine pasted notes with any extracted file text.
    const combined = [notes, documentText].filter(Boolean).join('\n\n').trim();

    if (!combined) {
      return res
        .status(400)
        .json({ error: 'Please provide notes or upload a file.' });
    }

    // Step 3 + 4: run the LLM and return the study guide.
    const studyGuide = await generateStudyGuide(combined.slice(0, MAX_CHARS));
    res.json(studyGuide);
  } catch (err) {
    console.error('Generate failed:', err);
    res.status(500).json({ error: 'Failed to generate the study guide.' });
  }
});

module.exports = router;
