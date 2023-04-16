import { Schema, model, Document } from 'mongoose';

export interface StockStat {
    stock_id: string,
    date: string,
    close: number,
    volume: number,
    volatility: number
}

const stockStatSchema = new Schema({
    stock_id: { type: String, required: true },
    date: { type: String, required: true },
    close: { type: Number, required: true },
    volume: { type: Number, required: true },
    volatility: { type: Number, required: true },
});

export const StockStatModel = model<StockStat>('StockStat', stockStatSchema);
