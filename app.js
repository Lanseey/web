const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000000 }, 
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myFile');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Only images are allowed!');
    }
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send(`
                <h2>Error: ${err}</h2>
                <a href="/">Go Back</a>
            `);
        }

        if (!req.file) {
            return res.status(400).send(`
                <h2>Error: No file selected!</h2>
                <a href="/">Go Back</a>
            `);
        }

        res.send(`
            <h2>File Uploaded Successfully!</h2>
            <p>File: ${req.file.filename}</p>
            <a href="/">Go Back</a>
        `);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
