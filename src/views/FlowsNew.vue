<template>
  <div>
    <ul>
      <li class="text-danger" v-for="error in errors">{{ error }}</li>
    </ul>
    <form v-on:submit.prevent="addFlow()">
      <div>
        <label for="name">Title:</label>
        <input v-model="title" type="text" />
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea v-model="description" rows="10" cols="30"></textarea>
      </div>
      <input type="submit" value="Create" />
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      title: "",
      description: "",
      errors: []
    };
  },
  methods: {
    addFlow: function() {
      let params = {
        title: this.title,
        description: this.description
      };
      axios
        .post("/api/flows", params)
        .then(response => {
          console.log(response.data);
          this.$router.push("/flows");
        })
        .catch(error => (this.errors = error.response.data.errors));
    }
  }
};
</script>
