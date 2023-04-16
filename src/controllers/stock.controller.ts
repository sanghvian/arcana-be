// src/stock.controller.ts
import { CompleteStock, CompleteStockModel } from '../models/complete-stock.model';
import { Stock, StockModel } from '../models/stock.model';
import { Types } from 'mongoose';

export async function createStock(stock: Stock): Promise<Stock> {
    const newStock = new StockModel(stock);
    await newStock.save();
    return newStock;
}

export async function getStockById(id: string): Promise<Stock | null> {
    const stock = await StockModel.findById(id);
    return stock;
}


export async function getStockBySymbol(symbol: string): Promise<Stock | null> {
    const stock = await StockModel.findOne({ symbol });
    return stock;
}

export async function getCompleteStockBySymbol(symbol: string): Promise<CompleteStock | null> {
    const stock = await CompleteStockModel.findOne({ symbol });
    return stock;
}

export async function getAllStocks(): Promise<Stock[]> {
    return await StockModel.find();
}

export async function updateStock(symbol: string, updates: Partial<Stock>): Promise<Stock | null> {
    const updatedStock = await StockModel.findOneAndUpdate(
        { symbol },
        { $set: updates },
        { new: true }
    );
    return updatedStock;
}

export async function deleteStock(symbol: string): Promise<boolean> {
    const result = await StockModel.findOneAndDelete({ symbol });
    return !!result;
}
