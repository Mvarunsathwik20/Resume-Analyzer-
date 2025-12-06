const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const analyzeRouter = require('./routes/analyze');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: path.join(__dirname, 'uploads/') });

app.post('/api/analyze', upload.single('resume'), analyzeRouter);

app.get('/', (req, res) => {
  res.send({ status: 'AI Resume Analyzer backend running' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


