<template>
<!-- Button trigger modal -->

<!-- Modal -->
<div class="modal fade" id="detalleDispositivo" tabindex="-1" aria-labelledby="detalleDispositivoLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="detalleDispositivoLabel">{{dispositivo.identifica.nombre}}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
            <p class="card-text">{{ dispositivo.identifica.ubicacion }}, {{ dispositivo.identifica.coordenadas }}.</p>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Valor</th>
                        <th>Nom</th>
                        <th>Min</th>
                        <th>Max</th>
                        <th>Opera</th>
                        <th>Uni</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Potencia</td>
                        <th>{{ dispositivo.identifica.potencia.nominal }}</th>
                        <th>{{ dispositivo.identifica.potencia.minimo }}</th>
                        <th>{{ dispositivo.identifica.potencia.maximo }}</th>
                        <th :class="{'text-success':(dispositivo.opera.potencia.idEstatus===1), 'text-warning':(dispositivo.opera.potencia.idEstatus===2), 'text-danger':(dispositivo.opera.potencia.idEstatus===3)}">{{ dispositivo.opera.potencia.valor }}</th>
                        <th>{{ dispositivo.identifica.potencia.um }}</th>
                    </tr>
                    <tr>
                        <td>Voltaje</td>
                        <th>{{ dispositivo.identifica.voltaje.nominal }}</th>
                        <th>{{ dispositivo.identifica.voltaje.minimo }}</th>
                        <th>{{ dispositivo.identifica.voltaje.maximo }}</th>
                        <th :class="{'text-success':(dispositivo.opera.voltaje.idEstatus===1), 'text-warning':(dispositivo.opera.voltaje.idEstatus===2), 'text-danger':(dispositivo.opera.voltaje.idEstatus===3)}">{{ dispositivo.opera.voltaje.valor }}</th>
                        <th>{{ dispositivo.identifica.voltaje.um }}</th>
                    </tr>
                    <tr>
                        <td>Corriente</td>
                        <th>{{ dispositivo.identifica.corriente.nominal }}</th>
                        <th>{{ dispositivo.identifica.corriente.minimo }}</th>
                        <th>{{ dispositivo.identifica.corriente.maximo }}</th>
                        <th :class="{'text-success':(dispositivo.opera.corriente.idEstatus===1), 'text-warning':(dispositivo.opera.corriente.idEstatus===2), 'text-danger':(dispositivo.opera.corriente.idEstatus===3)}" >{{ dispositivo.opera.corriente.valor }}</th>
                        <th>{{ dispositivo.identifica.corriente.um }}</th>
                    </tr>
                    <tr>
                        <td>Caudal</td>
                        <th >{{ dispositivo.identifica.caudal.nominal }}</th>
                        <th >{{ dispositivo.identifica.caudal.minimo }}</th>
                        <th >{{ dispositivo.identifica.caudal.maximo }}</th>
                        <th :class="{'text-success':(dispositivo.opera.caudal.idEstatus===1), 'text-warning':(dispositivo.opera.caudal.idEstatus===2), 'text-danger':(dispositivo.opera.caudal.idEstatus===3)}" >{{ dispositivo.opera.caudal.valor }}</th>
                        <th >{{ dispositivo.identifica.caudal.um }}</th>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="5" :class="{'text-success':(dispositivo.opera.idEstatus===1), 'text-warning':(dispositivo.opera.idEstatus===2), 'text-danger':(dispositivo.opera.idEstatus===3)}">Estatus: {{ dispositivo.opera.estatus }}</th>
                    </tr>
                </tfoot>
            </table>
            <small class="text-body-secondary">{{dispositivo.opera.fechaRegistro}}</small>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
    name: 'DispositivoDiealogo',
    props: {
        dispositivo: {
            type: Object,
            require: true
        }
    }
}
</script>

<style>
</style>