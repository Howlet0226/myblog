<template>
  <div class="wrapper">
    <el-input placeholder="请输入标题" v-model="title"></el-input>

    <div class="editor-box"><div ref="editor" id="editor" ></div></div>
    <div ref="con" type="success" round id="tijiao" @click="handleclick">提交</div>
  </div>
</template>

<script>
import Editor from "wangeditor";
import "wangeditor/release/wangEditor.min.css";
import axios from "axios";
import showdown from "showdown";
export default {
  data() {
    return {
      title: "",
      editorContent: "",
      textarea:'',
    };
  },
  async mounted() {
    // console.log(this.$route.params.id);
    let converter = new showdown.Converter()
    this.editor = new Editor("#editor");
    this.editor.customConfig.onchange = html => {
      this.editorContent = html;
    };
    this.editor.create();
    console.log(  this.editor);
    let res1 = await axios.get("/api/blog/detail", {
      params: {
        id: this.$route.params.id
      }
    })
    if(res1.status === 200){
      this.title = res1.data.data.title
      res1.data.data.content = converter.makeHtml(res1.data.data.content)
      this.editor.cmd.do('insertHTML', res1.data.data.content)
    }
  },
  methods: {
    async handleclick() {
      let content
      if (!this.title) {
        return;
      }else{
        content = this.editorContent
      }
      let res = await axios({
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        url: "/api/blog/update",
        data: {
          id:this.$route.params.id,
          title: this.title,
          content
        }
      });
      if(res.status === 200){
        this.$router.push('/personal')
      }
    },
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
