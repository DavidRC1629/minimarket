-- Categorías iniciales
INSERT INTO categorias (nombre, descripcion) VALUES ('Bebidas', 'Bebidas frías y calientes');
INSERT INTO categorias (nombre, descripcion) VALUES ('Snacks', 'Aperitivos y golosinas');
INSERT INTO categorias (nombre, descripcion) VALUES ('Abarrotes', 'Productos de despensa');

-- Productos iniciales
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) VALUES ('Agua Mineral 500ml', 'Botella de agua sin gas', 1.50, 100, 1);
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) VALUES ('Gaseosa Cola 1L', 'Bebida gaseosa sabor cola', 4.50, 60, 1);
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) VALUES ('Papas Fritas 150g', 'Snack de papas fritas clásicas', 3.20, 80, 2);
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) VALUES ('Chocolate Bar', 'Barra de chocolate con leche', 2.80, 50, 2);
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) VALUES ('Arroz 1kg', 'Bolsa de arroz extra', 5.90, 40, 3);
