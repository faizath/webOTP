var user;
function masterPasswordAnyway() {
  s("#useMaster").innerText = "Use Master Password Anyway";
  s("#useMaster").onclick = function() {
    toastr.info("<button type='button' id='confirmMaster' class='btn border mx-1'>Yes</button><button type='button' id='cancelMaster' class='btn border'>No</button>","Are you sure want to use Master Password anyway? Vault Timeout Action preference will be set as 'Lock with Master Password'", {
      allowHtml: true,
      timeOut: 0,
      extendedTimeOut: 0,
      preventDuplicates: true,
      onShown: function (toast) {
          s("#confirmMaster").onclick = function(){
            s("#useMaster").classList.add("d-none");
            s("span").innerHTML = "Verify Master Password";
            s("#floatingPassword").setAttribute("placeholder", "Master Password");
            s("label").innerText = "Master Password";
            s("#passwordHelpBlock").innerHTML = "Your vault is locked. Verify your Master Password to unlock: " + JSON.parse(localStorage.usernames)[user - 1] + " (Local Account)";
            s("form").onsubmit = function(e){
              e.preventDefault();
              if (tryDecrypt(JSON.parse(localStorage.data)[user - 1], CryptoJS.SHA512(s("#floatingPassword").value).toString())) {
                localStorage.setItem("session", CryptoJS.SHA512(s("#floatingPassword").value).toString());
                localStorage.setItem("user", user);
                redirect("vault.html");
              } else {
                toastr.error("Incorrect Master Password !");
                s("#useMaster").classList.remove("d-none");
                customPasswordAnyway();
              }
            };
          };
        }
    });
  };
}
function customPasswordAnyway() {
  s("#useMaster").innerText = "Use Custom PIN / Password Anyway";
  s("#useMaster").onclick = function() {
    toastr.info("<button type='button' id='confirmCustom' class='btn border mx-1'>Yes</button><button type='button' id='cancelCustom' class='btn border'>No</button>","Are you sure want to use Custom PIN / Password anyway?", {
      allowHtml: true,
      timeOut: 0,
      extendedTimeOut: 0,
      preventDuplicates: true,
      onShown: function (toast) {
          s("#confirmCustom").onclick = function(){
            s("#useMaster").classList.add("d-none");
            s("span").innerHTML = "Verify Custom PIN / Password";
            s("#floatingPassword").setAttribute("placeholder", "Custom PIN / Password");
            s("label").innerText = "Custom PIN / Password";
            s("#passwordHelpBlock").innerHTML = "Your vault is locked. Verify your Custom PIN / Password to unlock: " + JSON.parse(localStorage.usernames)[user - 1] + " (Local Account)";
            s("form").onsubmit = function(e){
              e.preventDefault();
              if (tryDecrypt(localStorage.session, CryptoJS.SHA512(s("#floatingPassword").value).toString())) {
                localStorage.setItem("session", decrypt(localStorage.session, CryptoJS.SHA512(s("#floatingPassword").value).toString()));
                localStorage.setItem("custom", CryptoJS.SHA512(s("#floatingPassword").value).toString());
                localStorage.setItem("user", user);
                redirect("vault.html");
              } else {
                toastr.error("Incorrect Custom PIN / Password !");
                s("#useMaster").classList.remove("d-none");
                masterPasswordAnyway();
              }
            };
          };
        }
    });
  };
}
if (!isEmpty(getUrl("user"))) {
  user = getUrl("user");
  if (!isEmpty(localStorage.session) || isAllLC(localStorage.session)) {
    s("span").innerHTML = "Verify Custom PIN / Password";
    s("#floatingPassword").setAttribute("placeholder", "Custom PIN / Password");
    s("label").innerText = "Custom PIN / Password";
    s("#passwordHelpBlock").innerHTML = "Your vault is locked. Verify your Custom PIN / Password to unlock: " + JSON.parse(localStorage.usernames)[user - 1] + " (Local Account)";
    s("form").onsubmit = function(e){
      e.preventDefault();
      if (tryDecrypt(localStorage.session, CryptoJS.SHA512(s("#floatingPassword").value).toString())) {
        localStorage.setItem("session", decrypt(localStorage.session, CryptoJS.SHA512(s("#floatingPassword").value).toString()));
        localStorage.setItem("custom", CryptoJS.SHA512(s("#floatingPassword").value).toString());
        localStorage.setItem("user", user);
        redirect("vault.html");
      } else {
        toastr.error("Incorrect Custom PIN / Password !");
        s("#useMaster").classList.remove("d-none");
        masterPasswordAnyway();
      }
    };
  } else {
    s("span").innerHTML = "Verify Master Password";
    s("#floatingPassword").setAttribute("placeholder", "Master Password");
    s("label").innerText = "Master Password";
    s("#passwordHelpBlock").innerHTML = "Your vault is locked. Verify your Master Password to unlock: " + JSON.parse(localStorage.usernames)[user - 1] + " (Local Account)";
    s("form").onsubmit = function(e){
      e.preventDefault();
      if (tryDecrypt(JSON.parse(localStorage.data)[user - 1], CryptoJS.SHA512(s("#floatingPassword").value).toString())) {
        localStorage.setItem("session", CryptoJS.SHA512(s("#floatingPassword").value).toString());
        localStorage.setItem("user", user);
        redirect("vault.html");
      } else {
        toastr.error("Incorrect Master Password !");
      }
    };
  }
} else if (getUrl("event") === "importdecrypted") {
  if (isEmpty(localStorage.getItem("importDecrypted"))) {
    s("#submit").remove();
    var allbtnContent = '<div class="d-grid gap-2">';
    allbtnContent += '<button class="btn btn-large" type="button" disabled>No pending webOTP export data to be imported !</button>';
    allbtnContent += '</div>';
    s("content").innerHTML = allbtnContent;
    toastr.error("No pending webOTP export data to be imported !");
  } else {
    s("#submit").remove();
    var allbtnContent = '<div class="d-grid gap-2">';
    if (isEmpty(localStorage.getItem("usernames")) || localStorage.getItem("usernames") === null || localStorage.getItem("usernames") === "") {
      allbtnContent += '<button class="btn btn-large" type="button" disabled>No Local Account Found</button>';
    } else {
      var usernamesObj = JSON.parse(localStorage.getItem("usernames"));
      for (i = 0; i < usernamesObj.length; i++) {
        allbtnContent += '<button class="btn btn-large importdecrypted" type="button" id="account' + (i + 1).toString() + '">Import to Local Account: ' + usernamesObj[i] + '</button>';
      }
    }
    allbtnContent += '<button class="btn btn-large importdecrypted" type="button" id="newaccount">Create new local account</button>';
    allbtnContent += '</div>';
    s("content").innerHTML = allbtnContent;
    [].forEach.call(document.querySelectorAll("button.importdecrypted"), function(el) {
      el.onclick = function() {
        const datauserid = parseInt(this.id.replace("account","")) - 1;
        if (this.id.slice(0,1) == "n") {
          redirect("register.html?event=import&state=decrypted&type=" + getUrl("type"));
        } else {
          if (tryDecrypt(JSON.parse(localStorage.data)[datauserid], localStorage.session)) {
            var preDataall = JSON.parse(localStorage.data), preData = JSON.parse(decrypt(JSON.parse(localStorage.data)[datauserid], localStorage.session));
            if (getUrl("type") === "single") {
              var newData = JSON.parse(localStorage.importDecrypted);
              preData[preData.length] = newData;
            } else if (getUrl("type") === "multiple") {
              var newDataall = JSON.parse(localStorage.importDecrypted);
              for (var x in newDataall) {
                preData[preData.length] = newDataall[x];
              }
            }
            preDataall[datauserid] = encrypt(JSON.stringify(preData), localStorage.session);
            localStorage.setItem("data", JSON.stringify(preDataall));
            localStorage.removeItem("importDecrypted");
            toastr.success("Data saved !");
            setTimeout(function(){redirect("vault.html");}, 1000);
          } else {
            redirect("verify.html?verifyimport=" + (datauserid + 1).toString() + "&type=" + getUrl("type"));
          }
        }
      };
    });
  }
} else if (getUrl("event") === "importencrypted") {
  s("span").innerHTML = "Verify Master Password";
  s("#floatingPassword").setAttribute("placeholder", "Master Password");
  s("label").innerHTML = "Master Password";
  if (isEmpty(localStorage.getItem("importEncrypted"))) {
    s("#floatingPassword").setAttribute("disabled", "");
    s("#passwordHelpBlock").innerHTML = "No pending webOTP export data to be decrypted !";
    toastr.error("No pending webOTP export data to be decrypted !");
  } else {
    s("#passwordHelpBlock").innerHTML = "Your imported data is encryped. Verify your Master Password to decrypt the data";
    s("form").onsubmit = function(e){
      e.preventDefault();
      if (tryDecrypt(JSON.parse(localStorage.getItem("importEncrypted"))[0], CryptoJS.SHA512(s("#floatingPassword").value).toString())) {
        localStorage.setItem("importDecrypted", decrypt(JSON.parse(localStorage.getItem("importEncrypted"))[0], CryptoJS.SHA512(s("#floatingPassword").value).toString()));
        localStorage.removeItem("importEncrypted");
        const type = (!isEmpty(JSON.parse(localStorage.importDecrypted)[0])) ? "multiple" : "single";
        s("#submit").remove();
        var allbtnContent = '<div class="d-grid gap-2">';
        if (isEmpty(localStorage.getItem("usernames")) || localStorage.getItem("usernames") === null || localStorage.getItem("usernames") === "") {
          allbtnContent += '<button class="btn btn-large" type="button" disabled>No Local Account Found</button>';
        } else {
          var usernamesObj = JSON.parse(localStorage.getItem("usernames"));
          for (i = 0; i < usernamesObj.length; i++) {
            allbtnContent += '<button class="btn btn-large importencrypted" type="button" id="account' + (i + 1).toString() + '">Import to Local Account: ' + usernamesObj[i] + '</button>';
          }
        }
        allbtnContent += '<button class="btn btn-large importencrypted" type="button" id="newaccount">Create new local account</button>';
        allbtnContent += '</div>';
        s("content").innerHTML = allbtnContent;
        [].forEach.call(document.querySelectorAll("button.importencrypted"), function(el) {
          el.onclick = function() {
            const datauserid = parseInt(this.id.replace("account","")) - 1;
            if (this.id.slice(0,1) == "n") {
              redirect("register.html?event=import&type=" + type);
            } else {
              if (tryDecrypt(JSON.parse(localStorage.data)[datauserid], localStorage.session)) {
                var preDataall = JSON.parse(localStorage.data), preData = JSON.parse(decrypt(JSON.parse(localStorage.data)[datauserid], localStorage.session));
                if (type === "single") {
                  var newData = JSON.parse(localStorage.importDecrypted);
                  preData[preData.length] = newData;
                } else if (type === "multiple") {
                  var newDataall = JSON.parse(localStorage.importDecrypted);
                  for (var x in newDataall) {
                    preData[preData.length] = newDataall[x];
                  }
                }
                preDataall[datauserid] = encrypt(JSON.stringify(preData), localStorage.session);
                localStorage.setItem("data", JSON.stringify(preDataall));
                toastr.success("Data saved !");
                setTimeout(function(){redirect("vault.html");}, 1000);
              } else {
                redirect("verify.html?verifyimport=" + (datauserid + 1).toString() + "&type=" + type);
              }
            }
          };
        });
      } else {
        toastr.error("Incorrect master password !");
      }
    };
  }
} else if (!isEmpty(getUrl("verifyimport"))) {
  user = parseInt(getUrl("verifyimport"));
  s("span").innerHTML = "Verify Master Password";
  s("#floatingPassword").setAttribute("placeholder", "Master Password");
  s("label").innerHTML = "Master Password";
  s("#passwordHelpBlock").innerHTML = "Your vault is locked. Verify your Master Password to unlock: " + JSON.parse(localStorage.usernames)[user - 1] + " (Local Account)";
  s("form").onsubmit = function(e){
    e.preventDefault();
    if (tryDecrypt(JSON.parse(localStorage.data)[user - 1], CryptoJS.SHA512(s("#floatingPassword").value).toString())) {
      localStorage.setItem("session", CryptoJS.SHA512(s("#floatingPassword").value).toString());
      localStorage.setItem("user", user);
      var preDataall = JSON.parse(localStorage.data), preData = JSON.parse(decrypt(JSON.parse(localStorage.data)[user - 1], localStorage.session));
      if (getUrl("type") === "single") {
        var newData = JSON.parse(localStorage.importDecrypted);
        preData[preData.length] = newData;
      } else if (getUrl("type") === "multiple") {
        var newDataall = JSON.parse(localStorage.importDecrypted);
        for (var x in newDataall) {
          preData[preData.length] = newDataall[x];
        }
      }
      preDataall[user - 1] = encrypt(JSON.stringify(preData), localStorage.session);
      localStorage.setItem("data", JSON.stringify(preDataall));
      toastr.success("Data saved !");
      setTimeout(function(){redirect("vault.html");}, 1000);
    } else {
      toastr.error("Incorrect master password !");
    }
  };
} else if (!isEmpty(getUrl("verifyexport"))) {
  user = parseInt(getUrl("verifyexport"));
  s("span").innerHTML = "Verify Master Password";
  s("#floatingPassword").setAttribute("placeholder", "Master Password");
  s("label").innerHTML = "Master Password";
  s("#passwordHelpBlock").innerHTML = "Verify your Master Password to export: " + JSON.parse(localStorage.usernames)[user - 1] + " (Local Account)";
  s("form").onsubmit = function(e){
    e.preventDefault();
    if (tryDecrypt(JSON.parse(localStorage.data)[user - 1], CryptoJS.SHA512(s("#floatingPassword").value).toString())) {
      const d = new Date();
      const datestring = d.getFullYear().toString() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2) + ("0" + d.getHours()).slice(-2) + ("0" + d.getMinutes()).slice(-2) + ("0" + d.getSeconds()).slice(-2);
      if (getUrl("type") === "encrypted") {
        var filename = "webOTP_encrypted_export_" + datestring + ".json";
        var file = new File([new Blob([`["${JSON.parse(localStorage.data)[user - 1]}"]`], {encoding:'UTF-8',type:'application/json'})], filename);
        saveAs(file, filename);
        setTimeout(function(){redirect("settings.html");}, 1000);
      } else {
        var filename = "webOTP_export_" + JSON.parse(localStorage.usernames)[user - 1]  + "_" + datestring + ".json";
        var file = new File([new Blob([decrypt(JSON.parse(localStorage.data)[user - 1], CryptoJS.SHA512(s("#floatingPassword").value).toString())], {encoding:'UTF-8',type:'application/json'})], filename);
        saveAs(file, filename);
        setTimeout(function(){redirect("settings.html");}, 1000);
      }
    } else {
      toastr.error("Incorrect master password !");
    }
  };
}