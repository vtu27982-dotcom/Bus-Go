import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  source: { type: String, required: true },
  destination: { type: String, required: true },
  distance: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Route', routeSchema);
