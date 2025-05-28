<template>
  <v-card class="elevation-6 rounded-lg register-card" style="width: 450px;">
    <v-card-title class="headline text-center register-title">
      Registro de Usuario
    </v-card-title>
    <v-card-text class="register-form-content">
      <v-text-field
        v-model="nombreCompleto"
        label="Nombre Completo"
        prepend-inner-icon="mdi-account" rounded
        outlined
        dense
        :rules="[rules.required]"
        class="custom-input"
      ></v-text-field>

      <v-text-field
        v-model="correo"
        label="Correo Electrónico"
        prepend-inner-icon="mdi-email" rounded
        outlined
        dense
        :rules="[rules.required, rules.email]"
        class="custom-input"
      ></v-text-field>

      <v-text-field
        v-model="contrasena"
        label="Contraseña"
        prepend-inner-icon="mdi-lock" :type="showPassword ? 'text' : 'password'"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        rounded
        outlined
        dense
        :rules="[rules.required, rules.minPasswordLength(6)]"
        class="custom-input"
      ></v-text-field>

      <v-text-field
        v-model="telefono"
        label="Número Telefónico"
        prepend-inner-icon="mdi-phone" type="tel"
        inputmode="numeric"
        :rules="[rules.required, rules.numeric, rules.minLength(7)]"
        rounded
        outlined
        dense
        @keydown="onlyNumbers" class="custom-input"
      ></v-text-field>

      <v-menu
        ref="menu"
        v-model="menuFechaNacimiento"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        full-width
        :nudge-right="40"
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            :value="fechaNacimiento"
            label="Fecha de Nacimiento"
            prepend-inner-icon="mdi-calendar" readonly
            v-bind="attrs"
            v-on="on"
            rounded
            outlined
            dense
            :rules="[rules.required, rules.date]"
            class="custom-input"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="fechaNacimiento"
          @input="menuFechaNacimiento = false"
        ></v-date-picker>
      </v-menu>

      <v-text-field
        v-model="direccion"
        label="Dirección"
        prepend-inner-icon="mdi-map-marker" rounded
        outlined
        dense
        :rules="[rules.required]"
        class="custom-input"
      ></v-text-field>

      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="departamento"
            label="Departamento"
            prepend-inner-icon="mdi-city" rounded
            outlined
            dense
            :rules="[rules.required]"
            class="custom-input"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="ciudad"
            label="Ciudad"
            prepend-inner-icon="mdi-city-variant-outline" rounded
            outlined
            dense
            :rules="[rules.required]"
            class="custom-input"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-text-field
        v-model="codigoPostal"
        label="Código Postal"
        prepend-inner-icon="mdi-mailbox" type="text" inputmode="numeric"
        :rules="[rules.required, rules.numeric, rules.minLength(5)]"
        rounded
        outlined
        dense
        @keydown="onlyNumbers" class="custom-input"
      ></v-text-field>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        color="primary"
        class="mb-4 register-button"
        @click="handleRegister"
        :disabled="!isFormValid"
      >
        Registrar
      </v-btn>
    </v-card-actions>
    <v-card-actions class="justify-end">
      <v-btn text @click="$emit('close')" class="cancel-button">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      nombreCompleto: '',
      correo: '',
      contrasena: '',
      telefono: '',
      fechaNacimiento: null,
      menuFechaNacimiento: false,
      direccion: '',
      departamento: '',
      ciudad: '',
      codigoPostal: '',
      showPassword: false,
      rules: {
        required: (value) => !!value || 'Este campo es requerido.',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'Correo electrónico no válido.';
        },
        numeric: (value) => {
          if (value === null || value === undefined || value === '') {
            return 'Debe ingresar solo números.';
          }
          return /^\d+$/.test(String(value)) || 'Debe ingresar solo números.';
        },
        minLength: (min) => (value) => (value && String(value).length >= min) || `Mínimo ${min} caracteres.`,
        minPasswordLength: (min) => (value) => (value && value.length >= min) || `La contraseña debe tener al menos ${min} caracteres.`,
        date: (value) => {
          if (!value) return true;
          const pattern = /^\d{4}-\d{2}-\d{2}$/;
          return pattern.test(value) || 'Formato de fecha inválido (YYYY-MM-DD).';
        }
      },
    };
  },
  computed: {
    isFormValid() {
      // Una validación más completa con Vuetify podría usar ref y this.$refs.form.validate()
      return (
        !!this.nombreCompleto &&
        this.rules.email(this.correo) === true &&
        this.rules.minPasswordLength(6)(this.contrasena) === true &&
        this.rules.numeric(this.telefono) === true && // Ahora se valida el campo numérico
        this.rules.minLength(7)(this.telefono) === true &&
        this.rules.date(this.fechaNacimiento) === true &&
        !!this.direccion &&
        !!this.departamento &&
        !!this.ciudad &&
        this.rules.numeric(this.codigoPostal) === true && // Ahora se valida el campo numérico
        this.rules.minLength(5)(this.codigoPostal) === true
      );
    }
  },
  methods: {
    // Nueva función para permitir solo números al presionar teclas
    onlyNumbers(event) {
      // Permitir: números (0-9), teclas de control (flechas, borrar, tab, etc.)
      const allowedKeys = [
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'
      ];
      if (allowedKeys.includes(event.key)) {
        return; // Permite estas teclas
      }
      // Si no es un dígito y no es una tecla permitida, previene la entrada
      if (!/\d/.test(event.key)) {
        event.preventDefault();
      }
    },

    async handleRegister() {
      // Antes de enviar, verifica si el formulario es válido
      if (!this.isFormValid) {
        alert('Por favor, complete todos los campos correctamente.');
        return;
      }

      try {
        const payload = {
          nombre_completo: this.nombreCompleto,
          correo: this.correo.trim().toLowerCase(),
          contrasena: this.contrasena,
          telefono: this.telefono,
          fecha_nacimiento: this.fechaNacimiento,
          direccion: this.direccion,
          departamento: this.departamento,
          ciudad: this.ciudad,
          codigo_postal: this.codigoPostal,
          is_admin: false,
        };

        const response = await axios.post('http://localhost:3000/api/usuarios/insertar', payload);
        console.log('Respuesta completa del backend:', response.data);
        alert('¡Usuario registrado exitosamente!');
        console.log('ID nuevo usuario:', response.data.id);
        this.$emit('register-success');
        this.$emit('close');
        this.resetForm();
      } catch (error) {
        console.error('Error al registrar usuario:', error.response?.data || error.message);
        alert('Error: ' + (error.response?.data?.error || error.message));
      }
    },
    resetForm() {
      this.nombreCompleto = '';
      this.correo = '';
      this.contrasena = '';
      this.telefono = '';
      this.fechaNacimiento = null;
      this.direccion = '';
      this.departamento = '';
      this.ciudad = '';
      this.codigoPostal = '';
    }
  },
};
</script>

<style scoped>
.register-card {
  background-color: #ffffff !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1) !important;
  border-radius: 8px;
  padding: 20px;
}

.register-title {
  background-color: transparent !important;
  color: #333 !important;
  font-weight: bold;
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.register-form-content {
  padding-top: 0 !important;
}

/* Estilos para los v-text-field personalizados */
.custom-input.v-text-field--outlined.v-input--dense {
  /* Quitar el border-radius por defecto de Vuetify para que el nuestro prevalezca */
  border-radius: 0; 
}

.custom-input.v-text-field--outlined .v-input__control fieldset {
  border-radius: 30px !important; /* Bordes muy redondeados como en la imagen */
  border-width: 1px !important;
  border-color: #ccc !important; /* Color del borde por defecto (gris claro) */
}

/* Color del borde al enfocar (azul) */
.custom-input.v-text-field--outlined.v-input--is-focused .v-input__control fieldset {
  border-color: #2196F3 !important; /* Azul de Vuetify (puedes ajustar el tono si quieres) */
  border-width: 2px !important; /* Borde un poco más grueso al enfocar */
}

/* Color del borde si hay un error */
.custom-input.v-text-field--outlined.v-input--has-state .v-input__control fieldset {
  border-color: #FF5252 !important; /* Rojo de error de Vuetify */
  border-width: 2px !important;
}

/* Color del texto y label */
.custom-input.v-text-field--outlined.v-input--dense .v-input__control .v-input__slot label {
  color: #666 !important; /* Etiquetas en gris */
}

.custom-input.v-text-field--outlined.v-input--dense .v-input__control .v-input__slot input {
  color: #333 !important; /* Texto de entrada en gris oscuro */
}

/* Iconos internos (prepend-inner-icon) */
.custom-input .v-input__prepend-inner .v-icon {
  color: #666 !important; /* Color de los iconos en gris */
}

/* Ajuste para el ícono de append (ojo de la contraseña) */
.custom-input .v-input__append-inner .v-icon {
  color: #666 !important;
}

/* Botón de registro */
.register-button {
  background-color: #2196F3 !important; /* Azul, similar al enfoque de los inputs */
  color: white !important;
  font-weight: bold;
  letter-spacing: 1px;
  border-radius: 4px;
  padding: 10px 20px;
}

.register-button:hover {
  background-color: #1976D2 !important; /* Un azul un poco más oscuro al pasar el ratón */
}

/* Estilos del botón Cancelar */
.cancel-button {
  color: #777 !important; /* Un gris suave para el botón de cancelar */
}
</style>