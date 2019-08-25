<template>
  <div>
    <h1>{{ flow.title }}</h1>
    <p>{{ flow.description }}</p>
    <ul>
      <li v-for="technique in flow.techniques">{{ technique.name }}</li>
    </ul>
    <button v-on:click="addTechnique()">Add Technique to Flow</button>
    <button v-on:click="deleteTechnique()">Remove Technique from Flow</button>
    <button v-on:click="deleteFlow()">Delete this Flow</button>
    <button v-on:click="getAll()">Get All</button>
    <div>
      <router-link to="/flows">Back to My Flows</router-link>
      |
      <router-link to="/frontpage">Back to Front Page</router-link>
      |
      <router-link to="/logout">Logout</router-link>
    </div>
    <div v-if="edit">
      Techniques:
      <ul>
        <!-- change to a dropdown? -->
        <li v-for="technique in techniques" v-on:click="submit(technique)">
          {{ technique.name }}
        </li>
      </ul>
    </div>
    <div><button v-on:click="createChart()">Map it out</button></div>
    <div id="cy"></div>
  </div>
</template>

<style>
#cy {
  width: 500px;
  height: 500px;
  display: block;
  border: 1px solid black;
}
</style>

<script>
import axios from "axios";
import cytoscape from "cytoscape";

export default {
  data: function() {
    return {
      flow: {},
      techniques: [],
      edit: false,
      add: true,
      errors: [],
      elements: [],
      style: []
    };
  },
  created: function() {
    axios
      .get(`/api/flows/${this.$route.params.id}`)
      .then(response => {
        console.log(response.data);
        this.flow = response.data;
      })
      .catch(error => (this.errors = error.response.data.errors));
  },
  methods: {
    addTechnique: function() {
      axios.get("/api/techniques").then(response => {
        console.log(response.data);
        this.techniques = response.data;
      });
      this.add = true;
      this.edit = !this.edit;
    },
    deleteTechnique: function() {
      this.techniques = this.flow.techniques;
      this.add = false;
      this.edit = !this.edit;
    },
    submit: function(tech) {
      let params = {
        technique_id: tech.id,
        flow_id: this.$route.params.id
      };
      if (this.add) {
        axios
          .post("/api/flow_techniques", params)
          .then(response => console.log(response.data))
          .catch(error => (this.errors = error.response.data.errors));
        this.flow.techniques.push(tech);
      } else {
        axios
          .delete(`/api/flow_techniques/${tech.id}`)
          .then(response => console.log(response.data));
        let index = this.flow.techniques.indexOf(tech);
        this.flow.techniques.splice(index, 1);
      }
    },
    deleteFlow: function() {
      axios.delete(`api/flows/${this.$route.params.id}`).then(response => {
        console.log(response.data);
        this.$router.push("/flows");
      });
    },
    getAll: function() {
      axios
        .get("/api/flow_techniques?flow_id=10")
        .then(response => console.log(response.data));
    },
    createChart: function() {
      var cy = cytoscape({
        container: document.getElementById("cy"),
        elements: [
          // loop through techniques to get this data
          {
            // node a
            data: {
              id: `${this.flow.techniques[0].id}`,
              name: `${this.flow.techniques[0].name}`
            },
            position: { x: 100, y: 100 },
            locked: true,
            classes: [] // set CSS classes
          },
          {
            // node b
            data: {
              id: `${this.flow.techniques[1].id}`,
              name: `${this.flow.techniques[1].name}`
            },
            position: { x: 200, y: 100 },
            locked: false,
            classes: [] // set CSS classes
          },
          {
            // edge ab
            data: {
              id: `${this.flow.techniques[0].id}${this.flow.techniques[1].id}`,
              source: `${this.flow.techniques[0].id}`,
              target: `${this.flow.techniques[1].id}`,
              name: "first move"
            }
          }
        ],
        style: [
          // the stylesheet for the graph
          {
            selector: "node",
            style: {
              shape: "square",
              width: "50",
              height: "50",
              "background-color": "#600",
              "background-blacken": -0.5,
              label: "data(name)",
              "text-valign": "center"
            }
          },

          {
            selector: "edge",
            style: {
              width: 3,
              "line-color": "#ccc",
              "target-arrow-color": "#ccc",
              "target-arrow-shape": "triangle",
              "curve-style": "straight",
              label: "data(name)"
            }
          }
        ],
        layout: { name: "preset" },
        zoom: 1,
        minZoom: 0.5,
        maxZoom: 5
      });
      cy.on("click", "node", function(evt) {
        var node = evt.target;
        console.log("tapped " + node.id());
      });
      cy.on("click", "edge", function(evt) {
        var edge = evt.target;
        console.log("tapped " + edge.id());
      });
    }
  }
};
</script>
