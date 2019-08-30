<template>
  <!-- prettier-ignore -->
  <div>
    <!-- ======== @Region: #header ======== -->
    <div id="header" class="pos-lg-fixed w-100">
      <div data-toggle="sticky">

        <!--Header & Branding region-->
        <div class="header bg-black border-primary border-op-4 border-top-0 border-right-0 border-left-0">
          <!-- all direct children of the .header-inner element will be vertically aligned with each other you can override all the behaviours using the flexbox utilities (flexbox.html) All elements with .header-brand & .header-block-flex wrappers will automatically be aligned inline & vertically using flexbox, this can be overridden using the flexbox utilities (flexbox.htm) Use .header-block to stack elements within on small screen & "float" on larger screens use .order-first or/and .order-last classes to make an element show first or last within .header-inner or .headr-block elements -->
          <div class="header-inner container">
            <!--branding/logo -->
            <div class="header-brand">
              <router-link to="/" class="header-brand-text" title="Home">
                <h1 class="h2">
                  <span class="header-brand-text-alt">FlowYo</span>Roll<span class="header-brand-text-alt">.</span>
                </h1>
              </router-link>
              <div class="header-divider d-none d-lg-block"></div>
              <div class="header-slogan d-none d-lg-block">Visualize Your Game</div>
            </div>
            <!-- other header content -->
            <div class="header-block order-12">
              <ul class="nav">
                <li class="nav-link" v-if="jwt"><router-link
                to="/techniques" class="text-white op-8" data-toggle="scroll-link" data-dismiss="overlay">Techniques</router-link></li>
                <li class="nav-link" v-if="jwt"><router-link
                to="/videos" class="text-white op-8" data-toggle="scroll-link" data-dismiss="overlay">Videos</router-link></li>
                <li class="nav-link" v-if="jwt"><router-link
                to="/flows" class="text-white op-8" data-toggle="scroll-link" data-dismiss="overlay">Flows</router-link></li>
                <li class="nav-link" v-if="jwt"><router-link
                to="/logout" class="text-white op-8" data-toggle="scroll-link" data-dismiss="overlay">Logout</router-link></li>
                <li class="nav-link" v-if="!jwt"><router-link
                to="/signup" class="text-white op-8" data-toggle="scroll-link" data-dismiss="overlay">Signup</router-link></li>
                <li class="nav-link" v-if="!jwt"><router-link
                to="/login" class="text-white op-8" data-toggle="scroll-link" data-dismiss="overlay">Login</router-link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br>
    <br>
    <br>

    <router-view class="main-view" v-on:changeJwt="setJwt()" />
    
  </div>
</template>

<style></style>

<script>
/* global setupTheme */

export default {
  data: function() {
    return {
      jwt: null
    };
  },
  created: function() {
    this.setJwt();
  },
  mounted: function() {
    setupTheme();
  },
  methods: {
    setJwt: function() {
      this.jwt = localStorage.getItem("jwt");
    }
  }
};
</script>
