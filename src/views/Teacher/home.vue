<template>
  <div>
    <el-container>
      <el-main>
        <h1>teacher home</h1>
        <info-card></info-card>
        <el-card style="margin-top: 10px">
          <p><i class="el-icon-s-home" style="margin-right: 18px"></i>项目名：学生管理系统</p>
          <p><i class="el-icon-s-custom" style="margin-right: 18px"></i>作者：zhiend</p>
          <p><i class="el-icon-location-outline" style="margin-right: 18px"></i>ZZU</p>
          <p><i class="el-icon-chat-round" style="margin-right: 18px"></i>邮箱: sse_d@qq.com</p>
          <p><i class="el-icon-success" style="margin-right: 18px;"></i>欢迎进入ZZU学生管理系统</p>
        </el-card>
        <logout></logout>
      </el-main>
    </el-container>
  </div>
</template>


<script>
import Logout from "@/components/logout";
import InfoCard from "@/components/infoCard";
export default {
  name: "home",
  components: {InfoCard, Logout},
}
</script>

<style scoped>

</style>
