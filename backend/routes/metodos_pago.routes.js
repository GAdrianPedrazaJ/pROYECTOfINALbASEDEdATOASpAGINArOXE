// 🔷 metodos_pago.routes.js
const express = require('express');
const router = express.Router();
const client = require('../db');
/**
 * @swagger
 * tags:
 *   name: Métodos de Pago
 *   description: Operaciones relacionadas con los métodos de pago
 */
/**
 * @swagger
 * /metodos_pago/insertar:
 *   post:
 *     summary: Crear un nuevo método de pago
 *     tags: [Métodos de Pago]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *               - activo
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               activo:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Método de pago creado exitosamente
 */
router.post('/metodos_pago/insertar', (req, res) => {
  const { nombre, descripcion, activo } = req.body;
  const query = 'INSERT INTO metodos_pago (nombre, descripcion, activo) VALUES ($1, $2, $3)';
  client.query(query, [nombre, descripcion, activo])
    .then(() => res.status(201).json({ mensaje: 'Método de pago creado' }))
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /metodos_pago/obtener:
 *   get:
 *     summary: Obtener todos los métodos de pago
 *     tags: [Métodos de Pago]
 *     responses:
 *       200:
 *         description: Lista de métodos de pago
 */
router.get('/metodos_pago/obtener', (req, res) => {
  client.query('SELECT * FROM metodos_pago')
    .then(result => res.json({ data: result.rows }))
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /metodos_pago/actualizar/{id}:
 *   put:
 *     summary: Actualizar un método de pago por ID
 *     tags: [Métodos de Pago]
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
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Método de pago actualizado exitosamente
 */
router.put('/metodos_pago/actualizar/:id', (req, res) => {
  const { nombre, descripcion, activo } = req.body;
  const query = 'UPDATE metodos_pago SET nombre=$1, descripcion=$2, activo=$3 WHERE id=$4';
  client.query(query, [nombre, descripcion, activo, req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'No encontrado' });
      res.json({ mensaje: 'Método de pago actualizado' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /metodos_pago/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un método de pago por ID
 *     tags: [Métodos de Pago]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Método de pago eliminado exitosamente
 */
router.delete('/metodos_pago/eliminar/:id', (req, res) => {
  client.query('DELETE FROM metodos_pago WHERE id=$1', [req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'No encontrado' });
      res.json({ mensaje: 'Método de pago eliminado' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;