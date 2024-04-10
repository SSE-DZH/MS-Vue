<template>
  <div>
      <el-button type="text" style="color: #333333; font-size: 18px" @click="out()">
        logout
      </el-button>
      <el-divider direction="vertical" style="color: #333333"></el-divider>
      <i class="el-icon-paperclip" style="margin-right: 18px"></i>
      <span>{{ currentTerm }}</span>
      <!-- <span>24-春季学期</span> -->
      <el-divider direction="vertical"></el-divider>
      <i class="el-icon-user" style="margin-right: 18px"></i>
      <span>{{ name }}</span>
  </div>
</template>

<script>
export default {
  name: "r-header",
  data() {
    return {
      name: null,
      currentTerm: null,
      phone: null,
    }
  },
  created() {
    this.name = sessionStorage.getItem("name")
    this.currentTerm = sessionStorage.getItem("currentTerm")
    this.phone = sessionStorage.getItem("phone")
  },
  methods: {
    out() {
      sessionStorage.clear();
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

</style>