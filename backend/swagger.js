const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de E-commerce',
      version: '1.0.0',
      description: 'Documentación de la API para la gestión de usuarios, productos, pedidos, historial de compras, métodos de pago y tipos de documento.',
    },
    servers: [
      {
        url: 'http://localhost:3000', 
        description: 'Servidor de Desarrollo',
      },
    ],
    components: {
      schemas: {
        Usuario: {
          type: 'object',
          required: ['nombre_completo', 'correo', 'contrasena', 'telefono', 'fecha_nacimiento', 'direccion', 'departamento', 'ciudad', 'codigo_postal'],
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
              readOnly: true,
              description: 'ID único del usuario',
            },
            nombre_completo: {
              type: 'string',
              description: 'Nombre completo del usuario',
              example: 'Juan Pérez',
            },
            correo: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico del usuario (único)',
              example: 'juan.perez@example.com',
            },
            contrasena: {
              type: 'string',
              description: 'Contraseña del usuario',
              example: 'password123',
            },
            telefono: {
              type: 'string',
              description: 'Número de teléfono del usuario',
              example: '1234567890',
            },
            fecha_nacimiento: {
              type: 'string',
              format: 'date',
              description: 'Fecha de nacimiento del usuario (YYYY-MM-DD)',
              example: '1990-01-15',
            },
            direccion: {
              type: 'string',
              description: 'Dirección de residencia del usuario',
              example: 'Calle 10 #20-30',
            },
            departamento: {
              type: 'string',
              description: 'Departamento de residencia del usuario',
              example: 'Cundinamarca',
            },
            ciudad: {
              type: 'string',
              description: 'Ciudad de residencia del usuario',
              example: 'Bogotá',
            },
            codigo_postal: {
              type: 'string',
              description: 'Código postal de la dirección del usuario',
              example: '110111',
            },
            is_admin: {
              type: 'boolean',
              description: 'Indica si el usuario es administrador',
              default: false,
            },
          },
        },
        Producto: {
          type: 'object',
          required: ['nombre', 'descripcion', 'precio', 'stock'],
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
              readOnly: true,
              description: 'ID único del producto',
            },
            nombre: {
              type: 'string',
              description: 'Nombre del producto',
              example: 'Laptop Gamer',
            },
            descripcion: {
              type: 'string',
              description: 'Descripción detallada del producto',
              example: 'Potente laptop con procesador i7 y tarjeta gráfica RTX 3070.',
            },
            precio: {
              type: 'number',
              format: 'float',
              description: 'Precio del producto',
              example: 1200.50,
            },
            stock: {
              type: 'integer',
              description: 'Cantidad de unidades disponibles en stock',
              example: 50,
            },
            imagen_url: {
              type: 'string',
              format: 'uri',
              description: 'URL de la imagen del producto',
              example: '/uploads/producto-1678901234-567.jpg',
            },
          },
        },
        ItemPedido: {
          type: 'object',
          required: ['producto_id', 'cantidad', 'precio_unitario'],
          properties: {
            producto_id: {
              type: 'integer',
              description: 'ID del producto en el pedido',
              example: 1,
            },
            cantidad: {
              type: 'integer',
              description: 'Cantidad del producto solicitado',
              example: 2,
            },
            precio_unitario: {
              type: 'number',
              format: 'float',
              description: 'Precio unitario del producto al momento de la compra',
              example: 600.25,
            },
          },
        },
        Pedido: {
          type: 'object',
          required: ['usuario_id', 'nombre_cliente', 'tipo_documento_id', 'numero_documento', 'celular', 'metodo_pago_id', 'monto_total', 'productos'],
          properties: {
            id: {
              type: 'integer',
              readOnly: true,
              description: 'ID único del pedido',
            },
            usuario_id: {
              type: 'integer',
              description: 'ID del usuario que realizó el pedido',
              example: 1,
            },
            nombre_cliente: {
              type: 'string',
              description: 'Nombre del cliente que realizó el pedido',
              example: 'María López',
            },
            tipo_documento_id: {
              type: 'integer',
              description: 'ID del tipo de documento del cliente',
              example: 1,
            },
            numero_documento: {
              type: 'string',
              description: 'Número de documento del cliente',
              example: '1020304050',
            },
            celular: {
              type: 'string',
              description: 'Número de celular del cliente',
              example: '3001234567',
            },
            metodo_pago_id: {
              type: 'integer',
              description: 'ID del método de pago utilizado',
              example: 1,
            },
            monto_total: {
              type: 'number',
              format: 'float',
              description: 'Monto total del pedido',
              example: 1200.50,
            },
            estado: {
              type: 'string',
              description: 'Estado actual del pedido',
              enum: ['Pendiente', 'Confirmado', 'Enviado', 'Entregado', 'Cancelado'],
              default: 'Pendiente',
            },
            fecha_creacion: {
              type: 'string',
              format: 'date-time',
              readOnly: true,
              description: 'Fecha y hora de creación del pedido',
            },
            productos: {
              type: 'array',
              description: 'Lista de productos en el pedido',
              items: {
                $ref: '#/components/schemas/ItemPedido',
              },
            },
          },
        },
        HistorialCompra: {
          type: 'object',
          required: ['usuario_id', 'pedido_id', 'producto_id', 'cantidad', 'precio_unitario', 'estado'],
          properties: {
            id: {
              type: 'integer',
              readOnly: true,
              description: 'ID único del registro de historial de compra',
            },
            usuario_id: {
              type: 'integer',
              description: 'ID del usuario que realizó la compra',
              example: 1,
            },
            pedido_id: {
              type: 'integer',
              description: 'ID del pedido asociado a esta compra',
              example: 101,
            },
            producto_id: {
              type: 'integer',
              description: 'ID del producto comprado',
              example: 1,
            },
            cantidad: {
              type: 'integer',
              description: 'Cantidad del producto comprado',
              example: 1,
            },
            precio_unitario: {
              type: 'number',
              format: 'float',
              description: 'Precio unitario del producto al momento de la compra',
              example: 50.00,
            },
            estado: {
              type: 'string',
              description: 'Estado de la compra (ej. "completada", "devuelta")',
              example: 'completada',
            },
            fecha_compra: {
              type: 'string',
              format: 'date-time',
              readOnly: true,
              description: 'Fecha y hora de la compra',
            },
          },
        },
        MetodoPago: {
          type: 'object',
          required: ['nombre', 'descripcion', 'activo'],
          properties: {
            id: {
              type: 'integer',
              readOnly: true,
              description: 'ID único del método de pago',
            },
            nombre: {
              type: 'string',
              description: 'Nombre del método de pago',
              example: 'Tarjeta de Crédito',
            },
            descripcion: {
              type: 'string',
              description: 'Descripción del método de pago',
              example: 'Pago con Visa, Mastercard, etc.',
            },
            activo: {
              type: 'boolean',
              description: 'Indica si el método de pago está activo',
              example: true,
            },
          },
        },
        TipoDocumento: {
          type: 'object',
          required: ['nombre', 'descripcion'],
          properties: {
            id: {
              type: 'integer',
              readOnly: true,
              description: 'ID único del tipo de documento',
            },
            nombre: {
              type: 'string',
              description: 'Nombre del tipo de documento',
              example: 'Cédula de Ciudadanía',
            },
            descripcion: {
              type: 'string',
              description: 'Descripción del tipo de documento',
              example: 'Documento de identificación nacional',
            },
          },
        },
      },
      responses: {
        Error400: {
          description: 'Solicitud incorrecta o campos obligatorios faltantes',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Todos los campos son obligatorios',
                  },
                },
              },
            },
          },
        },
        Error401: {
          description: 'No autorizado / Credenciales inválidas',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false,
                  },
                  mensaje: {
                    type: 'string',
                    example: 'Credenciales inválidas',
                  },
                },
              },
            },
          },
        },
        Error404: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  mensaje: {
                    type: 'string',
                    example: 'Usuario no encontrado',
                  },
                },
              },
            },
          },
        },
        Error500: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Error interno del servidor',
                  },
                  detalle: {
                    type: 'string',
                    example: 'Mensaje de error detallado',
                  },
                },
              },
            },
          },
        },
      },
    },
    paths: {
      // Rutas de Usuarios
      '/api/usuarios/insertar': {
        post: {
          summary: 'Registra un nuevo usuario',
          tags: ['Usuarios'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nombre_completo', 'correo', 'contrasena', 'telefono', 'fecha_nacimiento', 'direccion', 'departamento', 'ciudad', 'codigo_postal'],
                  properties: {
                    nombre_completo: { type: 'string', example: 'Ana Torres' },
                    correo: { type: 'string', format: 'email', example: 'ana.torres@example.com' },
                    contrasena: { type: 'string', example: 'segura123' },
                    telefono: { type: 'string', example: '3109876543' },
                    fecha_nacimiento: { type: 'string', format: 'date', example: '1995-03-20' },
                    direccion: { type: 'string', example: 'Carrera 5 #10-15' },
                    departamento: { type: 'string', example: 'Antioquia' },
                    ciudad: { type: 'string', example: 'Medellín' },
                    codigo_postal: { type: 'string', example: '050010' },
                    is_admin: { type: 'boolean', default: false },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Usuario creado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      mensaje: { type: 'string', example: 'Usuario creado con éxito' },
                      usuario: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          nombre_completo: { type: 'string' },
                          correo: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              $ref: '#/components/responses/Error400',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/usuarios/obtener': {
        get: {
          summary: 'Obtiene la lista de todos los usuarios',
          tags: ['Usuarios'],
          responses: {
            '200': {
              description: 'Lista de usuarios obtenida con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Usuario',
                    },
                  },
                },
              },
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/usuarios/actualizar/{id}': {
        put: {
          summary: 'Actualiza la información de un usuario existente',
          tags: ['Usuarios'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: {
                type: 'integer',
              },
              required: true,
              description: 'ID del usuario a actualizar',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nombre_completo: { type: 'string', example: 'Juan Carlos Pérez' },
                    correo: { type: 'string', format: 'email', example: 'juan.carlos@example.com' },
                    telefono: { type: 'string', example: '3201234567' },
                    direccion: { type: 'string', example: 'Avenida Siempre Viva 742' },
                    is_admin: { type: 'boolean', example: true },
                  },
                  description: 'Solo los campos proporcionados serán actualizados. Al menos uno debe ser enviado.',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Usuario actualizado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      mensaje: { type: 'string', example: 'Usuario actualizado' },
                      usuario: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          nombre_completo: { type: 'string' },
                          correo: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              $ref: '#/components/responses/Error400',
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/usuarios/eliminar/{correo}': {
        delete: {
          summary: 'Elimina un usuario por su correo electrónico',
          tags: ['Usuarios'],
          parameters: [
            {
              in: 'path',
              name: 'correo',
              schema: {
                type: 'string',
                format: 'email',
              },
              required: true,
              description: 'Correo electrónico del usuario a eliminar',
            },
          ],
          responses: {
            '200': {
              description: 'Usuario eliminado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      mensaje: { type: 'string', example: 'Usuario eliminado' },
                      usuario: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          correo: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/usuarios/login': {
        post: {
          summary: 'Inicia sesión de un usuario',
          tags: ['Usuarios'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['correo', 'contrasena'],
                  properties: {
                    correo: { type: 'string', format: 'email', example: 'usuario@example.com' },
                    contrasena: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Inicio de sesión exitoso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      mensaje: { type: 'string', example: 'Inicio de sesión exitoso' },
                      usuario: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          nombre_completo: { type: 'string' },
                          correo: { type: 'string' },
                          is_admin: { type: 'boolean' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              $ref: '#/components/responses/Error400',
            },
            '401': {
              $ref: '#/components/responses/Error401',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/usuarios/reset-password-direct': {
        post: {
          summary: 'Restablece la contraseña de un usuario directamente',
          tags: ['Usuarios'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['correo', 'nueva_contrasena', 'confirmar_nueva_contrasena'],
                  properties: {
                    correo: { type: 'string', format: 'email', example: 'usuario@example.com' },
                    nueva_contrasena: { type: 'string', example: 'newpassword456' },
                    confirmar_nueva_contrasena: { type: 'string', example: 'newpassword456' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Contraseña restablecida correctamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Contraseña restablecida correctamente.' },
                    },
                  },
                },
              },
            },
            '400': {
              $ref: '#/components/responses/Error400',
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/usuarios/eliminar-cuenta': {
        post: {
          summary: 'Elimina la cuenta de un usuario',
          tags: ['Usuarios'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['correo', 'contrasena'],
                  properties: {
                    correo: { type: 'string', format: 'email', example: 'usuario@example.com' },
                    contrasena: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Cuenta eliminada correctamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Cuenta eliminada correctamente.' },
                    },
                  },
                },
              },
            },
            '400': {
              $ref: '#/components/responses/Error400',
            },
            '401': {
              $ref: '#/components/responses/Error401',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      // Rutas de Productos
      '/api/productos/insertar': {
        post: {
          summary: 'Inserta un nuevo producto con o sin imagen',
          tags: ['Productos'],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    nombre: { type: 'string', example: 'Teclado Mecánico' },
                    descripcion: { type: 'string', example: 'Teclado RGB con switches Cherry MX.' },
                    precio: { type: 'number', format: 'float', example: 75.99 },
                    stock: { type: 'integer', example: 100 },
                    imagen: {
                      type: 'string',
                      format: 'binary',
                      description: 'Archivo de imagen para el producto (opcional)',
                    },
                  },
                  required: ['nombre', 'descripcion', 'precio', 'stock'],
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Producto insertado con éxito',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Producto',
                  },
                },
              },
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/productos/actualizar/{id}': {
        put: {
          summary: 'Actualiza la información de un producto existente, incluyendo la imagen (opcional)',
          tags: ['Productos'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: {
                type: 'integer',
              },
              required: true,
              description: 'ID del producto a actualizar',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    nombre: { type: 'string', example: 'Mouse Inalámbrico' },
                    descripcion: { type: 'string', example: 'Mouse ergonómico con sensor óptico de alta precisión.' },
                    precio: { type: 'number', format: 'float', example: 30.50 },
                    stock: { type: 'integer', example: 150 },
                    imagen: {
                      type: 'string',
                      format: 'binary',
                      description: 'Nuevo archivo de imagen para el producto (opcional)',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Producto actualizado con éxito',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Producto',
                  },
                },
              },
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/productos/obtener': {
        get: {
          summary: 'Obtiene la lista de todos los productos',
          tags: ['Productos'],
          responses: {
            '200': {
              description: 'Lista de productos obtenida con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Producto',
                    },
                  },
                },
              },
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/productos/eliminar/{id}': {
        delete: {
          summary: 'Elimina un producto por su ID',
          tags: ['Productos'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: {
                type: 'integer',
              },
              required: true,
              description: 'ID del producto a eliminar',
            },
          ],
          responses: {
            '200': {
              description: 'Producto eliminado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Producto eliminado exitosamente' },
                      deletedProduct: {
                        $ref: '#/components/schemas/Producto',
                      },
                    },
                  },
                },
              },
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      // Rutas de Pedidos
      '/api/pedidos/insertar': {
        post: {
          summary: 'Inserta un nuevo pedido con sus items asociados',
          tags: ['Pedidos'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Pedido',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Pedido creado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      mensaje: { type: 'string', example: 'Pedido creado con éxito.' },
                      pedido: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          nombre_cliente: { type: 'string' },
                          monto_total: { type: 'number' },
                          fecha_creacion: { type: 'string', format: 'date-time' },
                        },
                      },
                      productos_agregados: { type: 'integer' },
                    },
                  },
                },
              },
            },
            '400': {
              $ref: '#/components/responses/Error400',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/pedidos/obtener': {
        get: {
          summary: 'Obtiene la lista de todos los pedidos',
          tags: ['Pedidos'],
          responses: {
            '200': {
              description: 'Lista de pedidos obtenida con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Pedido',
                    },
                  },
                },
              },
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/pedidos/obtener/{id}': {
        get: {
          summary: 'Obtiene un pedido por su ID',
          tags: ['Pedidos'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: {
                type: 'integer',
              },
              required: true,
              description: 'ID del pedido a obtener',
            },
          ],
          responses: {
            '200': {
              description: 'Pedido obtenido con éxito',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Pedido',
                  },
                },
              },
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/pedidos/actualizar/{id}': {
        put: {
          summary: 'Actualiza el estado de un pedido por su ID',
          tags: ['Pedidos'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: {
                type: 'integer',
              },
              required: true,
              description: 'ID del pedido a actualizar',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['estado'],
                  properties: {
                    estado: {
                      type: 'string',
                      description: 'Nuevo estado del pedido',
                      enum: ['Pendiente', 'Confirmado', 'Enviado', 'Entregado', 'Cancelado'],
                      example: 'Confirmado',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Pedido actualizado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      mensaje: { type: 'string', example: 'Pedido actualizado con éxito.' },
                      pedido: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          nombre_cliente: { type: 'string' },
                          estado: { type: 'string' },
                          fecha_creacion: { type: 'string', format: 'date-time' },
                          monto_total: { type: 'number' },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              $ref: '#/components/responses/Error400',
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/pedidos/eliminar/{id}': {
        delete: {
          summary: 'Elimina un pedido por su ID',
          tags: ['Pedidos'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: {
                type: 'integer',
              },
              required: true,
              description: 'ID del pedido a eliminar',
            },
          ],
          responses: {
            '200': {
              description: 'Pedido eliminado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      mensaje: { type: 'string', example: 'Pedido eliminado con éxito.' },
                    },
                  },
                },
              },
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      // Rutas de Items_Pedido
      '/api/items_pedido/insertar': {
        post: {
          summary: 'Inserta un nuevo item en un pedido',
          tags: ['Items de Pedido'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['pedido_id', 'producto_id', 'cantidad', 'precio_unitario'],
                  properties: {
                    pedido_id: { type: 'integer', example: 101 },
                    producto_id: { type: 'integer', example: 1 },
                    cantidad: { type: 'integer', example: 1 },
                    precio_unitario: { type: 'number', format: 'float', example: 50.00 },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Item en pedido creado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      mensaje: { type: 'string', example: 'Item en pedido creado' },
                    },
                  },
                },
              },
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/items_pedido/obtener': {
        get: {
          summary: 'Obtiene la lista de todos los items de pedidos',
          tags: ['Items de Pedido'],
          responses: {
            '200': {
              description: 'Lista de items de pedido obtenida con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer' },
                        pedido_id: { type: 'integer' },
                        producto_id: { type: 'integer' },
                        nombre_producto: { type: 'string', description: 'Nombre del producto asociado' },
                        cantidad: { type: 'integer' },
                        precio_unitario: { type: 'number', format: 'float' },
                        fecha_creacion: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/items_pedido/actualizar/{id}': {
        put: {
          summary: 'Actualiza un item de pedido por su ID',
          tags: ['Items de Pedido'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: {
                type: 'integer',
              },
              required: true,
              description: 'ID del item de pedido a actualizar',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    pedido_id: { type: 'integer', example: 101 },
                    producto_id: { type: 'integer', example: 1 },
                    cantidad: { type: 'integer', example: 2 },
                    precio_unitario: { type: 'number', format: 'float', example: 55.00 },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Item de pedido actualizado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      mensaje: { type: 'string', example: 'Item actualizado' },
                    },
                  },
                },
              },
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/items_pedido/eliminar/{id}': {
        delete: {
          summary: 'Elimina un item de pedido por su ID',
          tags: ['Items de Pedido'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: {
                type: 'integer',
              },
              required: true,
              description: 'ID del item de pedido a eliminar',
            },
          ],
          responses: {
            '200': {
              description: 'Item de pedido eliminado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      mensaje: { type: 'string', example: 'Item eliminado' },
                    },
                  },
                },
              },
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      // Rutas de Historial_Compras
      '/api/historial_compras/insertar': {
        post: {
          summary: 'Inserta un nuevo registro en el historial de compras',
          tags: ['Historial de Compras'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HistorialCompra',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Registro de compra insertado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      mensaje: { type: 'string', example: 'Compra registrada exitosamente' },
                    },
                  },
                },
              },
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/historial_compras/obtener': {
        get: {
          summary: 'Obtiene el historial de todas las compras con detalles',
          tags: ['Historial de Compras'],
          responses: {
            '200': {
              description: 'Historial de compras obtenido con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer' },
                        nombre_usuario: { type: 'string', description: 'Nombre del usuario que realizó la compra' },
                        nombre_cliente: { type: 'string', description: 'Nombre del cliente en el pedido' },
                        tipo_documento_nombre: { type: 'string', description: 'Tipo de documento del cliente' },
                        numero_documento: { type: 'string', description: 'Número de documento del cliente' },
                        celular: { type: 'string', description: 'Número de celular del cliente' },
                        metodo_pago_nombre: { type: 'string', description: 'Nombre del método de pago' },
                        cantidad: { type: 'integer' },
                        precio_unitario: { type: 'number', format: 'float' },
                        fecha_compra: { type: 'string', format: 'date-time' },
                        estado: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/historial_compras/obtener/{id}': {
        get: {
          summary: 'Obtiene un registro del historial de compras por su ID',
          tags: ['Historial de Compras'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: {
                type: 'integer',
              },
              required: true,
              description: 'ID del registro de historial de compra a obtener',
            },
          ],
          responses: {
            '200': {
              description: 'Registro de historial obtenido con éxito',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/HistorialCompra',
                  },
                },
              },
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/historial_compras/actualizar/{id}': {
        put: {
          summary: 'Actualiza un registro del historial de compras por su ID',
          tags: ['Historial de Compras'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: {
                type: 'integer',
              },
              required: true,
              description: 'ID del registro de historial de compra a actualizar',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    usuario_id: { type: 'integer', example: 1 },
                    pedido_id: { type: 'integer', example: 101 },
                    producto_id: { type: 'integer', example: 1 },
                    cantidad: { type: 'integer', example: 2 },
                    precio_unitario: { type: 'number', format: 'float', example: 50.00 },
                    estado: { type: 'string', example: 'devuelto' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Registro de compra actualizado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      mensaje: { type: 'string', example: 'Compra actualizada' },
                    },
                  },
                },
              },
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/historial_compras/eliminar/{id}': {
        delete: {
          summary: 'Elimina un registro del historial de compras por su ID',
          tags: ['Historial de Compras'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: {
                type: 'integer',
              },
              required: true,
              description: 'ID del registro de historial de compra a eliminar',
            },
          ],
          responses: {
            '200': {
              description: 'Registro de historial eliminado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      mensaje: { type: 'string', example: 'Registro eliminado exitosamente' },
                    },
                  },
                },
              },
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      // Rutas de Metodos_Pago
      '/api/metodos_pago/insertar': {
        post: {
          summary: 'Inserta un nuevo método de pago',
          tags: ['Métodos de Pago'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MetodoPago',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Método de pago creado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      mensaje: { type: 'string', example: 'Método de pago creado' },
                    },
                  },
                },
              },
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/metodos_pago/obtener': {
        get: {
          summary: 'Obtiene la lista de todos los métodos de pago',
          tags: ['Métodos de Pago'],
          responses: {
            '200': {
              description: 'Lista de métodos de pago obtenida con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/MetodoPago',
                    },
                  },
                },
              },
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/metodos_pago/obtener/{id}': {
        get: {
          summary: 'Obtiene un método de pago por su ID',
          tags: ['Métodos de Pago'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: {
                type: 'integer',
              },
              required: true,
              description: 'ID del método de pago a obtener',
            },
          ],
          responses: {
            '200': {
              description: 'Método de pago obtenido con éxito',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/MetodoPago',
                  },
                },
              },
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/metodos_pago/actualizar/{id}': {
        put: {
          summary: 'Actualiza un método de pago por su ID',
          tags: ['Métodos de Pago'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: {
                type: 'integer',
              },
              required: true,
              description: 'ID del método de pago a actualizar',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nombre: { type: 'string', example: 'Transferencia Bancaria' },
                    descripcion: { type: 'string', example: 'Pago directo a cuenta bancaria.' },
                    activo: { type: 'boolean', example: false },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Método de pago actualizado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      mensaje: { type: 'string', example: 'Método de pago actualizado' },
                    },
                  },
                },
              },
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/metodos_pago/eliminar/{id}': {
        delete: {
          summary: 'Elimina un método de pago por su ID',
          tags: ['Métodos de Pago'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: {
                type: 'integer',
              },
              required: true,
              description: 'ID del método de pago a eliminar',
            },
          ],
          responses: {
            '200': {
              description: 'Método de pago eliminado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      mensaje: { type: 'string', example: 'Método de pago eliminado' },
                    },
                  },
                },
              },
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      // Rutas de Tipos_Documento
      '/api/tipos_documento/insertar': {
        post: {
          summary: 'Inserta un nuevo tipo de documento',
          tags: ['Tipos de Documento'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TipoDocumento',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Tipo de documento creado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      mensaje: { type: 'string', example: 'Tipo de documento creado' },
                    },
                  },
                },
              },
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/tipos_documento/obtener': {
        get: {
          summary: 'Obtiene la lista de todos los tipos de documento',
          tags: ['Tipos de Documento'],
          responses: {
            '200': {
              description: 'Lista de tipos de documento obtenida con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/TipoDocumento',
                    },
                  },
                },
              },
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/tipos_documento/obtener/{id}': {
        get: {
          summary: 'Obtiene un tipo de documento por su ID',
          tags: ['Tipos de Documento'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: {
                type: 'integer',
              },
              required: true,
              description: 'ID del tipo de documento a obtener',
            },
          ],
          responses: {
            '200': {
              description: 'Tipo de documento obtenido con éxito',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/TipoDocumento',
                  },
                },
              },
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/tipos_documento/actualizar/{id}': {
        put: {
          summary: 'Actualiza un tipo de documento por su ID',
          tags: ['Tipos de Documento'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: {
                type: 'integer',
              },
              required: true,
              description: 'ID del tipo de documento a actualizar',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nombre: { type: 'string', example: 'Cédula de Extranjería' },
                    descripcion: { type: 'string', example: 'Documento de identificación para extranjeros.' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Tipo de documento actualizado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      mensaje: { type: 'string', example: 'Tipo de documento actualizado' },
                    },
                  },
                },
              },
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
      '/api/tipos_documento/eliminar/{id}': {
        delete: {
          summary: 'Elimina un tipo de documento por su ID',
          tags: ['Tipos de Documento'],
          parameters: [
            {
              in: 'path',
              name: 'id',
              schema: {
                type: 'integer',
              },
              required: true,
              description: 'ID del tipo de documento a eliminar',
            },
          ],
          responses: {
            '200': {
              description: 'Tipo de documento eliminado con éxito',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      mensaje: { type: 'string', example: 'Tipo de documento eliminado' },
                    },
                  },
                },
              },
            },
            '404': {
              $ref: '#/components/responses/Error404',
            },
            '500': {
              $ref: '#/components/responses/Error500',
            },
          },
        },
      },
    },
  },
  apis: [], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;