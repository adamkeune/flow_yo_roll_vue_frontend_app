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
      <button
        type="button"
        class="btn btn-primary"
        data-toggle="modal"
        data-target="#new"
      >
        Add Video
      </button>
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
              <div>
                <label for="title">Title:</label>
                <input v-model="title" type="text" />
              </div>
              <div>
                <label for="url">Url:</label>
                <input v-model="url" type="text" />
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
