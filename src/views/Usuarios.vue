<template>
  <v-container fluid class="admin-view">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-center">
            Panel de Administración
          </v-card-title>
          <v-tabs
            v-model="tab"
            background-color="purple"
            dark
            centered
          >
            <v-tab key="usuarios" value="usuarios">Usuarios</v-tab>
            <v-tab key="productos" value="productos">Productos</v-tab>
            <v-tab key="pedidos" value="pedidos">Pedidos</v-tab>
            <v-tab key="items-pedido" value="items-pedido">Items Pedido</v-tab>
            <v-tab key="historial-compras" value="historial-compras">Historial Compras</v-tab>
            <v-tab key="metodos-pago" value="metodos-pago">Métodos de Pago</v-tab>
            <v-tab key="tipos-documento" value="tipos-documento">Tipos de Documento</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item key="usuarios">
              <v-card flat>
                <v-card-title>
                  Usuarios
                  <v-spacer></v-spacer>
                  <v-btn color="purple accent-2" dark @click="dialogAgregarUsuario = true">Agregar Usuario</v-btn>
                </v-card-title>
                <v-data-table
                  :headers="headersUsuarios"
                  :items="users"
                  class="elevation-1"
                  :loading="loadingUsuarios"
                >
                  <template v-slot:item.actions="{ item }">
                    <v-btn icon color="primary" @click="editarUsuario(item)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon color="error" @click="eliminarUsuario(item.correo)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card>
            </v-tab-item>

            <v-tab-item key="productos">
              <v-card flat>
                <v-card-title>
                  Productos
                  <v-spacer></v-spacer>
                  <v-btn color="purple accent-2" dark @click="dialogAgregarProducto = true">Agregar Producto</v-btn>
                </v-card-title>
                <v-data-table
                  :headers="headersProductos"
                  :items="products"
                  class="elevation-1"
                  :loading="loadingProductos"
                >
                  <template v-slot:item.actions="{ item }">
                    <v-btn icon color="primary" @click="editarProducto(item)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon color="error" @click="eliminarProducto(item.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card>
            </v-tab-item>

            <v-tab-item key="pedidos">
              <v-card flat>
                <v-card-title>
                  Pedidos
                  <v-spacer></v-spacer>
                </v-card-title>
                <v-data-table
                  :headers="headersPedidos"
                  :items="pedidos"
                  class="elevation-1"
                  :loading="loadingPedidos"
                >
                  <template v-slot:item.estado="{ item }">
                    <v-select
                      v-model="item.estado"
                      :items="estadosPedido"
                      label="Estado"
                      @change="actualizarEstadoPedido(item)"
                      dense
                      outlined
                    ></v-select>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn icon color="error" @click="eliminarPedido(item.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card>
            </v-tab-item>

            <v-tab-item key="items-pedido">
              <v-card flat>
                <v-card-title>
                  Items Pedido
                </v-card-title>
                <v-data-table
                  :headers="headersItemsPedido"
                  :items="itemsPedido"
                  class="elevation-1"
                  :loading="loadingItemsPedido"
                ></v-data-table>
              </v-card>
            </v-tab-item>

            <v-tab-item key="historial-compras">
              <v-card flat>
                <v-card-title>
                  Historial Compras
                </v-card-title>
                <v-data-table
                  :headers="headersHistorialCompras"
                  :items="historialCompras"
                  class="elevation-1"
                  :loading="loadingHistorialCompras"
                ></v-data-table>
              </v-card>
            </v-tab-item>

            <v-tab-item key="metodos-pago">
              <v-card flat>
                <v-card-title>
                  Métodos de Pago
                  <v-spacer></v-spacer>
                  <v-btn color="purple accent-2" dark @click="dialogAgregarMetodoPago = true">Agregar Método</v-btn>
                </v-card-title>
                <v-data-table
                  :headers="headersMetodosPago"
                  :items="metodosPago"
                  class="elevation-1"
                  :loading="loadingMetodosPago"
                >
                  <template v-slot:item.activo="{ item }">
                    <v-chip :color="item.activo ? 'green' : 'red'" dark>{{ item.activo ? 'Sí' : 'No' }}</v-chip>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn icon color="primary" @click="editarMetodoPago(item)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon color="error" @click="eliminarMetodoPago(item.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card>
            </v-tab-item>

            <v-tab-item key="tipos-documento">
              <v-card flat>
                <v-card-title>
                  Tipos de Documento
                  <v-spacer></v-spacer>
                  <v-btn color="purple accent-2" dark @click="dialogAgregarTipoDocumento = true">Agregar Tipo</v-btn>
                </v-card-title>
                <v-data-table
                  :headers="headersTiposDocumento"
                  :items="tiposDocumento"
                  class="elevation-1"
                  :loading="loadingTiposDocumento"
                >
                  <template v-slot:item.actions="{ item }">
                    <v-btn icon color="primary" @click="editarTipoDocumento(item)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon color="error" @click="eliminarTipoDocumento(item.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogAgregarUsuario" max-width="500px">
      <AgregarUsuarioForm @usuario-agregado="cargarUsuarios" @close="dialogAgregarUsuario = false" />
    </v-dialog>

    <v-dialog v-model="dialogEditarUsuario" max-width="500px">
      <ActualizarUsuarioForm :usuario="usuarioSeleccionado" @usuario-actualizado="cargarUsuarios" @close="dialogEditarUsuario = false" />
    </v-dialog>

    <v-dialog v-model="dialogEliminar" max-width="400px">
      <EliminarConfirmacion
        :texto="textoEliminar"
        :tipo="tipoAEliminar" :id="idAEliminar || correoAEliminar" @confirmar="confirmarEliminar"
        @cancelar="dialogEliminar = false"
      />
    </v-dialog>

    <v-dialog v-model="dialogAgregarProducto" max-width="500px">
      <AgregarProductoForm @producto-agregado="cargarProductos" @close="dialogAgregarProducto = false" />
    </v-dialog>

    <v-dialog v-model="dialogEditarProducto" max-width="500px">
      <ActualizarProductoForm :producto="productoSeleccionado" @producto-actualizado="cargarProductos" @close="dialogEditarProducto = false" />
    </v-dialog>

    <v-dialog v-model="dialogAgregarMetodoPago" max-width="500px">
      <AgregarMetodoPagoForm @metodo-pago-agregado="cargarMetodosPago" @close="dialogAgregarMetodoPago = false" />
    </v-dialog>

    <v-dialog v-model="dialogEditarMetodoPago" max-width="500px">
      <ActualizarMetodoPagoForm :metodoPago="metodoPagoSeleccionado" @metodo-pago-actualizado="cargarMetodosPago" @close="dialogEditarMetodoPago = false" />
    </v-dialog>

    <v-dialog v-model="dialogAgregarTipoDocumento" max-width="500px">
      <AgregarTipoDocumentoForm @tipo-documento-agregado="cargarTiposDocumento" @close="dialogAgregarTipoDocumento = false" />
    </v-dialog>

    <v-dialog v-model="dialogEditarTipoDocumento" max-width="500px">
      <ActualizarTipoDocumentoForm :tipoDocumento="tipoDocumentoSeleccionado" @tipo-documento-actualizado="cargarTiposDocumento" @close="dialogEditarTipoDocumento = false" />
    </v-dialog>

    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import AgregarUsuarioForm from '../components/AgregarUsuarioForm.vue';
import AgregarProductoForm from '../components/AgregarProductoForm.vue';
import ActualizarUsuarioForm from '../components/ActualizarUsuarioForm.vue';
import ActualizarProductoForm from '../components/ActualizarProducto.vue';
import EliminarConfirmacion from '../components/EliminarConfirmacion.vue';
import AgregarMetodoPagoForm from '../components/AgregarMetodoPagoForm.vue';
import ActualizarMetodoPagoForm from '../components/ActualizarMetodoPagoForm.vue';
import AgregarTipoDocumentoForm from '../components/AgregarTipoDocumentoForm.vue';
import ActualizarTipoDocumentoForm from '../components/ActualizarTipoDocumentoForm.vue';

export default {
  components: {
    AgregarUsuarioForm,
    AgregarProductoForm,
    ActualizarUsuarioForm,
    ActualizarProductoForm,
    EliminarConfirmacion,
    AgregarMetodoPagoForm,
    ActualizarMetodoPagoForm,
    AgregarTipoDocumentoForm,
    ActualizarTipoDocumentoForm,
  },
  data() {
    return {
      tab: 'usuarios',
      estadosPedido: ['Pendiente', 'En proceso', 'Enviado', 'Entregado', 'Cancelado'],

      // Headers para las tablas (sin cambios)
      headersUsuarios: [
        { text: 'ID', value: 'id' },
        { text: 'Correo', value: 'correo' },
        { text: 'Nombre', value: 'nombre_completo' },
        { text: 'Teléfono', value: 'telefono' },
        { text: 'Dirección', value: 'direccion' },
        { text: 'Fecha Nacimiento', value: 'fecha_nacimiento' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      headersProductos: [
        { text: 'ID', value: 'id' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Descripción', value: 'descripcion' },
        { text: 'Precio', value: 'precio' },
        { text: 'Stock', value: 'stock' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      headersPedidos: [
        { text: 'ID', value: 'id' },
        { text: 'Usuario ID', value: 'usuario_id' },
        { text: 'Nombre Cliente', value: 'nombre_cliente' },
        { text: 'Tipo Doc ID', value: 'tipo_documento_id' },
        { text: 'Número Doc', value: 'numero_documento' },
        { text: 'Dirección Entrega', value: 'direccion_entrega' },
        { text: 'Celular', value: 'celular' },
        { text: 'Método Pago ID', value: 'metodo_pago_id' },
        { text: 'Monto Total', value: 'monto_total' },
        { text: 'Estado', value: 'estado' },
        { text: 'Fecha Creación', value: 'fecha_creacion' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      headersItemsPedido: [
        { text: 'ID', value: 'id' },
        { text: 'Pedido ID', value: 'pedido_id' },
        { text: 'Producto ID', value: 'producto_id' },
        { text: 'Nombre Producto', value: 'nombre_producto' },
        { text: 'Cantidad', value: 'cantidad' },
        { text: 'Precio Unitario', value: 'precio_unitario' },
        { text: 'Fecha Creación', value: 'fecha_creacion' },
      ],
      headersHistorialCompras: [
        { text: 'ID', value: 'id' },
        { text: 'Usuario ID', value: 'usuario_id' },
        { text: 'Producto ID', value: 'producto_id' },
        { text: 'Pedido ID', value: 'pedido_id' },
        { text: 'Cantidad', value: 'cantidad' },
        { text: 'Monto', value: 'monto' },
        { text: 'Estado', value: 'estado' },
      ],
      headersMetodosPago: [
        { text: 'ID', value: 'id' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Descripción', value: 'descripcion' },
        { text: 'Activo', value: 'activo' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      headersTiposDocumento: [
        { text: 'ID', value: 'id' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Descripción', value: 'descripcion' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],

      // Datos (sin cambios)
      users: [],
      products: [],
      pedidos: [],
      itemsPedido: [],
      historialCompras: [],
      metodosPago: [],
      tiposDocumento: [],

      // Estados de carga (sin cambios)
      loadingUsuarios: false,
      loadingProductos: false,
      loadingPedidos: false,
      loadingItemsPedido: false,
      loadingHistorialCompras: false,
      loadingMetodosPago: false,
      loadingTiposDocumento: false,

      // Diálogos (sin cambios, excepto el prop 'tipo' en EliminarConfirmacion)
      dialogAgregarUsuario: false,
      dialogEditarUsuario: false,
      dialogEliminar: false,
      dialogAgregarProducto: false,
      dialogEditarProducto: false,
      dialogAgregarMetodoPago: false,
      dialogEditarMetodoPago: false,
      dialogAgregarTipoDocumento: false,
      dialogEditarTipoDocumento: false,

      // Seleccionados (sin cambios)
      usuarioSeleccionado: null,
      productoSeleccionado: null,
      metodoPagoSeleccionado: null,
      tipoDocumentoSeleccionado: null,

      // Eliminación: ¡NUEVO!
      idAEliminar: null, // Para IDs numéricos (productos, pedidos, métodos de pago, tipos de documento)
      correoAEliminar: null, // Para el correo del usuario
      tipoAEliminar: null, // ¡Variable clave para saber qué tipo de entidad se eliminará!
      textoEliminar: '',

      // Notificaciones (sin cambios)
      snackbar: {
        visible: false,
        message: '',
        color: 'success'
      }
    };
  },
  methods: {
    // Métodos de carga (sin cambios)
    async cargarUsuarios() {
      this.loadingUsuarios = true;
      try {
        const response = await axios.get('http://localhost:3000/api/usuarios/obtener');
        this.users = response.data;
      } catch (error) {
        this.mostrarNotificacion('Error al cargar usuarios', 'error');
        console.error('Error al cargar usuarios:', error);
      } finally {
        this.loadingUsuarios = false;
      }
    },

    async cargarProductos() {
      this.loadingProductos = true;
      try {
        const response = await axios.get('http://localhost:3000/api/productos/obtener');
        this.products = response.data;
      } catch (error) {
        this.mostrarNotificacion('Error al cargar productos', 'error');
        console.error('Error al cargar productos:', error);
      } finally {
        this.loadingProductos = false;
      }
    },

    async cargarPedidos() {
      this.loadingPedidos = true;
      try {
        const response = await axios.get('http://localhost:3000/api/pedidos/obtener');
        this.pedidos = response.data;
      } catch (error) {
        this.mostrarNotificacion('Error al cargar pedidos', 'error');
        console.error('Error al cargar pedidos:', error);
      } finally {
        this.loadingPedidos = false;
      }
    },

    async cargarItemsPedido() {
      this.loadingItemsPedido = true;
      try {
        const response = await axios.get('http://localhost:3000/api/items_pedido/obtener');
        this.itemsPedido = response.data;
      } catch (error) {
        this.mostrarNotificacion('Error al cargar items de pedido', 'error');
        console.error('Error al cargar items de pedido:', error);
      } finally {
        this.loadingItemsPedido = false;
      }
    },

    async cargarHistorialCompras() {
      this.loadingHistorialCompras = true;
      try {
        const response = await axios.get('http://localhost:3000/api/historial_compras/obtener');
        this.historialCompras = response.data;
      } catch (error) {
        this.mostrarNotificacion('Error al cargar historial de compras', 'error');
        console.error('Error al cargar historial de compras:', error);
      } finally {
        this.loadingHistorialCompras = false;
      }
    },

    async cargarMetodosPago() {
      this.loadingMetodosPago = true;
      try {
        const response = await axios.get('http://localhost:3000/api/metodos_pago/obtener');
        this.metodosPago = response.data;
      } catch (error) {
        this.mostrarNotificacion('Error al cargar métodos de pago', 'error');
        console.error('Error al cargar métodos de pago:', error);
      } finally {
        this.loadingMetodosPago = false;
      }
    },

    async cargarTiposDocumento() {
      this.loadingTiposDocumento = true;
      try {
        const response = await axios.get('http://localhost:3000/api/tipos_documento/obtener');
        this.tiposDocumento = response.data;
      } catch (error) {
        this.mostrarNotificacion('Error al cargar tipos de documento', 'error');
        console.error('Error al cargar tipos de documento:', error);
      } finally {
        this.loadingTiposDocumento = false;
      }
    },

    // Métodos para pedidos (actualizado el eliminarPedido)
    async actualizarEstadoPedido(item) {
      try {
        await axios.put(`http://localhost:3000/api/pedidos/actualizar/${item.id}`, {
          estado: item.estado
        });
        this.mostrarNotificacion('Estado del pedido actualizado correctamente');
      } catch (error) {
        console.error('Error al actualizar estado del pedido:', error);
        this.mostrarNotificacion('Error al actualizar estado del pedido', 'error');
        this.cargarPedidos();
      }
    },

    eliminarPedido(id) {
      this.idAEliminar = id;
      this.correoAEliminar = null; // Asegúrate de que esto sea null si no es un usuario
      this.tipoAEliminar = 'pedidos'; // <--- ¡IMPORTANTE! Se establece el tipo
      this.textoEliminar = '¿Seguro que deseas eliminar este pedido?';
      this.dialogEliminar = true;
    },

    // Métodos para usuarios
    editarUsuario(usuario) {
      this.usuarioSeleccionado = { ...usuario };
      this.dialogEditarUsuario = true;
    },

    eliminarUsuario(correo) {
      this.correoAEliminar = correo;
      this.idAEliminar = null; // Asegúrate de que esto sea null si es un usuario
      this.tipoAEliminar = 'usuarios'; // <--- ¡IMPORTANTE! Se establece el tipo
      this.textoEliminar = '¿Seguro que deseas eliminar este usuario?';
      this.dialogEliminar = true;
    },

    // Métodos para productos
    editarProducto(producto) {
      this.productoSeleccionado = { ...producto };
      this.dialogEditarProducto = true;
    },

    eliminarProducto(id) {
      this.idAEliminar = id;
      this.correoAEliminar = null; // Asegúrate de que esto sea null si no es un usuario
      this.tipoAEliminar = 'productos'; // <--- ¡IMPORTANTE! Se establece el tipo
      this.textoEliminar = '¿Seguro que deseas eliminar este producto?';
      this.dialogEliminar = true;
    },

    // Métodos para métodos de pago
    editarMetodoPago(metodoPago) {
      this.metodoPagoSeleccionado = { ...metodoPago };
      this.dialogEditarMetodoPago = true;
    },

    eliminarMetodoPago(id) {
      this.idAEliminar = id;
      this.correoAEliminar = null;
      this.tipoAEliminar = 'metodos-pago'; // <--- ¡IMPORTANTE! Se establece el tipo
      this.textoEliminar = '¿Seguro que deseas eliminar este método de pago?';
      this.dialogEliminar = true;
    },

    // Métodos para tipos de documento
    editarTipoDocumento(tipoDocumento) {
      this.tipoDocumentoSeleccionado = { ...tipoDocumento };
      this.dialogEditarTipoDocumento = true;
    },

    eliminarTipoDocumento(id) {
      this.idAEliminar = id;
      this.correoAEliminar = null;
      this.tipoAEliminar = 'tipos-documento'; // <--- ¡IMPORTANTE! Se establece el tipo
      this.textoEliminar = '¿Seguro que deseas eliminar este tipo de documento?';
      this.dialogEliminar = true;
    },

    // Métodos generales
    mostrarNotificacion(mensaje, tipo = 'success') {
      this.snackbar.message = mensaje;
      this.snackbar.color = tipo;
      this.snackbar.visible = true;
    },

    // Función confirmarEliminar modificada para usar 'data' del evento
    async confirmarEliminar(data) { // Recibe el objeto { tipo, id }
      const { tipo, id } = data; // Desestructura para obtener el tipo y el identificador

      try {
        let endpoint = '';
        let successMessage = '';
        let reloadFunction;

        switch (tipo) {
          case 'usuarios':
            endpoint = `http://localhost:3000/api/usuarios/eliminar/${id}`; // 'id' aquí es el correo
            successMessage = 'Usuario eliminado correctamente';
            reloadFunction = this.cargarUsuarios;
            break;
          case 'productos':
            endpoint = `http://localhost:3000/api/productos/eliminar/${id}`;
            successMessage = 'Producto eliminado correctamente';
            reloadFunction = this.cargarProductos;
            break;
          case 'pedidos':
            endpoint = `http://localhost:3000/api/pedidos/eliminar/${id}`;
            successMessage = 'Pedido eliminado correctamente';
            reloadFunction = this.cargarPedidos;
            break;
          case 'metodos-pago':
            endpoint = `http://localhost:3000/api/metodos_pago/eliminar/${id}`;
            successMessage = 'Método de pago eliminado correctamente';
            reloadFunction = this.cargarMetodosPago;
            break;
          case 'tipos-documento':
            endpoint = `http://localhost:3000/api/tipos_documento/eliminar/${id}`;
            successMessage = 'Tipo de documento eliminado correctamente';
            reloadFunction = this.cargarTiposDocumento;
            break;
          default:
            throw new Error('Tipo de eliminación desconocido');
        }

        await axios.delete(endpoint);
        this.mostrarNotificacion(successMessage);
        reloadFunction(); // Llama a la función de recarga correspondiente

      } catch (error) {
        console.error(`Error al eliminar ${tipo}:`, error);
        this.mostrarNotificacion(`Error al eliminar ${tipo}`, 'error');
      } finally {
        this.dialogEliminar = false;
        // Limpia las variables de estado después de la acción
        this.idAEliminar = null;
        this.correoAEliminar = null;
        this.tipoAEliminar = null;
        this.textoEliminar = '';
      }
    }
  },
  mounted() {
    // Carga inicial de todos los datos
    this.cargarUsuarios();
    this.cargarProductos();
    this.cargarPedidos();
    this.cargarItemsPedido();
    this.cargarHistorialCompras();
    this.cargarMetodosPago();
    this.cargarTiposDocumento();
  }
};
</script>

<style scoped>
.admin-view {
  padding: 20px;
}
</style>