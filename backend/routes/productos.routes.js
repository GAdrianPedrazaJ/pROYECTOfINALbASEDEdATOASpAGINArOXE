// 🔷 productos.routes.js
const express = require('express');
const router = express.Router();
const client = require('../db');
/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Operaciones sobre productos
 */
/**
 * @swagger
 * /productos/insertar:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *               - precio
 *               - stock
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *               imagen_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 */
router.post('/productos/insertar', (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_url } = req.body;
  const query = `INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, fecha_creacion, fecha_actualizacion)
                 VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
  client.query(query, [nombre, descripcion, precio, stock, imagen_url])
    .then(() => res.status(201).json({ mensaje: 'Producto creado' }))
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /productos/obtener:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/productos/obtener', (req, res) => {
  client.query('SELECT * FROM productos')
    .then(result => res.json({ data: result.rows }))
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /productos/actualizar/{id}:
 *   put:
 *     summary: Actualizar un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *               imagen_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 */
router.put('/productos/actualizar/:id', (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_url } = req.body;
  const query = `UPDATE productos SET nombre=$1, descripcion=$2, precio=$3, stock=$4, imagen_url=$5, fecha_actualizacion=CURRENT_TIMESTAMP WHERE id=$6`;
  client.query(query, [nombre, descripcion, precio, stock, imagen_url, req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
      res.json({ mensaje: 'Producto actualizado' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /productos/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 */
router.delete('/productos/eliminar/:id', (req, res) => {
  client.query('DELETE FROM productos WHERE id=$1', [req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
      res.json({ mensaje: 'Producto eliminado' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;