const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
    const productos = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/productos.json')));
    res.render('home', { productos });
});

router.get('/realtimeproducts', (req, res) => {
    const productos = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/productos.json')));
    res.render('realTimeProducts', { productos });
});

module.exports = router;
