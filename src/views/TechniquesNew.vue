<template>
  <div class="container">
    <h1>Add a Technique</h1>
    <form action="">
      <div>
        <label for="name">Name:</label>
        <input v-model="name" type="text" />
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea v-model="description"></textarea>
      </div>
      <div>
        <label for="source">Source:</label>
        <input v-model="source" type="text" />
      </div>
      <div>
        <label for="type">Type:</label>
        <input v-model="type" type="text" />
      </div>
      <div>
        <label for="priority">Priority:</label>
        <input v-model="priority" type="text" />
      </div>
      <div>
        <label for="video">Video URL (optional):</label>
        <input v-model="video" type="text" />
      </div>
    </form>
  </div>
</template>

<style></style>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      name: "",
      description: "",
      source: "",
      type: "",
      priority: "",
      video: ""
    };
  }
};
</script>
