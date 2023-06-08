const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'files/' });

app.post('/savedata', upload.single('userimage'), (req, res) => {
  // Access form fields
  const { name, username } = req.body;
 
  // Print username and name
  console.log('Username:', username);
  console.log('Name:', name);

  // Handle uploaded file
  if (req.file) {
    // Store the file in the "files" folder
    const filename = req.file.filename;
    const filePath = path.join(__dirname, 'files', filename);
    console.log('File saved:', filePath);
  }

  // Send response
  res.sendStatus(200);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
