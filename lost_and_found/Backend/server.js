// server.js - Backend server for IP tracking + Stripe donations
require("dotenv").config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const https = require('https');

// ✅ Stripe setup
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = 5000;

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/';
const DB_NAME = 'ip_location';
const COLLECTION_NAME = 'users_info';

let db;

// Middleware
app.use(cors());
app.use(express.json()); // needed for Stripe request JSON
const bodyParser = require('body-parser');

// ✅ Raw body parser for Stripe webhook if needed later
app.use("/webhook", bodyParser.raw({ type: "application/json" }));

// Database connect
MongoClient.connect(MONGO_URI)
  .then((client) => {
    console.log('✓ Connected to MongoDB');
    db = client.db(DB_NAME);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

function getIPInfo(ip) {
  return new Promise((resolve, reject) => {
    const url = `https://ipinfo.io/${ip}/json`;

    https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error('Failed to parse IP info'));
        }
      });
    }).on('error', reject);
  });
}

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] ||
         req.headers['x-real-ip'] ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         'unknown';
}

// ==============================
// 🌍 IP Tracking Routes
// ==============================
app.get('/api/track-ip', async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    console.log(`Tracking IP: ${clientIP}`);

    const ipData = await getIPInfo(clientIP);

    const locationDoc = {
      ip: ipData.ip,
      hostname: ipData.hostname || null,
      city: ipData.city || null,
      region: ipData.region || null,
      country: ipData.country || null,
      location: ipData.loc || null,
      organization: ipData.org || null,
      postal: ipData.postal || null,
      timezone: ipData.timezone || null,
      timestamp: new Date(),
      userAgent: req.headers['user-agent'] || null
    };

    const collection = db.collection(COLLECTION_NAME);
    await collection.insertOne(locationDoc);

    console.log(`✓ Saved location for IP: ${clientIP}`);

    res.json({
      success: true,
      data: {
        city: ipData.city,
        region: ipData.region,
        country: ipData.country,
        timezone: ipData.timezone
      }
    });

  } catch (error) {
    console.error('Error tracking IP:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track IP'
    });
  }
});

app.get('/api/locations', async (req, res) => {
  try {
    const collection = db.collection(COLLECTION_NAME);
    const locations = await collection
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    res.json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch locations'
    });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const collection = db.collection(COLLECTION_NAME);

    const stats = {
      totalVisits: await collection.countDocuments(),
      uniqueIPs: (await collection.distinct('ip')).length,
      countries: await collection.aggregate([
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray(),
      cities: await collection.aggregate([
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray()
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats'
    });
  }
});

// ==============================
// 💳 Stripe Donation Route
// ==============================
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "Donation" },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/donation-success",
      cancel_url: "http://localhost:3000/donations",
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints ready`);
  console.log(`💳 Stripe enabled on /api/create-checkout-session`);
});
