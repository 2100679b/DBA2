import { createStore } from 'vuex'

export default createStore({
  state: {
    dispositivos: [],
    usuarios: [],
    usuario: {
      id: 0,
      name: ''
    }
  },
  mutations: {
    setUsuario: function(state, usuario) {
      state.usuario = usuario
    },
    setDispositivos (state, payload) {
      state.dispositivos = payload
    },
    setUsuarios (state,payload) {
      state.usuarios = payload
    },
    addUsuario (state, usuario) {
      state.usuarios.push(usuario)
    },
    addDispositivo (state, dispositivo) {
      console.log('-------------------------------------------------------------')
      console.log(dispositivo)
      state.dispositivos.push(dispositivo)
      console.log('-------------------------------------------------------------')
      console.log(state.dispositivos)
    }
  },
  actions: {
  }
})
