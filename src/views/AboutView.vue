<template>
  <v-container fluid class="carrito-view">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>TU CARRITO DE COMPRAS</h1>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-5">
      <v-col md="8" sm="10" cols="12">
        <v-card v-for="item in cartItems" :key="item.product.id" class="mb-4">
          <v-row align="center">
            <v-col md="3" sm="4" cols="6" class="text-center">
              <v-img :src="item.product.imagen_url" max-width="80" contain></v-img>
            </v-col>
            <v-col md="6" sm="5" cols="6">
              <v-card-title class="headline mb-1">{{ item.product.nombre }}</v-card-title>
              <v-card-subtitle>Precio: ${{ item.product.precio }}</v-card-subtitle>
            </v-col>
            <v-col md="3" sm="3" cols="12" class="text-center">
              <div class="d-flex align-center justify-space-around">
                <v-btn icon small @click="decrementQuantity(item)">
                  <v-icon>-</v-icon>
                </v-btn>
                <span>{{ item.quantity }}</span>
                <v-btn icon small @click="incrementQuantity(item)">
                  <v-icon>+</v-icon>
                </v-btn>
                <v-btn color="error" small @click="removeFromCart(item.product.id)">Eliminar</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <v-card v-if="cartItems.length > 0" class="mt-5">
          <v-row justify="end" class="pa-4">
            <v-col cols="auto">
              <div class="text-h6">Total: ${{ cartTotalPrice }}</div>
            </v-col>
            <v-col cols="auto">
              <v-btn color="purple accent-2" dark @click="checkLoginBeforePayment">Proceder al Pago</v-btn>
            </v-col>
          </v-row>
        </v-card>
        <v-card v-else class="mt-5">
          <v-card-text class="text-center">El carrito está vacío.</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card class="panel-pedido">
        <v-card-title class="headline panel-titulo">
          Detalles del Pedido
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <p class="productos-titulo">Número de Productos: {{ cartTotalQuantity }}</p>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="paymentDetails.name"
                  label="Nombre Completo"
                  :rules="[rules.required]"
                  outlined dense class="input-panel"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="paymentDetails.documentType"
                  :items="tiposDocumento"
                  item-text="text"
                  item-value="value"
                  label="Tipo de Documento"
                  :rules="[rules.required]"
                  outlined dense class="select-panel"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="paymentDetails.documentNumber"
                  label="Número de Documento"
                  :rules="[rules.required, rules.numeric]"
                  type="number"         
                  inputmode="numeric"   
                  outlined dense class="input-panel"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="paymentDetails.phoneNumber"
                  label="Número de Celular"
                  :rules="[rules.required, rules.numeric, rules.minLength(10)]"
                  type="tel"            
                  inputmode="numeric"   
                  outlined dense class="input-panel"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <p class="productos-titulo">Productos a Comprar:</p>
                <ul class="lista-productos">
                  <li v-for="item in cartItems" :key="item.product.id">
                    {{ item.product.nombre }} (Cantidad: {{ item.quantity }}, Precio Unitario: ${{ item.product.precio }})
                  </li>
                </ul>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="paymentDetails.paymentMethod"
                  :items="metodosPago"
                  item-text="text"
                  item-value="value"
                  label="Método de Pago"
                  :rules="[rules.required]"
                  outlined dense class="select-panel"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          </v-card-text>
        <v-card-actions class="panel-acciones">
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="dialog = false" class="boton-panel">Retroceder</v-btn>
          <v-btn
            color="purple accent-2"
            :disabled="!isFormValid"
            @click="procederPedido"
            class="boton-panel"
          >
            Proceder al Pedido
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="snackbarTimeout" :color="snackbarColor">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
  name: 'CarritoView',
  data() {
    return {
      dialog: false,
      paymentDetails: {
        name: '',
        documentType: null,
        documentNumber: '',
        phoneNumber: '',
        paymentMethod: null,
      },
      rules: {
        required: (value) => !!value || 'Este campo es requerido.',
        numeric: (value) => {
          if (value === null || value === undefined || value === '') {
            return 'Debe ingresar solo números.';
          }
          return /^\d+$/.test(String(value)) || 'Debe ingresar solo números.';
        },
        minLength: (min) => (value) => (value && String(value).length >= min) || `Mínimo ${min} caracteres.`,
      },
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'error',
      snackbarTimeout: 3000,
      tiposDocumento: [
        { text: 'Cédula de Ciudadanía', value: 1 },
        { text: 'Cédula de Extranjería', value: 2 }
      ],
      metodosPago: [
        { text: 'NEQUI', value: 1 },
        { text: 'DaviPlata', value: 2 }
      ],
    };
  },
  computed: {
    ...mapGetters('cart', ['cartItems', 'cartTotalQuantity', 'cartTotalPrice']),
    // MODIFICACIÓN CLAVE AQUÍ: Usar el getter 'isLoggedIn' de tu store principal
    isUserLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    isFormValid() {
      return !!this.paymentDetails.name &&
             !!this.paymentDetails.documentType &&
             !!this.paymentDetails.documentNumber &&
             !!this.paymentDetails.phoneNumber &&
             !!this.paymentDetails.paymentMethod &&
             this.rules.numeric(this.paymentDetails.documentNumber) === true &&
             this.rules.numeric(this.paymentDetails.phoneNumber) === true &&
             this.rules.minLength(10)(this.paymentDetails.phoneNumber) === true;
    },
  },
  methods: {
    ...mapActions('cart', ['removeFromCart', 'incrementQuantity', 'decrementQuantity', 'clearCart']),

    checkLoginBeforePayment() {
      // Esta función ahora usará el getter 'isLoggedIn' de tu store
      if (!this.isUserLoggedIn) {
        this.showSnackbar('Debes iniciar sesión antes de proceder al pago', 'error');
        return;
      }
      this.dialog = true;
    },

    showSnackbar(text, color = 'error', timeout = 3000) {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.snackbarTimeout = timeout;
      this.snackbar = true;
    },

    async procederPedido() {
      if (!this.isFormValid) {
        this.showSnackbar('Por favor, complete todos los campos requeridos correctamente.', 'error');
        return;
      }

      try {
        // Asegúrate de que el usuario obtenido de localStorage tenga la propiedad 'id'
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario || !usuario.id) {
          this.showSnackbar('Error: No se pudo obtener la información del usuario logueado.', 'error');
          return;
        }

        const pedidoData = {
          usuario_id: usuario.id, // Asegúrate de que tu API espera 'usuario_id' y no 'userId' o similar
          nombre_cliente: this.paymentDetails.name,
          tipo_documento_id: this.paymentDetails.documentType,
          numero_documento: this.paymentDetails.documentNumber,
          celular: this.paymentDetails.phoneNumber,
          metodo_pago_id: this.paymentDetails.paymentMethod,
          monto_total: this.cartTotalPrice,
          productos: this.cartItems.map(item => ({
            producto_id: item.product.id,
            cantidad: item.quantity,
            precio_unitario: item.product.precio
          }))
        };

        const response = await axios.post('http://localhost:3000/api/pedidos/insertar', pedidoData);
        
        if (response.data && response.data.pedido) {
          this.clearCart();
          this.dialog = false;
          
          this.showSnackbar('¡Pedido realizado con éxito!', 'success', 5000);
          setTimeout(() => {
            this.$router.push('/pedido-confirmado');
          }, 1000);
        } else {
          throw new Error('Respuesta inesperada del servidor al procesar el pedido.');
        }

      } catch (error) {
        console.error('Error al enviar el pedido:', error);
        let errorMessage = 'Ocurrió un error al procesar el pedido.';
        if (error.response && error.response.data && error.response.data.error) {
          errorMessage += ' Detalle: ' + error.response.data.error;
        } else if (error.message) {
            errorMessage += ' Detalle: ' + error.message;
        }
        this.showSnackbar(errorMessage, 'error', 5000);
      }
    },
  },
};
</script>

<style scoped>
.panel-pedido {
  border-radius: 15px !important;
  overflow: hidden;
}

.panel-titulo {
  background-color: #8c00ff;
  color: white !important;
  font-weight: bold;
  text-align: center;
  justify-content: center;
  padding: 16px;
  border-bottom: 2px solid #6a00cd;
}

.input-panel .v-input__control {
  border-radius: 8px;
}

.select-panel .v-input__control {
  border-radius: 8px;
}

.productos-titulo {
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 5px;
  color: #333;
}

.lista-productos {
  list-style-type: disc;
  padding-left: 20px;
  margin-bottom: 15px;
}

.lista-productos li {
  margin-bottom: 5px;
  color: #555;
}

.panel-acciones {
  background-color: #f5f5f5;
  padding: 10px 20px;
  border-top: 1px solid #eee;
}

.boton-panel {
  text-transform: uppercase !important;
  font-weight: bold !important;
  margin-left: 10px;
}

.carrito-view {
  background-color: #f8f8f8;
  padding: 20px;
}

.v-card {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-radius: 10px;
}

.d-flex .v-btn {
  min-width: 36px !important;
}

.d-flex span {
  font-weight: bold;
  margin: 0 10px;
}
</style>