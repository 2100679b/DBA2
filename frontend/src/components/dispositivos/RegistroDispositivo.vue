<template>
<div id="login" class="card bg-trasparent mb-3 record-card">
  <div class="card-body">
    <div class="text-center">
      <h4 class="card-title">Registro Dispositivo</h4>
      <hr />
    </div>
    <div class="row p-1"> 
      <form>
        <div class="form-floating p-1">
          <input type="text" id="identificador" class="form-control" v-model="dispositivo.identifica.identificador" placeholder="Identificador"/>
          <label for="identificador" class="form-text text-muted">Identificador</label>
        </div>            
        <div class="form-floating p-1">
          <input type="text" id="nombreDisp" class="form-control" v-model="dispositivo.identifica.nombre" placeholder="Nombre del dispositivo"/>
          <label for="nombreDisp" class="form-text text-muted">Nombre del dispositivo</label>
        </div>
        <div class="form-floating p-1">
          <input type="text" id="ubicacion" class="form-control" v-model="dispositivo.identifica.ubicacion" placeholder="Ubicacion"/>
          <label for="ubicacion" class="form-text text-muted">Ubicación</label>
        </div>
      </form>
    </div>

    <div class="row p-2" v-if="alerta.mensaje">
      <div class="col-12">
        <div class="alert alert-danger" role="alert">
          <strong>¡Error!</strong>
          <p v-html="alerta.mensaje"></p>
        </div>
      </div>
    </div>

    <div class="row p-2">
      <div class="col">
        <button class="btn btn-outline-success" type="button" @click="guardar()">Guardar</button>
        <button class="btn btn-outline-secondary" type="button" @click="limpiar()">Cancelar</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import api from '@/api'

export default {
  name: 'RegistroDispositivo',
  data() {
    return {
      dispositivo: {
        identifica: {
          identificador: 0,
          nombre: '',
          ubicacion: '',
          coordenadas: '19.7060° N, 101.1950° W',
          potencia: { nominal: 7.4, minimo: 6.2, maximo: 8.6, um: 'KW' },
          voltaje: { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' },
          corriente: { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' },
          caudal: { nominal: 1, minimo: 0.10, maximo: 1.20, um: 'm3/minuto' },
        },
        estado: 1
      },
      alerta: { mensaje: '' }
    };
  },
  methods: {
    guardar() {
      const d = this.dispositivo.identifica;
      const payload = {
        nombre: d.nombre,
        ubicacion: d.ubicacion,
        coordenadas: d.coordenadas,
        potencia: d.potencia,
        voltaje: d.voltaje,
        corriente: d.corriente,
        caudal: d.caudal,
        registro_usuario: 1
      };

      api.post('/dispositivos/agregar', payload)
        .then(res => {
          console.log('Dispositivo registrado:', res.data);
          this.alerta.mensaje = '';
          this.limpiar();
        })
        .catch(err => {
          this.alerta.mensaje = err.response?.data?.error || 'Error al conectar con el servidor.';
          console.error(err);
        });
    },
    limpiar() {
      this.dispositivo.identifica.nombre = '';
      this.dispositivo.identifica.ubicacion = '';
      this.dispositivo.identifica.identificador = 0;
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
</style>
