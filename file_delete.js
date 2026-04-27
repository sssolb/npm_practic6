const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'DELETE' && req.url.startsWith('/data/')) {
        const id = parseInt(req.url.split('/')[2], 10);
        const dataPath = path.join(__dirname, 'data.json');

        let rawData;
        try {
            rawData = fs.readFileSync(dataPath, 'utf8');
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end();
        }

        let fileData;
        try {
            fileData = JSON.parse(rawData);
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end();
        }

        const initialLength = fileData.length;
        fileData = fileData.filter(item => item.id !== id);

        if (fileData.length === initialLength) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end();
        }

        try {
            fs.writeFileSync(dataPath, JSON.stringify(fileData));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end();
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end();
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end();
    }
});

server.listen(port);