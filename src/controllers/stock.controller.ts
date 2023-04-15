// src/stock.controller.ts
import { Stock, StockModel } from '../models/stock.model';
import { Types } from 'mongoose';

export async function createStock(stock: Stock): Promise<Stock> {
    const newStock = new StockModel(stock);
    await newStock.save();
    return newStock;
}

export async function getStockById(id: string): Promise<Stock | null> {
    const stock = await StockModel.findOne({ _id: id });
    return stock;
}

export async function getAllStocks(): Promise<Stock[]> {
    return await StockModel.find();
}

export async function updateStock(id: string, updates: Partial<Stock>): Promise<Stock | null> {
    const updatedStock = await StockModel.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true }
    );
    return updatedStock;
}

export async function deleteStock(id: string): Promise<boolean> {
    const result = await StockModel.findByIdAndDelete(id);
    return !!result;
}
