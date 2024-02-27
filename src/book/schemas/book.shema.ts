import * as mongoose from 'mongoose';
import { EnumStatusBook } from '../interface/book.types';
import { Schema as MongooseSchema } from 'mongoose';

export const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: { unique: true },
  },
  author: { type: String, required: true },
  status: { type: String, required: true, enum: EnumStatusBook },
  startedDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  created_at: { type: Date, required: true, default: Date.now },
  user: { type: MongooseSchema.Types.ObjectId, ref: 'Person' },
});
