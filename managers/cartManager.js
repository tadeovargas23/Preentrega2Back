const fs = require('fs');
const path = require('path');
const cartFilePath = path.join(__dirname, '../data/carrito.json');

class CartManager {
    getAllCarts() {
        try {
            const cartsData = fs.readFileSync(cartFilePath, 'utf-8');
            return JSON.parse(cartsData);
        } catch (error) {
            throw new Error('Error al leer los carritos');
        }
    }

    getCartById(id) {
        const carts = this.getAllCarts();
        return carts.find(cart => cart.id === id);
    }

    createCart() {
        const carts = this.getAllCarts();
        const newId = carts.length ? carts[carts.length - 1].id + 1 : 1;
        const newCart = { id: newId, products: [] };
        carts.push(newCart);

        fs.writeFileSync(cartFilePath, JSON.stringify(carts, null, 2));
        return newCart;
    }

    addProductToCart(cartId, productId) {
        const carts = this.getAllCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        if (cartIndex === -1) return null;

        const cart = carts[cartIndex];
        const productInCart = cart.products.find(prod => prod.product === productId);

        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        fs.writeFileSync(cartFilePath, JSON.stringify(carts, null, 2));
        return cart;
    }
}

module.exports = CartManager;
