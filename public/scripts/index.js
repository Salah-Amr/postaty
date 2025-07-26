
function validations(email, password) {
  if (!email || !password) {
    TOAST("Email and password are required", "red");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    TOAST("Please enter a valid email", "red");
    return false;
  }

  return true;
}
function TOAST(message, color) {
  const toast = document.getElementById("toast");
  toast.style.backgroundColor = color;
  document.getElementById("text").innerText = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 1500);
}

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1]; // Get payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Normalize
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
}

function login() {
  const lognBtn = document.getElementById("login-btn");

  lognBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (!validations(email, pass)) {
      return; 
    }

    fetch("https://posts-app-uinv.onrender.com/user/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password: pass }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.signToken);
        localStorage.setItem(
          "userInfos",
          JSON.stringify(parseJwt(data.signToken))
        );
        TOAST("Login successfully", "green");
        setTimeout(() => {
          window.location.href = "homePage.html";
        }, 1600);
      })
      .catch((error) => {
        TOAST("invalid email or password", "red");
      });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  login();
});
