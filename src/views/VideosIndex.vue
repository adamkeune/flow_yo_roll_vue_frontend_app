<template>
  <div class="container">
    <h1>My Videos</h1>
    <div v-for="video in videos" class="list-group">
      <h3 class="list-group-item">{{ video.title }}</h3>
      <a :href="video.url" target="_blank" class="list-group-item">
        Link to video
      </a>
      <div v-if="!video.technique">
        <router-link
          :to="`/techniques-new?url=${video.url}`"
          class="list-group-item"
        >
          <!-- change this to reflect modal changes -->
          Add this technique to your list...
        </router-link>
      </div>
      <button
        v-on:click="deleteVideo(video)"
        type="button"
        class="btn btn-primary"
      >
        Delete Video
      </button>
      <!-- add modal view -->
    </div>
    <div v-if="videos.length === 0">No videos, brah?! Add one here...</div>

    <div>
      <router-link to="/videos-new">
        <button type="button" class="btn btn-primary">Add a Video</button>
      </router-link>
      |
      <router-link to="/frontpage">
        <button type="button" class="btn btn-primary">
          Back to Front Page
        </button>
      </router-link>
      |
      <router-link to="/logout">
        <button type="button" class="btn btn-primary">Logout</button>
      </router-link>
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
