<template>
  <div class="wrapper">
    <el-input placeholder="请输入标题" v-model="title"></el-input>
    <div class="mark" v-if="text">
      <el-input type="textarea" :rows="18" placeholder="请输入内容" v-model="textarea" class="c-textarea"></el-input>
    </div>
    <div class="editor-box" v-show='!text'><div id="editor" ></div></div>
    <div ref="con" type="success" round id="tijiao" @click="handleclick">提交</div>
    <div class="changemol" @click="handlemol">{{changecon}}</div>
    <!-- <div class="upload-demo">
    <input type="file" ref="fileInt" @change="changeHandle" >
    </div>-->
  </div>
</template>

<script>
import Editor from "wangeditor";
import "wangeditor/release/wangEditor.min.css";
import axios from "axios";
export default {
  data() {
    return {
      title: "",
      editorContent: "",
      text: false,
      textarea:'',
      changecon:'切换至文本'
    };
  },
  mounted() {
    this.editor = new Editor("#editor");
    this.editor.customConfig.onchange = html => {
      this.editorContent = html;
    };
    this.editor.create();
  },
  methods: {
    // async changeHandle(){
    //   if(!this.title){
    //     return
    //   }
    //   const file = this.$refs.fileInt.files[0]
    //   let res = await axios({
    //     headers:{
    //          'Content-Type': 'multipart/form-data',
    //     },
    //     method:"POST",
    //     url: "/api/blog/new",
    //     data:{
    //       file
    //     }
    //   })
    //   console.log(res)
    // },
    async handleclick() {
      let content
      // console.log(this.editorContent);
      if (!this.title) {
        return;
      }else if (this.text){
        content = this.textarea
      }else{
        content = this.editorContent
      }

      let res = await axios({
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        url: "/api/blog/new",
        data: {
          title: this.title,
          content
        }
      });
      if(res.status === 200){
        this.$router.push('/personal')
      }
    },
    handlemol(){
      this.text = !this.text
      if(this.changecon == '切换至文本'){
        this.changecon = '切换至富文本'
      }else{
        this.changecon = '切换至文本'

      }
    }
  }
};
</script>
<style scoped>

.changemol {
  height: 30px;
  width: 100px;
  /* border: 1px solid black; */
  border-radius: 15px;
  margin: 15px;
  background-color: yellowgreen;
  color: #fff;
  font-weight: bold;
  text-align: center;
  line-height: 30px;
}
#tijiao {
  display: block;
  /* border: 1px solid black; */
  width: 80px;
  text-align: center;
  margin: 20px;
  border-radius: 15px;
  background-color: rgb(160, 102, 214);
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}
</style>
