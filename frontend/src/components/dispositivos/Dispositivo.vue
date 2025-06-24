<template>
<div class="col">
    <div class="card">
        
        <div class="card-body">
            <h5 class="card-title">{{dispositivo.identifica.nombre}}</h5>
            <p class="card-text">{{ dispositivo.identifica.ubicacion }}, {{ dispositivo.identifica.coordenadas }}.</p>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Valor</th>
                        <th>Opera</th>
                        <th>Uni</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Potencia</td>
                        <th :class="{'text-success':(dispositivo.opera.potencia.idEstatus===1), 'text-warning':(dispositivo.opera.potencia.idEstatus===2), 'text-danger':(dispositivo.opera.potencia.idEstatus===3)}">{{ dispositivo.opera.potencia.valor }}</th>
                        <th>{{ dispositivo.identifica.potencia.um }}</th>
                    </tr>
                    <tr>
                        <td>Voltaje</td>
                        <th :class="{'text-success':(dispositivo.opera.voltaje.idEstatus===1), 'text-warning':(dispositivo.opera.voltaje.idEstatus===2), 'text-danger':(dispositivo.opera.voltaje.idEstatus===3)}">{{ dispositivo.opera.voltaje.valor }}</th>
                        <th>{{ dispositivo.identifica.voltaje.um }}</th>
                    </tr>
                    <tr>
                        <td>Corriente</td>
                        <th :class="{'text-success':(dispositivo.opera.corriente.idEstatus===1), 'text-warning':(dispositivo.opera.corriente.idEstatus===2), 'text-danger':(dispositivo.opera.corriente.idEstatus===3)}" >{{ dispositivo.opera.corriente.valor }}</th>
                        <th>{{ dispositivo.identifica.corriente.um }}</th>
                    </tr>
                    <tr>
                        <td>Caudal</td>
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
        </div>
        <div class="card-footer">
            <small class="text-body-secondary">{{dispositivo.opera.fechaRegistro}}</small>
            <button type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#detalleDispositivo" @click="setDispositivo">
            Ver Detalle
            </button>
        </div>
    </div>
</div>
</template>
<script>
// 
export default {
    name: 'Dispositivo',
    props: {
        dispositivo: {
            type: Object,
            require: true
        }
    },
    data() {
        return {
        }
    },
    computed: {
        setDispositivo() {
            this.$emit('setDispositivo',this.dispositivo)
        }
        // Retorna {1 -> 'Operación Normal', 2 -> 'Alerta', 3 -> 'Problemas'}
        /*
        estatusCaudal() {
            let reply
            if(this.opera.caudal < this.identifica.caudal.minimo || this.opera.caudal > this.identifica.caudal.maximo)
                reply = 3
            else if(this.opera.caudal < (this.identifica.caudal.minimo + 3) || this.opera.caudal > (this.identifica.caudal.maximo-3))
                reply = 2
            else 
                reply = 1
            return reply
        }
        */
    }
}
</script>
