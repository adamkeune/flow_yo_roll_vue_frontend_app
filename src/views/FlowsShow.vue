<template>
  <div>
    <h1>{{ flow.title }}</h1>
    <p>{{ flow.description }}</p>
    <ul>
      <li v-for="technique in flow.techniques">{{ technique.name }}</li>
    </ul>
    <button v-on:click="addTechnique()">Add Technique to Flow</button>
    <button v-on:click="deleteTechnique()">Remove Technique from Flow</button>
    <button v-on:click="deleteFlow()">Delete this Flow</button>
    <div>
      <router-link to="/flows">Back to My Flows</router-link>
      |
      <router-link to="/frontpage">Back to Front Page</router-link>
      |
      <router-link to="/logout">Logout</router-link>
    </div>
    <div v-if="edit">
      Techniques:
      <ul>
        <li v-for="technique in techniques" v-on:click="submit(technique)">
          {{ technique.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      flow: {},
      techniques: [],
      edit: false,
      add: true,
      errors: []
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
  },
  methods: {
    addTechnique: function() {
      axios.get("/api/techniques").then(response => {
        console.log(response.data);
        this.techniques = response.data;
      });
      this.add = true;
      this.edit = !this.edit;
    },
    deleteTechnique: function() {
      this.techniques = this.flow.techniques;
      this.add = false;
      this.edit = !this.edit;
    },
    submit: function(tech) {
      let params = {
        technique_id: tech.id,
        flow_id: this.$route.params.id
      };
      if (this.add) {
        axios
          .post("/api/flow_techniques", params)
          .then(response => console.log(response.data))
          .catch(error => (this.errors = error.response.data.errors));
        this.flow.techniques.push(tech);
      } else {
        axios
          .delete(`/api/flow_techniques/${tech.id}`)
          .then(response => console.log(response.data));
        let index = this.flow.techniques.indexOf(tech);
        this.flow.techniques.splice(index, 1);
      }
    },
    deleteFlow: function() {
      axios.delete(`api/flows/${this.$route.params.id}`).then(response => {
        console.log(response.data);
        this.$router.push("/flows");
      });
    }
  }
};
</script>
