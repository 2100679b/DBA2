<template>
<div id="login" class="card bg-trasparent mb-3 record-card" >
    <div class="card-body">
    <div class="text-center">
        <h4 class="card-title" title="Plataforma para monitoreo de Sistemas de Bombeo">Registro Dispositivo</h4>
        <hr />
    </div>
    <div class="row p-1"> 
        <form @submit.prevent="guardar">
              <div class="form-floating p-1">
                <input type="text" id="identificador" ref="identificador" class="form-control" v-model="dispositivo.identifica.identificador" v-on:keyup.enter="$refs.nombreDisp.focus()" aria-describedby="Id" placeholder="Identificador" disabled/>
                <label id="identificador" class="form-text text-muted">Identificador (Auto-generado)</label>
              </div>            
              <div class="form-floating p-1">
                <input type="text" id="nombreDisp" ref="nombreDisp" class="form-control" v-model="dispositivo.identifica.nombre" v-on:keyup.enter="$refs.ubicacion.focus()" aria-describedby="Nombre" placeholder="Nombre del dispositivo" required/>
                <label id="nombreDisp" class="form-text text-muted">Nombre del dispositivo</label>
              </div>
              <div class="form-floating p-1">
                <input type="text" id="ubicacion" ref="ubicacion" class="form-control" v-model="dispositivo.identifica.ubicacion" v-on:keyup.enter="guardar" aria-describedby="Ubicacion" placeholder="Ubicacion" required/>
                <label id="ubicacion" class="form-text text-muted">Ubicación</label>
              </div>
              <div class="form-floating p-1">
                <input type="text" id="coordenadas" ref="coordenadas" class="form-control" v-model="dispositivo.identifica.coordenadas" aria-describedby="Coordenadas" placeholder="Coordenadas"/>
                <label id="coordenadas" class="form-text text-muted">Coordenadas</label>
              </div>
            </form>
            </div>
            <div class="row p-2">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="alert alert-danger" role="alert" v-if="alerta.mensaje">
                <strong>¡Error!</strong>
                <p v-html="alerta.mensaje"></p>
                </div>
                <div class="alert alert-success" role="alert" v-if="alerta.exito">
                <strong>¡Éxito!</strong>
                <p v-html="alerta.exito"></p>
                </div>
            </div>
        </div>
        <div class="row p-2">
            <div class="col">
                <button class="btn btn-outline-success" type="button" @click="guardar()" :disabled="guardando"> 
                    <i class="bi bi-box-arrow-in-right"></i> 
                    {{ guardando ? 'Guardando...' : 'Guardar' }}
                </button>
                <button class="btn btn-outline-secondary" type="button" @click="limpiar()"> 
                    <i class="bi bi-x-circle"></i> Cancelar 
                </button>
            </div>
        </div>
    </div>
</div>
</template>
      
<script>
import axios from 'axios'

export default  {
    name: 'RegistroDispositivo',
    components: {
    },
    data: function() {
        return { 
        dispositivo: {
          identifica: {
            identificador: 'Auto-generado',
            nombre: '',
            ubicacion: '',
            coordenadas: '19.7060° N, 101.1950° W',
            idestatus: 1,
            estatus: 'Operacion Normal',
            potencia:  { nominal: 7.400, minimo: 6.200, maximo: 8.600, um: 'KW' },
            voltaje: { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' },
            corriente: { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' },
            caudal: { nominal: 1, minimo: 0.10, maximo: 1.20, um: 'm3/minuto' },
            fechaRegistro: new Date().toISOString()
          },
          opera: {
            potencia: { valor: 7.200, idEstatus: 1 },
            voltaje: { valor: 240, idEstatus: 1 },
            corriente: { valor: 30, idEstatus: 1 },
            caudal: { valor: 1, idEstatus: 1 },
            idEstatus: 1,
            estatus: 'Operacion Normal',
            fechaRegistro: new Date().toISOString()
          },
          estado: 1
        },
        alerta: {
            mensaje: '',
            exito: ''
        },
        guardando: false,
        apiUrl: 'http://localhost:3000/api'
        };
    },
    computed: {
    }, 
    methods: {
      async guardar() {
        // Validar campos requeridos
        if (!this.dispositivo.identifica.nombre.trim()) {
          this.alerta.mensaje = 'El nombre del dispositivo es requerido';
          this.alerta.exito = '';
          return;
        }
        
        if (!this.dispositivo.identifica.ubicacion.trim()) {
          this.alerta.mensaje = 'La ubicación es requerida';
          this.alerta.exito = '';
          return;
        }

        this.guardando = true;
        this.alerta.mensaje = '';
        this.alerta.exito = '';

        try {
          const response = await axios.post(`${this.apiUrl}/dispositivos`, this.dispositivo);
          
          if (response.status === 201) {
            this.alerta.exito = 'Dispositivo guardado exitosamente';
            this.alerta.mensaje = '';
            
            // Actualizar el store de Vuex si existe
            if (this.$store) {
              this.$store.dispatch('cargarDispositivos');
            }
            
            // Limpiar formulario después de un pequeño delay
            setTimeout(() => {
              this.limpiar();
            }, 1500);
          }
        } catch (error) {
          console.error('Error al guardar dispositivo:', error);
          
          if (error.response && error.response.data && error.response.data.error) {
            this.alerta.mensaje = error.response.data.error;
          } else if (error.response && error.response.status === 400) {
            this.alerta.mensaje = 'Datos inválidos. Verifique la información ingresada.';
          } else if (error.response && error.response.status === 500) {
            this.alerta.mensaje = 'Error del servidor. Intente nuevamente más tarde.';
          } else {
            this.alerta.mensaje = 'Error de conexión. Verifique su conexión a internet.';
          }
          this.alerta.exito = '';
        } finally {
          this.guardando = false;
        }
      },
      
      limpiar() {
        this.dispositivo = {
          identifica: {
            identificador: 'Auto-generado',
            nombre: '',
            ubicacion: '',
            coordenadas: '19.7060° N, 101.1950° W',
            idestatus: 1,
            estatus: 'Operacion Normal',
            potencia:  { nominal: 7.400, minimo: 6.200, maximo: 8.600, um: 'KW' },
            voltaje: { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' },
            corriente: { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' },
            caudal: { nominal: 1, minimo: 0.10, maximo: 1.20, um: 'm3/minuto' },
            fechaRegistro: new Date().toISOString()
          },
          opera: {
            potencia: { valor: 7.200, idEstatus: 1 },
            voltaje: { valor: 240, idEstatus: 1 },
            corriente: { valor: 30, idEstatus: 1 },
            caudal: { valor: 1, idEstatus: 1 },
            idEstatus: 1,
            estatus: 'Operacion Normal',
            fechaRegistro: new Date().toISOString()
          },
          estado: 1
        };
        
        this.alerta.mensaje = '';
        this.alerta.exito = '';
        
        // Redirigir a la lista de dispositivos
        this.$router.push('/menu/dispositivos');
      }    
    }
}
</script>
      
<style scoped>
.record-card {
    max-width: 500px;
    min-width: 400px;
    width: 100%;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>