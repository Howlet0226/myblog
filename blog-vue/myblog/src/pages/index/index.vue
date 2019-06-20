<template>
  <div class="wrapper1">
    <index-content></index-content>
  </div>
</template>

<script>
import indexContent from './components/content'
export default {
  components:{
    indexContent
  }
}

</script>
<style scoped>
*{
  background-color: #eee;
}
body,html{
  height: 100%;
}
.wrapper1{
  height: 100%;
}
</style>
