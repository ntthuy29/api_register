import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/Database0'); 
    console.log('✅ Kết nối MongoDB thành công');
  } catch (err) {
    console.error('❌ Kết nối MongoDB thất bại:', err.message);
    process.exit(1);
  }
};

export default connectDB;
