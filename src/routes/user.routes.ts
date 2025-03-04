import express from 'express';
import { UserService } from '../services';
import fileUpload from 'express-fileupload';

const router = express.Router();
router.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  abortOnLimit: true
}));

router.get('/me', async (req, res) => {
  try {
    const userId = req.kauth.grant?.access_token?.content.sub;
    const user = await new UserService().getProfile(userId);
    res.json(user);
  } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
  }
});

router.patch('/me', async (req, res) => {
  try {
    const userId = req.kauth.grant?.access_token?.content.sub;
    const user = await new UserService().updateProfile(userId, req.body);
    res.json(user);
  } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
  }
});

router.post('/me/avatar',  async (req, res) => {
  try {
    if (!req.files?.avatar) throw new Error('No file uploaded');
    
    const userId = req.kauth.grant?.access_token?.content.sub;
    const user = await new UserService().updateAvatar(
      userId,
      req.files.avatar as fileUpload.UploadedFile
    );
    
    res.json(user);
  } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
  }
});

export default router;