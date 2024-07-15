// const express = require('express');
// const router = express.Router();
// const { signup, login, logout, getCurrentUser } = require('../../controllers/session');
// const { authMiddleware } = require('../../middlewares/authMiddleware');
 
// //--------------------do weryfikacji------------------------------// 
 

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/avatars');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage }); 

// //----------------------------------------------------//

// router.post('/signup', signup);
// router.post('/login', login); 
// router.get('/logout', authMiddleware, logout); 
// router.get('/current', authMiddleware, getCurrentUser); 

 
// //---------------------do weryfikacji ------------------------------// 
// router.post('/upload-avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
//     if (!req.file) {
//       return res.status(400).send('No file uploaded.');
//     }
  
//     const user = req.user;
//     user.avatarURL = `/avatars/${req.file.filename}`;
//     await user.save();
  
//     res.send(`File uploaded successfully: ${req.file.filename}`);
//   }); 

// //--------------------------------------------------//

// module.exports = router;
 
const express = require('express');
const router = express.Router();
const { signup, login, logout, getCurrentUser } = require('../controllers/session');
const { authMiddleware } = require('../middlewares/authMiddleware');
const multer = require('multer');
const Jimp = require('jimp');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tmp');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', authMiddleware, logout);
router.get('/current', authMiddleware, getCurrentUser);

router.patch('/avatars', authMiddleware, upload.single('avatar'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const user = req.user;
  const tmpPath = path.join(__dirname, '../tmp', req.file.filename);
  const outputPath = path.join(__dirname, '../public/avatars', req.file.filename);

  try {
  
    const image = await Jimp.read(tmpPath);
    await image.resize(250, 250).quality(80).writeAsync(outputPath);

    user.avatarURL = `/avatars/${req.file.filename}`;
    await user.save();

    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    res.status(500).json({ message: 'Error processing file' });
  }
});

module.exports = router;
