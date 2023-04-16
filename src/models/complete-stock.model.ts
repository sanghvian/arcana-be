// src/stock.model.ts
import { Schema, model, Document } from 'mongoose';

export interface CompleteStock extends Document {
  _id: string
  name: string
  symbol: string
  volatility_q1: number
  volatility_q2: number
  volatility_q3: number
  volatility_q4: number
  correlation_q1: number
  correlation_q2: number
  correlation_q3: number
  correlation_q4: number
  volatility_predicted: number
}

const stockSchema = new Schema({
  id: { type: String },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  volatility_q1: { type: Number, required: true },
  volatility_q2: { type: Number, required: true },
  volatility_q3: { type: Number, required: true },
  volatility_q4: { type: Number, required: true },
  correlation_q1: { type: Number, required: true },
  correlation_q2: { type: Number, required: true },
  correlation_q3: { type: Number, required: true },
  correlation_q4: { type: Number, required: true },
  volatility: { type: Number, required: true },
});

export const CompleteStockModel = model<CompleteStock>('Completestat', stockSchema);