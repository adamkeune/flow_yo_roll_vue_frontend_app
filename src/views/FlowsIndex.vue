<template>
  <div id="flows-index" class="container">
    <h1 class="mx-auto text-center text-white">My Flows</h1>
    <div
      v-for="flow in flows"
      class="w-30 mx-auto text-center overflow-auto shadow"
    >
      <router-link :to="`/flows/${flow.id}`" class="list-group mx-auto">
        <h3 class="list-group-item text-teal">{{ flow.title }}</h3>
      </router-link>
    </div>

    <div class="mt-3">
      <button
        type="button"
        class="btn btn-teal d-block mx-auto"
        data-toggle="modal"
        data-target="#new"
      >
        Add Flow
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
            <h1>Add Flow</h1>
            <ul>
              <li v-for="error in errors" class="text-danger">{{ error }}</li>
            </ul>
            <form>
              <div class="form-group">
                <label for="title">Title:</label>
                <input class="form-control" v-model="title" type="text" />
              </div>
              <div class="form-group">
                <label for="url">Description:</label>
                <input class="form-control" v-model="description" type="text" />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-teal" data-dismiss="modal">
              Cancel
            </button>
            <button
              v-on:click="addFlow()"
              type="button"
              class="btn btn-teal"
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
#flows-index {
  height: 650px;
}
</style>

<script>
/* global setupTheme */
import axios from "axios";

export default {
  data: function() {
    return {
      flows: [],
      title: "",
      description: "",
      errors: []
    };
  },
  created: function() {
    axios
      .get("/api/flows")
      .then(response => {
        console.log(response.data);
        this.flows = response.data;
      })
      .catch(error => (this.errors = error.response.data.errors));
  },
  mounted: function() {
    setupTheme();
  },
  methods: {
    addFlow: function() {
      let params = {
        title: this.title,
        description: this.description
      };
      axios
        .post("/api/flows", params)
        .then(response => {
          console.log(response.data);
          this.flows.push(response.data);
          this.title = "";
          this.description = "";
        })
        .catch(error => (this.errors = error.response.data.errors));
    }
  }
};
</script>
