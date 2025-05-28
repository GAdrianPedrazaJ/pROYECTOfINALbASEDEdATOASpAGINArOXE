<template>
  <v-card class="elevation-12 rounded-lg product-form-card">
    <v-card-title class="headline white--text product-form-title text-center">
      Agregar Producto
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model="nombre"
        label="Nombre del Producto"
        prepend-icon="mdi-shopping"
        rounded
        outlined
        class="product-form-input"
      ></v-text-field>
      <v-textarea
        v-model="descripcion"
        label="Descripción"
        prepend-icon="mdi-information"
        rounded
        outlined
        class="product-form-input"
      ></v-textarea>
      <v-text-field
        v-model="precio"
        label="Precio"
        prepend-icon="mdi-currency-usd"
        type="number"
        rounded
        outlined
        class="product-form-input"
      ></v-text-field>
      <v-text-field
        v-model="stock"
        label="Stock"
        prepend-icon="mdi-package-variant"
        type="number"
        rounded
        outlined
        class="product-form-input"
      ></v-text-field>
      <v-file-input
        v-model="imagenArchivo"
        label="Subir Imagen"
        prepend-icon="mdi-camera"
        accept="image/*"
        show-size
        counter
        rounded
        outlined
        class="product-form-input"
      ></v-file-input>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        color="green darken-1"
        class="mb-4 rounded-pill white--text product-form-button"
        @click="handleAgregarProducto"
      >
        Agregar Producto
      </v-btn>
    </v-card-actions>
    <v-card-actions class="justify-end">
      <v-btn text @click="$emit('close')">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      nombre: '',
      descripcion: '',
      precio: null,
      stock: null,
      imagenArchivo: null, // Almacenará el objeto File que el usuario seleccione
    };
  },
  methods: {
    async handleAgregarProducto() {
      try {
        const formData = new FormData(); // FormData es necesario para enviar archivos junto con otros datos
        formData.append('nombre', this.nombre);
        formData.append('descripcion', this.descripcion);
        formData.append('precio', this.precio);
        formData.append('stock', this.stock);
        
        if (this.imagenArchivo) {
          formData.append('imagen', this.imagenArchivo); 
        }

        const response = await axios.post('http://localhost:3000/api/productos/insertar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', 
          },
        });
        console.log('Respuesta del backend:', response.data);
        alert('¡Producto agregado exitosamente!');
        this.$emit('producto-agregado'); // Emite un evento para que el componente padre (ej. donde está la tabla de productos) pueda recargar la lista
        this.$emit('close'); 

        // Limpiar los campos del formulario después de una inserción exitosa
        this.nombre = '';
        this.descripcion = '';
        this.precio = null;
        this.stock = null;
        this.imagenArchivo = null; 
      } catch (error) {
        console.error('Error al agregar producto:', error.response?.data || error.message);
        alert('Error: ' + (error.response?.data?.error || error.message));
      }
    },
  },
};
</script>

<style scoped>
/* Estilos específicos para el formulario de producto */
.product-form-card {
  background-color: #f1f8e9 !important; /* Un verde muy claro para el fondo de la tarjeta */
  color: #388e3c !important; /* Verde oscuro para el texto principal */
}

.product-form-title {
  background-color: #4caf50 !important; /* Verde principal para el título de la tarjeta */
  color: white !important;
  text-align: center; /* Centra el título */
  padding: 16px; /* Ajusta el padding */
}

/* Estilos para los campos de texto y textarea */
.product-form-input input,
.product-form-input textarea {
  color: #388e3c !important; /* Color del texto de entrada */
}

.product-form-input label {
  color: #66bb6a !important; /* Color de las etiquetas de los campos */
}

/* Estilo para el botón de agregar */
.product-form-button {
  background-color: #4caf50 !important; /* Verde principal para el botón */
  color: white !important;
}

.product-form-button:hover {
  background-color: #388e3c !important; /* Verde más oscuro al pasar el ratón */
}

/* Color de los iconos prepend */
.v-input__prepend-outer,
.v-input__append-inner {
  color: #66bb6a !important; /* Color de los iconos que acompañan a los campos */
}
</style>