// 🔷 historial_compras.routes.js
const express = require('express');
const router = express.Router();
const client = require('../db');

/**
 * @swagger
 * tags:
 *   name: Historial de Compras
 *   description: Registros de compras realizadas por usuarios
 */


/**
 * @swagger
 * /historial_compras/insertar:
 *   post:
 *     summary: Registrar una compra en el historial
 *     tags: [Historial de Compras]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - pedido_id
 *               - producto_id
 *               - cantidad
 *               - precio_unitario
 *               - estado
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               pedido_id:
 *                 type: integer
 *               producto_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               precio_unitario:
 *                 type: number
 *               estado:
 *                 type: string
 *     responses:
 *       201:
 *         description: Compra registrada exitosamente
 */
router.post('/historial_compras/insertar', (req, res) => {
  const { usuario_id, pedido_id, producto_id, cantidad, precio_unitario, estado } = req.body;
  const query = `INSERT INTO historial_compras (usuario_id, pedido_id, producto_id, cantidad, precio_unitario, fecha_compra, estado)
                 VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6)`;
  client.query(query, [usuario_id, pedido_id, producto_id, cantidad, precio_unitario, estado])
    .then(() => res.status(201).json({ mensaje: 'Compra registrada' }))
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /historial_compras/obtener:
 *   get:
 *     summary: Obtener historial de compras
 *     tags: [Historial de Compras]
 *     responses:
 *       200:
 *         description: Lista de compras
 */
router.get('/historial_compras/obtener', (req, res) => {
  client.query('SELECT * FROM historial_compras')
    .then(result => res.json({ data: result.rows }))
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /historial_compras/actualizar/{id}:
 *   put:
 *     summary: Actualizar un registro de historial por ID
 *     tags: [Historial de Compras]
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
 *               usuario_id:
 *                 type: integer
 *               pedido_id:
 *                 type: integer
 *               producto_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               precio_unitario:
 *                 type: number
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Historial actualizado exitosamente
 */
router.put('/historial_compras/actualizar/:id', (req, res) => {
  const { usuario_id, pedido_id, producto_id, cantidad, precio_unitario, estado } = req.body;
  const query = `UPDATE historial_compras SET usuario_id=$1, pedido_id=$2, producto_id=$3, cantidad=$4, precio_unitario=$5, estado=$6 WHERE id=$7`;
  client.query(query, [usuario_id, pedido_id, producto_id, cantidad, precio_unitario, estado, req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'No encontrado' });
      res.json({ mensaje: 'Compra actualizada' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /historial_compras/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un registro de historial por ID
 *     tags: [Historial de Compras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro eliminado exitosamente
 */
router.delete('/historial_compras/eliminar/:id', (req, res) => {
  client.query('DELETE FROM historial_compras WHERE id=$1', [req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'No encontrado' });
      res.json({ mensaje: 'Compra eliminada' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;