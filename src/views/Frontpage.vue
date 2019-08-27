<template>
  <div class="container home">
    <div
      class="p-4 py-lg-8 bg-grey-dark text-center overlay overlay-op-7"
      id="jumbotron"
      data-bg-img="/photos/jonathan-borba-jWYbjMfDvrI-unsplash.jpg"
    >
      <h2 class="text-uppercase font-weight-bold m-0 text-white">FlowYoRoll</h2>
    </div>
    <h1>Welcome to FlowYoRoll</h1>
    <router-link to="/techniques"><h3>My Techniques</h3></router-link>
    <router-link to="/videos"><h3>My Videos</h3></router-link>
    <router-link to="/flows"><h3>My Flows</h3></router-link>
    <router-link to="/logout">Logout</router-link>
  </div>
</template>

<style>
#jumbotron {
  width: 100%;
  height: auto;
}
</style>

<script>
import axios from "axios";

export default {
  data: function() {
    return {};
  }
};
</script>
