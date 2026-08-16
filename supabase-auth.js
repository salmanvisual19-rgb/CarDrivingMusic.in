(() => {
  const SUPABASE_URL =
    "https://ifcdrbvimiuxsimajwje.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_k8Dg9gilBY5TgpDyew0Brg_3qISpJDD";

  if (!window.supabase || !window.supabase.createClient) {
    console.error("Supabase JS library is not loaded.");
    return;
  }

  const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  function errorBox(id, message, success = false) {
    const el = document.getElementById(id);
    if (!el) return;

    el.textContent = message;
    el.style.display = "block";
    el.style.color = success ? "#25a95a" : "#c62828";
  }

  if (signupForm) {
    signupForm.addEventListener(
      "submit",
      async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        const username =
          document.getElementById("signupUsername")?.value.trim();

        const email =
          document.getElementById("signupEmail")?.value.trim();

        const password =
          document.getElementById("signupPassword")?.value;

        if (!username || !email || !password) {
          errorBox(
            "signupError",
            "Username, email aur password sabhi bharna zaroori hai."
          );
          return;
        }

        if (password.length < 6) {
          errorBox(
            "signupError",
            "Password kam se kam 6 characters ka hona chahiye."
          );
          return;
        }

        const button = signupForm.querySelector(".auth-submit");

        if (button) {
          button.disabled = true;
          button.textContent = "Creating...";
        }

        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                username: username
              },
              emailRedirectTo: window.location.origin
            }
          });

          if (error) {
            errorBox("signupError", error.message);
            return;
          }

          if (data.session) {
            errorBox(
              "signupError",
              "Account create ho gaya! Aap login ho gaye.",
              true
            );
          } else {
            errorBox(
              "signupError",
              "Account create ho gaya! Email confirm karke Login karein.",
              true
            );
          }

          signupForm.reset();
        } catch (err) {
          errorBox(
            "signupError",
            err.message || "Signup failed."
          );
        } finally {
          if (button) {
            button.disabled = false;
            button.textContent = "Create account";
          }
        }
      },
      true
    );
  }

  if (loginForm) {
    loginForm.addEventListener(
      "submit",
      async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        const email =
          document.getElementById("loginEmail2")?.value.trim();

        const password =
          document.getElementById("loginPassword2")?.value;

        if (!email || !password) {
          errorBox(
            "loginError2",
            "Email aur password enter karein."
          );
          return;
        }

        const button = loginForm.querySelector(".auth-submit");

        if (button) {
          button.disabled = true;
          button.textContent = "Logging in...";
        }

        try {
          const { error } =
            await supabase.auth.signInWithPassword({
              email,
              password
            });

          if (error) {
            errorBox("loginError2", error.message);
            return;
          }

          errorBox(
            "loginError2",
            "Login successful!",
            true
          );

          window.dispatchEvent(
            new CustomEvent("supabase-auth-success")
          );
        } catch (err) {
          errorBox(
            "loginError2",
            err.message || "Login failed."
          );
        } finally {
          if (button) {
            button.disabled = false;
            button.textContent = "Login";
          }
        }
      },
      true
    );
  }

  window.BMACSupabase = supabase;
})();
