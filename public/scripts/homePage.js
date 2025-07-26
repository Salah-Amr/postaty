//import { error } from "./console";
import { logout } from "./logout.js";
const url = "https://posts-app-uinv.onrender.com/";
const token = localStorage.getItem("token");
function TOAST(message, color) {
  const toast = document.getElementById("toast");
  toast.style.backgroundColor = color;
  document.getElementById("text").innerText = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 1500);
}

function search() {
  const searchBar = document.getElementById("search");

  searchBar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const title = searchBar.value;
      if (title == "") {
        TOAST("Please enter search text", "red");
      } else {
        fetch(`${url}posts/search?title=${title}`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (response.status == 200) {
              return response.json();
            } else {
              TOAST("Error In Search", "red");
            }
          })
          .then((result) => {
            printPosts(result.posts);
          })
          .catch((error) => {
              TOAST("Cannot search please try again later!", "red");
          });
      }
    }
  });
}
function addPost() {
  const btnAdd = document.getElementById("addpost");
  const pop = document.getElementById("popUp");
  btnAdd.addEventListener("click", () => {
    pop.style.display = "block";
  });

  const btnAddPost = document.getElementById("add-post");
  const Title = document.getElementById("title");
  const Description = document.getElementById("desc");
  btnAddPost.addEventListener("click", () => {
    if (!title.value || !Description.value) {
      alert("invalid title or description");
      return;
    }
    const postDetails = {
      title: Title.value,
      description: Description.value,
    };

    fetch(`${url}posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postDetails),
    }).then((response) => {
      if (response.ok) {
        TOAST("post added successfully", "green");
        Title.value = "";
        Description.value = "";
        pop.style.display = "none";
        showPosts();
      } else {
        TOAST("Error in adding post", "red");
      }
    });
  });
}
function showPosts() {
  fetch(`${url}posts`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(async (data) => {
      printPosts(data.posts);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function addlike(postId) {
  fetch(`${url}posts/togglelike/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const likeSpan = document.getElementById(`likes-${postId}`);
      const icon = document.getElementById(`${postId}`);
      if (!likeSpan) {
        console.warn(`Element with id likes-${postId} not found`);
        return;
      }
      if (data.liked == true) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
      } else {
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
      }
      likeSpan.innerText = data.totalLikes;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function savePost(postId) {
  fetch(`${url}posts/togglesave/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      const icon = document.querySelector(`[data-id="save_${postId}"]`);
      if (result.saved == true) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
      } else {
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function openProfile() {
  const profileBtn = document.getElementById("profileButton");
  profileBtn.addEventListener("click", () => {
    window.location.href = "profilePage.html";
  });
}

async function isLiked(postId) {
  const response = await fetch(`${url}posts/liked/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    const totalLikes = data.likedPosts;
    return totalLikes.some((post) => post._id === postId);
  }

  return false;
}

async function isSaved(postId) {
  const response = await fetch(`${url}posts/saved/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    const savedPosts = data.savedPosts;
    return savedPosts.some((post) => post._id === postId);
  }

  return false;
}

async function printPosts(posts) {
  const postsParent = document.getElementById("posts");

  let postsArray = !posts.length ? "<p style='color: red;'>There is no posts</p>" : "";

  for (let post of posts) {
    const created = dayjs(post.createdAt);
    const child = `<div class="post" id="post-${post._id}">
                <div class="content">
                    <span class="userDetails"><i class="fa-regular fa-circle-user"></i> ${
                      post.userId.name
                    }</span>
                <h3>${post.title}</h3>
                <p class="description">${post.description}</p>
                <span class="createTime">${created.format(
        "hh:mmA DD/MM/YYYY"
      )} ${post.edited ? "Edited" : ""}</span>
                </div>
                <div class="icons">
                    <i class="${(await isLiked(post._id)) ? "fa-solid" : "fa-regular"
      } fa-thumbs-up like-btn" id="${post._id}" ></i>
                    <span id="likes-${post._id}">${post.totalLikes}</span>
                    <br>
                    <i class="${(await isSaved(post._id)) ? "fa-solid" : "fa-regular"
      } fa-bookmark save-btn" data-id="save_${post._id}" id="${post._id
      }"></i>
                </div>
            </div>`;
    postsArray += child;
  }
  postsParent.innerHTML = postsArray;

  document.querySelectorAll(".like-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      addlike(btn.id, btn.className);
    });
  });

  document.querySelectorAll(".save-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      savePost(btn.id);
    });
  });
}

function Close() {
  const btnAdd = document.getElementById("close");
  const pop = document.getElementById("popUp");
  const Title = document.getElementById("title");
  const Description = document.getElementById("desc");
  btnAdd.addEventListener("click", () => {
    pop.style.display = "none";
    Title.value = "";
    Description.value = "";
  });
}
document.addEventListener("DOMContentLoaded", () => {
  search();
  addPost();
  showPosts();
  openProfile();
  Close();
  document.getElementById("logout").addEventListener("click", logout);
});