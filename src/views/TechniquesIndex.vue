<template>
  <div class="container">
    <h1>My Techniques</h1>
    <div v-for="technique in techniques">
      <h3>{{ technique.name }}</h3>
      <p>{{ technique.description }}</p>
      <!-- change to button for modal show view -->
    </div>
    <div>
      <router-link to="/techniques-new">Create New Technique</router-link>
      |
      <router-link to="/frontpage">Back to Front Page</router-link>
      |
      <router-link to="/logout">Logout</router-link>
    </div>
  </div>
</template>

<style></style>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      techniques: []
    };
  },
  created: function() {
    axios.get("/api/techniques").then(response => {
      console.log(response.data);
      this.techniques = response.data;
    });
  }
};
</script>
