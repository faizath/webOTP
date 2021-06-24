if (JSON.parse(localStorage.pref).theme) {
  s("option[value='" + JSON.parse(localStorage.pref).theme + "']").setAttribute("selected", "true");
}
if (JSON.parse(localStorage.pref).timeout) {
  s("option[value='" + JSON.parse(localStorage.pref).timeout + "']").setAttribute("selected", "true");
}
if (JSON.parse(localStorage.pref).action) {
  if (JSON.parse(localStorage.pref).action === "custom") {
    if (isEmpty(localStorage.custom)) {
      localStorage.pref = JSON.stringify({"theme":JSON.parse(localStorage.pref).theme,"timeout":JSON.parse(localStorage.pref).timeout,"action":"master"});
    } else {
      s("#submitCustom").innerText = "Change Custom PIN / Password";
      s("#submitCustom").classList.remove("d-none");
      s("#submitCustom").onclick = function() {
        s(".form-floating").classList.remove("d-none");
        s("#floatingPassword").focus();
        s("#submitCustom").innerText = "Save Custom PIN / Password";
        s("#submitCustom").onclick = function() {
          if (!isEmpty(s("#floatingPassword").value)) {
            localStorage.custom = CryptoJS.SHA512(s("#floatingPassword").value).toString();
            if (s("#floatingPassword").type === "text") {s("#toggle-password").click();}
            toastr.success("Custom PIN / Password successfully saved");
          } else {
            toastr.error("Custom PIN / Password cannot be empty");
          }
        };
      };
    }
  }
  s("option[value='" + JSON.parse(localStorage.pref).action + "']").setAttribute("selected", "true");
}
if (!tryDecrypt(JSON.parse(localStorage.data)[parseInt(localStorage.user) - 1 || 0], localStorage.session)) {
  s("h5").innerText = "You're not logged in";
  s("#login").classList.remove("d-none");
  s("#login").onclick = function(){redirect("login.html");};
} else if (getUser()) {
  var account = JSON.parse(localStorage.usernames)[parseInt(localStorage.user) - 1 || 0];
  s("h5").innerText = "Current Local Account: " + account;
  s("#vault").classList.remove("d-none");
  s("#vault").onclick = function() {
    redirect("vault.html");
  };
  s("#lock").classList.remove("d-none");
  s("#lock").onclick = function() {
    if (JSON.parse(localStorage.pref).action === "master") {
      localStorage.removeItem("session");
      toastr.success("Account successfully locked !");
      setTimeout(function(){redirect("menu.html");}, 1000);
    } else {
      localStorage.session = encrypt(localStorage.session, localStorage.custom);
      localStorage.removeItem("custom");
      toastr.success("Account successfully locked !");
      setTimeout(function(){redirect("menu.html");}, 1000);
    }
  };
  s("#exportEncrypted").classList.remove("d-none");
  s("#exportEncrypted").onclick = function() {
    redirect(`verify.html?verifyexport=${(parseInt(localStorage.user) - 1 || 0) + 1}&type=encrypted`);
  };
  s("#exportDecrypted").classList.remove("d-none");
  s("#exportDecrypted").onclick = function() {
    redirect(`verify.html?verifyexport=${(parseInt(localStorage.user) - 1 || 0) + 1}&type=decrypted`);
  };
  s("#deleteAccount").classList.remove("d-none");
  s("#deleteAccount").innerText = `Delete Current Local Account: ${account}`;
  s("#deleteAccount").onclick = function() {
    toastr.info("<button type='button' id='deleteConfirmed' class='btn border mx-1'>Yes</button><button type='button' id='deleteCanceled' class='btn border'>No</button>",`Are you sure want to delete this account: ${account}, This action cannot be undone`, {
      allowHtml: true,
      timeOut: 0,
      extendedTimeOut: 0,
      preventDuplicates: true,
      onShown: function (toast) {
          s("#deleteConfirmed").onclick = function(){
            var data = JSON.parse(localStorage.data), usernames = JSON.parse(localStorage.usernames);
            delete data[parseInt(localStorage.user) - 1 || 0];
            delete usernames[parseInt(localStorage.user) - 1 || 0];
            data = data.filter(function(x) { return x !== null });
            usernames = usernames.filter(function(x) { return x !== null });
            localStorage.setItem("data", JSON.stringify(data));
            localStorage.setItem("usernames", JSON.stringify(usernames));
            localStorage.removeItem("session");
            toastr.success("Account deleted");
            setTimeout(function(){redirect("menu.html");}, 1000);
          };
      }
    });
  };
} else {
  s("h5").innerText = "No Local Account Found";
}
s("#menu").onclick = function() {
  redirect("menu.html");
};
s("#theme").onchange = function() {
  if (s("#theme").value === "default") {
    localStorage.pref = JSON.stringify({"theme":"default","timeout":JSON.parse(localStorage.pref).timeout,"action":JSON.parse(localStorage.pref).action});
    if (window.matchMedia("(prefers-color-scheme: dark)").matches === true) {
      s("html").className = "theme_dark";
    } else {
      s("html").className = "theme_light";
    }
  } else if (s("#theme").value === "light") {
    localStorage.pref = JSON.stringify({"theme":"light","timeout":JSON.parse(localStorage.pref).timeout,"action":JSON.parse(localStorage.pref).action});
    s("html").className = "theme_light";
  } else if (s("#theme").value === "dark") {
    localStorage.pref = JSON.stringify({"theme":"dark","timeout":JSON.parse(localStorage.pref).timeout,"action":JSON.parse(localStorage.pref).action});
    s("html").className = "theme_dark";
  }
};
s("#timeout").onchange = function() {
  localStorage.pref = JSON.stringify({"theme":JSON.parse(localStorage.pref).theme,"timeout":s("#timeout").value,"action":JSON.parse(localStorage.pref).action});
};
s("#action").onchange = function() {
  if (s("#action").value === "master") {
    localStorage.pref = JSON.stringify({"theme":JSON.parse(localStorage.pref).theme,"timeout":JSON.parse(localStorage.pref).timeout,"action":"master"});
    localStorage.removeItem("custom");
    s(".form-floating").classList.add("d-none");
    s("#submitCustom").classList.add("d-none");
  } else if (s("#action").value === "custom") {
    localStorage.pref = JSON.stringify({"theme":JSON.parse(localStorage.pref).theme,"timeout":JSON.parse(localStorage.pref).timeout,"action":"custom"});
    s(".form-floating").classList.remove("d-none");
    s("#submitCustom").classList.remove("d-none");
    s("#floatingPassword").focus();
    s("#submitCustom").onclick = function() {
      if (!isEmpty(s("#floatingPassword").value)) {
        localStorage.custom = CryptoJS.SHA512(s("#floatingPassword").value).toString();
        if (s("#floatingPassword").type === "text") {s("#toggle-password").click();}
        toastr.success("Custom PIN / Password successfully saved");
      } else {
        toastr.error("Custom PIN / Password cannot be empty");
      }
    };
  }
};
s("#exPref").onclick = function() {
  const d = new Date();
  const datestring = d.getFullYear().toString() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2) + ("0" + d.getHours()).slice(-2) + ("0" + d.getMinutes()).slice(-2) + ("0" + d.getSeconds()).slice(-2);
  var filename = "webOTP_preferences_" + datestring + ".json";
  var file = new File([new Blob([localStorage.pref], {encoding:'UTF-8',type:'application/json'})], filename);
  saveAs(file, filename);
};
s("#imPref").onclick = function() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.acceptCharset = 'utf-8';
  input.onchange = (event) => {
    event.target.files[0].text().then(function(value){
      if (IsJsonString(value)) {
        var json = JSON.parse(value);
        if (!isEmpty(json.theme) && !isEmpty(json.timeout) && !isEmpty(json.action)) {
          if ((json.theme === "default" || json.theme === "light" || json.theme === "dark") && (json.timeout === "0" || json.timeout === "1" || json.timeout === "5" || json.timeout === "15" || json.timeout === "30" || json.timeout === "60" || json.timeout === "240" || json.timeout === "never") && (json.action === "master" || json.action === "custom")) {
            var newpref = {"theme":json.theme,"timeout":json.timeout,"action":json.action};
            localStorage.pref = JSON.stringify(newpref);
            toastr.success("Preferences successfully imported");
          } else {
            toastr.error("Invalid webOTP preferences JSON format !");
          }
        } else {
          toastr.error("Invalid webOTP preferences JSON format !");
        }
      } else {
        toastr.error("Invalid JSON format !");
      }
    });
  };
  input.initialValue = input.value;
  s("#d-none").appendChild(input);
  input.click();
};
