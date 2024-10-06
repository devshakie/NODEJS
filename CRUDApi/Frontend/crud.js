const addedDataJSON = [];
let currentProductId = null; // Used to track the current product being edited.

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
            <p>Date: ${product.date || 'No date available'}</p>
            <p>Location: ${product.location || 'No location available'}</p>
            <p>Company: ${product.company || 'No description available'}</p>
            <div class="threeButtons">
                <button onclick="viewProduct(${product.id})">View product</button>
                <button onclick="openEditModal(${product.id})">Edit product</button>
                <button onclick="deleteProduct(${product.id})">Delete product 😒</button>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
}

// View product functionality
function viewProduct(id) {
    const product = addedDataJSON.find(p => p.id === id);
    
    if (product) {
        document.getElementById("view-title").innerText = product.title || 'No title available';
        document.getElementById("view-price").innerText = `Price: ksh ${product.price || 'Not available'}`;
        document.getElementById("view-image").src = product.imageUrl || 'default-image.png';
        document.getElementById("view-date").innerText = `Date: ${product.date || 'No date available'}`;
        document.getElementById("view-location").innerText = `Location: ${product.location || 'No location available'}`;
        document.getElementById("view-company").innerText = product.company || 'No description available';
        
        toggleViewProductModal(true);
    }
}

// Open the view product modal
function toggleViewProductModal(isOpen) {
    const viewProductModal = document.getElementById("view-product-modal");
    viewProductModal.classList.toggle("active", isOpen);
    viewProductModal.style.display = isOpen ? "flex" : "none";
}

// Close the view product modal
function closeViewProductModal() {
    toggleViewProductModal(false);
}

// Open the edit modal with pre-filled product data
function openEditModal(id) {
    currentProductId = id;
    const product = addedDataJSON.find(p => p.id === id);
    
    if (product) {
        document.getElementById("edit-title").value = product.title || '';
        document.getElementById("edit-price").value = product.price || '';
        document.getElementById("edit-image").value = product.imageUrl || '';
        document.getElementById("edit-date").value = product.date || '';
        document.getElementById("edit-location").value = product.location || '';
        document.getElementById("edit-company").value = product.company || '';
        
        
        toggleModal(true); 
    }
}

// Modal visibility 
function toggleModal(isOpen) {
    const modal = document.getElementById("modal");
    modal.classList.toggle("active", isOpen);
    modal.style.display = isOpen ? "flex" : "none";
}

// Close the modal
function closeModal() {
    toggleModal(false); 
    currentProductId = null;
}

// Open the add product modal
function openAddProductModal() {
    const addProductModal = document.getElementById("add-product-modal");
    addProductModal.style.display = "flex"; // Show the modal
}

// Close the add product modal and clear fields
function closeAddProductModal() {
    const addProductModal = document.getElementById("add-product-modal");
    addProductModal.style.display = "none"; // Hide the modal

    // Clear input fields
    document.getElementById("add-title").value = '';
    document.getElementById("add-price").value = '';
    document.getElementById("add-image").value = '';
    document.getElementById("add-date").value = '';
    document.getElementById("add-location").value = '';
    document.getElementById("add-company").value = '';
   
}

// Submit the new product details
async function submitAddProduct() {
    const newTitle = document.getElementById("add-title").value;
    const newPrice = document.getElementById("add-price").value;
    const newImageUrl = document.getElementById("add-image").value;
    const newDate = document.getElementById("add-date").value;
    const newLocation = document.getElementById("add-location").value;
    const newCompany = document.getElementById("add-company").value;
    

    const response = await fetch("http://localhost:5000/api/products", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle, price: newPrice, imageUrl: newImageUrl, date: newDate, location: newLocation, company: newCompany }),
    });

    if (response.ok) {
        const newProduct = await response.json();
        console.log('Product added:', newProduct);
        fetchProducts(); // Refresh the product list
        closeAddProductModal(); // Close the modal after adding the product
    } else {
        console.error('Failed to add product');
    }
}

// Submit the edited product details
async function submitEdit(id) {
    if (id === null) return; 
    
    const product = addedDataJSON.find(p => p.id === id);
    if (product) {
        const updatedTitle = document.getElementById("edit-title").value;
        const updatedPrice = document.getElementById("edit-price").value;
        const updatedImageUrl = document.getElementById("edit-image").value;
        const updatedDate = document.getElementById("edit-date").value;
        const updatedLocation = document.getElementById("edit-location").value;
        const updatedCompany = document.getElementById("edit-company").value;

        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: updatedTitle, price: updatedPrice, imageUrl: updatedImageUrl, date: updatedDate, location: updatedLocation, company: updatedCompany }),
        });
        if (response.ok) {
            const updatedProduct = await response.json();
            console.log('Product updated:', updatedProduct);
            fetchProducts(); 
            closeModal(); 
        } else {
            console.error(`Failed to update product with ID: ${id}`);
        }
    } else {
        console.error(`Product not found with ID: ${id}`);
    }
}

// Delete product
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

// Initial fetch on page load
fetchProducts(); 
