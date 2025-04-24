import bcrypt from 'bcryptjs';
import UserModel from '../../models/users.model.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    });

    await newUser.save();
    return res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Đăng ký thất bại' });
  }
};
