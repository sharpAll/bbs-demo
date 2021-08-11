import request from "@/utils/request";

/**
 * @description: 新建帖子
 * @param:  postContent postName postType(0信息，1BUG，2建议)  remark
 */
export function addPost(form) {
  return request({
    url: "/feedback-post-info/addPost",
    method: "post",
    data: form,
  });
}
/**
 * @description: 帖子列表
 * @param:  type帖子类型 currPage name帖子名称(模糊查询) pageSize state帖子状态
 */
export function postList(form) {
  return request({
    url: "/feedback-post-info/list",
    method: "get",
    params: form,
  });
}
/**
 * @description: 删除帖子
 */
export function deletePost(id) {
  return request({
    url: "/feedback-post-info/deletePost",
    method: "get",
    params: { id: id },
  });
}
/**
 * @description: 点赞(已点赞会取消赞)
 */
export function changeGood(id) {
  return request({
    url: "/feedback-good-info/good",
    method: "get",
    params: { postId: id },
  });
}
/**
 * @description: 获取评论列表
 */
export function commentList(params) {
  return request({
    url: "/feedback-comment-info/list",
    method: "get",
    params: params,
  });
}
/**
 * @description: 新增评论
 */
export function commentAdd(params) {
  return request({
    url: "/feedback-comment-info/addComment",
    method: "post",
    data: params,
  });
}
/**
 * @description: 删除评论
 */
export function deleteComment(id) {
  return request({
    url: "/feedback-comment-info/deleteComment",
    method: "get",
    params: { id },
  });
}
/**
 * @description: 帖子详情
 */
export function postInfo(id) {
  return request({
    url: "/feedback-post-info/postInfo",
    method: "get",
    params: { id },
  });
}
/**
 * @description: 编辑帖子
 */
export function updatePost(form) {
  return request({
    url: "/feedback-post-info/updatePost",
    method: "POST",
    data: form,
  });
}
/**
 * @description: 状态流转
 */
export function updateState(form) {
  return request({
    url: "/feedback-post-info/updateState",
    method: "get",
    params: form,
  });
}
