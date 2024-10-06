 productCard.innerHTML = `
            <img src="${product.imageUrl || 'default-image.png'}" alt="${product.title || 'Product image'}">
            <h3>${product.title || 'No title available'}</h3>
            <p>Price: ksh ${product.price || 'Not available'}</p>
            <div class="threeButtons">
                <button onclick="viewProduct(${product.id})">View product</button>
                <button onclick="openEditModal(${product.id})">Edit product</button>
                <button onclick="deleteProduct(${product.id})">Delete product 😒</button>
            </div>
        `;