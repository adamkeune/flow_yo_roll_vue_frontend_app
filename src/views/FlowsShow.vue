<template>
  <div id="flows-show" class="container-fluid d-flex flex-column">
    <div class="d-flex flex-row">
      <div class="flex-row-4">
        <h1>{{ flow.title }}</h1>
        <p>{{ flow.description }}</p>
      </div>
      <div class="flex-row-8">
        <button class="btn btn-primary" v-on:click="addPosition()">
          Add Position to Flow
        </button>
        <button class="btn btn-primary" v-on:click="addTransition()">
          Add Transition/Submission to Flow
        </button>
        <button class="btn btn-primary" v-on:click="deleteTechnique()">
          Remove Technique from Flow
        </button>
        <button class="btn btn-primary" v-on:click="deleteFlow()">
          Delete this Flow
        </button>
        <div v-if="edit" class="mx-auto text-center">
          <form v-if="this.action === 'addPosition'">
            <label class="pr-2">Technique:</label>
            <select v-model="selectedPosition">
              <option v-for="position in positions" :value="position">
                {{ position.name }}
              </option>
            </select>
            <input
              v-on:click="submit(selectedPosition)"
              type="submit"
              value="Submit"
              class="pr-2"
            />
          </form>
          <form v-else-if="this.action === 'addTransition'">
            <label class="pr-2">Technique:</label>
            <select v-model="selectedTransition">
              <option v-for="transition in transitions" :value="transition">
                {{ transition.name }}
              </option>
            </select>
            <label class="pr-2" for="source">Source:</label>
            <select v-model="source">
              <option v-for="position in positions" :value="position">
                {{ position.name }}
              </option>
            </select>
            <label class="pr-2" for="target">Target:</label>
            <select v-model="target">
              <option v-for="position in positions" :value="position">
                {{ position.name }}
              </option>
            </select>
            <label class="pr-2" for="result">Result:</label>
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
            />
          </form>
          <form v-else-if="this.action === 'delete'">
            <label class="pr-2">Technique:</label>
            <select v-model="selectedPosition">
              <option v-for="technique in flow_techniques" :value="technique">
                {{ technique.name }}
              </option>
            </select>
            <input
              v-on:click="submit(selectedPosition)"
              type="submit"
              value="Submit"
            />
          </form>
        </div>
      </div>
    </div>
    <!-- filter out duplicate techniques below? -->
    <div class="d-flex flex-row">
      <ul class="flex-row-4 list-group">
        <li
          class="list-group-item"
          :class="{ active: technique === active }"
          v-for="technique in flow_techniques"
          v-on:click="toggleActive(technique)"
        >
          <h4>{{ technique.name }}</h4>
          <p v-if="active === technique">{{ technique.description }}</p>
        </li>
      </ul>
      <div id="cy" class="d-block w-85 mx-auto border border-primary"></div>
    </div>
  </div>
</template>

<style>
#flows-show {
  height: 700px;
}

#cy {
  height: 500px;
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
      // elements: [],
      style: [
        // the stylesheet for the graph
        {
          selector: "node",
          style: {
            shape: "square",
            width: "50",
            height: "50",
            "background-color": "#600",
            "background-blacken": -0.3,
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
  computed: {
    elements() {
      return this.flow_techniques.map(tech => {
        if (tech.type.id === 1) {
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
        minZoom: 0.8,
        maxZoom: 1.5
      });
      // let layout = cy.layout;
      // cy.on("click", "node", function(evt) {
      //   var node = evt.target;
      //   console.log("tapped " + node.id());
      // });
      // cy.on("click", "edge", function(evt) {
      //   var edge = evt.target;
      //   console.log("tapped " + edge.id());
      // });
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
