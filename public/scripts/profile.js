const url = "https://posts-app-uinv.onrender.com/";
const token = localStorage.getItem("token");
const userInfo = JSON.parse(localStorage.getItem("userInfos"));
const typeSpans = document.querySelectorAll(".type span");
import { logout } from "./logout.js";

function checkClicked() {
  typeSpans.forEach((span) => {
    span.addEventListener("click", () => {
      typeSpans.forEach((s) => s.classList.remove("active"));
      span.classList.add("active");

      const type = span.innerText.toLowerCase();
      if (type.includes("my")) {
        getMyPosts();
      } else if (type.includes("liked")) {
        getLikedPosts();
      } else if (type.includes("saved")) {
        getSavedPosts();
      }
    });
  });
}

function getMyPosts() {
  fetch(`${url}posts/user/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      printPosts(data.posts);
    });
}

function getLikedPosts() {
  fetch(`${url}posts/liked/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      printPosts(data.likedPosts);
    });
}

function getSavedPosts() {
  fetch(`${url}posts/saved/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      printPosts(data.savedPosts);
    });
}

async function printPosts(posts) {
  const postsParent = document.getElementById("posts");
  postsParent.innerHTML = "";

  let postsArray = "";

  for (const post of posts) {
    const created = dayjs(post.createdAt);

    let icon1 = "";
    let icon2 = "";

    const isOwner = post.userId.name === userInfo.name;

    if (isOwner) {
      icon1 = `fa-solid fa-trash delete`;
      icon2 = `fa-regular fa-pen-to-square edit`;
    } else {
      const liked = await isLiked(post._id);
      const saved = await isSaved(post._id);
      icon1 = `${liked ? "fa-solid" : "fa-regular"} fa-thumbs-up like-btn`;
      icon2 = `${
        saved ? "fa-solid" : "fa-regular"
      } fa-bookmark save-btn" data-id="save_${post._id}"`;
    }

    const postHTML = `
      <div class="post" id="post-${post._id}">
        <div class="content">
          <h3>${post.title}</h3>
          <p class="description">${post.description}</p>
          <span class="createTime">${created.format("hh:mmA DD/MM/YYYY")} ${
      post.edited ? "Edited" : ""
    }</span>
        </div>
        <div class="icons">
          <i class="${icon1}" id="${post._id}"></i>
          <i class="${icon2}" id="${post._id}"></i>
        </div>
      </div>
    `;

    postsArray += postHTML;
  }

  postsParent.innerHTML = postsArray;

  document.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      deletePost(btn.id);
      location.reload();
    });
  });

  document.querySelectorAll(".edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("popUp").style.display = "block";
      const postElement = document.getElementById(`post-${btn.id}`);
      const title = postElement.querySelector("h3").innerText;
      const description = postElement.querySelector(".description").innerText;

      document.getElementById("title").value = title;
      document.getElementById("desc").value = description;
      document.getElementById("popUp").style.display = "block";

      editPost(btn.id);
    });
  });

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
    return data.likedPosts.some((post) => post._id === postId);
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
    return data.savedPosts.some((post) => post._id === postId);
  }

  return false;
}

function deletePost(postId) {
  fetch(`${url}posts/${postId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (response.status == 200) {
      TOAST("Post deleted successfully", "green");
    }
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
    .then((response) => response.json())
    .then((data) => {
      const icon = document.getElementById(`${postId}`);
      if (data.liked === true) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
      } else {
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");

        const activeTab = document
          .querySelector(".type span.active")
          .innerText.toLowerCase();
        if (activeTab.includes("liked")) {
          const postElement = document.getElementById(`post-${postId}`);
          if (postElement) postElement.remove();
        }
      }

      const likeSpan = document.getElementById(`likes-${postId}`);
      if (likeSpan) {
        likeSpan.innerText = data.totalLikes;
      }
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
      if (!icon) return;

      if (result.saved === true) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
      } else {
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");

        const activeTab = document
          .querySelector(".type span.active")
          .innerText.toLowerCase();
        if (activeTab.includes("saved")) {
          const postElement = document.getElementById(`post-${postId}`);
          if (postElement) postElement.remove();
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function editPost(postId) {
  const editBtn = document.getElementById("editPost");

  const newEditBtn = editBtn.cloneNode(true);
  editBtn.parentNode.replaceChild(newEditBtn, editBtn);

  newEditBtn.addEventListener("click", () => {
    const Title = document.getElementById("title").value.trim();
    const desc = document.getElementById("desc").value.trim();

    if (Title === "" || desc === "") {
      alert("Title and Description cannot be empty!");
      return;
    }

    fetch(`${url}posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: Title,
        description: desc,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update post");
        return res.json();
      })
      .then(() => {
        document.getElementById("popUp").style.display = "none";
        document.getElementById("title").value = "";
        document.getElementById("desc").value = "";
        location.reload();
      })
      .catch((err) => {
        console.error("Error updating post:", err);
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

function homePage() {
  const homebtn = document.getElementById("homeBtn");
  homebtn.addEventListener("click", () => {
    setTimeout(() => {
      window.location.href = "homePage.html";
    }, 600);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("username").innerText = userInfo.name;
  checkClicked();
  getMyPosts();
  Close();
  homePage();
  document.getElementById("logout").addEventListener("click", logout);
});
