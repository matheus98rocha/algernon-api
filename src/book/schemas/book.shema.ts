import * as mongoose from 'mongoose';
import { EnumStatusBook } from '../interface/book.types';

export const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  status: { type: String, required: true, enum: EnumStatusBook },
  startedDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
});
