// services/sessionService.js

import axios from 'axios'
import dsSesionMock from './dsSesion.mock.js'

// Cambia esta IP por la de tu backend en producción o usa variables de entorno
const BASE_URL = 'http://18.119.167.171:3000/api/users' // Ejemplo: 'http://18.219.121.55:3000/api/users'

const USE_BACKEND = true // Cambia a false para usar el mock (modo prueba)

export const verify = async (userName, password) => {
  if (USE_BACKEND) {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        userName,
        password
      })

      if (response.data && response.data.usuario) {
        return response.data
      } else {
        throw new Error('Respuesta inválida del servidor')
      }
    } catch (error) {
      console.error('Error en la verificación con backend:', error)
      if (error.response && error.response.data?.mensaje) {
        throw new Error(error.response.data.mensaje)
      }
      throw new Error('Error de conexión con el servidor')
    }
  } else {
    return dsSesionMock.verify(userName, password)
  }
}
