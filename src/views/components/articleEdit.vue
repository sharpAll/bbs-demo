<template>
  <div>
    <el-form
      ref="postForm"
      :model="form"
      :rules="rules"
      class="login-form"
      label-width="80px"
    >
      <el-form-item label="标题" prop="postName">
        <el-input v-model="form.postName" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="postType">
        <el-radio-group v-model="form.postType">
          <el-radio :label="0">公告</el-radio>
          <el-radio :label="2">建议</el-radio>
          <el-radio :label="1">BUG</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <editor id="editor" v-model="form.postContent" :init="init"></editor>
  </div>
</template>

<script>
import axios from "axios";
import tinymce from "tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/plugins/image";
import "tinymce/icons/default/icons";
import "../../utils/tinymce/langs/zh_CN.js";
import { addPost, postInfo, updatePost } from "@/api/article.js";
import { getToken } from "@/utils/auth";
export default {
  components: {
    Editor,
  },
  data() {
    return {
      form: {
        postName: "",
        postType: "",
        postContent: "",
        remark: "",
      },
      rules: {
        postName: [{ required: true, message: "请输入标题", trigger: "blur" }],
        postType: [
          { required: true, message: "请选择文章类型", trigger: "blur" },
        ],
      },
      init: {
        selector: "#editor",
        height: "400px",
        plugins: "image", //插件
        toolbar:
          "image | bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | undo redo | link unlink code | removeformat", //工具栏
        menubar: true, //菜单栏
        language: "zh_CN",
        theme: "silver", //主题
        images_upload_handler: (blobInfo, success) => {
          let formdata = new FormData();
          formdata.append("files", blobInfo.blob());
          formdata.append("token", this.$store.state.user.token);
          axios
            .post(
              `${process.env.VUE_APP_UPLOAD_URL}/cms/uploadFile`,
              formdata,
              { headers: { token: getToken() } }
            )
            .then((res) => {
              if (res.data.code == 200) {
                success(res.data.info[0]);
              } else {
                this.$message({
                  message: "上传失败",
                  type: "error",
                  duration: 500, // 弹出停留时间
                });
              }
            });
        },
      },
    };
  },
  methods: {
    dataAdjust() {
      let remark = tinymce.editors["editor"].getContent({ format: "text" });
      if (remark.length > 100) {
        this.form.remark = remark.substr(0, 100) + "...";
      } else {
        this.form.remark = remark;
      }
    },
    submit(type) {
      this.$refs["postForm"].validate((valid) => {
        if (valid) {
          this.dataAdjust();
          if (type == "add") {
            addPost(this.form).then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "发布成功",
                });
                this.$emit("success");
              }
            });
          } else {
            updatePost(this.form).then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "修改成功",
                });
                this.$emit("success");
              }
            });
          }
        }
      });
    },
    //编辑时初始化数据
    initForm(id) {
      postInfo(id).then((res) => {
        if (res.code == 200) {
          this.form = res.info;
        }
      });
    },
  },
  created() {
    tinymce.init({});
  },
};
</script>
