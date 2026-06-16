require('dotenv').config();


const express = require('express');
const cors = require('cors');

const generateRoute = require('./routes/generate');
const app = express();
// will use azures port and 5000 as a fallback
const PORT = process.env.PORT || 5000;

// middleware
// allows request frpm react front end
// TODO: update with azure url before submission
app.use(cors({origin: 'http://localhost:3000'}));
// parse incoming request bdies
app.use(express.json({ limit: '10mb'}));


// routes
// main ai endpoint gets called when user clicks generate study guide
app.use('/api/generate', generateRoute);

// health check for azure to ping
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok'});
});

// starts the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});