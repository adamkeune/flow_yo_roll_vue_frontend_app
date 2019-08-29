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
              <a class="header-brand-text" href="index.html" title="Home">
                <h1 class="h2">
                  <span class="header-brand-text-alt">FlowYo</span>Roll<span class="header-brand-text-alt">.</span>
                </h1>
              </a>
              <div class="header-divider d-none d-lg-block"></div>
              <div class="header-slogan d-none d-lg-block">Visualize Your Game</div>
            </div>
            <!-- other header content -->
            <div class="header-block order-12">

              <!-- mobile collapse menu button - data-toggle="collapse" = default BS menu - data-toggle="off-canvas" = Off-cavnas Menu - data-toggle="overlay" = Overlay Menu -->
              <a href="#top" class="btn btn-link btn-icon text-white ml-2 order-12" data-toggle="overlay" data-target="#overlay-menu" data-settings='{"cloneTarget":true, "targetClassExtras": "navbar-offcanvas"}'> <i class="fa fa-bars"></i> </a>
              <a href="#join" data-toggle="scroll-link" class="btn btn-outline-light btn-rounded border-w-2 text-uppercase font-weight-bold px-4 d-none d-lg-inline-block">Join</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <router-view />
    <!--Hidden elements - excluded from jPanel Menu on mobile-->
    <div class="hidden-elements js-off-canvas-exclude">
      <div class="overlay overlay-fp" id="overlay-menu">
        <div class="overlay-content">
          <div class="overlay-header"> <i class="fa fa-home fa-3x"></i> </div>
          <div class="overlay-body">
            <ul class="nav nav-overlay">
              <li class="nav-link"><router-link
              to="/techniques" class="text-white op-8" data-toggle="scroll-link" data-dismiss="overlay">Techniques</router-link></li>
              <li class="nav-link"><router-link
              to="/videos" class="text-white op-8" data-toggle="scroll-link" data-dismiss="overlay">Videos</router-link></li>
              <li class="nav-link"><router-link
              to="/flows" class="text-white op-8" data-toggle="scroll-link" data-dismiss="overlay">Flows</router-link></li>
              <li class="nav-link"><router-link
              to="/logout" class="text-white op-8" data-toggle="scroll-link" data-dismiss="overlay">Logout</router-link></li>
              <li class="nav-link"><router-link
              to="/signup" class="text-white op-8" data-toggle="scroll-link" data-dismiss="overlay">Signup</router-link></li>
              <li class="nav-link"><router-link
              to="/login" class="text-white op-8" data-toggle="scroll-link" data-dismiss="overlay">Login</router-link></li>
            </ul>
          </div>
          <div class="overlay-footer">
            <a href="#" class="text-white op-8" data-dismiss="overlay"> <i class="ion-ios-close-empty icon-4x"></i> </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

<script>
/* global setupTheme */

export default {
  mounted: function() {
    setupTheme();
  }
};
</script>
