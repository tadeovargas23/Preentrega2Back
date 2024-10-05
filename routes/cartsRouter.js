const express = require('express');
const CartManager = require('../managers/cartManager');
const router = express.Router();

const cartManager = new CartManager();

// Ruta POST /
router.post('/', (req, res) => {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
});

// Ruta GET /:cid
router.get('/:id', (req, res) => {
    const cart = cartManager.getCartById(parseInt(req.params.id));
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

// Ruta POST /:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const updatedCart = cartManager.addProductToCart(cartId, productId);

    if (updatedCart) {
        res.json(updatedCart);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

module.exports = router;