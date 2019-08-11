<template>
  <div class="container">
    <h1>Add a Technique</h1>
    <ul>
      <li class="text-danger" v-for="error in errors">{{ error }}</li>
    </ul>
    <form v-on:submit.prevent="createTechnique()">
      <div>
        <label for="name">Name:</label>
        <input v-model="name" type="text" />
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea v-model="description" rows="10" cols="30"></textarea>
      </div>
      <div>
        <label for="source">Source:</label>
        <input v-model="source" type="text" />
      </div>
      <div>
        <label for="type">Type:</label>
        <select v-model="type">
          <option value="1">Position</option>
          <option value="2">Transition</option>
          <option value="3">Submission</option>
        </select>
      </div>
      <div>
        <label for="priority">Priority:</label>
        <input v-model="priority" type="number" min="1" max="5" />
      </div>
      <div>
        <label for="video">Video URL (optional):</label>
        <input v-model="video" type="text" />
      </div>
      <input type="submit" value="Create" />
    </form>
    <router-link to="/techniques">Cancel</router-link>
  </div>
</template>

<style></style>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      name: "",
      description: "",
      source: "",
      type: 1,
      priority: "",
      video: this.$route.query.url || "",
      errors: []
    };
  },
  methods: {
    createTechnique: function() {
      let params = {
        name: this.name,
        description: this.description,
        source: this.source,
        type_id: this.type,
        priority: this.priority,
        video: this.video
      };
      axios
        .post("/api/techniques", params)
        .then(response => {
          console.log(response.data);
          this.$router.push("/techniques");
        })
        .catch(error => {
          this.errors = error.response.data.errors; // not catching errors???
        });
    }
  }
};
</script>
