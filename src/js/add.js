if (getUrl("import") === "1") {
  if (getUrl("name")) {
    s("#addName").value = getUrl("name");
  }
  if (getUrl("account")) {
    s("#addAccount").value = getUrl("account");
  }
  if (getUrl("secret")) {
    s("#addSecret").value = getUrl("secret");
  }
  if (getUrl("digits")) {
    s("#digits").value = getUrl("digits");
  }
  if (getUrl("period")) {
    s("#period").value = getUrl("period");
  }
}
s("#cancel").onclick = function() {
  redirect(getUrl("cancel") || "vault.html");
};
s("#addURIbtn").onclick = function() {
  var template = new DOMParser().parseFromString(s(".addURItemplate").outerHTML.replaceAll("URI_", "URI" + (nodeLength(".addURI") + 1).toString()).replaceAll("URI _", "URI " + (nodeLength(".addURI") + 1).toString()).replace("addURItemplate", "addURI"), 'text/html').querySelector(".addURI");
  (s("#addcontainerURI" + nodeLength(".addURI").toString()) || s("#secretContainer")).after(template);
  [].forEach.call(document.querySelectorAll("button.buttononinput"), function(el) {
    el.onclick = function() {
      this.parentNode.remove();
      if (s(".addURI")) {
        var rem = document.querySelectorAll(".addURI");
        for (i = 0; i < rem.length; i++) {
          rem[i].children[1].innerHTML = "URI " + (i + 1).toString();
          rem[i].children[1].setAttribute("for", "addURI" + (i + 1).toString());
          rem[i].setAttribute("placeholder", "URI " + (i + 1).toString());
          rem[i].id = "addURI" + (i + 1).toString();
          rem[i].id = "addcontainerURI" + (i + 1).toString();
        }
      }
    };
  });
};
s("button.buttononinput").onclick = function() {
  this.parentNode.remove();
};
function digit() {
  if (this.value == 6 || this.value == 8 || this.value === null || this.value === "") {} else {
    toastr.warning("TOTP digits can only between 6 or 8, the default is 6");
    if (this.value == 7) {} else if (this.value >= 8) {this.value = 8;} else {this.value = 6;}
  }
}
s("#digits").onchange = digit;
s("#digits").onkeyup = digit;
s("#scanQR").onclick = function() {
  // Inspired by: https://github.com/inbasic/open-two-factor-authenticator/blob/master/v0.2.0/data/plus/index.js
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.acceptCharset = 'utf-8';
  input.onchange = () => {
    const canvas = s("canvas");
    const context = canvas.getContext('2d');
    const reader = new FileReader();
    const img = new Image();
    // Read in the image file as a data URL.
    reader.onload = e => {
      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        context.drawImage(img, 0, 0);
        const code = jsQR(context.getImageData(0, 0, img.width, img.height).data, img.width, img.height);
        if (code) {
          const [pre, post] = code.data.split('?');
          const decodedLabel = decodeURIComponent(pre.replace('otpauth://totp/', ''));
          if (decodedLabel.split(":").length === 1) {
            s("#addName").value = decodedLabel || "";
          } else {
            s("#addName").value = decodedLabel.split(":")[0] || "";
            s("#addAccount").value = decodedLabel.split(":")[1] || "";
          }
          const args = new URLSearchParams(post);
          s("#addSecret").value = args.get('secret') || "";
          s("#digits").value = args.get('digits') || 6;
          s("#period").value = args.get('period') || 30;
        }
        else {
          toastr.error("Cannot decode this QR code");
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  };
  input.initialValue = input.value;
  s(".d-none").appendChild(input);
  input.click();
};
s("#save").onclick = function() {
  if (!tryDecrypt(JSON.parse(localStorage.data || [0])[parseInt(localStorage.user) - 1 || 0], localStorage.session)) {
    toastr.error("Expired / Invalid Session !");
    if (!isInputsFilled()) {
      setTimeout(function(){redirect("login.html");}, 1000);
    }
    return;
  }
  if (s("#addSecret").value) {
    var preDataall = JSON.parse(localStorage.data), preData = JSON.parse(decrypt(JSON.parse(localStorage.data)[parseInt(localStorage.user) - 1 || 0], localStorage.session));
    var newData = {"name":"","account":"","secret":"","URI":"","digits":"","period":"","notes":""};
    newData.name = s("#addName").value || "";
    newData.account = s("#addAccount").value || "";
    newData.secret = s("#addSecret").value.replaceAll(" ", "") || "";
    newData.digits = s("#digits").value || 6;
    newData.period = s("#period").value || 30;
    newData.notes = s("#addNotes").value || "";
    var newURI = [];
    var obj = Array.prototype.slice.call(document.querySelectorAll(".addURI")), strObjlist = "";
    for (var x in obj) {
      if (isEmpty(obj[x].children[0].value)) {
        strObjlist+= x;
      }
    }
    var revObjlist = strObjlist.split("").reverse();
    for (x in revObjlist) {
      delete obj[parseInt(revObjlist[x])];
      obj = obj.filter(function(x) { return x !== null });
    }
    for (x in obj) {
      newURI[newURI.length] = obj[x].children[0].value;
    }
    newData.URI = newURI;
    preData[preData.length] = newData;
    preDataall[parseInt(localStorage.user) - 1 || 0] = encrypt(JSON.stringify(preData), localStorage.session);
    localStorage.setItem("data", JSON.stringify(preDataall));
    toastr.success("Data saved !");
    setTimeout(function(){redirect(getUrl("cancel") || "vault.html")}, 2000);
  } else {
    toastr.error("Secret key cannot be empty !");
  }
};
