// 🔷 pedidos.routes.js
const express = require('express');
const router = express.Router();
const client = require('../db');
/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Operaciones sobre pedidos
 */
/**
 * @swagger
 * /pedidos/insertar:
 *   post:
 *     summary: Crear un nuevo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - nombre_cliente
 *               - tipo_documento_id
 *               - numero_documento
 *               - celular
 *               - metodo_pago_id
 *               - monto_total
 *               - estado
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               nombre_cliente:
 *                 type: string
 *               tipo_documento_id:
 *                 type: integer
 *               numero_documento:
 *                 type: string
 *               celular:
 *                 type: string
 *               metodo_pago_id:
 *                 type: integer
 *               monto_total:
 *                 type: number
 *               estado:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 */
router.post('/pedidos/insertar', (req, res) => {
  const { usuario_id, nombre_cliente, tipo_documento_id, numero_documento, celular, metodo_pago_id, monto_total, estado } = req.body;
  const query = `INSERT INTO pedidos (usuario_id, nombre_cliente, tipo_documento_id, numero_documento, celular, metodo_pago_id, monto_total, estado, fecha_creacion, fecha_actualizacion)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`;
  client.query(query, [usuario_id, nombre_cliente, tipo_documento_id, numero_documento, celular, metodo_pago_id, monto_total, estado])
    .then(() => res.status(201).json({ mensaje: 'Pedido creado' }))
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /pedidos/obtener:
 *   get:
 *     summary: Obtener todos los pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get('/pedidos/obtener', (req, res) => {
  client.query('SELECT * FROM pedidos')
    .then(result => res.json({ data: result.rows }))
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /pedidos/actualizar/{id}:
 *   put:
 *     summary: Actualizar un pedido por ID
 *     tags: [Pedidos]
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
 *               nombre_cliente:
 *                 type: string
 *               tipo_documento_id:
 *                 type: integer
 *               numero_documento:
 *                 type: string
 *               celular:
 *                 type: string
 *               metodo_pago_id:
 *                 type: integer
 *               monto_total:
 *                 type: number
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pedido actualizado exitosamente
 */
router.put('/pedidos/actualizar/:id', (req, res) => {
  const { usuario_id, nombre_cliente, tipo_documento_id, numero_documento, celular, metodo_pago_id, monto_total, estado } = req.body;
  const query = `UPDATE pedidos SET usuario_id=$1, nombre_cliente=$2, tipo_documento_id=$3, numero_documento=$4, celular=$5,
                                   metodo_pago_id=$6, monto_total=$7, estado=$8, fecha_actualizacion=CURRENT_TIMESTAMP WHERE id=$9`;
  client.query(query, [usuario_id, nombre_cliente, tipo_documento_id, numero_documento, celular, metodo_pago_id, monto_total, estado, req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
      res.json({ mensaje: 'Pedido actualizado' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /pedidos/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un pedido por ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido eliminado exitosamente
 */
router.delete('/pedidos/eliminar/:id', (req, res) => {
  client.query('DELETE FROM pedidos WHERE id=$1', [req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
      res.json({ mensaje: 'Pedido eliminado' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;