<template>
  <div class="container">
    <h1>My Videos</h1>
    <div v-for="video in videos">
      <h3>{{ video.title }}</h3>
      <a :href="video.url" target="_blank">Link to video</a>
      <!-- add modal view -->
    </div>
    <div v-if="videos.length === 0">No videos, brah?! Add one here...</div>
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
      videos: []
    };
  },
  created: function() {
    axios.get("/api/videos").then(response => {
      console.log(response.data);
      this.videos = response.data;
    });
  }
};
</script>
