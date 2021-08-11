import request from "@/utils/request";

export function login(form) {
  return request({
    url: "/sys/login",
    method: "post",
    data: form,
  });
}
export function getUserInfo() {
  return request({
    url: `/sys/user/info`,
    method: "get",
  });
}
