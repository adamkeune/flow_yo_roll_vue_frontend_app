<template>
  <div class="container">
    <h1>My Flows</h1>
    <div v-for="flow in flows">
      <router-link :to="`/flows/${flow.id}`" class="list-group">
        <h3 class="list-group-item">{{ flow.title }}</h3>
      </router-link>
    </div>

    <div class="mt-3">
      <button
        type="button"
        class="btn btn-primary d-block"
        data-toggle="modal"
        data-target="#new"
      >
        Add Flow
      </button>
    </div>
    <div
      id="new"
      class="modal"
      data-modal-animate-in="slideInLeft"
      data-modal-animate-out="slideOutLeft"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">New Flow</h4>
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
            <h1>Add a Flow</h1>
            <ul>
              <li class="text-danger" v-for="error in errors">{{ error }}</li>
            </ul>
            <form>
              <div class="form-group">
                <label for="name">Title:</label>
                <input class="form-control" v-model="title" type="text" />
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
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">
              Cancel
            </button>
            <button
              v-on:click="addFlow()"
              type="button"
              class="btn btn-primary"
              data-dismiss="modal"
            >
              Add Flow
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
