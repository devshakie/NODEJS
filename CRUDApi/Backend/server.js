// server.js
import http from 'http';
import fs from 'fs';
import productListData from './cruddb.js'; 

const setCORSHeaders = (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// Save data to DB (cruddb.js)
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

    // PUT (Edit product)
    else if (url.match(/\/api\/products\/\d+/) && method === 'PUT') {
        const id = parseInt(url.split('/')[3]);
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { title, price, imageUrl } = JSON.parse(body);
                const productIndex = productListData.findIndex(product => product.id === id);

                if (productIndex !== -1) {
                    productListData[productIndex] = { 
                        ...productListData[productIndex], 
                        title, 
                        price, 
                        imageUrl 
                    };
                    saveToDB(productListData);
                    sendJSONResponse(200, { message: 'Product updated', product: productListData[productIndex] });
                } else {
                    sendJSONResponse(404, { message: 'Product not found' });
                }
            } catch (error) {
                sendJSONResponse(400, { message: 'Invalid JSON' });
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

    // If no route is matched
    else {
        sendJSONResponse(404, { message: 'Route Not Found' });
    }
};

// Create server
const server = http.createServer(router);
server.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
