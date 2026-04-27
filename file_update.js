const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'PUT' && req.url.startsWith('/data/')) {
        const id = parseInt(req.url.split('/')[2], 10);
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const updatePayload = JSON.parse(body);
                const dataPath = path.join(__dirname, 'data.json');

                let fileData;
                try {
                    const rawData = fs.readFileSync(dataPath, 'utf8');
                    fileData = JSON.parse(rawData);
                } catch (fileError) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    return res.end('Internal Server Error');
                }

                const itemIndex = fileData.findIndex(item => item.id === id);

                if (itemIndex === -1) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    return res.end('Not Found');
                }

                fileData[itemIndex] = { ...fileData[itemIndex], ...updatePayload, id: id };
                fs.writeFileSync(dataPath, JSON.stringify(fileData));

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Bad Request');
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(port);