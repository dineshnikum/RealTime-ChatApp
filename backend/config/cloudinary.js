import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Configure Cloudinary for image uploads
 */

// Debug: Log what environment variables are loaded (without exposing secrets)
console.log('🔍 Cloudinary Config Check:');
console.log('  - CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
console.log('  - CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('  - CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

