const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'vidmerge_licenses';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'change-me-in-production';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const client = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = client.db(DB_NAME);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
}

function generateLicenseKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = 4;
    const segmentLength = 4;

    let key = '';
    for (let i = 0; i < segments; i++) {
        if (i > 0) key += '-';
        for (let j = 0; j < segmentLength; j++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    }
    return key;
}

module.exports = async (req, res) => {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { adminSecret, email, expiryDays } = req.body;

        // Validate admin secret
        if (adminSecret !== ADMIN_SECRET) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Connect to database
        const { db } = await connectToDatabase();
        const licenses = db.collection('licenses');

        // Generate new key
        let key;
        let exists = true;

        // Ensure unique key
        while (exists) {
            key = generateLicenseKey();
            exists = await licenses.findOne({ key });
        }

        // Calculate expiry date
        let expiryDate = null;
        if (expiryDays && expiryDays > 0) {
            expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + expiryDays);
        }

        // Create license document
        const license = {
            key,
            email: email || null,
            createdAt: new Date(),
            expiryDate,
            machineId: null,
            activatedAt: null,
            lastCheck: null,
        };

        // Insert into database
        await licenses.insertOne(license);

        console.log('Generated new license:', key);

        return res.status(200).json({
            success: true,
            licenseKey: key,
            expiryDate: expiryDate,
        });
    } catch (error) {
        console.error('Error generating license:', error);
        return res.status(500).json({
            success: false,
            error: 'Server error during generation',
        });
    }
};
