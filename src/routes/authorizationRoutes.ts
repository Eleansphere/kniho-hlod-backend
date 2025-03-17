import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tajnyklic';

// Přihlášení uživatele
router.post('/login', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
        
            return res.status(400).json({ error: 'Uživatelské jméno a heslo jsou povinná' });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Neplatný email nebo heslo' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Neplatný email nebo heslo' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    } catch (error) {
        console.error('Chyba při přihlášení:', error);
        return res.status(500).json({ error: 'Interní chyba serveru' });
    }
});


router.get('/user', verifyToken, (req:Request, res: Response) => {
    // req.user obsahuje dekódované informace z tokenu
    res.json({ 
      id: req.body.id,
      email: req.body.email
    });
  });

function verifyToken(req:Request, res:Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Chybí autorizační token' });
    }
    
    const token = authHeader.split(' ')[1]; // získat token z "Bearer TOKEN"
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      // Přidat informace o uživateli do požadavku
      req.body = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Neplatný nebo vypršený token' });
    }
  }
  
export default router;