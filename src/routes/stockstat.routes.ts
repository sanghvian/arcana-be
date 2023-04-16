// src/stock.routes.ts
import express from 'express';
import { createStockStat, getStockStatById, updateStockStat, deleteStockStat, getAllStockStats, getStockStatBySymbol } from '../controllers/stockstat.controller';

const router = express.Router();

router.post('/', async (req, res) => {
    const stock = await createStockStat(req.body);
    res.status(201).json(stock);
});

router.get('/', async (req, res) => {
    const stocks = await getAllStockStats();
    res.status(201).json(stocks);
});

router.get('/by-symbol/:id', async (req, res) => {
    console.log(req.params.id, 'getting timeseries by symbol')
    const stocks = await getStockStatBySymbol(req.params.id);
    if (!stocks) return res.status(404).json({ message: 'StockStat not found' });
    res.json(stocks);
});

router.put('/:id', async (req, res) => {
    const stock = await updateStockStat(req.params.id, req.body);
    if (!stock) return res.status(404).json({ message: 'StockStat not found' });
    res.json(stock);
});

router.delete('/:id', async (req, res) => {
    const success = await deleteStockStat(req.params.id);
    if (!success) return res.status(404).json({ message: 'StockStat not found' });
    res.status(204).end();
});

export default router;