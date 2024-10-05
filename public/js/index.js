const socket = io();

const productList = document.getElementById('productList');
const productForm = document.getElementById('productForm');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');

// Escuchar la creación de productos
productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newProduct = {
        name: nameInput.value,
        price: parseFloat(priceInput.value)
    };

    socket.emit('productCreated', newProduct);

    nameInput.value = '';
    priceInput.value = '';
});

// Escuchar cuando un producto es añadido
socket.on('productListUpdated', (newProduct) => {
    const newItem = document.createElement('li');
    newItem.setAttribute('data-id', newProduct.id);
    newItem.innerHTML = `${newProduct.name} - ${newProduct.price} 
        <button class="delete-btn">Eliminar</button>`;

    productList.appendChild(newItem);
});

// Escuchar cuando un producto es eliminado
productList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const productId = e.target.closest('li').getAttribute('data-id');
        socket.emit('deleteProduct', productId);
    }
});

socket.on('productDeleted', (productId) => {
    const itemToDelete = document.querySelector(`li[data-id="${productId}"]`);
    if (itemToDelete) {
        itemToDelete.remove();
    }
});
