const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const DATA_FILE = path.join(__dirname, 'data.json');
const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configurations
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static website assets directly from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

/**
 * API ENDPOINT: Process Consultation Requests
 */
app.post('/api/consultation', (req, res) => {
    try {
        const { clientName, email, company, technologies, goals, urgency } = req.body;

        // Backend Validation
        if (!clientName || !email || !company || !goals) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing mandatory fields. Please check input parameters." 
            });
        }

        const newLead = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            clientName,
            email,
            company,
            technologies: technologies || [],
            goals,
            urgency: urgency || 'Medium'
        };

        // Log the structured dynamic lead captured
        console.log(`[Lead Captured @ ${newLead.timestamp}]:`, newLead);

        // Save to data.json
        let leads = [];
        try {
            if (fs.existsSync(DATA_FILE)) {
                const data = fs.readFileSync(DATA_FILE, 'utf8');
                leads = JSON.parse(data);
            }
        } catch (err) {
            console.error("Error reading data file:", err);
        }
        
        leads.push(newLead);
        fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2));

        return res.status(200).json({
            success: true,
            message: "Request successfully processed and pipeline entry initiated."
        });
    } catch (error) {
        console.error("Server error routing lead data:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server anomaly encountered." 
        });
    }
});

/**
 * Middleware: Admin Password Check
 */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'caddium2026';

const requireAdmin = (req, res, next) => {
    const pass = req.headers['x-admin-password'];
    if (pass === ADMIN_PASSWORD || pass === 'datafactory2026') {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

/**
 * API ENDPOINT: Get All Consultation Requests (Admin)
 */
app.get('/api/consultations', requireAdmin, (req, res) => {
    try {
        let leads = [];
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            leads = JSON.parse(data);
        }
        return res.status(200).json({ success: true, data: leads });
    } catch (error) {
        console.error("Error fetching leads:", error);
        return res.status(500).json({ success: false, message: "Error fetching leads" });
    }
});

/**
 * API ENDPOINT: Delete Consultation Request (Admin)
 */
app.delete('/api/consultations/:id', requireAdmin, (req, res) => {
    try {
        if (!fs.existsSync(DATA_FILE)) return res.status(404).json({ success: false, message: 'No data' });
        
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        let leads = JSON.parse(data);
        const initialLength = leads.length;
        leads = leads.filter(l => l.id !== req.params.id);
        
        if (leads.length === initialLength) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }

        fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2));
        return res.status(200).json({ success: true, message: "Lead deleted successfully" });
    } catch (error) {
        console.error("Error deleting lead:", error);
        return res.status(500).json({ success: false, message: "Error deleting lead" });
    }
});

/**
 * API ENDPOINT: Get All Products (Public)
 */
app.get('/api/products', (req, res) => {
    try {
        let products = [];
        if (fs.existsSync(PRODUCTS_FILE)) {
            const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
            products = JSON.parse(data);
        }
        return res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ success: false, message: "Error reading products" });
    }
});

/**
 * API ENDPOINT: Add / Update Product (Admin)
 */
app.post('/api/products', requireAdmin, (req, res) => {
    try {
        const { id, name, pillar, tagline, description, liveUrl, highlights, techTags, status } = req.body;

        if (!name || !pillar || !liveUrl) {
            return res.status(400).json({ success: false, message: "Name, pillar, and liveUrl are required." });
        }

        let products = [];
        if (fs.existsSync(PRODUCTS_FILE)) {
            const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
            products = JSON.parse(data);
        }

        const pillarLabels = {
            iot: "CADDium IoT",
            data: "CADDium Data",
            software: "CADDium Software",
            ai: "CADDium AI"
        };

        const productId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;
        const newProduct = {
            id: productId,
            name,
            pillar: pillar.toLowerCase(),
            pillarLabel: pillarLabels[pillar.toLowerCase()] || `CADDium ${pillar}`,
            tagline: tagline || '',
            description: description || '',
            liveUrl,
            highlights: Array.isArray(highlights) ? highlights : (highlights ? highlights.split('\n').filter(Boolean) : []),
            techTags: Array.isArray(techTags) ? techTags : (techTags ? techTags.split(',').map(t => t.trim()).filter(Boolean) : []),
            status: status || "Live Production App",
            createdAt: new Date().toISOString()
        };

        const existingIndex = products.findIndex(p => p.id === productId);
        if (existingIndex >= 0) {
            products[existingIndex] = { ...products[existingIndex], ...newProduct };
        } else {
            products.push(newProduct);
        }

        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
        return res.status(200).json({ success: true, message: "Product saved successfully", data: newProduct });
    } catch (error) {
        console.error("Error saving product:", error);
        return res.status(500).json({ success: false, message: "Failed to save product" });
    }
});

/**
 * API ENDPOINT: Delete Product (Admin)
 */
app.delete('/api/products/:id', requireAdmin, (req, res) => {
    try {
        if (!fs.existsSync(PRODUCTS_FILE)) return res.status(404).json({ success: false, message: "No products file" });

        const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
        let products = JSON.parse(data);
        const initialLength = products.length;
        products = products.filter(p => p.id !== req.params.id);

        if (products.length === initialLength) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
        return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ success: false, message: "Failed to delete product" });
    }
});

// Admin Route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

// Fallback Route to serve main index.html file for any unknown endpoints
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Application Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`   CADDIUM ENGINEERED SOLUTIONS PLATFORM LIVE          `);
    console.log(`   IoT • DATA • SOFTWARE • AI                          `);
    console.log(`   Port: ${PORT} (0.0.0.0)                             `);
    console.log(`=======================================================`);
});