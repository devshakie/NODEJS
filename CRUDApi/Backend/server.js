import http from 'http';
import router from './routes.js';
import cors from 'cors';

// Create HTTP server
const server = http.createServer((req, res) => {
    // Enable CORS for all routes
    cors()(req, res, () => {
        router(req, res);
    });
});

const PORT = 5000;
const HOST = 'localhost';
server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});
