<template>
  <div class="container-fluid">
    <span class="h1">My Techniques</span>
    <span class="float-right">
      Search:
      <input v-model="searchFilter" type="text" />
    </span>
    <div class="d-flex">
      <aside class="flex-row-4 list-group mx-3 my-3 overflow-auto">
        <div
          v-for="technique in filterBy(techniques, searchFilter, 'name')"
          v-on:click="setActive(technique)"
          class="list-group-item"
        >
          <h3>{{ technique.name }}</h3>
        </div>
        <div class="mt-3">
          <button
            type="button"
            class="btn btn-lg btn-primary d-block"
            data-toggle="modal"
            data-target="#new"
          >
            Create Technique
          </button>
        </div>
      </aside>
      <main class="flex-row-8 flex-fill mx-3 my-3 text-center">
        <h1>
          {{ active.name }}
        </h1>
        <p>{{ active.description }}</p>
        <iframe
          v-if="active.videos[0] !== undefined"
          class="d-block mx-auto"
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
          <router-link to="/videos-new">
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
aside {
  min-width: 25%;
}
main {
  max-width: 70%;
  height: 600px;
  border: 1px solid black;
}
</style>

<script>
/* global setupTheme */
import axios from "axios";
import Vue2Filters from "vue2-filters";

export default {
  mixins: [Vue2Filters.mixin],
  data: function() {
    return {
      searchFilter: "",
      techniques: [],
      active: {},
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
    });
  },
  mounted: function() {
    setupTheme();
  },
  methods: {
    createTechnique: function() {
      let params = {
        name: this.name,
        description: this.description,
        source: this.source,
        type_id: this.type,
        priority: this.priority,
        video: this.video
      };
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
          this.video = this.$route.query.url || "";
        })
        .catch(error => {
          this.errors = error.response.data.errors;
        });
    },
    setActive: function(tech) {
      this.active = tech;
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
          this.techniques.splice(index, 1, response.data);
          this.active = response.data;
          this.updatedName = "";
          this.updatedDescription = "";
          this.updatedSource = "";
          this.updatedPriority = 1;
          this.updatedType = 1;
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
