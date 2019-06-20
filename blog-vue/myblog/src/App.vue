<template>
  <div class="myblog">
    <index-header></index-header>
    <router-view/>
  </div>
</template>

<script>
import indexHeader from "./components/header";
export default {
  name: "App",
  components: {
    indexHeader
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
  list-style: none;
  text-decoration: none;
}
html,body{
  height: 100%;
}
.myblog{
  height: 100%;
}
pre{
  background-color: #999;
}
</style>
