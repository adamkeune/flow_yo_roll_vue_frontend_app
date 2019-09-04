<template>
  <div class="container-fluid home">
    <!-- ======== @Region: #highlighted ======== -->
    <div id="highlighted" class="border-0">
      <!-- Image Banner: Use the the data-bg-img functionality to create a simple image banner Use spacer classes to make the banner larger with padding, allows for easy responsive changes too see: elements-ctas.htm To make the banner full height add the attributes: data-toggle="full-height" data-offset="#header" -->
      <div
        class="bg-black overlay overlay-gradient-flip overlay-op-7 text-center"
        data-toggle="backstretch"
        data-backstretch-target="self"
        data-backstretch-overlay="false"
        data-backstretch-imgs="photos/jonathan-borba-jWYbjMfDvrI-unsplash.jpg, photos/rafaela-biazi-0mfj0jJt0dY-unsplash.jpg, photos/jonathan-borba-YcrcG17Kjmg-unsplash.jpg, photos/jiu-jitsu-2184597_1280.jpg"
      >
        <div
          data-toggle="full-height"
          data-breakpoint="740"
          data-scroll="scrollax"
          class="px-3 py-5 py-lg-10 flex-valign"
          data-animate="fadeIn"
          data-animate-delay="0.2"
        >
          <h1 id="headliner" class="display-1 text-orange mt-lg-5">
            FlowYoRoll
          </h1>
          <h3 class="text-grey font-weight-normal text-slab">
            Visualize Your Game
          </h3>
          <hr class="hr-white op-4 hr-lg w-20 mx-auto my-4" />
          <div id="links">
            <div v-if="jwt">
              <router-link
                to="/techniques"
                class="btn btn-white d-block font-weight-bold text-orange py-lg-3 px-lg-5 w-30"
                data-toggle="scroll-link"
                data-animate="fadeIn"
                data-animate-delay="0.45"
              >
                <h4>Techniques</h4>
              </router-link>
              <router-link
                to="/videos"
                class="btn btn-white d-block font-weight-bold text-orange py-lg-3 px-lg-5 w-30"
                data-toggle="scroll-link"
                data-animate="fadeIn"
                data-animate-delay="0.45"
              >
                <h4>Videos</h4>
              </router-link>
              <router-link
                to="/flows"
                class="btn btn-white d-block font-weight-bold text-orange py-lg-3 px-lg-5 w-30"
                data-toggle="scroll-link"
                data-animate="fadeIn"
                data-animate-delay="0.45"
              >
                <h4>Flows</h4>
              </router-link>
              <hr class="hr-white op-4 hr-lg w-20 mx-auto my-4" />
              <router-link
                to="/logout"
                class="btn btn-white d-block font-weight-bold py-lg-3 px-lg-5 w-30"
                data-toggle="scroll-link"
                data-animate="fadeIn"
                data-animate-delay="0.45"
              >
                <h4>Logout</h4>
              </router-link>
            </div>
            <div v-else-if="!jwt">
              <router-link
                to="/signup"
                class="btn btn-white d-block font-weight-bold py-lg-3 px-lg-5 w-30"
                data-toggle="scroll-link"
                data-animate="fadeIn"
                data-animate-delay="0.45"
              >
                <h4>Signup</h4>
              </router-link>
              <router-link
                to="/login"
                class="btn btn-white d-block font-weight-bold py-lg-3 px-lg-5 w-30"
                data-toggle="scroll-link"
                data-animate="fadeIn"
                data-animate-delay="0.45"
              >
                <h4>Login</h4>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#headliner {
  font-family: "Kalam", cursive;
  font-size: 120px;
}
#links .btn {
  margin: 0 auto;
  opacity: 0.8;
}
</style>

<script>
/* global setupTheme */
import axios from "axios";

export default {
  data: function() {
    return {
      jwt: localStorage.getItem("jwt")
    };
  },
  mounted: function() {
    setupTheme();
  }
};
</script>
