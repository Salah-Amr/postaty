export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userInfos");
  window.location.href = "./index.html";
}
