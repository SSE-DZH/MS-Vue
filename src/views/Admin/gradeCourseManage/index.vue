<template>
  <div>
    <keep-alive include="queryGradeCourse,statistic,gradeCourseList">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "index"
}
</script>

<style scoped>

</style>