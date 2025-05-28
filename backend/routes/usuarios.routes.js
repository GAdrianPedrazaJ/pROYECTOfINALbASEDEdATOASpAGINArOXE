// 🔷 usuarios.routes.js
const express = require('express');
const router = express.Router();
const client = require('../db');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Operaciones sobre usuarios
 */

/**
 * @swagger
 * /usuarios/insertar:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_completo
 *               - correo
 *               - contrasena
 *             properties:
 *               nombre_completo:
 *                 type: string
 *               correo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               telefono:
 *                 type: string
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *               direccion:
 *                 type: string
 *               departamento:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               codigo_postal:
 *                 type: string
 *               is_admin:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 */
router.post('/usuarios/insertar', async (req, res) => {
  try {
    const { contrasena, ...otrosDatos } = req.body;
    
    // Normalización de correo
    const correoNormalizado = otrosDatos.correo.trim().toLowerCase();
    
    // Verificar existencia del correo
    const existeUsuario = await client.query(
      'SELECT id FROM usuarios WHERE correo = $1', 
      [correoNormalizado]
    );
    
    if (existeUsuario.rows.length > 0) {
      return res.status(400).json({ 
        mensaje: 'El correo ya está registrado' 
      });
    }

    // Query de inserción
    const query = `
      INSERT INTO usuarios (
        nombre_completo, correo, contrasena, telefono,
        fecha_nacimiento, direccion, departamento,
        ciudad, codigo_postal, is_admin, fecha_creacion, fecha_actualizacion
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    await client.query(query, [
      otrosDatos.nombre_completo,
      correoNormalizado,
      contrasena, // Contraseña en texto plano
      otrosDatos.telefono,
      otrosDatos.fecha_nacimiento,
      otrosDatos.direccion,
      otrosDatos.departamento,
      otrosDatos.ciudad,
      otrosDatos.codigo_postal,
      otrosDatos.is_admin || false
    ]);

    res.status(201).json({ mensaje: "Usuario creado con éxito" });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al registrar el usuario' 
    });
  }
});
/**
 * @swagger
 * /usuarios/obtener:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/usuarios/obtener', (req, res) => {
  client.query('SELECT id, nombre_completo, correo, fecha_creacion FROM usuarios') // Excluir contraseña
    .then(result => res.status(200).json({ data: result.rows }))
    .catch(error => res.status(500).json({ error: error.message }));
});

/**
 * @swagger
 * /usuarios/actualizar/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     tags: [Usuarios]
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
 *               nombre_completo:
 *                 type: string
 *               correo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               telefono:
 *                 type: string
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *               direccion:
 *                 type: string
 *               departamento:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               codigo_postal:
 *                 type: string
 *               is_admin:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 */
router.put('/usuarios/actualizar/:id', async (req, res) => {
  const { id } = req.params;
  let { contrasena, ...otrosDatos } = req.body;

  try {
    if (contrasena) {
      if (!validarContrasena(contrasena)) {
        return res.status(400).json({
          mensaje: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial'
        });
      }
      const salt = await bcrypt.genSalt(10);
      contrasena = await bcrypt.hash(contrasena, salt);
    }

    const query = `
      UPDATE usuarios SET
        nombre_completo=$1, correo=$2, 
        ${contrasena ? 'contrasena=$3,' : ''} 
        telefono=${contrasena ? '$4' : '$3'},
        fecha_nacimiento=${contrasena ? '$5' : '$4'},
        direccion=${contrasena ? '$6' : '$5'},
        departamento=${contrasena ? '$7' : '$6'},
        ciudad=${contrasena ? '$8' : '$7'},
        codigo_postal=${contrasena ? '$9' : '$8'},
        is_admin=${contrasena ? '$10' : '$9'},
        fecha_actualizacion=CURRENT_TIMESTAMP
      WHERE id=${contrasena ? '$11' : '$10'}
    `;

    const values = [
      otrosDatos.nombre_completo,
      otrosDatos.correo,
      ...(contrasena ? [contrasena] : []),
      otrosDatos.telefono,
      otrosDatos.fecha_nacimiento,
      otrosDatos.direccion,
      otrosDatos.departamento,
      otrosDatos.ciudad,
      otrosDatos.codigo_postal,
      otrosDatos.is_admin,
      id
    ].filter(Boolean);

    const result = await client.query(query, values);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    
    res.status(200).json({ mensaje: "Usuario actualizado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /usuarios/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 */
router.delete('/usuarios/eliminar/:id', (req, res) => {
  const { id } = req.params;
  client.query('DELETE FROM usuarios WHERE id=$1', [id])
    .then(result => {
      if (result.rowCount === 0) return res.status(404).json({ mensaje: "Usuario no encontrado" });
      res.status(200).json({ mensaje: "Usuario eliminado con éxito" });
    })
    .catch(error => res.status(500).json({ error: error.message }));
});

/**
 * @swagger
 * /usuarios/cambiar-contrasena:
 *   put:
 *     summary: Cambiar contraseña de forma segura
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - contrasena_actual
 *               - nueva_contrasena
 *             properties:
 *               correo:
 *                 type: string
 *               contrasena_actual:
 *                 type: string
 *               nueva_contrasena:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 */
router.put('/usuarios/cambiar-contrasena', async (req, res) => {
  const { correo, contrasena_actual, nueva_contrasena } = req.body;

  try {
    if (!validarContrasena(nueva_contrasena)) {
      return res.status(400).json({
        mensaje: 'La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial'
      });
    }

    const usuario = await client.query(
      'SELECT id, contrasena FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (usuario.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const contrasenaValida = await bcrypt.compare(
      contrasena_actual,
      usuario.rows[0].contrasena
    );

    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: 'Contraseña actual incorrecta' });
    }

    const salt = await bcrypt.genSalt(10);
    const nuevaContrasenaHash = await bcrypt.hash(nueva_contrasena, salt);

    await client.query(
      'UPDATE usuarios SET contrasena = $1 WHERE id = $2',
      [nuevaContrasenaHash, usuario.rows[0].id]
    );

    res.status(200).json({ mensaje: 'Contraseña actualizada con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /usuarios/eliminar-cuenta:
 *   post:
 *     summary: Eliminar la cuenta de un usuario autenticado
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - contrasena
 *             properties:
 *               correo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cuenta eliminada exitosamente
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/usuarios/eliminar-cuenta', async (req, res) => {
  const { correo, contrasena } = req.body;

  const correoNormalizado = correo.trim().toLowerCase();
  console.log('[DELETE] Intento de eliminación:', correoNormalizado);

  try {
    const usuario = await client.query(
      'SELECT id, contrasena FROM usuarios WHERE correo = $1',
      [correoNormalizado]
    );

    if (usuario.rows.length === 0) {
      console.log(`Usuario no encontrado: ${correoNormalizado}`);
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuario.rows[0].contrasena
    );

    if (!contrasenaValida) {
      return res.status(401).json({
        mensaje: 'Credenciales inválidas. Verifica tu correo y contraseña'
      });
    }

    await client.query('DELETE FROM usuarios WHERE id = $1', [usuario.rows[0].id]);
    console.log(`Cuenta eliminada: ${usuario.rows[0].id}`);

    res.status(200).json({ mensaje: 'Cuenta eliminada exitosamente' });

  } catch (error) {
    console.error('Error en eliminación de cuenta:', error);
    res.status(500).json({ error: 'Error interno al procesar la solicitud' });
  }
});



module.exports = router;