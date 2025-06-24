<template>
  <div class="register-container">
    <div class="register-card">
      <div class="logo-container">
        <div class="app-logo">⚡</div>
        <h1 class="app-name">Sistema de Simulación</h1>
      </div>
      
      <h2>Crear Cuenta</h2>
      <form @submit.prevent="handleSubmit" class="register-form">

        <!-- Email -->
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input 
            type="email" 
            id="email"
            v-model.trim="form.email"
            :class="{ 'error': errors.email }"
            placeholder="tu-email@ejemplo.com"
            :disabled="isSubmitting"
            required
            maxlength="100"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <!-- Username -->
        <div class="form-group">
          <label for="username">Nombre de Usuario</label>
          <input 
            type="text" 
            id="username"
            v-model.trim="form.username"
            :class="{ 'error': errors.username }"
            placeholder="Nombre de usuario"
            :disabled="isSubmitting"
            required
            maxlength="30"
          />
          <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input 
            type="password" 
            id="password"
            v-model="form.password"
            :class="{ 'error': errors.password }"
            placeholder="Mínimo 8 caracteres"
            :disabled="isSubmitting"
            required
            maxlength="100"
          />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <!-- Mensajes -->
        <div v-if="generalError" class="message-box error-message">
          <i class="icon">⚠️</i> {{ generalError }}
        </div>
        <div v-if="successMessage" class="message-box success-message">
          <i class="icon">✅</i> {{ successMessage }}
        </div>

        <!-- Botón -->
        <button type="submit" class="register-btn" :disabled="isSubmitting">
          {{ isSubmitting ? 'Registrando...' : 'Crear Cuenta' }}
        </button>

        <!-- Link a login -->
        <div class="login-link">
          <p>¿Ya tienes cuenta? <router-link to="/login">Inicia Sesión</router-link></p>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      form: {
        email: '',
        username: '',
        password: '',
      },
      errors: {},
      isSubmitting: false,
      generalError: '',
      successMessage: '',
    };
  },
  methods: {
    clearMessages() {
      this.generalError = '';
      this.successMessage = '';
      this.errors = {};
    },

    validateForm() {
      this.errors = {};

      // Validación de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.form.email) {
        this.errors.email = 'El correo electrónico es requerido';
      } else if (!emailRegex.test(this.form.email)) {
        this.errors.email = 'Por favor ingresa un correo electrónico válido';
      }

      // Validación de username
      if (!this.form.username) {
        this.errors.username = 'El nombre de usuario es requerido';
      } else if (this.form.username.length < 3) {
        this.errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
      } else if (this.form.username.length > 30) {
        this.errors.username = 'El nombre de usuario no puede exceder los 30 caracteres';
      }

      // Validación de password
      if (!this.form.password) {
        this.errors.password = 'La contraseña es requerida';
      } else if (this.form.password.length < 8) {
        this.errors.password = 'La contraseña debe tener al menos 8 caracteres';
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleSubmit() {
      this.clearMessages();

      if (!this.validateForm()) return;

      this.isSubmitting = true;

      try {
        const userData = {
          email: this.form.email.trim(),
          username: this.form.username.trim(),
          password: this.form.password,
        };

        // Usar la URL base de las variables de entorno
        const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001';
        const response = await axios.post(`${API_URL}/api/users/register`, userData);

        if (response.data.message) {
          this.successMessage = response.data.message;
          
          // Limpiar formulario
          this.form = {
            email: '',
            username: '',
            password: '',
          };

          // Redirigir después de 2 segundos
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
        }
      } catch (error) {
        this.handleError(error);
      } finally {
        this.isSubmitting = false;
      }
    },
    
    handleError(error) {
      console.error('Error en registro:', error);

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.error || error.response.data?.message;

        switch (status) {
          case 400:
            this.generalError = message || 'Datos inválidos. Verifica la información.';
            break;
          case 409:
            this.generalError = 'El correo o nombre de usuario ya están registrados';
            break;
          default:
            this.generalError = message || 'Error del servidor. Intenta más tarde.';
        }
      } else if (error.request) {
        this.generalError = 'Error de conexión. Verifica tu internet.';
      } else {
        this.generalError = 'Error desconocido. Intenta nuevamente.';
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  padding: 20px;
}

.register-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  transition: all 0.3s ease;
}

.logo-container {
  text-align: center;
  margin-bottom: 25px;
}

.app-logo {
  font-size: 64px;
  margin-bottom: 10px;
}

.app-name {
  color: #2c3e50;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

h2 {
  color: #2c3e50;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
}

.register-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

input.error {
  border-color: #e74c3c;
}

.error-message {
  display: block;
  margin-top: 5px;
  color: #e74c3c;
  font-size: 14px;
}

.register-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(to right, #3498db, #2c3e50);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.register-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 15px;
}

.login-link a {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

.message-box {
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-top: 15px;
}

.error-message {
  background-color: #ffecec;
  color: #e74c3c;
  border: 1px solid #fadbd8;
}

.success-message {
  background-color: #e8f7f0;
  color: #27ae60;
  border: 1px solid #d4efdf;
}

.icon {
  margin-right: 10px;
}

@media (max-width: 500px) {
  .register-card {
    padding: 25px;
  }
  
  h2 {
    font-size: 24px;
  }
  
  input, .register-btn {
    padding: 12px;
  }
}
</style>