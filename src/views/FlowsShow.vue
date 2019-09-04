<template>
  <div id="flows-show" class="container-fluid d-flex flex-column">
    <div class="d-flex flex-row">
      <div class="flex-row-4 text-white w-35">
        <h1>{{ flow.title }}</h1>
        <p>{{ flow.description }}</p>
      </div>
      <div class="flex-row-8 w-60">
        <button class="btn btn-teal" v-on:click="addPosition()">
          Add Position to Flow
        </button>
        <button class="btn btn-teal" v-on:click="addTransition()">
          Add Transition/Submission to Flow
        </button>
        <button class="btn btn-teal" v-on:click="deleteTechnique()">
          Remove Technique from Flow
        </button>
        <button class="btn btn-teal" v-on:click="deleteFlow()">
          Delete this Flow
        </button>
        <div v-if="edit" class="mx-auto text-center text-white">
          <form v-if="this.action === 'addPosition'">
            <label class="p-2">Technique:</label>
            <select v-model="selectedPosition">
              <option v-for="position in positions" :value="position">
                {{ position.name }}
              </option>
            </select>
            <input
              v-on:click="submit(selectedPosition)"
              type="submit"
              value="Submit"
              class="ml-2"
            />
          </form>
          <form v-else-if="this.action === 'addTransition'">
            <label class="p-2">Technique:</label>
            <select v-model="selectedTransition">
              <option v-for="transition in transitions" :value="transition">
                {{ transition.name }}
              </option>
            </select>
            <label class="p-2" for="source">Source:</label>
            <select v-model="source">
              <option v-for="position in positions" :value="position">
                {{ position.name }}
              </option>
            </select>
            <br />
            <label class="p-2" for="target">Target:</label>
            <select v-model="target">
              <option v-for="position in positions" :value="position">
                {{ position.name }}
              </option>
            </select>
            <label class="p-2" for="result">Result:</label>
            <select v-model="success">
              <option value="true">
                Success
              </option>
              <option value="false">
                Failure
              </option>
            </select>
            <input
              v-on:click="submit(selectedTransition)"
              type="submit"
              value="Submit"
              class="ml-2"
            />
          </form>
          <form v-else-if="this.action === 'delete'">
            <label class="p-2">Technique:</label>
            <select v-model="selectedPosition">
              <option v-for="technique in flow_techniques" :value="technique">
                {{ technique.name }}
              </option>
            </select>
            <input
              v-on:click="submit(selectedPosition)"
              type="submit"
              value="Submit"
              class="ml-2"
            />
          </form>
        </div>
      </div>
    </div>
    <div id="flow-box" class="d-flex flex-row">
      <div class="flex-row-4 list-group mx-3 my-3 overflow-auto w-25 h-95">
        <div
          class="list-group-item"
          :class="{ myActive: technique === active }"
          v-for="technique in flow_techniques"
          v-on:click="toggleActive(technique)"
        >
          <h3>{{ technique.name }}</h3>
          <p v-if="active === technique">
            {{ technique.description }}
          </p>
        </div>
      </div>
      <div id="cy" class="flex-row-8 h-95 w-70 bg-grey"></div>
    </div>
  </div>
</template>

<style>
#flows-show {
  height: 700px;
}

#flow-box {
  height: 600px;
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
      active: { name: "", description: "" },
      flow_techniques: [],
      positions: [],
      transitions: [],
      selectedPosition: {},
      selectedTransition: {},
      chosen: {},
      source: {},
      target: {},
      success: true,
      edit: false,
      action: "",
      errors: [],
      style: [
        // the stylesheet for the graph
        {
          selector: "node",
          style: {
            shape: "diamond",
            width: "120",
            height: "60",
            "background-color": "#e67e22",
            label: "data(name)",
            "text-valign": "center"
          }
        },

        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#aaa",
            "target-arrow-color": "#000",
            "target-arrow-shape": "triangle",
            "curve-style": "unbundled-bezier",
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
  computed: {
    elements() {
      return this.flow_techniques.map(tech => {
        if (tech.type.id === 1) {
          return {
            data: {
              id: tech.id,
              name: tech.name
            },
            locked: false,
            classes: [] // set CSS classes
          };
        } else {
          if (tech.success === true) {
            return {
              data: {
                id: String(tech.id),
                source: String(tech.source_position_id),
                target: String(tech.target_position_id),
                name: tech.name
              }
            };
          } else {
            return {
              data: {
                id: String(tech.id),
                source: String(tech.source_position_id),
                target: String(tech.target_position_id),
                name: `${tech.name} - Failure`
              }
            };
          }
        }
      });
    },
    cy() {
      return cytoscape({
        container: document.getElementById("cy"),
        elements: this.elements,
        style: this.style,
        layout: this.layout,
        zoom: 1,
        minZoom: 0.5,
        maxZoom: 1.5
      });
    }
  },
  watch: {
    elements() {
      this.cy.layout.run();
    }
  },
  created: function() {
    axios
      .get(`/api/flows/${this.$route.params.id}`)
      .then(response => {
        this.flow = response.data;
      })
      .catch(error => (this.errors = error.response.data.errors));
    axios.get("/api/techniques").then(response => {
      this.techniques = response.data;
    });
    axios
      .get(`/api/flow_techniques?flow_id=${this.$route.params.id}`)
      .then(response => {
        this.flow_techniques = response.data;
        this.active = this.flow_techniques[0];
      });
  },
  mounted: function() {
    setupTheme();
  },
  methods: {
    // refactor to setAction()
    addPosition: function() {
      this.action = "addPosition";
      this.positions = this.techniques.filter(tech => tech.type.id === 1);
      this.edit = !this.edit;
    },
    addTransition: function() {
      this.action = "addTransition";
      this.positions = this.flow_techniques.filter(tech => tech.type.id === 1);
      this.transitions = this.techniques.filter(
        tech => tech.type.id === 2 || tech.type.id === 3
      );
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
        source_position_id: this.source.id,
        target_position_id: this.target.id,
        success: this.success
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
        this.success = true;
      } else {
        axios
          .delete(`/api/flow_techniques/${tech.id}`)
          .then(response => console.log(response.data));
        let index = this.flow_techniques.indexOf(tech);
        this.flow_techniques.splice(index, 1);
      }
      this.edit = false;
    },
    deleteFlow: function() {
      axios.delete(`api/flows/${this.$route.params.id}`).then(response => {
        console.log(response.data);
        this.$router.push("/flows");
      });
    },
    toggleActive: function(tech) {
      if (this.active === tech) {
        this.active = {};
      } else {
        this.active = tech;
      }
    }
  }
};
</script>
