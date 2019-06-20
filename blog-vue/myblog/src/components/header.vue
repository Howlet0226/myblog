<template>
  <div class="header-box">
    <div class="title" @click="handelback">Howlet的博客</div>
    <div class="profile" @click="handleclick">博客管理</div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  methods: {
    handleclick(){
      this.$router.push('/personal')
    },
    handelback(){
      this.$router.push('/')
    }
  },
};
</script>
<style scoped>
.header-box {
  height: 50px;
  background-color: #666;
  display: flex;
  justify-content: space-between;
}
.title {
  width: 200px;
  box-sizing: border-box;
  height: 100%;
  line-height: 50px;
  padding-left: 20px;
  color: #fff;
  font-weight: bold;
    transition: all .3s;
  background-color: #666;
  cursor: pointer;
  /* border: 1px solid #fff; */
}
.profile {
  width: 100px;
  height: 100%;
  color: #fff;
  padding-right: 20px;
  color: #fff;
  font-weight: bold;
  line-height: 50px;
  /* border: 1px solid #333; */
  transition: all .3s;
  text-align: center;
  background-color: #666;
    cursor: pointer;

}
.title:hover{
    font-size: 20px;
}
.profile:hover{
  font-size: 20px;
}
</style>
