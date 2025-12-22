import {v2 as cloudinary} from 'cloudinary';

const uploadToCloudinary = async (file_path) => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
          });
        const result = await cloudinary.uploader.upload(file_path, {
            resource_type: "auto"
        })
        .catch((error) => {
            console.error("Error uploading to Cloudinary:", error);
            return null;
        });
        //console.log("Uploaded to Cloudinary:", result);
        return result;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
    }
}

export default uploadToCloudinary;