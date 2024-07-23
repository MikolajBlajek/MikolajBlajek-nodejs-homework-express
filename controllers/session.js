import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import gravatar from 'gravatar';
import User from '../models/users';
import { sendVerificationEmail } from '../modules/email.js'; 

//--------------zmiana na importy 

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = userSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const avatarURL = gravatar.url(email); 
    const verificationToken = uuidv4();  //---<------
    const newUser = new User({ email, password: hashedPassword, avatarURL });
    await newUser.save(); 
//---------------------------------------kod na dole----
    const verificationLink = `http://yourdomain.com/api/users/verify/${verificationToken}`;
    const html = `Please verify your email by clicking the following link: <a href="${verificationLink}">${verificationLink}</a>`;
 
    await sendVerificationEmail(html, 'Verify your email', email); 
//----------------------------------------------------------------
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};
 
//----------export
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = userSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    user.token = token;
    await user.save();
    res.status(200).json({ token, user: { email: user.email, subscription: user.subscription } });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = req.user;
    user.token = null;
    await user.save();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

// module.exports = { signup, login, logout, getCurrentUser };
