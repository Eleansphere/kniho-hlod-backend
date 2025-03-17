import express, { Router } from 'express';
import type { Request, Response } from 'express';
import { Book, BookAttributes } from '../models/Book';
import { generateId } from '../utils/generateId';

const router: Router = express.Router();



// POST request
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const bookData: BookAttributes = {
            id: generateId('b'),
            title: req.body.title,
            author: req.body.author,
            owner_id: req.body.owner_id
        };

        const book = await Book.create(bookData);
        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
    }
});

// GET request all books
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const books = await Book.findAll();
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
    }
});
// GET request by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const bookId: string = req.params.id;
        const book = await Book.findByPk(bookId);
        
        if (!book) {
            res.status(404).json({ message: 'Kniha nebyla nalezena' });
            return;
        }

        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
    }
});

// DELETE request
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {

        const bookId: string = req.params.id;
        const response = await Book.destroy({
            where: { id: bookId }
        });
        
        if (!response) {
            res.status(404).json({ message: 'Kniha nebyla nalezena' });
            return;
        }
        
        res.status(200).json({ message: 'Kniha byla úspěšně smazána' });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
    }
});

export default router; 