<template>
  <div class="wrapper" :class="{ 'isMenu-active' : toggle === true }">
    <v-head></v-head>
    <div class="menu-toggle" @click="menuToggle(toggle)">
      <i class="el-icon-d-arrow-right"></i>
    </div>
    <v-sidebar></v-sidebar>
    <div class="content">
      <transition name="move" mode="out-in"><router-view></router-view></transition>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import vHead from './Header.vue'
  import vSidebar from './Sidebar.vue'
  export default {
    components: {
      vHead, vSidebar
    },
    data () {
      return {
        toggle: false,
        screenWidth: document.body.clientWidth
      }
    },
    mounted () {
      const that = this
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          that.screenWidth = window.screenWidth
        })()
      }
    },
    created () {
      this.onWidhtChange()
    },
    methods: {
      onWidhtChange () {
        if (this.screenWidth <= 768) {
          this.toggle = true
        }
      },
      menuToggle (status) {
        status === false ? this.toggle = true : this.toggle = false
      }
    },
    watch: {
      screenWidth (val) {
        if (!this.timer) {
          this.screenWidth = val
          this.timer = true
          let that = this
          setTimeout(function () {
            that.timer = false
          }, 400)
        }
        if (val <= 768) {
          this.toggle = true
        }
      }
    }
  }
</script>
