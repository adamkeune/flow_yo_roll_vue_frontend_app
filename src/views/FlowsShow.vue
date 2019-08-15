<template>
  <div>
    <h1>{{ flow.title }}</h1>
    <ul>
      <li v-for="technique in flow.techniques">{{ technique.name }}</li>
    </ul>
    <button v-on:click="addTechnique()">Add Technique to Flow</button>
    <div>
      <router-link to="/flows">Back to My Flows</router-link>
      |
      <router-link to="/frontpage">Back to Front Page</router-link>
      |
      <router-link to="/logout">Logout</router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      flow: {}
    };
  },
  created: function() {
    axios
      .get(`/api/flows/${this.$route.params.id}`)
      .then(response => {
        console.log(response.data);
        this.flow = response.data;
      })
      .catch(error => (this.errors = error.response.data.errors));
  }
};
</script>
