const fs = require('fs');
const path = require('path');
const os = require('os');

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { name, phone, class: studentClass, address } = req.body;

        if (!name || !phone || !studentClass || !address) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const date = new Date().toLocaleString();
        // Escape fields to handle commas in data
        const csvLine = `"${name}","${phone}","${studentClass}","${address}","${date}"\n`;

        // NOTE: On Vercel, we can only write to /tmp, and it is ephemeral.
        // This means the file will disappear when the lambda freezes/restarts.
        // For production, you should use a database (e.g., Vercel Postgres, MongoDB).
        const tempFilePath = path.join(os.tmpdir(), 'leads.csv');

        // Ensure header exists if file is new (in this ephemeral session)
        if (!fs.existsSync(tempFilePath)) {
            fs.writeFileSync(tempFilePath, 'Name,Phone,Class,Address,Date\n');
        }

        fs.appendFile(tempFilePath, csvLine, (err) => {
            if (err) {
                console.error('Error writing to CSV:', err);
                return res.status(500).json({ error: 'Failed to save lead' });
            }
            console.log('Lead saved to temp file:', { name, phone, class: studentClass, address });

            // In a real app, you would save to a DB here.

            res.status(200).json({ message: 'Lead received (saved to ephemeral storage)' });
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
