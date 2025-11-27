const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public directory

// CSV File Path
const CSV_FILE = path.join(__dirname, 'leads.csv');

// Ensure CSV exists with headers
if (!fs.existsSync(CSV_FILE)) {
    fs.writeFileSync(CSV_FILE, 'Name,Phone,Class,Address,Date\n');
}

// API Endpoint to save leads
app.post('/api/leads', (req, res) => {
    const { name, phone, class: studentClass, address } = req.body;

    if (!name || !phone || !studentClass || !address) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const date = new Date().toLocaleString();
    // Escape fields to handle commas in data
    const csvLine = `"${name}","${phone}","${studentClass}","${address}","${date}"\n`;

    fs.appendFile(CSV_FILE, csvLine, (err) => {
        if (err) {
            console.error('Error writing to CSV:', err);
            return res.status(500).json({ error: 'Failed to save lead' });
        }
        console.log('Lead saved:', { name, phone, class: studentClass, address });
        res.json({ message: 'Lead saved successfully' });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
