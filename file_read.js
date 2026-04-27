const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/data') {
        try {
            const dataPath = path.join(__dirname, 'data.json');
            const rawData = fs.readFileSync(dataPath, 'utf8');
            
            const data = JSON.parse(rawData);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON or missing file' }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});