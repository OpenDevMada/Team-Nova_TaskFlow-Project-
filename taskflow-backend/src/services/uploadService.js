const cloudinary = require('cloudinary').v2;
const { AppError } = require('../middleware/errorHandler');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class UploadService {
  static async uploadAvatar(fileBuffer, userId) {
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'votre_cloud_name') {
      return { url: null, message: 'Cloudinary non configuré' };
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'taskflow/avatars',
          public_id: `user_${userId}`,
          overwrite: true,
          resource_type: 'image',
          transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }]
        },
        (error, result) => {
          if (error) reject(new AppError('Erreur lors de l\'upload', 500));
          else resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  static async uploadTaskAttachment(fileBuffer, fileName, taskId) {
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'votre_cloud_name') {
      return { url: null, message: 'Cloudinary non configuré' };
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'taskflow/attachments',
          public_id: `task_${taskId}_${Date.now()}`,
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(new AppError('Erreur lors de l\'upload', 500));
          else resolve({ url: result.secure_url, publicId: result.public_id, format: result.format });
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  static async deleteFile(publicId) {
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Erreur suppression fichier Cloudinary:', error.message);
    }
  }
}

module.exports = UploadService;
