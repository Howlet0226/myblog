<template>
  <div class="login-box">
    <p class="text">请登录
      <span v-show='err'>{{err}}</span>
    </p>
    <form action="#">
      <el-input v-model="input" placeholder="请输入账号"></el-input>
      <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
       <el-button type="primary" round class="button" @click="handlelogin">登录</el-button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      input: "",
      password: "",
      err:''
    };
  },
  methods: {
    async handlelogin(){
     let res = await axios.get('/api/user/login',{
       params:{
         username:this.input,
         password:this.password
       }
     }
     )
      if(res.data.errno === 0){
        this.$router.push('/personal')
      }else{
        this.err='信息错误'
      }
    }
  },
};
</script>
<style scoped>
form{
  background-color: #fff;

}
.login-box {
  width: 25%;
  margin: auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  margin-top: 150px;
}
.login-box .text {
  background-color: #fff;
  color: #888;
  text-align: center;
  padding: 5px;
  font-weight: bolder;
}
.login-box .text span{
    background-color: #fff;
  color: red;
}
.button{
  background-color: #eee;
  margin:15px;
  /* margin-left: 150px; */
}
.el-button {
  /* background-color: #409EFF; */
  color: #409EFF;
  font-size: 15px;
  font-weight: bold;
}
</style>
