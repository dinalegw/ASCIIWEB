const express = require('express');
const path = require('path');
const { createCanvas } = require('canvas');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

function htmlToAscii(htmlContent) {
  const charSet = '@%#*+=-:. ';
  const width = 80;
  const height = 40;
  const canvas = createCanvas(width * 8, height * 16);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '16px monospace';
  ctx.fillStyle = '#000000';
  ctx.fillText(htmlContent.substring(0, 100), 10, 20);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let ascii = '';

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const brightness = (imageData[idx] + imageData[idx + 1] + imageData[idx + 2]) / 3;
      const charIndex = Math.floor((brightness / 255) * (charSet.length - 1));
      ascii += charSet[charIndex] || ' ';
    }
    ascii += '\n';
  }

  return ascii;
}

app.post('/api/generate', (req, res) => {
  const { html } = req.body;
  if (!html) {
    return res.status(400).json({ error: 'HTML content required' });
  }
  try {
    const ascii = htmlToAscii(html);
    res.json({ ascii });
  } catch (err) {
    res.status(500).json({ error: 'Conversion failed' });
  }
});

app.get('/api/preview', (req, res) => {
  const { url } = req.query;
  res.json({ message: 'URL preview coming soon', url });
});

app.listen(PORT, () => {
  console.log(`ASCIIWEB server running on port ${PORT}`);
});