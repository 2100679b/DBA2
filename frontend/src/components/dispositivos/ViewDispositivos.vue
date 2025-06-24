<template>
<div class="card">
    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
    <div class="btn-group me-2" role="group" aria-label="Second group">
        <button type="button" class="btn btn-secondary" @click="refresh">refresh</button>
        <button type="button" class="btn btn-secondary" @click="start">Iniciar</button>
        <button type="button" class="btn btn-secondary" @click="stop">Detener</button>
    </div>
    </div>
    <div class="card-body">
        <div class="row row-cols-1 row-cols-md-3 g-4">
            <Dispositivo  v-for="(item,index) in dispositivos" :key="index" :dispositivo="item" @setDispositivo="setDispositivo"></Dispositivo>
        </div>
    </div>
    <DispositivoDialogo :dispositivo="dispositivo"/>
</div>
</template>
<script>
import api from '@/api/api';
import Dispositivo from './Dispositivo.vue';
import DispositivoDialogo from './DispositivoDialogo.vue';

export default {
  name: 'ViewDispositivos',
  components: { Dispositivo, DispositivoDialogo },
  data() {
    return {
      dispositivo: { /* misma estructura inicial que antes */ },
      nIntervId: null
    };
  },
  computed: {
    dispositivos() {
      return this.$store.state.dispositivos;
    }
  },
  methods: {
    setDispositivo(dispositivo) {
      this.dispositivo = dispositivo;
    },
    async fetchDispositivos() {
      try {
        const response = await api.get('/dispositivos');
        this.$store.commit('setDispositivos', response.data);
      } catch (error) {
        console.error('Error al cargar dispositivos:', error);
      }
    },
    start() {
      if (!this.nIntervId) {
        this.nIntervId = setInterval(() => this.fetchDispositivos(), 2000);
      }
    },
    stop() {
      clearInterval(this.nIntervId);
      this.nIntervId = null;
    }
  },
  created() {
    this.fetchDispositivos(); // Cargar dispositivos al iniciar
  }
};
    </script>
    