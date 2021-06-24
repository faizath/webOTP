/*
show-password-toggle.js with some modification
License: https://github.com/coliff/bootstrap-show-password-toggle/blob/master/LICENSE
*/
var passwordInput, togglePasswordButton;
if (s("input[type=password]")) {
  s("input[type=password]").classList.add("input-password");
  passwordInput = s("input[type=password]");
}
if (s("#toggle-password")) {
  s("#toggle-password").classList.remove("d-none");
  togglePasswordButton = s("#toggle-password");
  togglePasswordButton.addEventListener("click", togglePassword);
}
function togglePassword() {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePasswordButton.setAttribute("aria-label", "Hide password.");
    togglePasswordButton.setAttribute("title", "Hide password.");
  } else {
    passwordInput.type = "password";
    togglePasswordButton.setAttribute(
      "aria-label",
      "Show password as plain text. " +
        "Warning: this will display your password on the screen."
    );
    togglePasswordButton.setAttribute(
      "title",
      "Show password as plain text.\nWarning: this will display your password on the screen."
    );
  }
}
