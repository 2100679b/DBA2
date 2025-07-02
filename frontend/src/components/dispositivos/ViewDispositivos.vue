<template>
  <div class="card">
    <div class="card-header">
      <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
        <div class="btn-group me-2" role="group" aria-label="Control group">
          <button type="button" class="btn btn-outline-primary" @click="refresh" :disabled="cargando">
            <i class="bi bi-arrow-clockwise"></i> 
            {{ cargando ? 'Cargando...' : 'Actualizar' }}
          </button>
          <button type="button" class="btn btn-outline-success" @click="start" :disabled="!!nIntervId">
            <i class="bi bi-play-fill"></i> Iniciar Auto-refresh
          </button>
          <button type="button" class="btn btn-outline-danger" @click="stop" :disabled="!nIntervId">
            <i class="bi bi-stop-fill"></i> Detener Auto-refresh
          </button>
        </div>
        <div class="btn-group" role="group" aria-label="Action group">
          <button type="button" class="btn btn-outline-info" @click="$router.push('/menu/dispositivos/agregar')">
            <i class="bi bi-plus-circle"></i> Nuevo Dispositivo
          </button>
        </div>
      </div>
    </div>
    
    <div class="card-body">
      <!-- Loading indicator -->
      <div v-if="cargando && dispositivos.length === 0" class="text-center p-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2">Cargando dispositivos...</p>
      </div>
      
      <!-- Error message -->
      <div v-if="error" class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle"></i>
        <strong>Error:</strong> {{ error }}
        <button type="button" class="btn btn-sm btn-outline-danger ms-2" @click="refresh">
          Reintentar
        </button>
      </div>
      
      <!-- Empty state -->
      <div v-if="!cargando && !error && dispositivos.length === 0" class="text-center p-4">
        <i class="bi bi-inbox" style="font-size: 3rem; color: #6c757d;"></i>
        <h5 class="mt-3">No hay dispositivos registrados</h5>
        <p class="text-muted">Comience agregando su primer dispositivo para monitorear.</p>
        <button type="button" class="btn btn-primary" @click="$router.push('/menu/dispositivos/nuevo')">
          <i class="bi bi-plus-circle"></i> Agregar Dispositivo
        </button>
      </div>
      
      <!-- Devices grid -->
      <div v-if="dispositivos.length > 0" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <Dispositivo
          v-for="(item, index) in dispositivos"
          :key="item.identifica?.identificador || index"
          :dispositivo="item"
          @setDispositivo="setDispositivo"
        />
      </div>
      
      <!-- Status bar -->
      <div v-if="dispositivos.length > 0" class="mt-3 p-2 bg-light rounded">
        <div class="row text-center">
          <div class="col-md-3">
            <small class="text-muted">Total Dispositivos:</small><br>
            <strong>{{ dispositivos.length }}</strong>
          </div>
          <div class="col-md-3">
            <small class="text-muted">En Operación Normal:</small><br>
            <strong class="text-success">{{ dispositivosNormales }}</strong>
          </div>
          <div class="col-md-3">
            <small class="text-muted">Con Alertas:</small><br>
            <strong class="text-warning">{{ dispositivosConAlerta }}</strong>
          </div>
          <div class="col-md-3">
            <small class="text-muted">Con Problemas:</small><br>
            <strong class="text-danger">{{ dispositivosConProblemas }}</strong>
          </div>
        </div>
        <div class="text-center mt-2">
          <small class="text-muted">
            <i class="bi bi-clock"></i> 
            Última actualización: {{ ultimaActualizacion }}
            <span v-if="nIntervId" class="badge bg-success ms-2">Auto-refresh activo</span>
          </small>
        </div>
      </div>
    </div>
    
    <!-- Device detail modal -->
    <DispositivoDialogo
      v-if="dispositivo"
      :dispositivo="dispositivo"
      @actualizarDispositivo="actualizarDispositivo"
      @close="dispositivo = null"
    />
  </div>
</template>

<script>
import Dispositivo from './Dispositivo.vue'
import DispositivoDialogo from './DispositivoDialogo.vue'
import axios from 'axios'

export default {
  name: 'ViewDispositivos',
  components: {
    Dispositivo,
    DispositivoDialogo
  },
  data() {
    return {
      nIntervId: null,
      dispositivo: null,
      dispositivos: [],
      cargando: false,
      error: null,
      ultimaActualizacion: '',
      apiUrl: 'http://localhost:3000/api'
    }
  },
  computed: {
    dispositivosNormales() {
      return this.dispositivos.filter(d => d.opera?.idEstatus === 1).length;
    },
    dispositivosConAlerta() {
      return this.dispositivos.filter(d => d.opera?.idEstatus === 2).length;
    },
    dispositivosConProblemas() {
      return this.dispositivos.filter(d => d.opera?.idEstatus === 3).length;
    }
  },
  methods: {
    setDispositivo(dispositivo) {
      this.dispositivo = dispositivo;
    },
    
    async refresh() {
      this.cargando = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${this.apiUrl}/dispositivos`);
        
        if (response.status === 200) {
          this.dispositivos = response.data;
          this.ultimaActualizacion = new Date().toLocaleString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
          
          // Actualizar el store de Vuex si existe
          if (this.$store) {
            this.$store.commit('setDispositivos', this.dispositivos);
          }
        }
      } catch (error) {
        console.error('Error al cargar dispositivos:', error);
        
        if (error.response && error.response.status === 404) {
          this.error = 'No se encontraron dispositivos en el servidor.';
        } else if (error.response && error.response.status >= 500) {
          this.error = 'Error del servidor. Intente nuevamente más tarde.';
        } else if (error.code === 'ECONNABORTED') {
          this.error = 'Tiempo de espera agotado. Verifique su conexión.';
        } else if (error.code === 'ERR_NETWORK') {
          this.error = 'Error de red. Verifique que el servidor esté funcionando.';
        } else {
          this.error = 'Error al cargar los dispositivos. Verifique su conexión.';
        }
      } finally {
        this.cargando = false;
      }
    },
    
    start() {
      if (!this.nIntervId) {
        this.nIntervId = setInterval(() => {
          this.refresh();
        }, 5000); // Actualizar cada 5 segundos
        
        console.log('Auto-refresh iniciado');
      }
    },
    
    stop() {
      if (this.nIntervId) {
        clearInterval(this.nIntervId);
        this.nIntervId = null;
        console.log('Auto-refresh detenido');
      }
    },
    
    actualizarDispositivo(dispositivoActualizado) {
      // Buscar y actualizar el dispositivo en la lista local
      const index = this.dispositivos.findIndex(
        d => d.identifica.identificador === dispositivoActualizado.identifica.identificador
      );
      
      if (index !== -1) {
        this.dispositivos.splice(index, 1, dispositivoActualizado);
      }
      
      // Actualizar el dispositivo seleccionado si es el mismo
      if (this.dispositivo && 
          this.dispositivo.identifica.identificador === dispositivoActualizado.identifica.identificador) {
        this.dispositivo = dispositivoActualizado;
      }
    }
  },
  
  async created() {
    // Cargar dispositivos al inicializar el componente
    await this.refresh();
  },
  
  beforeUnmount() {
    // Limpiar el intervalo al destruir el componente
    if (this.nIntervId) {
      this.stop();
    }
  }
}
</script>

<style scoped>
.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.btn-toolbar {
  justify-content: space-between;
}

.spinner-border {
  width: 2rem;
  height: 2rem;
}

.badge {
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .btn-toolbar {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .btn-group {
    width: 100%;
  }
  
  .btn-group .btn {
    flex: 1;
  }
}
</style>