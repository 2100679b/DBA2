/*
Clase para representar los servicios de datos para manejo de la sesion
*/
class SessionDS {
  constructor () {
    this.usuarios = [
      {
        id: 1,
        nombre: 'Agustin Rodriguez Ponce',
        userName: 'arodriguezp',
        password: 'uno',
        roles: [1,2,3]
      }
    ],
    this.response = {
      mensaje: {
        codigo: 40,
        descripcion: 'Ocurrio un error en el servidor'
      },
      usuario: {
        id: 0,
        nombre: '',
        userName: '',
        roles: [0]
      }
    }
  }
  add (usuario) {
    this.usuarios.push(usuario)
  }
  verify(userName, password) {
    return Promise.resolve(getUser(userName,password))
  }
  getUser(userName,password) {
    let usuario
    usuario = this.usuarios.find((item) => {item.userName===userName && item.password===password})
    if(usuario===undefined) {
      this.response = {
        mensaje: {
          codigo: 40,
          descripcion: 'Ocurrio un error en el servidor'
        },
        usuario: {
          id: 0,
          nombre: '',
          userName: '',
          roles: [0]
        }
      }
    } else {
      this.response = {
        mensaje: {
          codigo: 10,
          descripcion: 'Usuario localizado'
        },
        usuario: usuario
      }
    }
    return this.response
  }
}

export default new SessionDS()
