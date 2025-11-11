document.addEventListener("DOMContentLoaded", () => {
    // --- SIGN UP MODAL ---
    const openSignUpBtn = document.querySelector("#openSignUp");
    const signUpModal = document.getElementById("signUpModal");
    const cancelSignUpBtn = signUpModal.querySelector(".cancel-btn");
  
    // open Sign Up
    openSignUpBtn.addEventListener("click", (e) => {
      e.preventDefault();
      signUpModal.classList.add("show");
    });
  
    // close Sign Up
    cancelSignUpBtn.addEventListener("click", () => {
      signUpModal.classList.remove("show");
    });
  
    // close by clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === signUpModal) {
        signUpModal.classList.remove("show");
      }
    });
  
    // --- SIGN IN MODAL ---
    const signInModal = document.getElementById("signInModal");
    const openSignInLink = document.getElementById("openSignIn"); // from Sign Up modal
    const openSignUpLink = document.getElementById("openSignUpLink"); // from Sign In modal
    const cancelSignInBtn = signInModal.querySelector(".cancel-btn");
  
    // open Sign In from "Sign in here"
    if (openSignInLink) {
      openSignInLink.addEventListener("click", (e) => {
        e.preventDefault();
        signUpModal.classList.remove("show");
        signInModal.classList.add("show");
      });
    }
  
    // open Sign Up from "Sign up here"
    if (openSignUpLink) {
      openSignUpLink.addEventListener("click", (e) => {
        e.preventDefault();
        signInModal.classList.remove("show");
        signUpModal.classList.add("show");
      });
    }
  
    // close Sign In
    cancelSignInBtn.addEventListener("click", () => {
      signInModal.classList.remove("show");
    });
  
    // close Sign In by clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === signInModal) {
        signInModal.classList.remove("show");
      }
    });
    
        // --- FIND EVENT MODAL ---
    const findEventModal = document.getElementById("findEventModal");
    const openFindEvent = document.getElementById("openFindEvent");
    const cancelFindEventBtn = findEventModal.querySelector(".cancel-btn");

    // open the modal
    openFindEvent.addEventListener("click", () => {
    findEventModal.classList.add("show");
    });

    // close modal
    cancelFindEventBtn.addEventListener("click", () => {
    findEventModal.classList.remove("show");
    });

    // click outside to close
    window.addEventListener("click", (e) => {
    if (e.target === findEventModal) {
        findEventModal.classList.remove("show");
    }
    });

  });
  