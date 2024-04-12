<template>
  <div>
    <el-button type="text" style="color: #333333; font-size: 18px" @click="logout">
      退出登录
    </el-button>
    <el-divider direction="vertical" style="color: #333333"></el-divider>
    <i class="el-icon-paperclip" style="margin-right: 18px"></i>
    <span>{{ currentTerm }}</span>
    <el-divider direction="vertical"></el-divider>
    <!-- 头像显示 -->
    <img v-if="avatar" :src="avatar" style="width: 30px; height: 30px; border-radius: 50%; cursor: pointer"
      @click="uploadAvatar">
    <!-- 上传头像图标 -->
    <i v-else class="el-icon-upload" style="margin-right: 18px; cursor: pointer" @click="uploadAvatar"></i>
    <span>{{ name }}</span>
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
      avatar: null,
    };
  },
  created() {
    this.name = sessionStorage.getItem("name");
    this.currentTerm = sessionStorage.getItem("currentTerm");
    this.avatar = sessionStorage.getItem("avatar");
  },
  methods: {
    logout() {
      sessionStorage.clear();
      this.$router.push("/");
    },
    uploadAvatar() {
      console.log(sessionStorage.getItem("avatar"));
      // 触发文件上传的逻辑
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        // 发送文件到后端进行上传
        axios.post("http://localhost:10086/common/upload", formData)
          .then(response => {
            const avatarUrl = response.data.data;
            // 更新头像地址
            this.avatar = avatarUrl;
            // 存储新头像地址到sessionStorage
            sessionStorage.setItem("avatar", avatarUrl);

            // 根据用户类型选择更新学生或老师的头像信息的接口
            const updateUrl = sessionStorage.getItem("type") === 'teacher' || sessionStorage.getItem("type") === 'admin' ?
              'http://localhost:10086/teacher/updateTeacher' :
              'http://localhost:10086/student/updateStudent';


            // 构造更新头像信息的请求参数
            let data = {};
            if (sessionStorage.getItem("type") === 'teacher' || sessionStorage.getItem("type") === 'admin') {
              data = {
                tid: sessionStorage.getItem("tid"), // 老师ID
                avatar: avatarUrl
              };
            } else {
              data = {
                sid: sessionStorage.getItem("sid"), // 学生ID
                avatar: avatarUrl
              };
            }


            // 发送请求更新头像信息
            axios.post(updateUrl, data)
              .then(response => {
                if (response.data.code === 1) {
                  // 头像信息更新成功
                  // 此处可以做一些成功提示或其他逻辑
                  this.$message({
                    showClose: true,
                    message: '更新成功!',
                    type: 'success'
                  });
                  console.log("头像上传成功！");
                } else {
                  // 头像信息更新失败
                  // 此处可以做一些失败提示或其他逻辑
                  this.$message({
                    showClose: true,
                    message: '更新失败，请稍后再试！',
                    type: 'error'
                  });
                  console.error("头像上传失败！");
                }
              })
              .catch(error => {
                console.error("更新头像信息失败:", error);
              });
          })
          .catch(error => {
            console.error("上传文件失败:", error);
          });
      };
      input.click();
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
