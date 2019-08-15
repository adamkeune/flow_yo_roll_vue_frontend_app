<template>
  <div>
    <h1>My Flows</h1>
    <div v-for="flow in flows">
      <router-link :to="`/flows/${flow.id}`">
        <h3>{{ flow.title }}</h3>
      </router-link>
    </div>

    <div>
      <button v-on:click="addFlow()">Add New Flow</button>
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
      flows: [],
      errors: []
    };
  },
  created: function() {
    axios
      .get("/api/flows")
      .then(response => {
        console.log(response.data);
        this.flows = response.data;
      })
      .catch(error => (this.errors = error.response.data.errors));
  }
};
</script>
