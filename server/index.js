import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Razorpay with the keys from the frontend .env.local file
const razorpay = new Razorpay({
    key_id: process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
    key_secret: process.env.VITE_RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

app.post('/api/create-order', async (req, res) => {
    try {
        const { amount, planName } = req.body;

        if (!amount || !planName) {
            return res.status(400).json({ error: "Amount and planName are required" });
        }

        const options = {
            amount: amount * 100, // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
            notes: {
                plan: planName
            }
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.VITE_RAZORPAY_KEY_ID || 'dummy_key_id'
        });

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({
            error: "Failed to generate Razorpay order. Did you provide your API Keys in .env.local?",
            details: error.description || error.message || error
        });
    }
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Razorpay Payment Link Generator backend running on port ${PORT}`);
});
