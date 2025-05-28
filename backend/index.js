const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------ CONFIGURACIÓN MULTER ------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const newFileName = file.fieldname + '-' + uniqueSuffix + fileExtension;
    cb(null, newFileName);
  }
});

const upload = multer({ storage: storage });

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: 'Multer error: ' + err.message });
  } else if (err) {
    return res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------ RUTAS USUARIOS ------------------
app.post('/api/usuarios/insertar', async (req, res) => {
  const {
    nombre_completo, correo, contrasena, telefono, fecha_nacimiento,
    direccion, departamento, ciudad, codigo_postal, is_admin
  } = req.body;

  if (!nombre_completo || !correo || !contrasena || !telefono || !fecha_nacimiento || 
      !direccion || !departamento || !ciudad || !codigo_postal) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const query = `
      INSERT INTO usuarios (
        nombre_completo, correo, contrasena, telefono, fecha_nacimiento, 
        direccion, departamento, ciudad, codigo_postal, is_admin
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, nombre_completo, correo
    `;
    const result = await pool.query(query, [
      nombre_completo,
      correo,
      contrasena,
      telefono.toString(),
      fecha_nacimiento,
      direccion,
      departamento,
      ciudad,
      codigo_postal.toString(),
      is_admin || false
    ]);
    res.status(201).json({
      mensaje: 'Usuario creado con éxito',
      usuario: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'usuarios_correo_key') {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }
    res.status(500).json({ error: 'Error al registrar usuario', detalle: error.message });
  }
});

app.get('/api/usuarios/obtener', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nombre_completo, correo, telefono, fecha_nacimiento, 
             direccion, departamento, ciudad, codigo_postal, is_admin 
      FROM usuarios
      ORDER BY id ASC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor al obtener usuarios.', detalle: error.message });
  }
});

app.put('/api/usuarios/actualizar/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_completo, correo, telefono, direccion, is_admin } = req.body;

  const fields = [];
  const values = [];
  let paramIndex = 1;

  if (nombre_completo !== undefined) {
    fields.push(`nombre_completo=$${paramIndex++}`);
    values.push(nombre_completo);
  }
  if (correo !== undefined) {
    fields.push(`correo=$${paramIndex++}`);
    values.push(correo);
  }
  if (telefono !== undefined) {
    fields.push(`telefono=$${paramIndex++}`);
    values.push(String(telefono));
  }
  if (direccion !== undefined) {
    fields.push(`direccion=$${paramIndex++}`);
    values.push(direccion);
  }
  if (is_admin !== undefined) {
    fields.push(`is_admin=$${paramIndex++}`);
    values.push(is_admin);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar.' });
  }

  values.push(id);
  
  try {
    const query = `
      UPDATE usuarios 
      SET ${fields.join(', ')}
      WHERE id=$${paramIndex}
      RETURNING id, nombre_completo, correo
    `;
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.status(200).json({ mensaje: 'Usuario actualizado', usuario: result.rows[0] });
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'usuarios_correo_key') {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado por otro usuario' });
    }
    res.status(500).json({ error: 'Error al actualizar usuario', detalle: error.message });
  }
});

app.delete('/api/usuarios/eliminar/:correo', async (req, res) => {
  const correo = req.params.correo;
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE correo = $1 RETURNING id, correo', [correo]);
    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.status(200).json({ mensaje: 'Usuario eliminado', usuario: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario', detalle: error.message });
  }
});

app.post('/api/usuarios/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena) {
    return res.status(400).json({ success: false, error: 'Correo y contraseña son obligatorios' });
  }

  try {
    const result = await pool.query(
      `SELECT id, nombre_completo, correo, is_admin 
       FROM usuarios 
       WHERE correo = $1 AND contrasena = $2`,
      [correo, contrasena]
    );

    if (result.rows.length > 0) {
      const usuario = result.rows[0];
      res.status(200).json({
        success: true,
        mensaje: 'Inicio de sesión exitoso',
        usuario: {
          id: usuario.id,
          nombre_completo: usuario.nombre_completo,
          correo: usuario.correo,
          is_admin: usuario.is_admin
        }
      });
    } else {
      res.status(401).json({ success: false, mensaje: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al iniciar sesión', detalle: error.message });
  }
});

app.post('/api/usuarios/reset-password-direct', async (req, res) => {
  const { correo, nueva_contrasena, confirmar_nueva_contrasena } = req.body;
  if (!correo || !nueva_contrasena || !confirmar_nueva_contrasena) {
    return res.status(400).json({ error: 'Correo, nueva contraseña y confirmación son requeridos.' });
  }
  if (nueva_contrasena !== confirmar_nueva_contrasena) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
  }
  if (nueva_contrasena.length < 6) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' });
  }

  try {
    const userCheckQuery = 'SELECT id FROM usuarios WHERE correo = $1';
    const userCheckResult = await pool.query(userCheckQuery, [correo]);

    if (userCheckResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const updateQuery = `UPDATE usuarios SET contrasena = $1 WHERE correo = $2`;
    const result = await pool.query(updateQuery, [nueva_contrasena, correo]);

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Contraseña restablecida correctamente.' });
    } else {
      res.status(500).json({ error: 'No se pudo actualizar la contraseña.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor al restablecer la contraseña.', detalle: error.message });
  }
});

app.post('/api/usuarios/eliminar-cuenta', async (req, res) => {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo electrónico y contraseña son requeridos.' });
  }

  try {
    const query = `DELETE FROM usuarios WHERE correo = $1 AND contrasena = $2`;
    const result = await pool.query(query, [correo, contrasena]);

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Cuenta eliminada correctamente.' });
    } else {
      res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor al eliminar la cuenta.', detalle: error.message });
  }
});

// ------------------ RUTAS PRODUCTOS ------------------
app.post('/api/productos/insertar', upload.single('imagen'), async (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body; 
  let imagenUrl = null;
  if (req.file) {
    imagenUrl = `/uploads/${req.file.filename}`;
  }

  try {
    const query = 'INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [nombre, descripcion, parseFloat(precio), parseInt(stock), imagenUrl];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor al insertar producto' });
  }
});

app.put('/api/productos/actualizar/:id', upload.single('imagen'), async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock } = req.body; 
  let imagenUrl = null;
  let oldImageUrl = null;

  try {
    const productQuery = 'SELECT imagen_url FROM productos WHERE id = $1';
    const productResult = await pool.query(productQuery, [id]);

    if (productResult.rows.length > 0) {
      oldImageUrl = productResult.rows[0].imagen_url;
    }

    if (req.file) {
      imagenUrl = `/uploads/${req.file.filename}`;
      if (oldImageUrl && oldImageUrl !== imagenUrl) {
        const oldImagePath = path.join(__dirname, oldImageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error('Error al eliminar imagen antigua:', oldImagePath, err);
          });
        }
      }
    } else {
      imagenUrl = oldImageUrl;
    }

    const query = 'UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, stock = $4, imagen_url = $5 WHERE id = $6 RETURNING *';
    const values = [nombre, descripcion, parseFloat(precio), parseInt(stock), imagenUrl, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor al actualizar producto' });
  }
});

app.get('/api/productos/obtener', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor al obtener productos' });
  }
});

app.delete('/api/productos/eliminar/:id', async (req, res) => {
  const { id } = req.params;
  let imageUrlToDelete = null;

  try {
    const productQuery = 'SELECT imagen_url FROM productos WHERE id = $1';
    const productResult = await pool.query(productQuery, [id]);

    if (productResult.rows.length > 0) {
      imageUrlToDelete = productResult.rows[0].imagen_url;
    }

    const query = 'DELETE FROM productos WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (imageUrlToDelete) {
      const imagePath = path.join(__dirname, imageUrlToDelete);
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error al eliminar archivo de imagen:', imagePath, err);
        });
      }
    }

    res.status(200).json({ message: 'Producto eliminado exitosamente', deletedProduct: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor al eliminar producto' });
  }
});

// ------------------ RUTAS PEDIDOS ------------------
app.post('/api/pedidos/insertar', async (req, res) => {
  let { usuario_id, nombre_cliente, tipo_documento_id, numero_documento, celular, metodo_pago_id, monto_total, productos } = req.body;

  usuario_id = parseInt(usuario_id);
  tipo_documento_id = parseInt(tipo_documento_id);
  metodo_pago_id = parseInt(metodo_pago_id);
  monto_total = parseFloat(monto_total);

  if (productos && Array.isArray(productos)) {
    productos = productos.map(item => ({
      ...item,
      cantidad: parseInt(item.cantidad),
      precio_unitario: parseFloat(item.precio_unitario)
    }));
  }

  if (isNaN(usuario_id) || !nombre_cliente || isNaN(tipo_documento_id) || !numero_documento || !celular || isNaN(metodo_pago_id) || isNaN(monto_total) || monto_total === null) {
    return res.status(400).json({ error: 'Todos los campos de los detalles del pedido son obligatorios y deben tener el formato correcto.' });
  }

  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: 'El pedido debe contener al menos un producto válido.' });
  }

  for (const item of productos) {
    if (!item.producto_id || isNaN(item.cantidad) || item.cantidad <= 0 || isNaN(item.precio_unitario) || item.precio_unitario < 0) {
      return res.status(400).json({ error: `Cada producto en el carrito debe tener ID, cantidad (número positivo) y precio unitario (número no negativo) definidos. Problema en producto ID: ${item.producto_id || 'desconocido'}` });
    }
  }

  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');

    const pedidoQuery = `
      INSERT INTO pedidos (usuario_id, nombre_cliente, tipo_documento_id, numero_documento, celular, metodo_pago_id, monto_total, estado, fecha_creacion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pendiente', CURRENT_TIMESTAMP)
      RETURNING id, nombre_cliente, monto_total, fecha_creacion;
    `;
    const pedidoResult = await client.query(pedidoQuery, [usuario_id, nombre_cliente, tipo_documento_id, numero_documento, celular, metodo_pago_id, monto_total]);
    const nuevoPedido = pedidoResult.rows[0];
    const pedido_id = nuevoPedido.id;

    for (const item of productos) {
      const { producto_id, cantidad, precio_unitario } = item;

      const productInfoQuery = 'SELECT precio, stock FROM productos WHERE id = $1 FOR UPDATE;';
      const productInfoResult = await client.query(productInfoQuery, [producto_id]);

      if (productInfoResult.rows.length === 0) {
        throw new Error(`Producto con ID ${producto_id} no encontrado en la base de datos.`);
      }

      const { precio: precio_db, stock: stock_db } = productInfoResult.rows[0];

      if (stock_db < cantidad) {
        throw new Error(`Stock insuficiente para el producto ID ${producto_id}. Disponible: ${stock_db}, Solicitado: ${cantidad}.`);
      }

      const itemPedidoQuery = `
        INSERT INTO items_pedido (pedido_id, producto_id, cantidad, precio_unitario, fecha_creacion)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP);
      `;
      await client.query(itemPedidoQuery, [pedido_id, producto_id, cantidad, precio_unitario]);

      const updateStockQuery = `
        UPDATE productos
        SET stock = stock - $1
        WHERE id = $2;
      `;
      await client.query(updateStockQuery, [cantidad, producto_id]);
    }

    await client.query('COMMIT');
    res.status(201).json({
      mensaje: 'Pedido creado con éxito.',
      pedido: nuevoPedido,
      productos_agregados: productos.length
    });
  } catch (err) {
    if (client) await client.query('ROLLBACK');
    res.status(500).json({ error: 'Error interno del servidor al procesar el pedido.', detalle: err.message });
  } finally {
    if (client) client.release();
  }
});

app.get('/api/pedidos/obtener', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pedidos ORDER BY fecha_creacion DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor al obtener pedidos.', detalle: err.message });
  }
});

app.get('/api/pedidos/obtener/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'SELECT * FROM pedidos WHERE id = $1';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor al obtener pedido por ID.', detalle: err.message });
  }
});

app.put('/api/pedidos/actualizar/:id', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; 
  const fields = [];
  const values = [];
  let paramIndex = 1;

  if (estado !== undefined) {
    fields.push(`estado=$${paramIndex++}`);
    values.push(estado);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No se proporcionó el campo "estado" para actualizar.' });
  }

  values.push(id);
  
  try {
    const query = `
      UPDATE pedidos
      SET ${fields.join(', ')}
      WHERE id=$${paramIndex}
      RETURNING id, nombre_cliente, estado, fecha_creacion, monto_total
    `;
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado para actualizar.' });
    }
    res.status(200).json({ 
      mensaje: 'Pedido actualizado con éxito.', 
      pedido: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor al actualizar pedido.', detalle: error.message });
  }
});

app.delete('/api/pedidos/eliminar/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM pedidos WHERE id=$1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado para eliminar.' });
    }
    res.status(200).json({ mensaje: 'Pedido eliminado con éxito.' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor al eliminar pedido.', detalle: err.message });
  }
});

// ------------------ RUTAS ITEMS_PEDIDO ------------------
app.post('/api/items_pedido/insertar', (req, res) => {
  const { pedido_id, producto_id, cantidad, precio_unitario } = req.body;
  const query = `
    INSERT INTO items_pedido (pedido_id, producto_id, cantidad, precio_unitario)
    VALUES ($1, $2, $3, $4)
  `;
  pool.query(query, [pedido_id, producto_id, cantidad, precio_unitario])
    .then(() => res.status(201).json({ mensaje: 'Item en pedido creado' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/api/items_pedido/obtener', (req, res) => {
  const query = `
    SELECT
      ip.id,
      ip.pedido_id,
      ip.producto_id,
      p.nombre AS nombre_producto,
      ip.cantidad,
      ip.precio_unitario,
      ip.fecha_creacion
    FROM
      items_pedido ip
    JOIN
      productos p ON ip.producto_id = p.id
    ORDER BY ip.fecha_creacion DESC;
  `;
  pool.query(query)
    .then(result => res.status(200).json(result.rows))
    .catch(err => res.status(500).json({ error: 'Error interno del servidor al obtener items de pedido para el panel.', detalle: err.message }));
});

app.put('/api/items_pedido/actualizar/:id', (req, res) => {
  const { id } = req.params;
  const { pedido_id, producto_id, cantidad, precio_unitario } = req.body;
  const query = `
    UPDATE items_pedido
    SET pedido_id=$1, producto_id=$2, cantidad=$3, precio_unitario=$4
    WHERE id=$5
  `;
  pool.query(query, [pedido_id, producto_id, cantidad, precio_unitario, id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'Item no encontrado' });
      res.status(200).json({ mensaje: 'Item actualizado' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/api/items_pedido/eliminar/:id', (req, res) => {
  pool.query('DELETE FROM items_pedido WHERE id=$1', [req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'Item no encontrado' });
      res.status(200).json({ mensaje: 'Item eliminado' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// ------------------ RUTAS HISTORIAL_COMPRAS ------------------
app.post('/api/historial_compras/insertar', (req, res) => {
  const { usuario_id, pedido_id, producto_id, cantidad, precio_unitario, estado } = req.body;
  const query = `INSERT INTO historial_compras (usuario_id, pedido_id, producto_id, cantidad, precio_unitario, estado, fecha_compra)
               VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`;
  pool.query(query, [usuario_id, pedido_id, producto_id, cantidad, precio_unitario, estado])
    .then(() => res.status(201).json({ mensaje: 'Compra registrada exitosamente' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/api/historial_compras/obtener', (req, res) => {
  const query = `
    SELECT
      hc.id,
      u.nombre_completo AS nombre_usuario,
      p.nombre_cliente,
      td.nombre AS tipo_documento_nombre,
      p.numero_documento,
      p.celular,
      mp.nombre AS metodo_pago_nombre,
      hc.cantidad,
      hc.precio_unitario,
      hc.fecha_compra,
      hc.estado
    FROM
      historial_compras hc
    JOIN
      usuarios u ON hc.usuario_id = u.id
    JOIN
      pedidos p ON hc.pedido_id = p.id
    JOIN
      tipos_documento td ON p.tipo_documento_id = td.id
    JOIN
      metodos_pago mp ON p.metodo_pago_id = mp.id;
  `;
  pool.query(query)
    .then(result => res.status(200).json(result.rows))
    .catch(err => res.status(500).json({ error: 'Error interno del servidor al obtener historial de compras.', detalle: err.message }));
});

app.get('/api/historial_compras/obtener/:id', (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM historial_compras WHERE id = $1', [id])
    .then(result => {
      if (result.rows.length === 0) return res.status(404).json({ mensaje: 'Registro de historial no encontrado' });
      res.status(200).json(result.rows[0]);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/api/historial_compras/actualizar/:id', (req, res) => {
  const { usuario_id, pedido_id, producto_id, cantidad, precio_unitario, estado } = req.body;
  const query = `UPDATE historial_compras SET usuario_id=$1, pedido_id=$2, producto_id=$3, cantidad=$4, precio_unitario=$5, estado=$6 WHERE id=$7`;
  pool.query(query, [usuario_id, pedido_id, producto_id, cantidad, precio_unitario, estado, req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'No encontrado' });
      res.status(200).json({ mensaje: 'Compra actualizada' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/api/historial_compras/eliminar/:id', (req, res) => {
  pool.query('DELETE FROM historial_compras WHERE id=$1', [req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'Registro eliminado exitosamente' });
      res.status(200).json({ mensaje: 'Registro eliminado exitosamente' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// ------------------ RUTAS METODOS_PAGO ------------------
app.post('/api/metodos_pago/insertar', (req, res) => {
  const { nombre, descripcion, activo } = req.body;
  const query = 'INSERT INTO metodos_pago (nombre, descripcion, activo) VALUES ($1, $2, $3)';
  pool.query(query, [nombre, descripcion, activo])
    .then(() => res.status(201).json({ mensaje: 'Método de pago creado' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/api/metodos_pago/obtener', (req, res) => {
  pool.query('SELECT * FROM metodos_pago')
    .then(result => res.status(200).json(result.rows))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/api/metodos_pago/obtener/:id', (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM metodos_pago WHERE id = $1', [id])
    .then(result => {
      if (result.rows.length === 0) return res.status(404).json({ mensaje: 'Método de pago no encontrado' });
      res.status(200).json(result.rows[0]);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/api/metodos_pago/actualizar/:id', (req, res) => {
  const { nombre, descripcion, activo } = req.body;
  const query = 'UPDATE metodos_pago SET nombre=$1, descripcion=$2, activo=$3 WHERE id=$4';
  pool.query(query, [nombre, descripcion, activo, req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'No encontrado' });
      res.status(200).json({ mensaje: 'Método de pago actualizado' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/api/metodos_pago/eliminar/:id', (req, res) => {
  pool.query('DELETE FROM metodos_pago WHERE id=$1', [req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'Método de pago no encontrado' });
      res.status(200).json({ mensaje: 'Método de pago eliminado' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// ------------------ RUTAS TIPOS_DOCUMENTO ------------------
app.post('/api/tipos_documento/insertar', (req, res) => {
  const { nombre, descripcion } = req.body;
  const query = 'INSERT INTO tipos_documento (nombre, descripcion) VALUES ($1, $2)';
  pool.query(query, [nombre, descripcion])
    .then(() => res.status(201).json({ mensaje: 'Tipo de documento creado' }))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/api/tipos_documento/obtener', (req, res) => {
  pool.query('SELECT * FROM tipos_documento')
    .then(result => res.status(200).json(result.rows))
    .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/api/tipos_documento/obtener/:id', (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM tipos_documento WHERE id = $1', [id])
    .then(result => {
      if (result.rows.length === 0) return res.status(404).json({ mensaje: 'Tipo de documento no encontrado' });
      res.status(200).json(result.rows[0]);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/api/tipos_documento/actualizar/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  const query = 'UPDATE tipos_documento SET nombre=$1, descripcion=$2 WHERE id=$3';
  pool.query(query, [nombre, descripcion, id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'No encontrado' });
      res.status(200).json({ mensaje: 'Tipo de documento actualizado' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/api/tipos_documento/eliminar/:id', (req, res) => {
  pool.query('DELETE FROM tipos_documento WHERE id=$1', [req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'Tipo de documento no encontrado' });
      res.status(200).json({ mensaje: 'Tipo de documento eliminado' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// ------------------ INICIAR SERVIDOR ------------------
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});