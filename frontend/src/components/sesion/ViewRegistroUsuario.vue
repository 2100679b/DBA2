<template>
<div id="login" class="card bg-trasparent mb-3 card-center login-card" >
    <div class="card-body">
    <div class="text-center">
        <h4 class="card-title" title="Plataforma para monitoreo de Sistemas de Bombeo">Registro</h4>
        <h5 class="card-title">Nuevo usuario</h5>
        <hr />
    </div>
    <div class="row p-1"> 
        <form>
            <div class="form-floating p-1">
                <input type="text" id="nombre" ref="nombre" class="form-control" v-model="usuario.name" v-on:keyup.enter="tfPassword()" aria-describedby="nombreHelp" placeholder="Nombre Completo"/>
                <label id="nombreHelp" class="form-text text-muted">Nombre Completo</label>
            </div>            
            <div class="form-floating p-1">
                <input type="text" id="userName" ref="userName" class="form-control" v-model="usuario.userName" v-on:keyup.enter="" aria-describedby="usuarioNombreHelp" placeholder="Nombre de Usuario"/>
                <label id="usuarioNombreHelp" class="form-text text-muted">Nombre de Usuario</label>
            </div>
            <div class="form-floating p-1">
                <input type="password" id="password" ref="password" class="form-control" v-model="usuario.password" v-on:keyup.enter="" aria-describedby="usuarioPasswordHelp"/>
                <label id="passwordHelp" class="form-text text-muted">Contraseña</label>
            </div>
            <div class="form-floating p-1">
                <input type="password" id="passwordC" ref="password" class="form-control" v-model="usuario.passwordConfirm" v-on:keyup.enter="" aria-describedby="usuarioPasswordHelp"/>
                <label id="passwordCHelp" class="form-text text-muted">Confirma Contraseña</label>
            </div>
            </form>
            </div>
            <div class="row p-2">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="alert alert-danger" role="alert" v-if="alerta.mensaje">
                <strong>¡Error!</strong>
                <p v-html="alerta.mensaje"></p>
                </div>
            </div>
        </div>
        <div class="row p-2">
            <div class="col">
                <button class="btn btn-outline-success" type="button" @click="guardar()"> <i class="bi bi-box-arrow-in-right"></i> Guardar </button>
                <button class="btn btn-outline-secondary" type="button" @click="cancelar()"> <i class="bi bi-box-arrow-in-right"></i> Cancelar </button>
            </div>
        </div>
    </div>
</div>
</template>
      
<script>
import sessionStorage from '@/servicios/SessionStore'
export default  {
    name: 'ViewRegistroUsuario',
    components: {
    },
    data: function() {
        return { 
        usuario: {
            name: '',
            userName: '', 
            password: '',
            passwordConfirm: ''
        },
        alerta: {
            mensaje: '',
        }
        };
    },
    computed: {
    }, 
    methods: {
        guardar () {
            if(sessionStorage.getVerificaUsuario(this.login.userName,this.login.password))
                this.$router.push('/')
            else
                this.alerta.mensaje='Usuario no valido'
        },
        cancelar () {
            this.$router.push('/')
        },        
        limpiarControles () {
            this.alerta.mensaje = ''
            this.$refs.userName.focus()
        }
    }
}
</script>
      
<style scoped>
h1 {
    font-size: 1.75rem;
    color: var(--gray-900);
    font-weight: 500;
    line-height: 100%;
    /*letter-spacing: -0.125rem;*/
    margin: 0;
    font-family: "Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
        "Segoe UI Symbol";
}

h2 {
    font-size: 1.25rem;
    color: var(--gray-900);
    font-weight: 500;
    line-height: 100%;
    margin: 0;
    font-family: "Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
        "Segoe UI Symbol";
}

p {
    margin: 0;
    color: var(--gray-700);
}

.login-card {
    max-width: 400px;
    min-width: 300px;
    width: 100%;
    /*background:  url('@/assets/img/background.png') repeat-x scroll;*/
}

.login-full-width {
    width: 100%;
}
</style>
      