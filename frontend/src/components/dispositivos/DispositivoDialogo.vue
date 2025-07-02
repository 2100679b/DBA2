<template>
<!-- Modal -->
<div class="modal fade" id="detalleDispositivo" tabindex="-1" aria-labelledby="detalleDispositivoLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="detalleDispositivoLabel">{{dispositivo.identifica.nombre}}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
            <div class="mb-3">
                <h6><i class="bi bi-geo-alt"></i> Ubicación</h6>
                <p class="card-text">{{ dispositivo.identifica.ubicacion }}, {{ dispositivo.identifica.coordenadas }}</p>
            </div>
            
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
                        <tr>
                            <td><strong>Potencia</strong></td>
                            <td>{{ dispositivo.identifica.potencia.nominal }}</td>
                            <td>{{ dispositivo.identifica.potencia.minimo }}</td>
                            <td>{{ dispositivo.identifica.potencia.maximo }}</td>
                            <td :class="{'text-success':(dispositivo.opera.potencia.idEstatus===1), 'text-warning':(dispositivo.opera.potencia.idEstatus===2), 'text-danger':(dispositivo.opera.potencia.idEstatus===3)}">
                                <strong>{{ dispositivo.opera.potencia.valor }}</strong>
                            </td>
                            <td>
                                <span class="badge" :class="getBadgeClass(dispositivo.opera.potencia.idEstatus)">
                                    {{ getEstadoTexto(dispositivo.opera.potencia.idEstatus) }}
                                </span>
                            </td>
                            <td>{{ dispositivo.identifica.potencia.um }}</td>
                        </tr>
                        <tr>
                            <td><strong>Voltaje</strong></td>
                            <td>{{ dispositivo.identifica.voltaje.nominal }}</td>
                            <td>{{ dispositivo.identifica.voltaje.minimo }}</td>
                            <td>{{ dispositivo.identifica.voltaje.maximo }}</td>
                            <td :class="{'text-success':(dispositivo.opera.voltaje.idEstatus===1), 'text-warning':(dispositivo.opera.voltaje.idEstatus===2), 'text-danger':(dispositivo.opera.voltaje.idEstatus===3)}">
                                <strong>{{ dispositivo.opera.voltaje.valor }}</strong>
                            </td>
                            <td>
                                <span class="badge" :class="getBadgeClass(dispositivo.opera.voltaje.idEstatus)">
                                    {{ getEstadoTexto(dispositivo.opera.voltaje.idEstatus) }}
                                </span>
                            </td>
                            <td>{{ dispositivo.identifica.voltaje.um }}</td>
                        </tr>
                        <tr>
                            <td><strong>Corriente</strong></td>
                            <td>{{ dispositivo.identifica.corriente.nominal }}</td>
                            <td>{{ dispositivo.identifica.corriente.minimo }}</td>
                            <td>{{ dispositivo.identifica.corriente.maximo }}</td>
                            <td :class="{'text-success':(dispositivo.opera.corriente.idEstatus===1), 'text-warning':(dispositivo.opera.corriente.idEstatus===2), 'text-danger':(dispositivo.opera.corriente.idEstatus===3)}">
                                <strong>{{ dispositivo.opera.corriente.valor }}</strong>
                            </td>
                            <td>
                                <span class="badge" :class="getBadgeClass(dispositivo.opera.corriente.idEstatus)">
                                    {{ getEstadoTexto(dispositivo.opera.corriente.idEstatus) }}
                                </span>
                            </td>
                            <td>{{ dispositivo.identifica.corriente.um }}</td>
                        </tr>
                        <tr>
                            <td><strong>Caudal</strong></td>
                            <td>{{ dispositivo.identifica.caudal.nominal }}</td>
                            <td>{{ dispositivo.identifica.caudal.minimo }}</td>
                            <td>{{ dispositivo.identifica.caudal.maximo }}</td>
                            <td :class="{'text-success':(dispositivo.opera.caudal.idEstatus===1), 'text-warning':(dispositivo.opera.caudal.idEstatus===2), 'text-danger':(dispositivo.opera.caudal.idEstatus===3)}">
                                <strong>{{ dispositivo.opera.caudal.valor }}</strong>
                            </td>
                            <td>
                                <span class="badge" :class="getBadgeClass(dispositivo.opera.caudal.idEstatus)">
                                    {{ getEstadoTexto(dispositivo.opera.caudal.idEstatus) }}
                                </span>
                            </td>
                            <td>{{ dispositivo.identifica.caudal.um }}</td>
                        </tr>
                    </tbody>
                    <tfoot class="table-light">
                        <tr>
                            <th colspan="7" :class="{'text-success':(dispositivo.opera.idEstatus===1), 'text-warning':(dispositivo.opera.idEstatus===2), 'text-danger':(dispositivo.opera.idEstatus===3)}">
                                <i class="bi bi-activity"></i> Estado General: {{ dispositivo.opera.estatus }}
                            </th>
                        </tr>
                    </tfoot>
                </table>
            </div>
            
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
            require: true
        }
    },
    data() {
        return {
            apiUrl: 'http://localhost:3000/api'
        }
    },
    methods: {
        getBadgeClass(idEstatus) {
            switch(idEstatus) {
                case 1: return 'bg-success';
                case 2: return 'bg-warning';
                case 3: return 'bg-danger';
                default: return 'bg-secondary';
            }
        },
        getEstadoTexto(idEstatus) {
            switch(idEstatus) {
                case 1: return 'Normal';
                case 2: return 'Alerta';
                case 3: return 'Error';
                default: return 'Desconocido';
            }
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleString('es-MX', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        },
        async actualizarDatos() {
            try {
                const response = await axios.get(`${this.apiUrl}/dispositivos/${this.dispositivo.identifica.identificador}`);
                if (response.status === 200) {
                    // Emitir evento para actualizar el dispositivo en el componente padre
                    this.$emit('actualizarDispositivo', response.data);
                    
                    // También actualizar el store si existe
                    if (this.$store) {
                        this.$store.dispatch('cargarDispositivos');
                    }
                }
            } catch (error) {
                console.error('Error al actualizar datos del dispositivo:', error);
            }
        }
    }
}
</script>

<style scoped>
.table th, .table td {
    vertical-align: middle;
}

.badge {
    font-size: 0.75rem;
}

.modal-lg {
    max-width: 900px;
}
</style>