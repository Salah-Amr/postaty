function TOAST(color, message) {
  const toast = document.getElementById("toast");
  toast.style.backgroundColor = color;
  document.getElementById("text").innerText = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 1500);
}

function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function validateSignup(name, email, password, rePassword) {
  if (!name || name.length < 3 || name.length > 25) {
    TOAST("red", "Name must be between 3 and 25 characters");
    return false;
  }

  if (!email || !isValidEmail(email)) {
    TOAST("red", "Please enter a valid email");
    return false;
  }

  if (!password) {
    TOAST("red", "Password is required");
    return false;
  }

  if (password !== rePassword) {
    TOAST("red", "Passwords do not match");
    return false;
  }

  return true;
}

function signupUser(userData) {
  fetch("https://posts-app-uinv.onrender.com/user/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (response.status === 201) {
        TOAST("green", "Signup successful");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1600);
        
      } else if(response.status===200) {
        TOAST("red", "there is an account for this user");
      }
      else {
        TOAST("red", "error in signup");
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      TOAST("red", "Network error");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const btnSignup = document.getElementById("signup");

  btnSignup.addEventListener("click", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const rePassword = document.getElementById("confPassword").value.trim();

    if (validateSignup(name, email, password, rePassword)) {
      signupUser({ name, email, password });
    }
  });
});

