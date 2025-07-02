<template>
<!-- Modal -->
<div class="modal fade" id="detalleDispositivo" tabindex="-1" aria-labelledby="detalleDispositivoLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="detalleDispositivoLabel">{{ dispositivo.identifica.nombre }}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <!-- UBICACIÓN -->
        <div class="mb-3">
          <h6><i class="bi bi-geo-alt"></i> Ubicación</h6>
          <p class="card-text">{{ dispositivo.identifica.ubicacion }}, {{ dispositivo.identifica.coordenadas }}</p>
        </div>

        <!-- ESPECIFICACIONES -->
        <div class="mb-3">
          <h6><i class="bi bi-info-circle"></i> Especificaciones Técnicas</h6>
          <table class="table table-bordered">
            <thead class="table-light">
              <tr>
                <th>Parámetro</th>
                <th>Nominal</th>
                <th>Mínimo</th>
                <th>Máximo</th>
                <th>Actual</th>
                <th>Estado</th>
                <th>Unidad</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="param in ['potencia', 'voltaje', 'corriente', 'caudal']" :key="param">
                <td><strong>{{ param.charAt(0).toUpperCase() + param.slice(1) }}</strong></td>
                <td>{{ dispositivo.identifica[param].nominal }}</td>
                <td>{{ dispositivo.identifica[param].minimo }}</td>
                <td>{{ dispositivo.identifica[param].maximo }}</td>
                <td :class="{
                  'text-success': dispositivo.opera[param].idEstatus === 1,
                  'text-warning': dispositivo.opera[param].idEstatus === 2,
                  'text-danger': dispositivo.opera[param].idEstatus === 3
                }">
                  <strong>{{ dispositivo.opera[param].valor }}</strong>
                </td>
                <td>
                  <span class="badge" :class="getBadgeClass(dispositivo.opera[param].idEstatus)">
                    {{ getEstadoTexto(dispositivo.opera[param].idEstatus) }}
                  </span>
                </td>
                <td>{{ dispositivo.identifica[param].um }}</td>
              </tr>
            </tbody>
            <tfoot class="table-light">
              <tr>
                <th colspan="7"
                  :class="{
                    'text-success': dispositivo.opera.idEstatus === 1,
                    'text-warning': dispositivo.opera.idEstatus === 2,
                    'text-danger': dispositivo.opera.idEstatus === 3
                  }">
                  <i class="bi bi-activity"></i> Estado General: {{ dispositivo.opera.estatus }}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- INFORMACIÓN DE REGISTRO -->
        <div class="mb-3">
          <h6><i class="bi bi-clock"></i> Información de Registro</h6>
          <div class="row">
            <div class="col-md-6">
              <small class="text-muted">Fecha de Creación:</small><br>
              <small class="text-body-secondary">{{ formatDate(dispositivo.identifica.fechaRegistro) }}</small>
            </div>
            <div class="col-md-6">
              <small class="text-muted">Última Actualización:</small><br>
              <small class="text-body-secondary">{{ formatDate(dispositivo.opera.fechaRegistro) }}</small>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          <i class="bi bi-x-circle"></i> Cerrar
        </button>
        <button type="button" class="btn btn-primary" @click="actualizarDatos">
          <i class="bi bi-arrow-clockwise"></i> Actualizar Datos
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'DispositivoDialogo',
  props: {
    dispositivo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      apiUrl: import.meta.env.VITE_API_URL
    }
  },
  methods: {
    getBadgeClass(idEstatus) {
      switch (idEstatus) {
        case 1: return 'bg-success'
        case 2: return 'bg-warning'
        case 3: return 'bg-danger'
        default: return 'bg-secondary'
      }
    },
    getEstadoTexto(idEstatus) {
      switch (idEstatus) {
        case 1: return 'Normal'
        case 2: return 'Alerta'
        case 3: return 'Error'
        default: return 'Desconocido'
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },
    async actualizarDatos() {
      try {
        const response = await axios.get(`${this.apiUrl}/dispositivos/${this.dispositivo.identifica.identificador}`)
        if (response.status === 200) {
          this.$emit('actualizarDispositivo', response.data)
          if (this.$store) {
            this.$store.dispatch('cargarDispositivos')
          }
        }
      } catch (error) {
        console.error('Error al actualizar datos del dispositivo:', error)
      }
    }
  }
}
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

.badge {
  font-size: 0.75rem;
}

.modal-lg {
  max-width: 900px;
}
</style>
