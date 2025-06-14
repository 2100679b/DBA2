<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="login-title">{{ isRegister ? 'Registro' : 'Iniciar Sesión' }}</h1>
      <p class="login-subtitle">{{ isRegister ? 'Crea tu cuenta' : 'Accede a tu cuenta' }}</p>

      <form @submit.prevent="handleSubmit" class="login-form">
        <!-- Email (registro) -->
        <div v-if="isRegister" class="form-group">
          <label for="email" class="form-label">Correo electrónico</label>
          <input
            id="email"
            v-model.trim="formData.email"
            type="email"
            class="form-input"
            :class="{ 'error': errors.email }"
            placeholder="tu@email.com"
            required
            :disabled="isLoading"
          />
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>

        <!-- Usuario (registro) -->
        <div v-if="isRegister" class="form-group">
          <label for="username" class="form-label">Usuario</label>
          <input
            id="username"
            v-model.trim="formData.username"
            type="text"
            class="form-input"
            :class="{ 'error': errors.username }"
            placeholder="Nombre de usuario"
            required
            minlength="3"
            :disabled="isLoading"
          />
          <span v-if="errors.username" class="field-error">{{ errors.username }}</span>
        </div>

        <!-- Identificador (login) -->
        <div v-if="!isRegister" class="form-group">
          <label for="identifier" class="form-label">
            {{ loginByEmail ? 'Correo electrónico' : 'Usuario' }}
          </label>
          <input
            id="identifier"
            v-model.trim="formData.identifier"
            :type="loginByEmail ? 'email' : 'text'"
            class="form-input"
            :class="{ 'error': errors.identifier }"
            :placeholder="loginByEmail ? 'tu@email.com' : 'Nombre de usuario'"
            required
            :disabled="isLoading"
          />
          <span v-if="errors.identifier" class="field-error">{{ errors.identifier }}</span>
          <small class="form-hint">
            Ingresa tu {{ loginByEmail ? 'correo electrónico' : 'nombre de usuario' }}
          </small>
          <a href="#" class="toggle-login-link" @click.prevent="toggleLoginMethod">
            Usar {{ loginByEmail ? 'usuario' : 'correo electrónico' }} en su lugar
          </a>
        </div>

        <!-- Contraseña -->
        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            class="form-input"
            :class="{ 'error': errors.password }"
            :placeholder="isRegister ? 'Mínimo 8 caracteres' : 'Tu contraseña'"
            required
            :disabled="isLoading"
            :minlength="isRegister ? 8 : undefined"
          />
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </div>

        <!-- Confirmar contraseña (registro) -->
        <div v-if="isRegister" class="form-group">
          <label for="confirmPassword" class="form-label">Confirmar contraseña</label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            class="form-input"
            :class="{ 'error': errors.confirmPassword }"
            placeholder="Repite tu contraseña"
            required
            :disabled="isLoading"
          />
          <span v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</span>
        </div>

        <!-- Enlaces de alternancia -->
        <div class="toggle-links" v-if="!isLoading">
          <router-link v-if="!isRegister" to="/register" class="toggle-login-link">¿No tienes cuenta? Regístrate</router-link>
          <router-link v-else to="/login" class="toggle-login-link">¿Ya tienes cuenta? Inicia sesión</router-link>
        </div>

        <!-- Mensajes -->
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

        <!-- Botón -->
        <button type="submit" class="submit-btn" :disabled="isLoading || !isFormValid">
          <span v-if="!isLoading">{{ isRegister ? 'Crear cuenta' : 'Iniciar sesión' }}</span>
          <span v-else>{{ isRegister ? 'Creando cuenta...' : 'Iniciando sesión...' }}</span>
        </button>
      </form>

      <!-- Enlace adicional -->
      <div class="links-container">
        <a href="#" @click.prevent="handleForgotPassword" class="additional-link">¿Olvidaste tu contraseña?</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      isRegister: false,
      isLoading: false,
      errorMessage: '',
      successMessage: '',
      loginByEmail: false,
      errors: {},
      formData: {
        email: '',
        username: '',
        identifier: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  computed: {
    isFormValid() {
      const { email, username, identifier, password, confirmPassword } = this.formData
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (this.isRegister) {
        return (
          emailRegex.test(email.trim()) &&
          username.trim().length >= 3 &&
          password.length >= 8 &&
          password === confirmPassword
        )
      } else {
        return this.loginByEmail
          ? emailRegex.test(identifier.trim()) && password.length > 0
          : identifier.trim().length >= 3 && password.length > 0
      }
    }
  },
  created() {
    this.isRegister = this.$route.path === '/register'
  },
  watch: {
    '$route'(to) {
      this.isRegister = to.path === '/register'
      this.clearMessages()
      this.clearForm()
    }
  },
  methods: {
    clearMessages() {
      this.errorMessage = ''
      this.successMessage = ''
      this.errors = {}
    },
    clearForm() {
      for (const key in this.formData) {
        this.formData[key] = ''
      }
    },
    toggleLoginMethod() {
      this.loginByEmail = !this.loginByEmail
      this.formData.identifier = ''
      this.clearMessages()
    },
    validateForm() {
      const errors = {}
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (this.isRegister) {
        if (!this.formData.email.trim()) {
          errors.email = 'El correo electrónico es obligatorio'
        } else if (!emailRegex.test(this.formData.email.trim())) {
          errors.email = 'Formato de correo no válido'
        }

        if (!this.formData.username.trim()) {
          errors.username = 'El nombre de usuario es obligatorio'
        } else if (this.formData.username.trim().length < 3) {
          errors.username = 'Debe tener al menos 3 caracteres'
        }

        if (!this.formData.password) {
          errors.password = 'La contraseña es obligatoria'
        } else if (this.formData.password.length < 8) {
          errors.password = 'Debe tener al menos 8 caracteres'
        }

        if (!this.formData.confirmPassword) {
          errors.confirmPassword = 'Confirma la contraseña'
        } else if (this.formData.password !== this.formData.confirmPassword) {
          errors.confirmPassword = 'Las contraseñas no coinciden'
        }

      } else {
        if (!this.formData.identifier.trim()) {
          errors.identifier = this.loginByEmail ? 'El correo es obligatorio' : 'El usuario es obligatorio'
        } else if (this.loginByEmail && !emailRegex.test(this.formData.identifier.trim())) {
          errors.identifier = 'Formato de correo no válido'
        }

        if (!this.formData.password) {
          errors.password = 'La contraseña es obligatoria'
        }
      }

      this.errors = errors
      return Object.keys(errors).length === 0
    },
    async handleSubmit() {
      this.clearMessages()

      if (!this.validateForm()) return

      this.isLoading = true

      try {
        if (this.isRegister) {
          await this.register()
        } else {
          await this.login()
        }
      } catch (err) {
        this.errorMessage = err.message || 'Error inesperado'
      } finally {
        this.isLoading = false
      }
    },
    async register() {
      await new Promise(resolve => setTimeout(resolve, 1500))
      this.successMessage = 'Cuenta creada con éxito. Redirigiendo...'
      this.clearForm()
      await this.$router.push('/login')
    },
    async login() {
      await new Promise(resolve => setTimeout(resolve, 1500))
      this.successMessage = 'Inicio de sesión exitoso.'
      this.clearForm()
      // Aquí podrías redirigir al dashboard, por ejemplo:
      // await this.$router.push('/dashboard')
    },
    handleForgotPassword() {
      alert('Funcionalidad aún no implementada.')
    }
  }
}
</script>

<style scoped src="./login.css"></style>
