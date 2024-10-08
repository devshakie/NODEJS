import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbCruddbPath = path.join(__dirname, 'cruddb.json');


let productListData = JSON.parse(fs.readFileSync(dbCruddbPath, 'utf-8'));

// Function to write products to file
const writeProductstoFile = () => {
    fs.writeFileSync(dbCruddbPath, JSON.stringify(productListData, null, 2), 'utf-8');
};

const router = async (req, res) => {
    const { url, method } = req;

    const sendJSONResponse = (statusCode, data) => {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(statusCode);
        res.end(JSON.stringify(data));
    };

    // GET all products
    if (url === "/api/products" && method === "GET") {
        if (productListData.length > 0) {
            sendJSONResponse(200, productListData);
        } else {
            sendJSONResponse(400, { message: "Products are empty" });
        }
    }

    // GET a single product by ID
    else if (url.match(/\/api\/products\/\d+/) && method === "GET") {
        const id = url.split("/")[3];
        const product = productListData.find((product) => product.id === id);

        if (product) {
            sendJSONResponse(200, product);
        } else {
            sendJSONResponse(404, { message: "Product not found" });
        }
    }

    // POST a new product
    else if (url === '/api/products' && method === "POST") {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const { title, price, imageUrl, date, location,company } = JSON.parse(body);

                const existingProduct = productListData.find(p => p.title === title);
                if (existingProduct) {
                    return sendJSONResponse(400, { message: 'Product with this title already exists' });
                }

                const newProduct = {
                    id: uuidv4(), 
                    title,
                    price,
                    imageUrl,
                    date,
                    location,
                    company
                };
                productListData.push(newProduct);
                writeProductstoFile(); 
                sendJSONResponse(201, { message: 'New product added', product: newProduct });
            } catch (error) {
                sendJSONResponse(400, { message: 'Invalid JSON format' });
            }
        });
    }

    // PUT to update a specific product
    else if (url.match(/\/api\/products\/\d+/) && method === "PUT") {
        const id = parseInt(url.split("/")[3]);

        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const { title, price, imageUrl, date, location, company } = JSON.parse(body);
                const productIndex = productListData.findIndex((product) => product.id === id);

                if (productIndex !== -1) {
                    const updatedProduct = { ...productListData[productIndex], title, price, imageUrl, date, location, company };
                    productListData[productIndex] = updatedProduct;
                    writeProductstoFile(); 
                    sendJSONResponse(200, { message: 'Product updated', product: updatedProduct });
                } else {
                    sendJSONResponse(404, { message: 'Product not found' });
                }
            } catch (error) {
                sendJSONResponse(400, { message: 'Invalid JSON format' });
            }
        });
    }

    // DELETE a product by ID
    else if (url.match(/\/api\/products\/\d+/) && method === "DELETE") {
        const id = parseInt(url.split("/")[3]);
        const productIndex = productListData.findIndex((product) => product.id === id);

        if (productIndex !== -1) {
            productListData = productListData.filter((product) => product.id !== id);
            writeProductstoFile();
            sendJSONResponse(200, { message: 'Product deleted' });
        } else {
            sendJSONResponse(404, { message: 'Product not found' });
        }
    }


    else {
        sendJSONResponse(404, { message: 'Route Not Found' });
    }
};

export default router;
