<template>
  <div class="centrado">
    <img alt="Vue logo" src="./assets/logo.png" />
  </div>
  <Persona />
</template>

<script>
import Persona from "./components/Persona.vue";
export default {
  name: "App",
  components: {
    Persona,
  },
};
</script>

<style>
.centrado {
  text-align: center;
}
</style>
