<template>
  <div class="content-list">
    <div class="list-item" v-for="item in infoList" :key="item.id">
      <div class="option-box">
        <span class="name">{{ item.userName }}</span>
        <span class="time">{{ item.createTime }}</span>
        <template v-if="item.postType == 2">
          <span class="type">{{ getState(item.postState) }}</span>
        </template>
      </div>
      <div class="article-box">
        <div class="title">{{ item.postName }}</div>
        <template v-if="previewIds.indexOf(item.id) == -1">
          <div class="content content-ellipsis">
            {{ item.remark }}
            <span class="more-btn" @click="previewAll(item.id)"
              >阅读全文<i class="el-icon-arrow-down"></i
            ></span>
          </div>
        </template>
        <template v-else>
          <div class="content">
            <div v-html="item.postContent"></div>
          </div>
        </template>
      </div>
      <div class="operate-box">
        <span
          class="blue-box"
          :class="item.ifGood ? 'cur' : ''"
          @click="clickGood(item)"
          ><i class="el-icon-caret-top"></i>&nbsp;{{
            item.ifGood ? "已" : ""
          }}赞同{{ item.goodNum == 0 ? "" : " " + item.goodNum }}</span
        >
        <template v-if="previewComments.indexOf(item.id) == -1">
          <span class="item-box" @click="showComments(item.id)"
            ><i class="el-icon-chat-dot-round"></i>
            <template v-if="item.commentNum == 0"> &nbsp;添加评论 </template>
            <template v-else> &nbsp;{{ item.commentNum }}条评论 </template>
          </span>
        </template>
        <template v-else>
          <span class="item-box" @click="hideComments(item.id)"
            ><i class="el-icon-chat-dot-round"></i> &nbsp;收起评论
          </span>
        </template>
        <template v-if="sysUserName == item.userName">
          <span class="item-box" @click="openEditDialog(item.id)"
            ><i class="el-icon-edit"></i>&nbsp;编辑</span
          >
        </template>
        <template v-if="item.postType == 2 && sysRole == 1">
          <span
            class="item-box"
            @click="openStateDialog(item.postState, item.id)"
            ><i class="el-icon-bell"></i>&nbsp;状态</span
          >
        </template>
        <template v-if="sysUserName == item.userName || sysRole == 1">
          <span class="item-box" @click="delArticle(item.id)"
            ><i class="el-icon-delete"></i>&nbsp;删除</span
          >
        </template>
        <template v-if="previewIds.indexOf(item.id) !== -1">
          <span class="item-box u-fr" @click="previewEllipsis(item.id)"
            >收起<i class="el-icon-arrow-up"></i
          ></span>
        </template>
      </div>
      <!-- 评论模块 -->
      <template v-if="previewComments.indexOf(item.id) !== -1">
        <div class="comment-box">
          <div class="input-box">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入评论"
              v-model="myComment[item.id]"
              style="width: 840px"
            >
            </el-input>
            <el-button
              type="primary"
              size="small"
              style="float: right"
              @click="clickCommentAdd(item.id)"
              >发 布</el-button
            >
          </div>
          <div
            class="comment-item"
            v-for="comment in item.commentList"
            :key="comment.id"
          >
            <div class="title-box">
              <span class="user">{{ comment.userName }}</span>
              <span class="date">{{ comment.createTime }}</span>
            </div>
            <div class="content">
              {{ comment.commentContent }}
              <template v-if="sysUserName == comment.userName">
                <a
                  class="del-btn"
                  @click="handleDelComment(comment.id, item.commentList)"
                  ><i class="el-icon-delete"></i>&nbsp;删除</a
                >
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
    <!-- 发布文章弹窗 -->
    <el-dialog
      v-if="dialogEditVisible"
      :visible.sync="dialogEditVisible"
      width="1000px"
      :close-on-click-modal="false"
      :append-to-body="true"
      :destroy-on-close="true"
    >
      <ArticleEdit ref="ArticleEdit" @success="finishEdit"></ArticleEdit>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogEditVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" size="medium" @click="publishForm('edit')"
          >确认修改</el-button
        >
      </span>
    </el-dialog>
    <!-- 状态选择弹窗 -->
    <el-dialog :visible.sync="dialogStateVisible" width="460px">
      <el-radio-group v-model="curPostStateObj.state">
        <el-radio :label="0">已提交</el-radio>
        <el-radio :label="1">待开发</el-radio>
        <el-radio :label="2">开发中</el-radio>
        <el-radio :label="3">已完成</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogStateVisible = false"
          >取 消</el-button
        >
        <el-button size="medium" type="primary" @click="changeState"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  postList,
  deletePost,
  changeGood,
  commentAdd,
  commentList,
  deleteComment,
  updateState,
} from "@/api/article.js";
import PubSub from "pubsub-js";
import ArticleEdit from "@/views/components/articleEdit.vue";
export default {
  components: { ArticleEdit },
  data() {
    return {
      params: {
        type: 0,
        currPage: 1,
        name: "",
        pageSize: 20,
      },
      infoList: [],
      previewIds: [],
      previewComments: [],
      myComment: {},
      dialogEditVisible: false,
      dialogStateVisible: false,
      curPostStateObj: { state: 0, id: "" },
      hasEnd: false,
      sysUserName: this.$store.state.user.user.username, //当前用户
      sysRole: this.$store.state.user.user.roleIdList[0], //当前用户角色
    };
  },
  methods: {
    postListInit() {
      this.params.currPage = 1;
      this.previewComments = [];
      postList(this.params).then((res) => {
        if (res.code == 200) {
          res.info.list.forEach((item) => {
            item.commentList = [];
          });
          this.infoList = res.info.list;
          if (res.info.currPage >= res.info.totalPage) {
            this.hasEnd = true;
          } else {
            this.hasEnd = false;
          }
        }
      });
    },
    //阅读全文
    previewAll(id) {
      this.previewIds.push(id);
    },
    //收起全文
    previewEllipsis(id) {
      let index = this.previewIds.indexOf(id);
      this.previewIds.splice(index, 1);
    },
    //删除帖子
    delArticle(id) {
      this.$confirm("确认删除该项吗?", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePost(id).then((res) => {
            if (res.code == 200) {
              this.infoList.forEach((item, index) => {
                if (item.id == id) {
                  this.infoList.splice(index, 1);
                  this.$message({
                    type: "success",
                    message: "删除成功",
                  });
                }
              });
            }
          });
        })
        .catch(() => {});
    },
    //打开编辑
    openEditDialog(id) {
      this.dialogEditVisible = true;
      this.$nextTick(() => {
        this.$refs.ArticleEdit.initForm(id);
      });
    },
    //提交编辑
    publishForm(type) {
      this.$refs.ArticleEdit.submit(type);
    },
    //编辑完成
    finishEdit() {
      this.dialogEditVisible = false;
      this.postListInit();
    },
    //点赞
    clickGood(item) {
      changeGood(item.id).then((res) => {
        if (res.code == 200) {
          if (res.info) {
            item.goodNum++;
            item.ifGood = true;
          } else {
            item.goodNum--;
            item.ifGood = false;
          }
        }
      });
    },
    //显示评论
    showComments(id) {
      this.previewComments.push(id);
      this.$set(this.myComment, id, "");
      this.getCommentList(id);
    },
    //隐藏评论
    hideComments(id) {
      let index = this.previewComments.indexOf(id);
      this.previewComments.splice(index, 1);
    },
    //新增评论
    clickCommentAdd(id) {
      commentAdd({ commentContent: this.myComment[id], postId: id }).then(
        (res) => {
          if (res.code == 200) {
            this.myComment[id] = "";
            this.infoList.forEach((item) => {
              if (item.id == id) {
                item.commentNum++;
                this.getCommentList(id);
              }
            });
          }
        }
      );
    },
    //获取评论列表
    getCommentList(id) {
      commentList({ postId: id }).then((res) => {
        if (res.code == 200) {
          this.infoList.forEach((item) => {
            if (item.id == id) {
              item.commentList = res.info.list;
            }
          });
        }
      });
    },
    //删除评论
    handleDelComment(id, list) {
      this.$confirm("确认删除该条评论吗?", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteComment(id).then((res) => {
            if (res.code == 200) {
              list.forEach((item, index) => {
                if (item.id == id) {
                  list.splice(index, 1);
                }
              });
            }
          });
        })
        .catch(() => {});
    },
    //获取状态
    getState(stateType) {
      const stateTypeEnums = ["已提交", "待开发", "开发中", "已完成"];
      return stateTypeEnums[stateType];
    },
    //打开状态弹窗
    openStateDialog(state, id) {
      this.curPostStateObj.state = state;
      this.curPostStateObj.id = id;
      this.dialogStateVisible = true;
    },
    //改变状态
    changeState() {
      updateState(this.curPostStateObj).then((res) => {
        if (res.code == 200) {
          this.infoList.forEach((item) => {
            if (item.id == this.curPostStateObj.id) {
              item.postState = this.curPostStateObj.state;
            }
          });
          this.dialogStateVisible = false;
        }
      });
    },
    //滚动加载新内容
    scrollListener() {
      let $this = this;
      window.onscroll = function () {
        let scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        let windowHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        let scrollHeight =
          document.documentElement.scrollHeight || document.body.scrollHeight;
        if (scrollTop + windowHeight == scrollHeight) {
          if ($this.hasEnd) {
            return;
          }
          $this.params.currPage++;
          postList($this.params).then((res) => {
            if (res.code == 200) {
              res.info.list.forEach((item) => {
                item.commentList = [];
              });
              for (let i = 0; i < res.info.list.length; i++) {
                $this.infoList.push(res.info.list[i]);
              }
              if (res.info.currPage >= res.info.totalPage) {
                $this.hasEnd = true;
              }
            }
          });
        }
      };
    },
  },
  created() {
    this.postListInit();
    this.scrollListener();
  },
  mounted() {
    PubSub.subscribe("ParamsTypeChange", (msg, data) => {
      this.params.type = data;
      this.postListInit();
    });
    PubSub.subscribe("ParamsNameChange", (msg, data) => {
      this.params.name = data;
      this.postListInit();
    });
    PubSub.subscribe("ListReset", () => {
      this.postListInit();
    });
  },
};
</script>
