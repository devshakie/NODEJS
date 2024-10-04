import http from 'http';
import fs from 'fs';

import productListData from './cruddb.js';

const setCORSHeaders = (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const saveToDB = (data) => {
    fs.writeFileSync('./cruddb.js', `export default ${JSON.stringify(data, null, 2)};`);
};

// Router function
const router = async (req, res) => {
    const { url, method } = req;

    setCORSHeaders(res);

    const sendJSONResponse = (statusCode, data) => {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(JSON.stringify(data));
    };

    // GET all products
    if (url === '/api/products' && method === 'GET') {
        sendJSONResponse(200, productListData);
    }

    // POST (Add new product)
    else if (url === '/api/products' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { title, price, date, location, company, imageUrl } = JSON.parse(body);
            const newId = productListData.length + 1;
            const newProduct = {
                id: newId,
                title,
                price,
                date,
                location,
                company,
                imageUrl
            };
            productListData.push(newProduct);
            saveToDB(productListData);
            sendJSONResponse(201, { message: 'Product added', product: newProduct });
        });
    }

    // PUT (Edit product)
    else if (url.match(/\/api\/products\/\d+/) && method === 'PUT') {
        const id = parseInt(url.split('/')[3]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { title, price, date, location, company, imageUrl } = JSON.parse(body);
            const productIndex = productListData.findIndex(product => product.id === id);

            if (productIndex !== -1) {
                productListData[productIndex] = { ...productListData[productIndex], title, price, date, location, company, imageUrl };
                saveToDB(productListData);
                sendJSONResponse(200, { message: 'Product updated', product: productListData[productIndex] });
            } else {
                sendJSONResponse(404, { message: 'Product not found' });
            }
        });
    }

    // DELETE product
    else if (url.match(/\/api\/products\/\d+/) && method === 'DELETE') {
        const id = parseInt(url.split('/')[3]);
        const productIndex = productListData.findIndex(product => product.id === id);

        if (productIndex !== -1) {
            productListData = productListData.filter(product => product.id !== id);
            saveToDB(productListData);
            sendJSONResponse(200, { message: 'Product deleted' });
        } else {
            sendJSONResponse(404, { message: 'Product not found' });
        }
    }

    else {
        sendJSONResponse(404, { message: 'Route Not Found' });
    }
};

// Create server
const server = http.createServer(router);
server.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
export default router;