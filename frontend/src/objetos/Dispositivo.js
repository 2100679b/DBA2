class Dispositivo {
  constructor() {
    this.data = {
      identifica: {
        identificador: 1,
        nombre: 'Represa Uno',
        ubicacion: 'En la compuerta de la Represa Uno',
        coordenadas: '19.7060° N, 101.1950° W',
        idestatus: 1,
        estatus: 'Operacion Normal',
        potencia:  { nominal: 7.400, minimo: 6.200, maximo: 8.600, um: 'KW' },
        voltaje: { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' },
        corriente: { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' },
        caudal: { nominal: 1, minimo: 0.10, maximo: 1.20, um: 'm3/minuto' },
        fechaRegistro: new Date().toUTCString()
      },
      opera: {
        voltaje: 240,
        corriente: 30,
        caudal: 1,
        estatus: 1    // {1->Normal, 2->Advertencia, 3->Error}
      },
      estado: 1   // {1->Encendido, 2->Apagado, 3->Bloqueado}
    }
  }
  set(dIdentifica) {
    this.data={
      identifica: dIdentifica,
      opera: {
        voltaje: dIdentifica.voltaje.nominal,
        corriente: dIdentifica.corriente.nominal,
        caudal: dIdentifica.caudal.nominal,
        estatus: 1
      },
      estado: 1
    }
  }
  setOpera() {
    let voltaje = this.data.identifica.voltaje.minimo +
                  (((this.data.identifica.voltaje.maximo - this.data.identifica.voltaje.minimo) +
                  (this.data.identifica.voltaje.nominal * 0.10)) * Math.random())
    let corriente = this.data.identifica.corriente.minimo +
                  (((this.data.identifica.corriente.maximo - this.data.identifica.corriente.minimo) +
                  (this.data.identifica.corriente.nominal * 0.10)) * Math.random())
    let caudal = this.data.identifica.caudal.minimo +
                  (((this.data.identifica.caudal.maximo - this.data.identifica.caudal.minimo) +
                  (this.data.identifica.caudal.nominal * 0.10)) * Math.random())
    this.data.opera = {
      voltaje: voltaje,
      corriente: corriente,
      caudal: caudal,
      estatus: 1
    }
  }
}

export default Dispositivo;