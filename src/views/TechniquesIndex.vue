<template>
  <div class="container">
    <h1>My Techniques</h1>
    <div v-for="technique in techniques">
      <router-link :to="`/techniques/${technique.id}`" class="list-group">
        <h3 class="list-group-item">{{ technique.name }}</h3>
      </router-link>
    </div>
    <div>
      <button
        type="button"
        class="btn btn-primary"
        data-toggle="modal"
        data-target="#new"
      >
        Create Technique
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
    <div id="new" class="modal fade">
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
              <div>
                <label for="name">Name:</label>
                <input v-model="name" type="text" />
              </div>
              <div>
                <label for="description">Description:</label>
                <textarea v-model="description" rows="10" cols="30"></textarea>
              </div>
              <div>
                <label for="source">Source:</label>
                <input v-model="source" type="text" />
              </div>
              <div>
                <label for="type">Type:</label>
                <select v-model="type">
                  <option value="1">Position</option>
                  <option value="2">Transition</option>
                  <option value="3">Submission</option>
                </select>
              </div>
              <div>
                <label for="priority">Priority:</label>
                <input v-model="priority" type="number" min="1" max="5" />
              </div>
              <div>
                <label for="video">Video URL (optional):</label>
                <input v-model="video" type="text" />
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
  </div>
</template>

<style></style>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      techniques: [],
      name: "",
      description: "",
      source: "",
      type: 1,
      priority: "",
      video: this.$route.query.url || "",
      errors: []
    };
  },
  created: function() {
    axios.get("/api/techniques").then(response => {
      console.log(response.data);
      this.techniques = response.data;
    });
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
    }
  }
};
</script>
