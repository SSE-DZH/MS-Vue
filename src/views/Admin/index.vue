<template>
  <div>
    <el-container>
      <el-header style="text-align: right; background: linear-gradient(to bottom, #87CEFA, #ADD8E6); font-size: 18px; background-color: #409EFF; border-radius: 3px">
        <r-header></r-header>
      </el-header>
      <el-container style="background: linear-gradient(to bottom, #FDEBD0, #D6EAF8);">
        <r-aside></r-aside>
        <el-main  style="background: linear-gradient(to bottom, #FDEBD0, #D6EAF8);">
          <router-view  style="background: linear-gradient(to bottom, #FDEBD0, #D6EAF8);"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import RAside from "@/components/r-aside";
import RHeader from "@/components/r-header";
export default {
  name: "index",
  components: {RHeader, RAside},
}
</script>

<style scoped>

</style>