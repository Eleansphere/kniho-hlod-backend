import express, { Request, Response, Router } from 'express';
import Loan, { LoanAttributes } from '../models/Loan';
import { generateId } from '../utils/generateId';


const router: Router = express.Router();

// POST request

router.post('/', async (req: Request, res: Response) => {
        try {
        const loanData: LoanAttributes = {
            id: generateId('l'),
            book_id: req.body.book_id,
            borrower: req.body.borrower,
            loan_date: req.body.loan_date,
            return_date: req.body.return_date,
            owner_id: req.body.owner_id
        };
        const loan = await Loan.create(loanData);
        res.status(201).json(loan);

    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// GET request all loans
router.get('/', async (req: Request, res: Response) => {
    try {

        const loans = await Loan.findAll();
        res.status(200).json(loans);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// GET request by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const loan = await Loan.findByPk(req.params.id);
        if (!loan) {
            res.status(404).json({ message: 'Půjčka nebyla nalezena' });
            return;
        }
        res.status(200).json(loan); 
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// DELETE request
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const loan = await Loan.findByPk(req.params.id);
        if (!loan) {
            res.status(404).json({ message: 'Půjčka nebyla nalezena' });
            return;
        }
        await loan.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});


export default router; 