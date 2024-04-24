<template>
  <div>
    <el-button type="text" style="color: #333333; font-size: 18px" @click="logout">
      退出登录
    </el-button>
    <el-divider direction="vertical" style="color: #333333"></el-divider>
    <i class="el-icon-paperclip" style="margin-right: 18px"></i>
    <span>{{ currentTerm }}</span>
    <el-divider direction="vertical"></el-divider>
    <el-avatar :size="28" :src="avatar" @error="errorHandler">
      <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
    </el-avatar>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "r-header",
  data() {
    return {
      name: null,
      currentTerm: null,
      avatar: null
    };
  },
  created() {
    this.name = sessionStorage.getItem("name");
    this.currentTerm = sessionStorage.getItem("currentTerm");
    this.avatar = sessionStorage.getItem("avatar");
    // this.avatar = "https://ts1.cn.mm.bing.net/th/id/R-C.c718589e7c2f5c2e77b22f7161c1b213?rik=pBm%2ff%2fwm4SAx6A&riu=http%3a%2f%2fwww.webzuan.cn%2fuploads%2fallimg%2f230429%2f11105SV2-3.png&ehk=wwXz6Dr2aYLTr2HAfSI9yQS1tklTOKnYY85DSHdFmG8%3d&risl=&pid=ImgRaw&r=0"
  },
  methods: {
    logout() {
      sessionStorage.clear();
      this.$router.push("/");
    },
    errorHandler() {
      return true
    }

  }
}
</script>

<style scoped>
body,
html {
  background-color: transparent;
}

.可能带有边框的元素类名 {
  border: none;
}
</style>
