import express, { Request, Response, Router } from 'express';
import User, { UserAttributes } from '../models/User';
import { generateId } from '../utils/generateId';
import bcrypt from 'bcrypt';

const router: Router = express.Router();


const SALT_ROUNDS = 10;
// Vytvoření uživatele

router.post('/', async (req: Request, res: Response) => {
    try {
        const { username, email, password, role} = req.body;

        if (!username || !email || !password || !role) {
            return res.status(400).json({ error: 'Všechna pole jsou povinná' });
        }

        // Kontrola, zda uživatel už existuje
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Uživatel s tímto e-mailem už existuje' });
        }
        // Hashování hesla pomocí bcrypt
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user: User = await User.create({
            id: generateId('u'),
            username,
            email,
            password: hashedPassword, // Ukládáme jen hash
            role,
        });

  res.status(201).json({ message: 'Uživatel úspěšně registrován', user });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});


// Načtení všech uživatelů
router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// Načtení uživatele podle ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'Uživatel nebyl nalezen' });
            return;
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// Smazání uživatele podle ID
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'Uživatel nebyl nalezen' });
            return;
        }
        await user.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

export default router; 