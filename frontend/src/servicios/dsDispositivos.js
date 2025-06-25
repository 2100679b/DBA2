class DSDispositivos {
  getListaDataStore() {
    return [
      {
          identifica: {
              identificador: 1,
              nombre: 'Represa Uno',
              ubicacion: 'En la compuerta de la Represa Uno',
              coordenadas: '19.7060° N, 101.1950° W',
              potencia:  { nominal: 7.200, minimo: 6.200, maximo: 8.600, um: 'KW' },
              voltaje: { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' },
              corriente: { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' },
              caudal: { nominal: 1, minimo: 0.10, maximo: 1.20, um: 'm3/minuto' },
              fechaRegistro: new Date().toUTCString()
          },
          opera: {
              potencia: { valor: 7.200, idEstatus: 1 },
              voltaje: { valor: 240, idEstatus: 1 },
              corriente: { valor: 30, idEstatus: 1 },
              caudal: { valor: 1, idEstatus: 1 },
              idEstatus: 1,    // {1->Normal, 2->Advertencia, 3->Error}
              estatus: 'Operacion Normal',
              fechaRegistro: new Date().toUTCString()
          },
          estado: 1   // {1->Encendido, 2->Apagado, 3->Bloqueado}
      },
      {
          identifica: {
              identificador: 2,
              nombre: 'Represa dos',
              ubicacion: 'En la compuerta de la Represa dos',
              coordenadas: '19.7060° N, 101.1950° W',
              idestatus: 1,
              estatus: 'Operacion Normal',
              potencia:  { nominal: 7.200, minimo: 6.200, maximo: 8.600, um: 'KW' },
              voltaje: { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' },
              corriente: { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' },
              caudal: { nominal: 1, minimo: 0.10, maximo: 1.20, um: 'm3/minuto' },
              fechaRegistro: new Date().toUTCString()
          },
          opera: {
              potencia: { valor: 7.200, idEstatus: 1 },
              voltaje: { valor: 240, idEstatus: 1 },
              corriente: { valor: 30, idEstatus: 1 },
              caudal: { valor: 1, idEstatus: 1 },
              idEstatus: 1,    // {1->Normal, 2->Advertencia, 3->Error}
              estatus: 'Operacion Normal',
              fechaRegistro: new Date().toUTCString()
          },
          estado: 1   // {1->Encendido, 2->Apagado, 3->Bloqueado}
      },
      {
          identifica: {
              identificador: 3,
              nombre: 'Represa tres',
              ubicacion: 'En la compuerta de la Represa tres',
              coordenadas: '19.7060° N, 101.1950° W',
              idestatus: 1,
              estatus: 'Operacion Normal',
              potencia:  { nominal: 7.200, minimo: 6.200, maximo: 8.600, um: 'KW' },
              voltaje: { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' },
              corriente: { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' },
              caudal: { nominal: 1, minimo: 0.10, maximo: 1.20, um: 'm3/minuto' },
              fechaRegistro: new Date().toUTCString()
          },
          opera: {
              potencia: { valor: 7.200, idEstatus: 1 },
              voltaje: { valor: 240, idEstatus: 1 },
              corriente: { valor: 30, idEstatus: 1 },
              caudal: { valor: 1, idEstatus: 1 },
              idEstatus: 1,    // {1->Normal, 2->Advertencia, 3->Error}
              estatus: 'Operacion Normal',
              fechaRegistro: new Date().toUTCString()
          },
          estado: 1   // {1->Encendido, 2->Apagado, 3->Bloqueado}
      },
      {
          identifica: {
              identificador: 4,
              nombre: 'Represa cuatro',
              ubicacion: 'En la compuerta de la Represa Cuatro',
              coordenadas: '19.7060° N, 101.1950° W',
              idestatus: 1,
              estatus: 'Operacion Normal',
              potencia:  { nominal: 7.200, minimo: 6.200, maximo: 8.600, um: 'KW' },
              voltaje: { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' },
              corriente: { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' },
              caudal: { nominal: 1, minimo: 0.10, maximo: 1.20, um: 'm3/minuto' },
              fechaRegistro: new Date().toUTCString()
          },
          opera: {
              potencia: { valor: 7.200, idEstatus: 1 },
              voltaje: { valor: 240, idEstatus: 1 },
              corriente: { valor: 30, idEstatus: 1 },
              caudal: { valor: 1, idEstatus: 1 },
              idEstatus: 1,    // {1->Normal, 2->Advertencia, 3->Error}
              estatus: 'Operacion Normal',
              fechaRegistro: new Date().toUTCString()
          },
          estado: 1   // {1->Encendido, 2->Apagado, 3->Bloqueado}
      },
      {
          identifica: {
              identificador: 5,
              nombre: 'Represa Cinco',
              ubicacion: 'En la compuerta de la Represa Cinco',
              coordenadas: '19.7060° N, 101.1950° W',
              idestatus: 1,
              estatus: 'Operacion Normal',
              potencia:  { nominal: 7.200, minimo: 6.200, maximo: 8.600, um: 'KW' },
              voltaje: { nominal: 240, minimo: 230, maximo: 250, um: 'Volts' },
              corriente: { nominal: 30, minimo: 25, maximo: 35, um: 'Amperes' },
              caudal: { nominal: 1, minimo: 0.10, maximo: 1.20, um: 'm3/minuto' },
              fechaRegistro: new Date().toUTCString()
          },
          opera: {
              potencia: { valor: 7.200, idEstatus: 1 },
              voltaje: { valor: 240, idEstatus: 1 },
              corriente: { valor: 30, idEstatus: 1 },
              caudal: { valor: 1, idEstatus: 1 },
              idEstatus: 1,    // {1->Normal, 2->Advertencia, 3->Error}
              estatus: 'Operacion Normal',
              fechaRegistro: new Date().toUTCString()
          },
          estado: 1   // {1->Encendido, 2->Apagado, 3->Bloqueado}
      }
    ]
  }
  /*
  Estos metodos implementan una capa de abstraccion entre el almacen de datos y la UI
  Sella a la data store local o a la API Rest.
  */
  // Data Store local 
  getLista() {
    return Promise.resolve(this.getListaDataStore());
  }

}

export default new DSDispositivos()
