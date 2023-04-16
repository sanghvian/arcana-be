// src/stock.routes.ts
import express from 'express';
import { createStock, getStockById, updateStock, deleteStock, getAllStocks, getStockBySymbol, getCompleteStockBySymbol } from '../controllers/stock.controller';

const router = express.Router();

router.post('/', async (req, res) => {
    const stock = await createStock(req.body);
    res.status(201).json(stock);
});

router.get('/', async (req, res) => {
    const stocks = await getAllStocks();
    res.status(201).json(stocks);
});

router.get('/m_id/:id', async (req, res) => {
    const stock = await getStockById(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json(stock);
});

router.get('/complete/:id', async (req, res) => {
    const stock = await getCompleteStockBySymbol(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json(stock);
});

router.get('/:id', async (req, res) => {
    const stock = await getStockBySymbol(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json(stock);
});

router.put('/:id', async (req, res) => {
    const stock = await updateStock(req.params.id, req.body);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json(stock);
});

router.delete('/:id', async (req, res) => {
    const success = await deleteStock(req.params.id);
    if (!success) return res.status(404).json({ message: 'Stock not found' });
    res.status(204).end();
});

export default router;