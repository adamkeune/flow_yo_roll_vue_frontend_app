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
      <router-link to="/videos-new">Add a Video</router-link>
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
        let index = this.videos.indexOf(video);
        this.videos.splice(index, 1);
        // this.$router.push("/videos");
      });
    }
  }
};
</script>
