<template>
  <div class="wrapper">
    <ul>
      <li v-for="item in blog" :key="item.id">
        <router-link :to="{name:'detail',params:{id:item.id}}" class="title">{{item.title}}</router-link>
        <div class="mess">
          <div class="time">发布于:{{item.createtime}}</div>
          <div class="author">{{item.author}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      blog: []
    };
  },
  async mounted() {
    let res = await axios.get("/api/blog/list");
    console.log(res);
    if (res.status !== 200) {
      return;
    }
    let result = res.data.data;
    result.forEach(item => {
      item.createtime = this.formatDate(new Date(item.createtime));
    });
    this.blog = res.data.data;
    console.log(this.blog);
  },
  methods: {
    formatDate(dt) {
      if (!dt) {
        dt = new Date();
      }
      let year = dt.getFullYear();
      let month = dt.getMonth() + 1;
      let date = dt.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (date < 10) {
        date = "0" + date;
      }
      return year + "-" + month + "-" + date;
    }
  }
};
</script>
<style scoped>
* {
  background-color: #eee;
}
.wrapper ul {
  display: inline-block;
  width: 80%;
  border-radius: 5px;
  box-shadow: 1px 2px 2px #888888;
  overflow: hidden;
  text-align: left;
  margin-left: 50px;
  margin-top: 15px;
}
ul li {
  margin: 15px;
  border-radius: 5px;
  overflow: hidden;
}
ul li div {
  background-color: #fff;
  padding: 5px;
}
.title {
  display: block;
  background-color: #fff;
  padding: 5px;
  font-size: 15px;
  font-weight: bolder;
  color: #333;
  transition: all .3s;
}
.title:hover{
  font-size: 18px;
}
.mess {
  display: flex;
  justify-content: space-between;
}
.mess .author,
.time {
  text-align: right;
  font-size: 13px;
  color: #bbb;
}
.author span {
  text-align: left;
}
</style>
