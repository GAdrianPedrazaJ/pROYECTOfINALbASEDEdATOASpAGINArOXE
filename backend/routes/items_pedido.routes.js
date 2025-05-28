// 🔷 items_pedido.routes.js
const express = require('express');
const router = express.Router();
const client = require('../db');
/**
 * @swagger
 * tags:
 *   name: Ítems de Pedido
 *   description: Detalle de productos en cada pedido
 */


/**
 * @swagger
 * /items_pedido/insertar:
 *   post:
 *     summary: Insertar un ítem de pedido
 *     tags: [Ítems de Pedido]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pedido_id
 *               - producto_id
 *               - cantidad
 *               - precio_unitario
 *             properties:
 *               pedido_id:
 *                 type: integer
 *               producto_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               precio_unitario:
 *                 type: number
 *     responses:
 *       201:
 *         description: Ítem creado exitosamente
 */
router.post('/items_pedido/insertar', (req, res) => {
  const { pedido_id, producto_id, cantidad, precio_unitario } = req.body;
  const query = `INSERT INTO items_pedido (pedido_id, producto_id, cantidad, precio_unitario, fecha_creacion)
                 VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`;
  client.query(query, [pedido_id, producto_id, cantidad, precio_unitario])
    .then(() => res.status(201).json({ mensaje: 'Item agregado' }))
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /items_pedido/obtener:
 *   get:
 *     summary: Obtener todos los ítems de pedidos
 *     tags: [Ítems de Pedido]
 *     responses:
 *       200:
 *         description: Lista de ítems
 */
router.get('/items_pedido/obtener', (req, res) => {
  client.query('SELECT * FROM items_pedido')
    .then(result => res.json({ data: result.rows }))
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /items_pedido/actualizar/{id}:
 *   put:
 *     summary: Actualizar ítem de pedido por ID
 *     tags: [Ítems de Pedido]
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
 *               pedido_id:
 *                 type: integer
 *               producto_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               precio_unitario:
 *                 type: number
 *     responses:
 *       200:
 *         description: Ítem actualizado exitosamente
 */
router.put('/items_pedido/actualizar/:id', (req, res) => {
  const { pedido_id, producto_id, cantidad, precio_unitario } = req.body;
  const query = `UPDATE items_pedido SET pedido_id=$1, producto_id=$2, cantidad=$3, precio_unitario=$4 WHERE id=$5`;
  client.query(query, [pedido_id, producto_id, cantidad, precio_unitario, req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'No encontrado' });
      res.json({ mensaje: 'Item actualizado' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /items_pedido/eliminar/{id}:
 *   delete:
 *     summary: Eliminar ítem de pedido por ID
 *     tags: [Ítems de Pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ítem eliminado exitosamente
 */
router.delete('/items_pedido/eliminar/:id', (req, res) => {
  client.query('DELETE FROM items_pedido WHERE id=$1', [req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'No encontrado' });
      res.json({ mensaje: 'Item eliminado' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router