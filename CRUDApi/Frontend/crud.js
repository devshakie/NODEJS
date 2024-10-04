const addedDataJSON = [];
let currentProductId = null; //used to track the current product being edited.

async function fetchProducts() {
    try {
        const response = await fetch("http://localhost:5000/api/products");
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched products data:", data); 
        addedDataJSON.length = 0; 
        addedDataJSON.push(...data);
        populateProducts();
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

function populateProducts() {
    const productsContainer = document.getElementById("products-container");

    if (!productsContainer) {
        console.error('No products container found!');
        return;
    }

    productsContainer.innerHTML = "";

    addedDataJSON.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <img src="${product.imageUrl || 'default-image.png'}" alt="${product.title || 'Product image'}">
            <h3>${product.title || 'No title available'}</h3>
            <p>Price: ksh ${product.price || 'Not available'}</p>
            <p>
            <div class="threeButtons">
                <button onclick="viewProduct(${product.id})">View product</button>
                <button onclick="openEditModal(${product.id})">Edit product</button>
                <button onclick="deleteProduct(${product.id})">Delete product😒</button>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
}

// Function to open the edit modal with pre-filled product data
function openEditModal(id) {
    currentProductId = id;
    const product = addedDataJSON.find(p => p.id === id);
    
    if (product) {
        document.getElementById("edit-title").value = product.title || '';
        document.getElementById("edit-price").value = product.price || '';
        document.getElementById("edit-image").value = product.imageUrl || '';
        
        toggleModal(true); 
    }
}
//modal visibility 
function toggleModal(isOpen) {
    const modal = document.getElementById("modal");
    modal.classList.toggle("active", isOpen);
    modal.style.display = isOpen ? "flex" : "none";
}

//close the modal
function closeModal() {
    toggleModal(false); 
    currentProductId = null;
}

//submit the edited product details
async function submitEdit() {
    if (currentProductId === null) return; 
    
    const product = addedDataJSON.find(p => p.id === currentProductId);
    if (product) {
        const updatedTitle = document.getElementById("edit-title").value;
        const updatedPrice = document.getElementById("edit-price").value;
        const updatedImageUrl = document.getElementById("edit-image").value;

        const response = await fetch(`http://localhost:5000/api/products/${currentProductId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: updatedTitle, price: updatedPrice, imageUrl: updatedImageUrl }),
        });
        if (response.ok) {
            const updatedProduct = await response.json();
            console.log('Product updated:', updatedProduct);
            fetchProducts(); 
            closeModal(); 
        } else {
            console.error(`Failed to update product with ID: ${currentProductId}`);
        }
    } else {
        console.error(`Product not found with ID: ${currentProductId}`);
    }
}

async function deleteProduct(id) {
    const confirmation = confirm("Are you sure you want to delete this product?");
    if (confirmation) {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            console.log(`Deleted product with ID: ${id}`);
            fetchProducts(); 
        } else {
            console.error(`Failed to delete product with ID: ${id}`);
        }
    }
}

// Call fetch to load products on page load
window.onload = fetchProducts;
