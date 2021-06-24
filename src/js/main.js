if (!localStorage.pref) {
  localStorage.pref = JSON.stringify({"theme":"default","timeout":"never","action":"master"});
}
function redirect(d) {
  window.location.href = d;
}
if (!sessionStorage.active) {
  sessionStorage.active = 1;
}
function s(sel) {
  return document.querySelector(sel);
}
const url = window.location.href;
const windowurl = new URL(url);
function getUrl(param) {
  return windowurl.searchParams.get(param);
}
const theme = JSON.parse(localStorage.pref).theme;
if (theme !== null && theme !== "") {
  if (theme == "default") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches === true) {
      s("html").className = "theme_dark";
    } else {
      s("html").className = "theme_light";
    }
  } else if (theme == "light") {
    s("html").className = "theme_light";
  } else if (theme == "dark") {
    s("html").className = "theme_dark";
  }
} else {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches === true) {
    s("html").className = "theme_dark";
  } else {
    s("html").className = "theme_light";
  }
}
function searchArrayElement(array, query) {
  for (i = 0; i < array.length; i++) {
    if (array[i] == query) {
      return i;
    }
  }
  return false;
}
function isEmpty(val) {
  if (val == null || val === ""){return true;}return false;
}
function encrypt(raw, key) {
  return CryptoJS.AES.encrypt(raw, key).toString();
}
function decrypt(ciphertext, key) {
  return CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
}
function tryDecrypt(ciphertext, key) {
  try {
    decrypt(ciphertext, key);
  } catch (e) {
    return false;
  }
  if (decrypt(ciphertext, key) === "") {
    return false;
  }
  return true;
}
if (s("#back")) {
  s("#back").onclick = function(e){
    e.preventDefault();
    window.history.back();
  };
}
function nodeLength(sel) {
  return document.querySelectorAll(sel).length;
}
function copyText(a) {
  var b = document.createElement('textarea');
  c = document.getSelection();
  b.textContent = a;
  document.body.appendChild(b);
  c.removeAllRanges();
  b.select();
  document.execCommand('copy');
  c.removeAllRanges();
  document.body.removeChild(b);
}
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function ifReturn(state, value) {
  if (state) {
    return value;
  } else {
    return false;
  }
}
function getUser() {
  try {
    const x = JSON.parse(localStorage.usernames)[parseInt(localStorage.user) - 1 || 0];
  } catch(e) {
    return false;
  }
  return true;
}
function isAllLC(q) {
  try {
    q === q.toLowerCase();
  } catch (e) {
    return false;
  }
  if (q === q.toLowerCase()) {
    return true;
  } else {
    return false;
  }
}
function tryRegex(q) {
  try {
    new RegExp(q, "i");
  } catch(e) {
    return false;
  }
  return true;
}
window.onunload = () => {
  localStorage.setItem("logoff", new Date().getTime() / 1000);
};
const mainurl = windowurl.href.split("/")[windowurl.href.split("/").length - 1];
