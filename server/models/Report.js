import { Schema, model } from 'mongoose'
import mongoose from 'mongoose';


const reportSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // This will store the User's unique ID
    required: true,
    ref: 'users', // This links it to your User model
  },
  title: { type: String, required: true },
  location: { type: String, required: true },
  landmark: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'reports' });

export default model('Report', reportSchema)
