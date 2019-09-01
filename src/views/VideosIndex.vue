<template>
  <div class="container-fluid">
    <span class="h1">My Videos</span>
    <span class="float-right">
      Search:
      <input v-model="searchFilter" type="text" />
    </span>
    <div class="d-flex">
      <div
        v-for="video in filterBy(videos, searchFilter, 'title')"
        class="card flex-row-3"
      >
        <h3 class="card-header">{{ video.title }}</h3>
        <div class="card-body">
          <a class="btn d-block" :href="video.url" target="_blank">
            Link to video
          </a>

          <div v-if="!video.technique">
            <button class="btn d-block mx-auto">
              <router-link :to="`/techniques?url=${video.url}`">
                <!-- change this to reflect modal changes -->
                Add this technique
              </router-link>
            </button>
          </div>
          <button class="btn d-block mx-auto" v-on:click="deleteVideo(video)">
            Delete Video
          </button>
        </div>
      </div>
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
            <h4 class="modal-title">New Video</h4>
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

<style></style>

<script>
/* global setupTheme, $ */
import axios from "axios";
import Vue2Filters from "vue2-filters";

export default {
  mixins: [Vue2Filters.mixin],
  data: function() {
    return {
      searchFilter: "",
      videos: [],
      title: "",
      url: "",
      technique_id: null,
      errors: []
    };
  },
  created: function() {
    axios.get("/api/videos").then(response => {
      console.log(response.data);
      this.technique_id = this.$route.query.technique_id || "";
      this.videos = response.data;
    });
  },
  mounted: function() {
    setupTheme();
    if (this.$route.query.technique_id) {
      // open modal
      $("#new").modal("toggle");
    }
  },
  methods: {
    createVideo: function() {
      let params = {
        title: this.title,
        url: this.url,
        technique_id: this.technique_id
      };

      axios
        .post("api/videos", params)
        .then(response => {
          console.log(response.data);
          this.title = "";
          this.url = "";
          this.technique_id = "";
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
