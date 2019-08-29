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
          :to="`/techniques?url=${video.url}`"
          class="list-group-item"
        >
          <!-- change this to reflect modal changes -->
          Add this technique to your list...
        </router-link>
      </div>
      <p v-on:click="deleteVideo(video)" class="list-group-item">
        Delete Video
      </p>
    </div>
    <div v-if="videos.length === 0">No videos, brah?! Add one here...</div>

    <div class="mt-3">
      <button
        type="button"
        class="btn btn-primary"
        data-toggle="modal"
        data-target="#new"
      >
        Add Video
      </button>
    </div>

    <div
      id="new"
      class="modal fade"
      data-modal-animate-in="slideInLeft"
      data-modal-animate-out="slideOutLeft"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">New Technique</h4>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h1>Add Video</h1>
            <ul>
              <li v-for="error in errors" class="text-danger">{{ error }}</li>
            </ul>
            <form>
              <div class="form-group">
                <label for="title">Title:</label>
                <input class="form-control" v-model="title" type="text" />
              </div>
              <div class="form-group">
                <label for="url">Url:</label>
                <input class="form-control" v-model="url" type="text" />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">
              Cancel
            </button>
            <button
              v-on:click="createVideo()"
              type="button"
              class="btn btn-primary"
              data-dismiss="modal"
            >
              Save changes
            </button>
          </div>
        </div>
        <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
    </div>
    <!-- /.modal -->
  </div>
</template>

<style>
p {
  color: #55a798;
}

p.hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>

<script>
/* global setupTheme */
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
  mounted: function() {
    setupTheme();
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
          this.videos.push(response.data);
        })
        .catch(error => (this.errors = error.response.data.errors));
    },
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
