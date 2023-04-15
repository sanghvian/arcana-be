// src/stock.model.ts
import { Schema, model, Document } from 'mongoose';

export interface Stock extends Document {
  _id: string
  name: string
  symbol: string
  description: string
  image: string
  ceo: string
  sector: string
  industry: string
  range: string
  website: string
  lastDiv: number
  beta: number
}

const stockSchema = new Schema({
  _id: { type: String },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  ceo: { type: String, required: true },
  sector: { type: String, required: true },
  industry: { type: String, required: true },
  range: { type: String, required: true },
  website: { type: String, required: true },
  lastDiv: { type: Number, required: true },
  beta: { type: Number, required: true },
});

export const StockModel = model<Stock>('Stock', stockSchema);