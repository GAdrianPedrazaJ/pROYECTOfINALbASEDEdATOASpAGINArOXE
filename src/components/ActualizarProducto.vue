<template>
  <v-card class="elevation-12 rounded-lg product-form-card">
    <v-card-title class="headline white--text product-form-title text-center">
      Actualizar Producto
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model="nombre"
        label="Nombre del Producto"
        prepend-icon="mdi-shopping"
        rounded
        outlined
        class="product-form-input mt-4" 
        ></v-text-field>
      <v-textarea
        v-model="descripcion"
        label="Descripción"
        prepend-icon="mdi-information"
        rounded
        outlined
        class="product-form-input"
        rows="3"
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
        label="Subir Nueva Imagen"
        prepend-icon="mdi-camera"
        accept="image/*"
        show-size
        counter
        rounded
        outlined
        class="product-form-input"
        :hint="imagenExistente ? 'Imagen actual: ' + imagenExistente.split('/').pop() : 'No hay imagen actual'"
        persistent-hint
      ></v-file-input>

      <v-img
        v-if="currentImageSource"
        :src="currentImageSource"
        height="100px"
        width="100px"
        contain
        class="my-2"
      ></v-img>

    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        color="green darken-1"
        class="mb-4 rounded-pill white--text product-form-button"
        @click="handleActualizarProducto"
      >
        Actualizar Producto
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
  props: {
    producto: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      nombre: this.producto.nombre,
      descripcion: this.producto.descripcion,
      precio: this.producto.precio,
      stock: this.producto.stock,
      imagenExistente: this.producto.imagen_url, // Guarda la URL relativa de la imagen existente
      imagenArchivo: null, // Para la nueva imagen que se sube (objeto File)
      imagenArchivoPreview: null, // Para la previsualización de la nueva imagen (URL de objeto)
    };
  },
  watch: {
    // Observa los cambios en la prop 'producto'
    producto: {
      handler(newProducto) {
        // Cuando la prop 'producto' cambia, actualiza todos los datos del formulario
        this.nombre = newProducto.nombre;
        this.descripcion = newProducto.descripcion;
        this.precio = newProducto.precio;
        this.stock = newProducto.stock;
        this.imagenExistente = newProducto.imagen_url;
        // Limpia la imagen seleccionada y su previsualización al cambiar de producto
        this.imagenArchivo = null;
        if (this.imagenArchivoPreview) {
          URL.revokeObjectURL(this.imagenArchivoPreview);
          this.imagenArchivoPreview = null;
        }
      },
      deep: true, // Esto es importante para detectar cambios dentro del objeto producto
      immediate: true, // Esto hace que el watcher se ejecute inmediatamente al inicio
    },
    // Observa los cambios en el archivo de imagen seleccionado para generar la previsualización
    imagenArchivo(newFile) {
      if (this.imagenArchivoPreview) {
        URL.revokeObjectURL(this.imagenArchivoPreview); // Libera la URL anterior si existe
      }
      if (newFile) {
        this.imagenArchivoPreview = URL.createObjectURL(newFile); // Crea una URL temporal para previsualizar
      } else {
        this.imagenArchivoPreview = null;
      }
    }
  },
  computed: {
    currentImageSource() {
      // Si hay un archivo nuevo seleccionado, previsualiza ese.
      if (this.imagenArchivoPreview) {
        return this.imagenArchivoPreview;
      }
      // Si no hay archivo nuevo, y hay una imagen existente en la BD, muestra esa.
      if (this.imagenExistente) {
        return `http://localhost:3000${this.imagenExistente}`;
      }
      // Si no hay ni nueva ni existente, no hay fuente.
      return null;
    }
  },
  beforeUnmount() { // Cambiado de beforeDestroy en Vue 3
    if (this.imagenArchivoPreview) {
      URL.revokeObjectURL(this.imagenArchivoPreview);
    }
  },
  methods: {
    async handleActualizarProducto() {
      try {
        const formData = new FormData();
        formData.append('nombre', this.nombre);
        formData.append('descripcion', this.descripcion);
        formData.append('precio', this.precio);
        formData.append('stock', this.stock);

        if (this.imagenArchivo) {
          formData.append('imagen', this.imagenArchivo);
        } else if (this.imagenExistente) {
          // Si no se ha subido una nueva imagen, pero ya hay una existente,
          // puedes enviar la URL existente si tu backend lo necesita para confirmar que no se borre.
          // O simplemente no envíes nada si tu backend mantiene la imagen actual por defecto si no se recibe un nuevo archivo.
          // Para este ejemplo, asumimos que el backend si no recibe 'imagen' la mantiene.
        } else {
          // Si no hay imagenArchivo y no hay imagenExistente, podrías enviar un valor nulo si tu backend
          // permite que el campo de imagen sea nulo o si quieres eliminar la imagen actual.
          // formData.append('imagen', null); // Depende de cómo tu backend maneja la eliminación de imágenes.
        }

        const response = await axios.put(
          `http://localhost:3000/api/productos/actualizar/${this.producto.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log('Respuesta del backend:', response.data);
        alert('¡Producto actualizado exitosamente!');
        this.$emit('producto-actualizado');
        this.$emit('close');
      } catch (error) {
        console.error('Error al actualizar producto:', error.response?.data || error.message);
        alert('Error: ' + (error.response?.data?.error || error.message));
      }
    },
  },
};
</script>

<style scoped>
.product-form-card {
  background-color: #f1f8e9 !important;
  color: #388e3c !important;
}

.product-form-title {
  background-color: #4caf50 !important;
  color: white !important;
}

/* Estilo adicional para dar un poco más de espacio si es necesario.
  Normalmente, mt-4 (margin-top: 16px) en el elemento sería suficiente.
  Si el texto del label aún choca, podrías añadir un padding-top al v-card-text
  o ajustar el padding del v-card-title como opción alternativa.
*/
/* .product-form-input input,
.product-form-input textarea {
  color: #388e3c !important;
} */

/* Nuevo estilo si necesitas un ajuste más fino para el primer input */
.product-form-card .v-card__text .product-form-input:first-of-type {
  margin-top: 16px !important; /* Asegura que el primer input tenga este margen superior */
}


.product-form-input label {
  color: #66bb6a !important;
}

.product-form-button {
  background-color: #4caf50 !important;
  color: white !important;
}

.product-form-button:hover {
  background-color: #388e3c !important;
}

.v-input__prepend-outer,
.v-input__append-inner {
  color: #66bb6a !important;
}
</style>