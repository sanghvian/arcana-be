// src/stock.controller.ts
import { StockStat, StockStatModel } from '../models/stockstat.model';
import { Types } from 'mongoose';

export async function createStockStat(stock: StockStat): Promise<StockStat> {
    const newStockStat = new StockStatModel(stock);
    await newStockStat.save();
    return newStockStat;
}

export async function getStockStatById(id: string): Promise<StockStat | null> {
    const stock = await StockStatModel.findById(id);
    return stock;
}

export async function getStockStatBySymbol(symbol: string): Promise<StockStat[] | null> {
    const tickers = await StockStatModel.find({ stock_symbol: symbol });
    return tickers;
}

export async function getAllStockStats(): Promise<StockStat[]> {
    return await StockStatModel.find();
}


export async function updateStockStat(symbol: string, updates: Partial<StockStat>): Promise<StockStat | null> {
    const updatedStockStat = await StockStatModel.findOneAndUpdate(
        { symbol },
        { $set: updates },
        { new: true }
    );
    return updatedStockStat;
}

export async function deleteStockStat(symbol: string): Promise<boolean> {
    const result = await StockStatModel.findOneAndDelete({ symbol });
    return !!result;
}
