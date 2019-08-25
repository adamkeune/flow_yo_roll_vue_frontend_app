<template>
  <div class="container">
    <h1>{{ technique.name }}</h1>
    <p>{{ technique.description }}</p>
    <iframe
      v-if="technique.videos[0] !== undefined"
      width="560"
      height="315"
      :src="
        `https://www.youtube.com/embed/${
          technique.videos[0].url.split('v=')[1]
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
    <div>
      <span>Priority: {{ technique.priority }}</span>
      |
      <span>Source: {{ technique.source }}</span>
      |
      <span>Type: {{ technique.type.name }}</span>
    </div>
    <div>
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

    <router-link to="/techniques">
      <button type="button" class="btn btn-primary">
        Back to Index
      </button>
    </router-link>
    |
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
              <div>
                <label for="name">Name:</label>
                <input v-model="updatedName" type="text" />
              </div>
              <div>
                <label for="description">Description:</label>
                <textarea
                  v-model="updatedDescription"
                  rows="10"
                  cols="30"
                ></textarea>
              </div>
              <div>
                <label for="source">Source:</label>
                <input v-model="updatedSource" type="text" />
              </div>
              <div>
                <label for="type">Type:</label>
                <select v-model="updatedType">
                  <option value="1">Position</option>
                  <option value="2">Transition</option>
                  <option value="3">Submission</option>
                </select>
              </div>
              <div>
                <label for="priority">Priority:</label>
                <input
                  v-model="updatedPriority"
                  type="number"
                  min="1"
                  max="5"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
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

<style></style>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      technique: {
        videos: [{ url: "" }],
        type: {},
        practices: [{ formatted: {} }]
      },
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
    axios.get(`api/techniques/${this.$route.params.id}`).then(response => {
      console.log(response.data);
      this.technique = response.data;
      let last = this.technique.practices.length - 1;
      this.lastPractice = this.technique.practices[last].friendly_created_at;
    });
  },
  methods: {
    updateTechnique: function() {
      let params = {
        name: this.updatedName,
        description: this.description,
        priority: this.updatedPriority,
        source: this.updatedSource,
        type_id: this.updatedType
      };
      axios
        .patch(`/api/techniques/${this.$route.params.id}`, params)
        .then(response => {
          console.log(response.data);
          this.technique = response.data;
          this.updatedName = "";
          this.updatedDescription = "";
          this.updatedSource = "";
          this.updatedPriority = 1;
          this.updatedType = 1;
        })
        .catch(error => (this.errors = error.response.data.errors));
    },
    deleteTechnique: function() {
      axios.delete(`api/techniques/${this.$route.params.id}`).then(response => {
        console.log(response.data);
        this.$router.push("/techniques");
      });
    },
    createPractice: function() {
      let params = {
        technique_id: this.technique.id
      };
      axios
        .post("api/practices", params)
        .then(response => {
          console.log(response.data);
          this.lastPractice = response.data.friendly_created_at;
        })
        .catch(error => (this.errors = error.response.data.errors));
    }
  }
};
</script>
