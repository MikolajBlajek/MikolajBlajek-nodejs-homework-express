// const express = require('express')
// const logger = require('morgan')
// const cors = require('cors') 
// const path =require('path')
// const multer = require('multer')
// const contactsRouter = require('./routes/api/contacts') 
// const userRoutes = require('./routes/users');

// const app = express() 

// app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')));

// const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

// app.use(logger(formatsLogger))
// app.use(cors())
// app.use(express.json())

// app.use('/api/contacts', contactsRouter) 
 
// app.use('/api/auth', userRoutes);  //---<---//npm start
// //-----------------------------------------------/ 

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/avatars');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }
//   res.send(`File uploaded successfully: ${req.file.filename}`);
// });
 

// //-----------------------------------------------------

// app.use((req, res) => {
//   res.status(404).json({ message: 'Not found' })
// })

// app.use((err, req, res, next) => {
//   res.status(500).json({ message: err.message })
// })

// module.exports = app 

const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const contactsRouter = require('./routes/api/contacts');
const userRoutes = require('./routes/users');

const app = express(); 
  




app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')));

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/api/auth', userRoutes);


app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});


app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
