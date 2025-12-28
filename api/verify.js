const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'vidmerge_licenses';

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

module.exports = async (req, res) => {
    // Handle OPTIONS for CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { licenseKey, machineId } = req.body;

        // Validate input
        if (!licenseKey || !machineId) {
            return res.status(400).json({
                valid: false,
                error: 'Missing license key or machine ID',
            });
        }

        console.log('Verifying license:', licenseKey.trim());
        console.log('Machine ID:', machineId);

        // Connect to database
        const { db } = await connectToDatabase();
        const licenses = db.collection('licenses');

        // Find license
        const license = await licenses.findOne({ key: licenseKey.trim() });

        if (!license) {
            console.log('License not found');
            return res.status(200).json({
                valid: false,
                error: 'Invalid license key',
            });
        }

        // Check if expired
        if (license.expiryDate && new Date(license.expiryDate) < new Date()) {
            console.log('License expired');
            return res.status(200).json({
                valid: false,
                error: 'License has expired',
            });
        }

        // Check hardware lock
        if (license.machineId && license.machineId !== machineId) {
            console.log('Machine ID mismatch');
            return res.status(200).json({
                valid: false,
                error: 'License is already activated on another device',
            });
        }

        // If not locked yet, lock it
        if (!license.machineId) {
            console.log('Locking license to machine:', machineId);
            await licenses.updateOne(
                { key: licenseKey.trim() },
                {
                    $set: {
                        machineId: machineId,
                        activatedAt: new Date(),
                    },
                }
            );
        }

        // Update last check
        await licenses.updateOne(
            { key: licenseKey.trim() },
            {
                $set: {
                    lastCheck: new Date(),
                },
            }
        );

        console.log('License valid!');
        return res.status(200).json({
            valid: true,
            expiryDate: license.expiryDate,
            licensedTo: license.email || 'User',
        });
    } catch (error) {
        console.error('Error verifying license:', error);
        return res.status(500).json({
            valid: false,
            error: 'Server error during verification',
        });
    }
};
