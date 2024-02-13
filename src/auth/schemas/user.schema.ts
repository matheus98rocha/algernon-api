import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: { unique: true, dropDups: true },
  },
  hash: { type: String, required: true },
  hashedRt: { type: Date, required: false },
  created_at: { type: Date, required: true, default: Date.now },
});
