const apiBase = '/api';

const categoriasResult = document.getElementById('categorias-result');
const productosResult = document.getElementById('productos-result');
const ventasResult = document.getElementById('ventas-result');
const productoSelect = document.getElementById('producto-select');
const ventaForm = document.getElementById('venta-form');
const ventaCantidad = document.getElementById('venta-cantidad');
const ventaResult = document.getElementById('venta-result');

const loadCategoriasBtn = document.getElementById('load-categorias');
const loadProductosBtn = document.getElementById('load-productos');
const loadVentasBtn = document.getElementById('load-ventas');

loadCategoriasBtn.addEventListener('click', cargarCategorias);
loadProductosBtn.addEventListener('click', cargarProductos);
loadVentasBtn.addEventListener('click', cargarVentas);
ventaForm.addEventListener('submit', registrarVenta);

window.addEventListener('load', () => {
    cargarCategorias();
    cargarProductos();
});

async function cargarCategorias() {
    categoriasResult.innerHTML = 'Cargando...';
    try {
        const res = await fetch(`${apiBase}/categorias`);
        const categorias = await res.json();
        categoriasResult.innerHTML = `<pre>${JSON.stringify(categorias, null, 2)}</pre>`;
    } catch (error) {
        categoriasResult.innerHTML = `<pre>Error: ${error.message}</pre>`;
    }
}

async function cargarProductos() {
    productosResult.innerHTML = 'Cargando...';
    try {
        const res = await fetch(`${apiBase}/productos`);
        const productos = await res.json();
        productosResult.innerHTML = `<pre>${JSON.stringify(productos, null, 2)}</pre>`;
        actualizarProductoSelect(productos);
    } catch (error) {
        productosResult.innerHTML = `<pre>Error: ${error.message}</pre>`;
    }
}

async function cargarVentas() {
    ventasResult.innerHTML = 'Cargando...';
    try {
        const res = await fetch(`${apiBase}/ventas`);
        const ventas = await res.json();
        ventasResult.innerHTML = `<pre>${JSON.stringify(ventas, null, 2)}</pre>`;
    } catch (error) {
        ventasResult.innerHTML = `<pre>Error: ${error.message}</pre>`;
    }
}

function actualizarProductoSelect(productos) {
    productoSelect.innerHTML = '';
    if (productos.length === 0) {
        productoSelect.innerHTML = '<option value="">No hay productos disponibles</option>';
        return;
    }
    productoSelect.innerHTML = productos
        .map(producto => `<option value="${producto.id}">${producto.nombre} - S/. ${producto.precio} (stock: ${producto.stock})</option>`)
        .join('');
}

async function registrarVenta(event) {
    event.preventDefault();
    ventaResult.innerHTML = 'Registrando venta...';

    const productoId = Number(productoSelect.value);
    const cantidad = Number(ventaCantidad.value);

    if (!productoId || cantidad < 1) {
        ventaResult.innerHTML = '<pre>Selecciona un producto y una cantidad válida.</pre>';
        return;
    }

    try {
        const res = await fetch(`${apiBase}/ventas`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ productoId, cantidad })
        });

        if (!res.ok) {
            const error = await res.json();
            ventaResult.innerHTML = `<pre>Error: ${JSON.stringify(error, null, 2)}</pre>`;
            return;
        }

        const venta = await res.json();
        ventaResult.innerHTML = `<pre>Venta registrada correctamente:\n${JSON.stringify(venta, null, 2)}</pre>`;
        cargarProductos();
        cargarVentas();
    } catch (error) {
        ventaResult.innerHTML = `<pre>Error: ${error.message}</pre>`;
    }
}
