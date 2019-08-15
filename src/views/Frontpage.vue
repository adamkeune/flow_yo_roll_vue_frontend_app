<template>
  <div class="container home">
    <h1>Welcome to FlowYoRoll</h1>
    <router-link to="/techniques"><h3>My Techniques</h3></router-link>
    <router-link to="/videos"><h3>My Videos</h3></router-link>
    <router-link to="/flows"><h3>My Flows</h3></router-link>
    <router-link to="/logout">Logout</router-link>
  </div>
</template>

<style></style>

<script>
import axios from "axios";

export default {
  data: function() {
    return {};
  }
};
</script>
