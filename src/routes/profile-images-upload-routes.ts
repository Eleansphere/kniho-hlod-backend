import { Router } from 'express';
import multer from 'multer';
import { ProfileImage } from '../models/profile-images';

const profileImagesUploadRoutes = Router();
const upload = multer(); // uloží file do paměti (buffer)

profileImagesUploadRoutes.post('/:id/avatar', upload.single('avatar'), async (req, res) => {
  try {
    const entity = await ProfileImage.findByPk(req.params.id);
    if (!entity) {
      return res.status(404).json({ message: 'Not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    await entity.update({ avatar: req.file.buffer });
    res.json({ message: 'Avatar updated' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

profileImagesUploadRoutes.get('/:id/avatar', async (req, res) => {
  try {
    const entity = await ProfileImage.findByPk(req.params.id);
    if (!entity || !entity.avatar) {
      return res.status(404).json({ message: 'No avatar' });
    }

    res.set('Content-Type', 'image/png'); // zatím natvrdo PNG, můžeš uložit typ do DB
    res.send(entity.avatar);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default profileImagesUploadRoutes;
