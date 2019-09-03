<template>
  <div class="container-fluid">
    <div class="clearfix">
      <span class="h1 text-primary">My Techniques</span>
      <span class="float-right text-white">
        Search:
        <input class="rounded" v-model="searchFilter" type="text" size="40" />
      </span>
      <div class="clearfix mt-3">
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#new"
        >
          Create Technique
        </button>
        <!-- change to dropdown for sortAttribute -->
        <div class="float-right">
          <button
            v-on:click="searchAttribute = 'name'"
            class="btn btn-primary ml-2"
          >
            Sort by name
          </button>
          <button
            v-on:click="searchAttribute = 'type'"
            class="btn btn-primary ml-2"
          >
            Sort by type
          </button>
          <button
            v-on:click="searchAttribute = 'priority'"
            class="btn btn-primary ml-2"
          >
            Sort by priority
          </button>
        </div>
      </div>
    </div>
    <div id="box" class="d-flex">
      <aside
        class="flex-row-4 list-group mx-3 my-3 overflow-auto w-30 h-95 shadow"
        is="transition-group"
        appear
        enter-active-class="animated fadeInLeftBig"
        leave-active-class="animated fadeOutLeftBig"
      >
        <div
          v-for="technique in filterBy(
            techniques,
            searchFilter,
            searchAttribute
          )"
          v-on:click="setActive(technique)"
          class="list-group-item"
          :class="{ active: technique === active }"
          v-bind:key="technique.id"
        >
          <h3>{{ technique.name }}</h3>
        </div>
      </aside>
      <main
        id="active-box"
        class="flex-row-8 flex-fill mx-3 my-3 text-center h-95 w-70 bg-grey"
      >
        <h1>
          {{ active.name }}
        </h1>
        <p>{{ active.description }}</p>
        <iframe
          v-if="active.videos[0] !== undefined"
          class="d-block mx-auto shadow"
          width="560"
          height="315"
          :src="
            `https://www.youtube.com/embed/${
              active.videos[0].url.split('v=')[1]
            }`
          "
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <div v-else="">
          <router-link :to="`/videos?technique_id=${this.active.id}`">
            Link a video to this technique...
          </router-link>
        </div>
        <div class="mt-2">
          <span>Priority: {{ active.priority }}</span>
          |
          <span>Source: {{ active.source }}</span>
          |
          <span>Type: {{ active.type.name }}</span>
        </div>
        <div class="mt-2">
          <span>Last practiced:</span>
          <span>{{ lastPractice }}</span>
          |
          <button
            v-on:click="createPractice()"
            type="button"
            class="btn btn-secondary"
          >
            Add Practice
          </button>
        </div>

        <div class="mt-3">
          <button
            type="button"
            class="btn btn-primary"
            data-toggle="modal"
            data-target="#edit"
          >
            Update Technique
          </button>
          |
          <button
            v-on:click="deleteTechnique()"
            type="button"
            class="btn btn-primary"
          >
            Delete Technique
          </button>
        </div>
      </main>
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
            <h1>Add a Technique</h1>
            <ul>
              <li class="text-danger" v-for="error in errors">{{ error }}</li>
            </ul>
            <form>
              <div class="form-group">
                <label for="name">Name:</label>
                <input class="form-control" v-model="name" type="text" />
              </div>
              <div class="form-group">
                <label for="description">Description:</label>
                <textarea
                  class="form-control"
                  v-model="description"
                  rows="10"
                  cols="30"
                ></textarea>
              </div>
              <div class="form-group">
                <label for="source">Source:</label>
                <input class="form-control" v-model="source" type="text" />
              </div>
              <div class="form-group">
                <label for="type">Type:</label>
                <select class="form-control" v-model="type">
                  <option value="1">Position</option>
                  <option value="2">Transition</option>
                  <option value="3">Submission</option>
                </select>
              </div>
              <div class="form-group">
                <label for="priority">Priority:</label>
                <input
                  class="form-control"
                  v-model="priority"
                  type="number"
                  min="1"
                  max="5"
                />
              </div>
              <div class="form-group">
                <label for="video">Video URL (optional):</label>
                <input class="form-control" v-model="video" type="text" />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">
              Cancel
            </button>
            <button
              v-on:click="createTechnique()"
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
    <div id="edit" class="modal fade">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Edit Technique</h4>
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
            <ul>
              <li class="text-danger" v-for="error in errors">{{ error }}</li>
            </ul>
            <form>
              <div class="form-group">
                <label for="name">Name:</label>
                <input class="form-control" v-model="updatedName" type="text" />
              </div>
              <div class="form-group">
                <label for="description">Description:</label>
                <textarea
                  class="form-control"
                  v-model="updatedDescription"
                  rows="10"
                  cols="30"
                ></textarea>
              </div>
              <div class="form-group">
                <label for="source">Source:</label>
                <input
                  class="form-control"
                  v-model="updatedSource"
                  type="text"
                />
              </div>
              <div class="form-group">
                <label for="type">Type:</label>
                <select class="form-control" v-model="updatedType">
                  <option value="1">Position</option>
                  <option value="2">Transition</option>
                  <option value="3">Submission</option>
                </select>
              </div>
              <div class="form-group">
                <label for="priority">Priority:</label>
                <input
                  class="form-control"
                  v-model="updatedPriority"
                  type="number"
                  min="1"
                  max="5"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">
              Cancel
            </button>
            <button
              v-on:click="updateTechnique()"
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
#box {
  height: 600px;
}

#active-box {
  border: 1px black solid;
}
</style>

<script>
/* global setupTheme, $ */
import axios from "axios";
import Vue2Filters from "vue2-filters";

export default {
  mixins: [Vue2Filters.mixin],
  data: function() {
    return {
      searchFilter: "",
      searchAttribute: "name",
      techniques: [],
      active: { videos: [], type: {} },
      name: "",
      description: "",
      source: "",
      type: 1,
      priority: "",
      video: this.$route.query.url || "",
      updatedName: "",
      updatedDescription: "",
      updatedSource: "",
      updatedPriority: 1,
      updatedType: 1,
      lastPractice: "",
      errors: []
    };
  },
  created: function() {
    axios.get("/api/techniques").then(response => {
      console.log(response.data);
      this.techniques = response.data;
      this.active = this.techniques[0];
      let last = this.active.practices.length - 1;
      this.lastPractice = this.active.practices[last].friendly_created_at;
      this.updatedName = this.active.name;
      this.updatedDescription = this.active.description;
      this.updatedSource = this.active.source;
      this.updatedPriority = this.active.priority;
      this.updatedType = this.active.type.id;
    });
  },
  mounted: function() {
    setupTheme();
    if (this.$route.query.url) {
      // open modal
      $("#new").modal("toggle");
    }
  },
  methods: {
    createTechnique: function() {
      let params = {
        name: this.name,
        description: this.description,
        source: this.source,
        type_id: this.type,
        priority: this.priority
      };

      if (this.video) {
        params["video"] = this.video;
      }

      axios
        .post("/api/techniques", params)
        .then(response => {
          console.log(response.data);
          this.techniques.push(response.data);
          this.name = "";
          this.description = "";
          this.source = "";
          this.type = 1;
          this.priority = "";
          this.video = "";
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    },
    setActive: function(tech) {
      this.active = tech;
      if (this.active.practices.length > 0) {
        let last = this.active.practices.length - 1;
        this.lastPractice = this.active.practices[last].friendly_created_at;
      } else {
        this.lastPractice = "never";
      }
      this.updatedName = this.active.name;
      this.updatedDescription = this.active.description;
      this.updatedSource = this.active.source;
      this.updatedPriority = this.active.priority;
      this.updatedType = this.active.type.id;
    },
    createPractice: function() {
      let params = {
        technique_id: this.active.id
      };
      axios
        .post("api/practices", params)
        .then(response => {
          console.log(response.data);
          this.lastPractice = response.data.friendly_created_at;
        })
        .catch(error => (this.errors = error.response.data.errors));
    },
    updateTechnique: function() {
      let params = {
        name: this.updatedName,
        description: this.updatedDescription,
        priority: this.updatedPriority,
        source: this.updatedSource,
        type_id: this.updatedType
      };
      axios
        .patch(`/api/techniques/${this.active.id}`, params)
        .then(response => {
          console.log(response.data);
          let index = this.techniques.indexOf(this.active);
          this.active = response.data;
          // setActive()?
          this.techniques.splice(index, 1, response.data);
          this.updatedName = this.active.name;
          this.updatedDescription = this.active.description;
          this.updatedSource = this.active.source;
          this.updatedPriority = this.active.priority;
          this.updatedType = this.active.type.id;
        })
        .catch(error => (this.errors = error.response.data.errors));
    },
    deleteTechnique: function() {
      axios.delete(`api/techniques/${this.active.id}`).then(response => {
        console.log(response.data);
        let index = this.techniques.indexOf(this.active);
        this.techniques.splice(index, 1);
        this.active = this.techniques[0];
      });
    }
  }
};
</script>
