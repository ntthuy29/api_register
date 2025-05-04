import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModel from '../../models/users.model.js';
const JWT_SECRET = 'mySecretKey';
import nodemailer from 'nodemailer';
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
    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Đăng ký thất bại' });
  }
};

export const loginUser = async(req,res)=>{
  try{
    const {email, password} = req.body;
    const userExists = await UserModel.findOne({email});
    if(!userExists){
      return res.status(400).json({message: "Không tìm thấy người dùng"});

    }
    const isMatch = await bcrypt.compare(password, userExists.password);
    if(!isMatch){
      return res.status(400).json({message: "Mật khẩu không chính xác"});
    }
    const token = jwt.sign({
      id: userExists.__id,
      email: userExists.email,
      name: userExists.name,


    },
    JWT_SECRET,
  {
    expiresIn: '2h',

  });
  return res.status(200).json({message: 'Đăng nhập thành công', token});

  }catch{

    return res.status(400).json({message: "Lỗi gì đấy khum bic"});
  }
}
export const forgetPassword = async(req, res)=>{
  try{
    const {email} = req.body;
    const userExits = await UserModel.findOne(email);
    if(!userExits){
 return res.status(400).json({message: "Không tìm thấy người dùng"});

    }
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thay doi mat khau',
      text: 'Click day de reset lai email babe!',
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Đã gửi mail thành công!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gửi mail thất bại!' });
  }
  



}