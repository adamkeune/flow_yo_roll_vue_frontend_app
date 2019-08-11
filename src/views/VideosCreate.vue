<template>
  <div>
    <h3>Add Video</h3>
    <ul>
      <li v-for="error in errors" class="text-danger">{{ error }}</li>
    </ul>
    <form v-on:submit.prevent="createVideo()">
      <div>
        <label for="title">Title:</label>
        <input v-model="title" type="text" />
      </div>
      <div>
        <label for="url">Url:</label>
        <input v-model="url" type="text" />
      </div>
      <input type="submit" value="Submit" />
    </form>
    <router-link to="/videos">Cancel</router-link>
  </div>
</template>

<style></style>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      title: "",
      url: "",
      errors: []
    };
  },
  methods: {
    createVideo: function() {
      let params = {
        title: this.title,
        url: this.url
      };
      axios
        .post("api/videos", params)
        .then(response => {
          console.log(response.data);
          this.title = "";
          this.url = "";
          this.$router.push("/videos");
        })
        .catch(error => (this.errors = error.response.data.errors));
    }
  }
};
</script>
