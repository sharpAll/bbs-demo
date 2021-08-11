<template>
  <div class="header">
    <div class="header-box">
      <div class="title"></div>
      <ul class="menu">
        <li
          class="item"
          :class="{ cur: params.type == 0 }"
          @click="switchType(0)"
        >
          公告
        </li>
        <li
          class="item"
          :class="{ cur: params.type == 2 }"
          @click="switchType(2)"
        >
          建议
        </li>
        <li
          class="item"
          :class="{ cur: params.type == 1 }"
          @click="switchType(1)"
        >
          BUG
        </li>
      </ul>
      <div class="input-box">
        <el-input
          placeholder="请输入搜索内容"
          v-model="params.name"
          size="small"
          :clearable="true"
          @change="searchName"
          @clear="searchName"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchName"
          ></el-button>
        </el-input>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          round
          class="publish-btn"
          @click="dialogVisible = true"
          >发 布</el-button
        >
      </div>
      <el-dropdown class="user-box" @command="handleCommand">
        <div>
          <span class="user-name">{{ username }}</span>
          <img src="../../assets/img/user-icon.jpg" alt="" class="user-icon" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 发布文章弹窗 -->
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="1000px"
      :close-on-click-modal="false"
      :append-to-body="true"
      :destroy-on-close="true"
    >
      <ArticleAdd ref="ArticleAdd" @success="finishAdd"></ArticleAdd>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="closeDialog">取 消</el-button>
        <el-button type="primary" size="medium" @click="publishForm"
          >确认发布</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ArticleAdd from "@/views/components/articleEdit.vue";
import PubSub from "pubsub-js";
export default {
  components: { ArticleAdd },
  data() {
    return {
      username: this.$store.state.user.user.username,
      dialogVisible: false,
      params: {
        type: 0,
        currPage: 1,
        name: "",
        pageSize: 20,
      },
    };
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "logOut":
          this.handleLogOut();
          break;
        default:
          break;
      }
    },
    handleLogOut() {
      this.$confirm("确认退出本系统吗?", "退出", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("Logout").then((state) => {
            if (state) {
              // 退出成功
              // 回到登录页面
              this.$router.push("/login");
            } else {
              this.$message({
                message: "退出失败",
                type: "warning",
                duration: 500, // 弹出停留时间
              });
            }
          });
        })
        .catch(() => {});
    },
    publishForm() {
      this.$refs.ArticleAdd.submit("add");
    },
    finishAdd() {
      this.dialogVisible = false;
      PubSub.publish("ListReset");
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    switchType(type) {
      if (this.params.type == type) {
        return;
      } else {
        this.params.type = type;
        PubSub.publish("ParamsTypeChange", type);
      }
    },
    searchName() {
      PubSub.publish("ParamsNameChange", this.params.name);
    },
  },
};
</script>
