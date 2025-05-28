// 🔷 tipos_documento.routes.js
const express = require('express');
const router = express.Router();
const client = require('../db');
/**
 * @swagger
 * tags:
 *   name: Tipos de Documento
 *   description: Operaciones sobre tipos de documento
 */
/**
 * @swagger
 * /tipos_documento/insertar:
 *   post:
 *     summary: Crear un nuevo tipo de documento
 *     tags: [Tipos de Documento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tipo de documento creado exitosamente
 */
router.post('/tipos_documento/insertar', (req, res) => {
  const { nombre, descripcion } = req.body;
  const query = 'INSERT INTO tipos_documento (nombre, descripcion) VALUES ($1, $2)';
  client.query(query, [nombre, descripcion])
    .then(() => res.status(201).json({ mensaje: 'Tipo de documento creado' }))
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /tipos_documento/obtener:
 *   get:
 *     summary: Obtener todos los tipos de documento
 *     tags: [Tipos de Documento]
 *     responses:
 *       200:
 *         description: Lista de tipos de documento
 */
router.get('/tipos_documento/obtener', (req, res) => {
  client.query('SELECT * FROM tipos_documento')
    .then(result => res.status(200).json({ data: result.rows }))
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /tipos_documento/actualizar/{id}:
 *   put:
 *     summary: Actualizar un tipo de documento por ID
 *     tags: [Tipos de Documento]
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
 *     responses:
 *       200:
 *         description: Tipo de documento actualizado exitosamente
 */
router.put('/tipos_documento/actualizar/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  const query = 'UPDATE tipos_documento SET nombre=$1, descripcion=$2 WHERE id=$3';
  client.query(query, [nombre, descripcion, id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'No encontrado' });
      res.json({ mensaje: 'Tipo de documento actualizado' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /tipos_documento/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un tipo de documento por ID
 *     tags: [Tipos de Documento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tipo de documento eliminado exitosamente
 */
router.delete('/tipos_documento/eliminar/:id', (req, res) => {
  client.query('DELETE FROM tipos_documento WHERE id=$1', [req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'No encontrado' });
      res.json({ mensaje: 'Tipo de documento eliminado' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;