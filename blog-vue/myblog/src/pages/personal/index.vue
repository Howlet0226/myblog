<template>
    <div class="wrapper">
      <router-link :to="{name:'newblog'}" class="addlog">添加博客</router-link>
      <ul>
        <li v-for="item in blog" :key="item.id">
          <div class="some">
            <router-link :to="{name:'detail',params:{id:item.id}}" class="title">{{item.title}}</router-link>
            <div class="content" v-html="item.content"></div>
            <div class="mess">
              <div class="time">发布于:{{item.createtime}}</div>
              <div class="author">{{item.author}}</div>
            </div>
          </div>
          <div class="del" @click="handledel(item.id)">删除</div>
          <div class="fix" >
            <router-link :to="{name:'upblog', params:{id:item.id}}" class="fix-a">修改</router-link>
          </div>
        </li>
      </ul>
    </div>
</template>

<script>
import axios from "axios";
import showdown from "showdown";
export default {
  data() {
    return {
      blog: []
    };
  },
  async mounted() {
    let converter = new showdown.Converter();
    let res = await axios.get("/api/blog/list", {
      params: {
        isadmin: true
      }
    });
    if (res.data.errno == 1) {
      console.log(res.data.errno);
      this.$router.push("/login");
    } else {
      let result = res.data.data;
      result.forEach(item => {
        item.createtime = this.formatDate(new Date(item.createtime));
        item.content = converter.makeHtml(item.content);
        console.log(item.content);
      });
      this.blog = result;
    }
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
    },
    async handledel(id) {
      // console.log(id);
      let res1 = await axios.get("/api/blog/del", {
        params: {
          id
        }
      });
      if (res1.status === 200) {
        let converter = new showdown.Converter();
        let res = await axios.get("/api/blog/list", {
          params: {
            isadmin: true
          }
        });
        if (res.data.errno == 1) {
          // console.log(res.data.errno);
          this.$router.push("/login");
        } else {
          let result = res.data.data;
          result.forEach(item => {
            item.createtime = this.formatDate(new Date(item.createtime));
            item.content = converter.makeHtml(item.content);
            // console.log(item.content);
          });
          this.blog = res.data.data;
        }
      }
    }
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
.fix-a{
  color: #fff;
  background: greenyellow;
}
.addlog {
  display: block;
  /* border: 1px solid black; */
  width: 80px;
  text-align: center;
  margin: 10px 0px;
  padding: 10px 0px;
  margin-left: 50px;
  border-radius: 15px;
  background-color: rgb(160, 102, 214);
  color: #fff;
  font-weight: bold;
}
.content {
  background-color: #fff;
  max-height: 300px;
  overflow: hidden;
}
.wrapper {
  overflow: hidden;
  height: 100%;
}
.wrapper ul {
  width: 80%;
  border-radius: 5px;
  box-shadow: 1px 2px 2px #888888;
  text-align: left;
  margin-left: 50px;
  margin-top: 15px;
}
ul li {
  margin: 15px;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  /* flex-direction: column; */
}
ul li .some {
  flex: 1 1 auto;
  /* border-radius: 10px; */
  /* border: 1px solid black; */
  border-radius: 10px;
  overflow: hidden;
}
ul li div div {
  background-color: #fff;
  padding: 5px;
}
ul li .del {
  color: #fff;
  height: 40px;
  width: 40px;
  background-color: red;
  font-weight: bold;
  flex: 0 0 auto;
  border-radius: 10px;
  text-align: center;
  line-height: 40px;
  margin: 15px;
  cursor: pointer;
}
ul li .fix {
  color: #fff;
  height: 40px;
  width: 40px;
  background-color: greenyellow;
  font-weight: bold;
  flex: 0 0 auto;
  border-radius: 10px;
  text-align: center;
  line-height: 40px;
  margin: 15px;
  cursor: pointer;
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
