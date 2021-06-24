function lock() {
  if (JSON.parse(localStorage.pref).action === "master") {
      localStorage.removeItem("session");
    } else {
      if (!isEmpty(localStorage.custom)) {
        localStorage.session = encrypt(localStorage.session, localStorage.custom);
        localStorage.removeItem("custom");
      } else {
        localStorage.pref = JSON.stringify({"theme":JSON.parse(localStorage.pref).theme,"timeout":JSON.parse(localStorage.pref).timeout,"action":"master"});
        localStorage.removeItem("session");
      }
    }
}
var loggedoff = (((new Date().getTime() / 1000) - parseInt(localStorage.logoff)) / 60);
if (!isEmpty(localStorage.pref) && !isEmpty(localStorage.session)) {
  var timeout = JSON.parse(localStorage.pref).timeout;
  if (timeout === "0") {
    if (isEmpty(sessionStorage.active)) {
      lock();
    }
  } else if (timeout === "1") {
    if (loggedoff > 1) {
      lock();
    }
  } else if (timeout === "5") {
    if (loggedoff > 5) {
      lock();
    }
  } else if (timeout === "15") {
    if (loggedoff > 15) {
      lock();
    }
  } else if (timeout === "30") {
    if (loggedoff > 30) {
      lock();
    }
  } else if (timeout === "60") {
    if (loggedoff > 60) {
      lock();
    }
  } else if (timeout === "240") {
    if (loggedoff > 240) {
      lock();
    }
  }
}
if (!tryDecrypt(JSON.parse(localStorage.data || [0])[parseInt(localStorage.user) - 1 || 0], localStorage.session)) {
  if (!getUser()) {
    redirect("menu.html");
  } else {
    redirect("login.html");
  }
} else {
  redirect("vault.html");
}
