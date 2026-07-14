const UploadService = require('../services/uploadService');
const AuthService = require('../services/authService');
const { asyncHandler } = require('../middleware/errorHandler');

class UploadController {
  static uploadAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucun fichier fourni' });
    }

    const result = await UploadService.uploadAvatar(req.file.buffer, req.user.id);

    if (result.url) {
      await AuthService.updateProfile(req.user.id, { avatarUrl: result.url });
    }

    res.json({
      success: true,
      message: result.url ? 'Avatar mis à jour' : result.message,
      data: { url: result.url }
    });
  });

  static uploadTaskAttachment = asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucun fichier fourni' });
    }

    const { taskId } = req.params;
    const result = await UploadService.uploadTaskAttachment(req.file.buffer, req.file.originalname, taskId);

    res.status(201).json({
      success: true,
      message: result.url ? 'Fichier uploadé avec succès' : result.message,
      data: {
        url: result.url,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype
      }
    });
  });
}

module.exports = UploadController;
