<template>
  <div class="wrapper">
    <div class="box">
      <div class="title-box">
        <span class="title">{{detail.title}}</span>
        <span class="author">{{detail.author}}</span>
      </div>
      <div class="content" v-html="detail.content"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import showdown from "showdown";
export default {
  data() {
    return {
      detail: {}
    };
  },
  async mounted() {
    let converter = new showdown.Converter();
    // console.log(this.$route.params.id)
    let res = await axios.get("/api/blog/detail", {
      params: {
        id: this.$route.params.id
      }
    });

    let result = res.data.data;
      result.content = converter.makeHtml(result.content);
    this.detail = result;
    // console.log(this.detail.content);
  }
};
</script>
<style scoped>
* {
  background-color: #eee;
}
body,
html {
  height: 100%;
}
.wrapper {
  height: 100%;
  padding: 10px;
}
.box {
  display: inline-block;
  width: 80%;
  border-radius: 5px;
  box-shadow: 1px 2px 2px #888888;
  overflow: hidden;
  text-align: left;
  margin-left: 50px;
  margin-top: 15px;
  padding: 10px;
  background-color: #fff;
}
.title-box {
  background-color: #fff;
  border-bottom: 3px solid yellowgreen;
  padding: 10px;
  display: flex;
  justify-content: space-between;
}
.title-box span {
  background-color: #fff;
}
.title-box .author {
  color: #888888;
}
.content {
  padding: 5px;
  background-color: #fff;
}
</style>
