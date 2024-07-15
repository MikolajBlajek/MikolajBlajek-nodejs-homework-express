
// const authMiddleware = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'Not authorized' });
//   }
//   try {
//     const { id } = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(id);
//     if (!user || user.token !== token) {
//       return res.status(401).json({ message: 'Not authorized' });
//     }
//     req.user = user; 
//     req.token = token;
//     next();
//   } catch (error) {
//     next(error);
//   } 

const jwt = require('jsonwebtoken');
const User = require('../models/users');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authMiddleware };
