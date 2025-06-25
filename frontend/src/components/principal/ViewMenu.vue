<template>
<div class="container-fluid">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Monitor</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarScroll">
                <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">
                    <li class="nav-item">
                        <router-link class="nav-link active" aria-current="page" to="/menu/dispositivos" ><i class="bi bi-box-arrow-left"></i> Dispositivos</router-link>
                    </li>
                    <li class="nav-item">
                      <router-link class="nav-link" aria-current="page" to="/menu/dispositivos/agregar" ><i class="bi bi-box-arrow-left"></i> Agregar Dispositivo</router-link>
                    </li>
                    <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Link
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">Opcion1</a></li>
                        <li><a class="dropdown-item" href="#">Opcion2</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#">SOpcion3</a></li>
                    </ul>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" aria-current="page" to="/login" ><i class="bi bi-box-arrow-left"></i> Salir</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="col py-0 vh-100 overflow-scroll" >
        <router-view />
    </div>
</div>
</template>
<script>
export default {
    name: 'Menu',
    data() {
        return {}
    },
    methods: {
        
    }

}
</script>
<style>
</style>