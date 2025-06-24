<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo-container">
        <div class="app-logo">⚡</div>
        <h1 class="app-name">Sistema de Simulación</h1>
      </div>

      <h1 class="login-title">{{ isRegister ? 'Registro' : 'Iniciar Sesión' }}</h1>
      <p class="login-subtitle">
        {{ isRegister ? 'Crea una cuenta nueva' : 'Ingresa a tu cuenta' }}
      </p>

      <form @submit.prevent="isRegister ? register() : login()" class="login-form">
        <div v-if="isRegister" class="form-group">
          <label class="form-label">Correo electrónico:</label>
          <input
            v-model="formData.email"
            type="email"
            class="form-input"
            placeholder="tu-email@ejemplo.com"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">
            {{ isRegister ? 'Nombre de usuario:' : 'Usuario o correo:' }}
          </label>

          <!-- Inputs separados para evitar conflictos de v-model -->
          <input
            v-if="isRegister"
            v-model="formData.username"
            type="text"
            class="form-input"
            placeholder="Tu nombre de usuario"
            required
          />
          <input
            v-else
            v-model="formData.identifier"
            type="text"
            class="form-input"
            placeholder="Usuario o email"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Contraseña:</label>
          <input
            v-model="formData.password"
            type="password"
            class="form-input"
            placeholder="Tu contraseña"
            required
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Iniciar Sesión') }}
          </button>
        </div>
      </form>

      <div class="links-container">
        <a href="#" class="toggle-login-link" @click.prevent="toggleForm">
          {{ isRegister ? 'Ya tengo cuenta' : 'Crear cuenta nueva' }}
        </a>
      </div>

      <div v-if="errorMessage" class="message-box error-message">
        <i class="icon">⚠️</i> {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="message-box success-message">
        <i class="icon">✅</i> {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { setAuthToken } from '../../utils/auth';

// Configura la URL base para las peticiones HTTP
axios.defaults.baseURL = process.env.VUE_APP_API_URL || '';

export default {
  name: 'Login',
  data() {
    return {
      isRegister: false,
      isLoading: false,
      formData: {
        email: '',
        username: '',
        password: '',
        identifier: ''
      },
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    toggleForm() {
      this.isRegister = !this.isRegister;
      this.clearMessages();
    },
    clearMessages() {
      this.errorMessage = '';
      this.successMessage = '';
    },
    async register() {
      this.isLoading = true;
      this.clearMessages();

      try {
        const response = await axios.post('/api/users/register', {
          email: this.formData.email,
          username: this.formData.username,
          password: this.formData.password
        });

        this.successMessage = response.data.message || '¡Registro exitoso!';
        this.formData = { email: '', username: '', password: '', identifier: '' };

        // Cambiar al modo login tras 2 segundos
        setTimeout(() => {
          this.isRegister = false;
        }, 2000);
      } catch (error) {
        this.handleError(error, 'registro');
      } finally {
        this.isLoading = false;
      }
    },
    async login() {
      this.isLoading = true;
      this.clearMessages();

      try {
        const response = await axios.post('/api/users/login', {
          identifier: this.formData.identifier,
          password: this.formData.password
        });

        setAuthToken(response.data.token);
        this.successMessage = response.data.message || '¡Inicio de sesión exitoso!';
        this.formData.password = '';

        // Redirige tras 1.5 segundos
        setTimeout(() => {
          this.$router.push('/menu');
        }, 1500);
      } catch (error) {
        this.handleError(error, 'inicio de sesión');
      } finally {
        this.isLoading = false;
      }
    },
    handleError(error, contexto) {
      console.error(`Error en ${contexto}:`, error);

      if (error.response) {
        this.errorMessage = error.response.data?.error || `Error ${error.response.status} en ${contexto}`;
      } else if (error.request) {
        this.errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión.';
      } else {
        this.errorMessage = `Error al configurar la solicitud: ${error.message}`;
      }
    }
  }
};
</script>


<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  padding: 20px;
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  padding: 40px;
  width: 100%;
  max-width: 450px;
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

.login-title {
  color: #2c3e50;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
}

.login-subtitle {
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 30px;
  font-size: 16px;
}

.login-form {
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.submit-btn {
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
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.submit-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.links-container {
  text-align: center;
  margin-bottom: 20px;
}

.toggle-login-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.toggle-login-link:hover {
  color: #2980b9;
  text-decoration: underline;
}

.message-box {
  padding: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  font-size: 15px;
  margin-top: 20px;
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
  font-size: 18px;
}

@media (max-width: 500px) {
  .login-box {
    padding: 25px;
  }
  
  .login-title {
    font-size: 24px;
  }
  
  .form-input, .submit-btn {
    padding: 12px;
  }
}
</style>