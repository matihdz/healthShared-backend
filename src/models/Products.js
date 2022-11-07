import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    name: String,
    category: String,
}, {
    timestamps: true,
    versionKey: false
});

export default model('Product', productSchema);