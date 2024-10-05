import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import exphbs from 'express-handlebars'; // Asegúrate de que esto esté correcto
import path from 'path';
import ProductManager from './managers/productManager.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const productManager = new ProductManager('./data/productos.json');

// Configurar Handlebars
app.engine('handlebars', exphbs.engine()); // Cambia esta línea a exphbs.engine()
app.set('view engine', 'handlebars');
app.set('views', path.join(process.cwd(), 'views')); // Asegúrate de que la ruta a las vistas sea correcta

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/', async (req, res) => {
    const productos = await productManager.getProducts();
    res.render('home', { productos });
});

app.get('/realtimeproducts', async (req, res) => {
    const productos = await productManager.getProducts();
    res.render('realTimeProducts', { productos });
});

// Manejar la adición de productos
io.on('connection', (socket) => {
    console.log('Usuario conectado');

    // Emitir productos al conectarse
    productManager.getProducts().then((productos) => {
        socket.emit('productosActualizados', productos);
    });

    // Manejar la adición de productos
    socket.on('agregarProducto', async (producto) => {
        const productos = await productManager.getProducts();

        // Obtener el próximo ID disponible
        const nuevoId = productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1;

        // Crear un nuevo producto con el ID y el resto de la información
        const nuevoProducto = { id: nuevoId, ...producto };

        // Agregar el producto al array
        productos.push(nuevoProducto);
        
        // Guardar en el JSON
        await productManager.saveProducts(productos);

        // Emitir la lista actualizada
        io.emit('productosActualizados', productos);
    });

    // Manejar la eliminación de productos
    socket.on('eliminarProducto', async (id) => {
        const productos = await productManager.getProducts();
        const productosFiltrados = productos.filter(p => p.id !== parseInt(id));

        // Guardar los productos filtrados en el JSON
        await productManager.saveProducts(productosFiltrados);

        // Emitir la lista actualizada
        io.emit('productosActualizados', productosFiltrados);
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
