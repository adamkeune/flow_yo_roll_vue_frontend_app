<template>
  <div class="container">
    <h1>{{ flow.title }}</h1>
    <p>{{ flow.description }}</p>
    <ul>
      <li v-for="technique in flow_techniques">{{ technique.name }}</li>
    </ul>
    <button v-on:click="addPosition()">Add Position/Submission to Flow</button>
    <button v-on:click="addTransition()">Add Transition to Flow</button>
    <button v-on:click="deleteTechnique()">Remove Technique from Flow</button>
    <button v-on:click="deleteFlow()">Delete this Flow</button>
    <div v-if="edit">
      Techniques:
      <!-- <select v-if="this.action === 'addPosition'">
        <option v-for="position in positions" :value="position">
          {{ position.name }}
        </option>
      </select> -->
      <ul v-if="this.action === 'addPosition'">
        <li v-for="position in positions" v-on:click="submit(position)">
          <button>{{ position.name }}</button>
        </li>
      </ul>
      <ul v-else-if="this.action === 'addTransition'">
        <li v-for="transition in transitions" v-on:click="chosen = transition">
          {{ transition.name }}
          <div v-if="chosen === transition">
            <label for="source">Source:</label>
            <select v-model="source">
              <option v-for="position in positions" :value="position">
                {{ position.name }}
              </option>
            </select>
            <label for="target">Target:</label>
            <select v-model="target">
              <option v-for="position in positions" :value="position">
                {{ position.name }}
              </option>
            </select>
            <button v-on:click="submit(transition)">Submit</button>
          </div>
        </li>
      </ul>
      <ul v-else-if="this.action === 'delete'">
        <li v-for="technique in flow_techniques" v-on:click="submit(technique)">
          <button>{{ technique.name }}</button>
        </li>
      </ul>
    </div>
    <div><button v-on:click="createChart()">Map it out</button></div>
    <div id="cy"></div>
    <div class="mt-3">
      <router-link to="/flows">Back to My Flows</router-link>
      |
      <router-link to="/frontpage">Back to Front Page</router-link>
      |
      <router-link to="/logout">Logout</router-link>
    </div>
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
/* global setupTheme */

import axios from "axios";
import cytoscape from "cytoscape";

export default {
  data: function() {
    return {
      flow: {},
      techniques: [],
      flow_techniques: [],
      positions: [],
      transitions: [],
      chosen: {},
      source: {},
      target: {},
      edit: false,
      action: "",
      errors: [],
      elements: [],
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
      layout: {
        name: "breadthfirst",

        fit: true, // whether to fit the viewport to the graph
        directed: true, // whether the tree is directed downwards (or edges can point in any direction if false)
        padding: 30, // padding on fit
        circle: false, // put depths in concentric circles if true, put depths top down if false
        grid: true, // whether to create an even grid into which the DAG is placed (circle:false only)
        spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
        nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
        roots: undefined, // the roots of the trees
        maximal: false, // whether to shift nodes down their natural BFS depths in order to avoid upwards edges (DAGS only)
        animate: true, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled,
        animateFilter: function(node, i) {
          return true;
        }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
        ready: undefined, // callback on layoutready
        stop: undefined, // callback on layoutstop
        transform: function(node, position) {
          return position;
        } // transform a given node position. Useful for changing flow direction in discrete layouts
      }
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
    axios.get("/api/techniques").then(response => {
      console.log(response.data);
      this.techniques = response.data;
    });
    axios
      .get(`/api/flow_techniques?flow_id=${this.$route.params.id}`)
      .then(response => {
        console.log(response.data);
        this.flow_techniques = response.data;
      });
  },
  mounted: function() {
    setupTheme();
  },
  methods: {
    addPosition: function() {
      //refactor???
      this.action = "addPosition";
      this.positions = this.techniques.filter(
        tech => tech.type.id === 1 || tech.type.id === 3
      );
      this.edit = !this.edit;
    },
    addTransition: function() {
      // refactor???
      this.action = "addTransition";
      this.positions = this.flow_techniques.filter(
        tech => tech.type.id === 1 || tech.type.id === 3
      );
      this.transitions = this.techniques.filter(tech => tech.type.id === 2);
      this.edit = !this.edit;
    },
    deleteTechnique: function() {
      this.action = "delete";
      this.edit = !this.edit;
    },
    submit: function(tech) {
      let params = {
        technique_id: tech.id,
        flow_id: this.$route.params.id,
        source_position_id: this.source.id, // these need to change,
        target_position_id: this.target.id // get IDs from flow_techniques
      };
      let postToDatabase = params => {
        axios
          .post("/api/flow_techniques", params)
          .then(response => {
            console.log(response.data);
            this.flow_techniques.push(response.data);
          })
          .catch(error => (this.errors = error.response.data.errors));
      };
      if (this.action === "addPosition" || this.action === "addTransition") {
        postToDatabase(params);
        this.source = {};
        this.target = {};
      } else {
        axios
          .delete(`/api/flow_techniques/${tech.id}`)
          .then(response => console.log(response.data));
        let index2 = this.flow_techniques.indexOf(tech);
        this.flow_techniques.splice(index2, 1);
      }
      this.edit = false;
    },
    deleteFlow: function() {
      axios.delete(`api/flows/${this.$route.params.id}`).then(response => {
        console.log(response.data);
        this.$router.push("/flows");
      });
    },
    createChart: function() {
      var cy = cytoscape({
        container: document.getElementById("cy"),
        elements: this.flow_techniques.map(tech => {
          if (tech.type.id === 1 || tech.type.id === 3) {
            console.log(tech);
            return {
              data: {
                id: tech.id,
                name: tech.name
              },
              locked: false,
              classes: [] // set CSS classes
            };
          } else {
            console.log(tech);
            return {
              data: {
                id: String(tech.id),
                source: String(tech.source_position_id),
                target: String(tech.target_position_id),
                name: tech.name
              }
            };
          }
        }),
        style: this.style,
        layout: this.layout,
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
