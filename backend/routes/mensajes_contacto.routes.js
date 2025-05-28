// 🔷 mensajes_contacto.routes.js
const express = require('express');
const router = express.Router();
const client = require('../db');
/**
 * @swagger
 * tags:
 *   name: Mensajes de Contacto
 *   description: Gestión de mensajes enviados por usuarios
 */

/**
 * @swagger
 * /mensajes_contacto/insertar:
 *   post:
 *     summary: Crear un nuevo mensaje de contacto
 *     tags: [Mensajes de Contacto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - correo
 *               - mensaje
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               mensaje:
 *                 type: string
 *               fue_respondido:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Mensaje creado exitosamente
 */
router.post('/mensajes_contacto/insertar', (req, res) => {
  const { usuario_id, nombre, correo, mensaje, fue_respondido } = req.body;
  const query = `INSERT INTO mensajes_contacto (usuario_id, nombre, correo, mensaje, fecha_creacion, fue_respondido)
                 VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5)`;
  client.query(query, [usuario_id, nombre, correo, mensaje, fue_respondido])
    .then(() => res.status(201).json({ mensaje: 'Mensaje recibido' }))
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /mensajes_contacto/obtener:
 *   get:
 *     summary: Obtener todos los mensajes de contacto
 *     tags: [Mensajes de Contacto]
 *     responses:
 *       200:
 *         description: Lista de mensajes
 */
router.get('/mensajes_contacto/obtener', (req, res) => {
  client.query('SELECT * FROM mensajes_contacto')
    .then(result => res.json({ data: result.rows }))
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /mensajes_contacto/actualizar/{id}:
 *   put:
 *     summary: Actualizar un mensaje de contacto por ID
 *     tags: [Mensajes de Contacto]
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
 *               correo:
 *                 type: string
 *               mensaje:
 *                 type: string
 *               fue_respondido:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Mensaje actualizado exitosamente
 */
router.put('/mensajes_contacto/actualizar/:id', (req, res) => {
  const { nombre, correo, mensaje, fue_respondido } = req.body;
  const query = `UPDATE mensajes_contacto SET nombre=$1, correo=$2, mensaje=$3, fue_respondido=$4 WHERE id=$5`;
  client.query(query, [nombre, correo, mensaje, fue_respondido, req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'No encontrado' });
      res.json({ mensaje: 'Mensaje actualizado' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});
/**
 * @swagger
 * /mensajes_contacto/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un mensaje de contacto por ID
 *     tags: [Mensajes de Contacto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mensaje eliminado exitosamente
 */
router.delete('/mensajes_contacto/eliminar/:id', (req, res) => {
  client.query('DELETE FROM mensajes_contacto WHERE id=$1', [req.params.id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: 'No encontrado' });
      res.json({ mensaje: 'Mensaje eliminado' });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;
