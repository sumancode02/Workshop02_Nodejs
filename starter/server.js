// Import Node.js built-in HTTP module
const http = require('http');
// We also need the fs (File System) and path modules for the workshop tasks
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// --- Helper Functions for Error Handling ---
function handle404(res) {
    fs.readFile(path.join(PUBLIC_DIR, '404.html'), (err, content) => {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(content || '404 Not Found', 'utf-8');
    });
}

function handleServerError(res) {
    fs.readFile(path.join(PUBLIC_DIR, '500.html'), (err, content) => {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(content || '500 Internal Server Error', 'utf-8');
    });
}

function serveFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                handle404(res);
            } else {
                handleServerError(res);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}

// --- Create the web server ---
const server = http.createServer((req, res) => {
    console.log('Request received:', req.url);

    // Task 6: API Endpoint (Bonus)
    if (req.url === '/api/time' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ currentTime: new Date().toISOString() }));
    }

    // Task 4: Serve CSS Files
    if (req.url.match(/\.css$/)) {
        const safePath = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
        const cssPath = path.join(PUBLIC_DIR, safePath);
        return serveFile(res, cssPath, 'text/css');
    }

    // Task 2 & 3: Routing & Serving HTML
    let filePath = '';
    switch (req.url) {
        case '/':
            filePath = path.join(PUBLIC_DIR, 'index.html');
            break;
        case '/about':
            filePath = path.join(PUBLIC_DIR, 'about.html');
            break;
        case '/contact':
            filePath = path.join(PUBLIC_DIR, 'contact.html');
            break;
        default:
            return handle404(res);
    }

    serveFile(res, filePath, 'text/html');
});

// Prints a log once the server starts listening
server.listen(3000, () => {
    console.log('🚀 Server is running on http://localhost:3000');
    console.log('Press Ctrl + C in the terminal to stop the server.');
});