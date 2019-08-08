<template>
  <div class="container">
    <h1>My Videos</h1>
    <div v-for="video in videos">
      <h3>{{ video.title }}</h3>
      <a :href="video.url" target="_blank">Link to video</a>
      <div v-if="!video.technique">
        <router-link :to="`/techniques-new?url=${video.url}`">
          Add this technique to your list...
        </router-link>
      </div>
      <button v-on:click="deleteVideo(video)">Delete Video</button>
      <!-- add modal view -->
    </div>
    <div v-if="videos.length === 0">No videos, brah?! Add one here...</div>
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
    </div>
    <div>
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
      videos: [],
      title: "",
      url: "",
      errors: []
    };
  },
  created: function() {
    axios.get("/api/videos").then(response => {
      console.log(response.data);
      this.videos = response.data;
    });
  },
  methods: {
    deleteVideo: function(video) {
      axios.delete(`api/videos/${video.id}`).then(response => {
        console.log(response.data);
        this.$router.push("/videos");
      });
    },
    createVideo: function() {
      let params = {
        title: this.title,
        url: this.url
      };
      axios
        .post("api/videos", params)
        .then(response => {
          console.log(response.data);
          this.videos.push(response.data);
          this.title = "";
          this.url = "";
        })
        .catch(error => (this.errors = error.response.data.errors));
    }
  }
};
</script>
