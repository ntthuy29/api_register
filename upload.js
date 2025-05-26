import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import UserModel from './src/models/users.model'
dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/Database0'); 
    console.log('✅ Kết nối MongoDB thành công');
  } catch (err) {
    console.error('❌ Kết nối MongoDB thất bại:', err.message);
    process.exit(1);
  }
};

(async function () {
    try {
        // Cấu hình Cloudinary
        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        console.log("Cloudinary Config:", cloudinary.config());

        // Đường dẫn thư mục chứa ảnh
        const folderPath = './anh';

        // Lấy danh sách tất cả các file trong thư mục
        const files = fs.readdirSync(folderPath).filter(file => 
            file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')
        );

        console.log(`🔍 Tìm thấy ${files.length} ảnh trong thư mục.`);

        // Upload từng ảnh
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            console.log(`📤 Đang upload: ${file} ...`);

            try {
                const uploadResult = await cloudinary.uploader.upload(filePath, {
                    folder: 'uploaded_images', // Đặt thư mục trên Cloudinary
                    resource_type: 'image'
                });

                console.log(`✅ Upload thành công: ${file}`);
                console.log("🔗 URL:", uploadResult.secure_url);

            } catch (uploadError) {
                console.error(`❌ Lỗi khi upload ${file}:`, uploadError);
            }
        }

        console.log("🎉 Hoàn tất upload tất cả ảnh!");

    } catch (error) {
        console.error("Lỗi:", error);
    }
})();
async function saveAvatarToDB(userId, avatarUrl) {
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.avatar = avatarUrl;  
        await user.save();        

        console.log('Avatar updated successfully.');
        return user;
    } catch (error) {
        console.log('Error saving avatar:', error.message);
        throw error;
    }
}
