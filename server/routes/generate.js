const express = require('express');
const {analyzeNotes} = require('../services/ai');
const { notStrictEqual } = require('node:assert');

const router = express.Router();

router.post('/', async (req , res ) => {
  const {notes} = req.body;
// check notes for text otherwise dont send
  if (!notes || notes.trim() === '') {
    return res.status(400).json({error: 'No notes provided'});
  }

  // call ai service and send results to frontend
  try {
    const results = await analyzeNotes(notes.trim());
    return res.json(results);
  } catch (err) {
    console.error('AI analyst error:', err);
    return res.status(500).json({ error: 'Failed to analyze notes. Please try again'})
  }
});

module.exports = router;