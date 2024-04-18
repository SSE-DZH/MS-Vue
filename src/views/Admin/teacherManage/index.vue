<template>
  <keep-alive include="addTeacher">
    <router-view></router-view>
  </keep-alive>

</template>

<script>
export default {
  name: "index.vue"
}
</script>

<style scoped></style>