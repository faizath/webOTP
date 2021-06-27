var totpLoop, itemslist = [];
var qrc = new QRCode(s("#qrcontainer"));
s("#add").onclick = function() {
  redirect("add.html?cancel=" + encodeURIComponent(mainurl));
};
s("#settings").onclick = function() {
  redirect("settings.html");
};
function loadItemlist() {
  itemslist = [];
  if (!getUser()) {
    toastr.error("You're not logged in !");
    setTimeout(function(){redirect("menu.html");}, 1000);
  } else {
    if (!tryDecrypt(JSON.parse(localStorage.data)[parseInt(localStorage.user) - 1 || 0], localStorage.session)) {
      redirect("login.html");
    }
    if (JSON.parse(decrypt(JSON.parse(localStorage.data)[parseInt(localStorage.user) - 1 || 0], localStorage.session)).length === 0) {
      s("div.center").innerHTML = '<span class="title">Vault</span>';
      s("content").innerHTML = '<div class="d-grid gap-2 m-1"><p class="mx-auto">There are no items to list.</p></div>';
    } else {
      var htmlItemlist = "", allData = JSON.parse(decrypt(JSON.parse(localStorage.data)[parseInt(localStorage.user) - 1 || 0], localStorage.session));
      htmlItemlist += `<div class="d-flex justify-content-center"><h5>${allData.length.toString()}${(allData.length > 1)?" items":" item"}</h5></div>`;
      for (var itemList in allData) {
        let webOTPname = allData[itemList].name;
        let webOTPaccount = allData[itemList].account;
        htmlItemlist += `<div class="d-grid gap-2 m-1"><button class="btn btn-large itemlist" id="item${parseInt(itemList) + 1}"><div class="media m-0"><div class="media-body m-0"><h5 class="m-0">${webOTPname}</h5><p class="m-0">${webOTPaccount}</p></div></div></button></div>`;
        itemslist[itemslist.length] = {"webOTPname":webOTPname,"webOTPaccount":webOTPaccount,"itemIndex":parseInt(itemList) + 1};
      }
      s("#searchbar").classList.remove("d-none");
      s("#main").innerHTML = htmlItemlist;
      s(".py-1").focus();
    }
  }
}
loadItemlist();
function containerBtn() {
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
}
function digit() {
  if (this.value == 6 || this.value == 8 || this.value === null || this.value === "") {} else {
    toastr.warning("TOTP digits can only between 6 or 8, the default is 6");
    if (this.value == 7) {} else if (this.value >= 8) {this.value = 8;} else {this.value = 6;}
  }
}
s("#digits").onchange = digit;
s("#digits").onkeyup = digit;
const circleProgress = new CircleProgress('.progress', {
  max: 30,
  value: 0,
  clockwise: false,
  textFormat: function(value) {
      return value;
  }
});
function loadItem() {
  s("body").style.overflow = "hidden";
  s("html").classList.add("no-scrollbar");
  var openData = JSON.parse(decrypt(JSON.parse(localStorage.data)[parseInt(localStorage.user) - 1 || 0], localStorage.session))[parseInt(this.id.replace("item","")) - 1];
  sessionStorage.setItem('item', this.id.replace("item",""));
  circleProgress.max = parseInt(openData.period);
  s("#addName").value = openData.name || "";
  s("#addAccount").value = openData.account || "";
  s("#addSecret").value = openData.secret || "";
  s("#digits").value = openData.digits || 6;
  s("#period").value = openData.period || 30;
  s("#addNotes").value = openData.notes || "";
  for (var URIlist in openData.URI) {
    if (isEmpty(s("#addURI" + (parseInt(URIlist) + 1).toString()))) {
      containerBtn();
    }
    s("#addURI" + (parseInt(URIlist) + 1).toString()).value = openData.URI[URIlist];
  }
  if (nodeLength(".addURI") !== openData.URI.length) {
    for (i = 1; i < nodeLength(".addURI"); i++) {
      s("#addcontainerURI" + (i + openData.URI.length).toString()).remove();
    }
  }
  var totp = new jsOTP.totp(parseInt(openData.period), parseInt(openData.digits));
  var code = totp.getOtp(openData.secret);
  var updateTotp = function(secret, el) {
    el.innerText = totp.getOtp(secret);
  };
  var epoch = Math.round(new Date().getTime() / 1000.0) % parseInt(openData.period);
  circleProgress.value = parseInt(openData.period) - epoch;
  updateTotp(openData.secret, s(".h1"));
  var timeLoop = function() {
      var epoch = Math.round(new Date().getTime() / 1000.0);
      circleProgress.value = circleProgress.value - 1;
      if (epoch % parseInt(openData.period) === 0) {
          circleProgress.value = parseInt(openData.period);
          updateTotp(openData.secret, s(".h1"));
      }
  };
  totpLoop = setInterval(timeLoop, 1000);
  s(".sidenav").style.width = "100%";
  var otpauthURI = `otpauth://totp/${openData.name || ""}:${openData.account || ""}?secret=${openData.secret || ""}&digits=${openData.digits || 6}&period=${openData.period || 30}`;
  qrc.makeCode(otpauthURI);
  s("#showQR").onclick = function() {
    toastr.info(`<img id='qr' src='${new DOMParser().parseFromString(s("#qrcontainer").innerHTML, 'text/html').querySelector("img").src}'><br><br><button type='button' id='dl' class='btn border mx-1'>Download</button><button type='button' id='cancel' class='btn border'>Dismiss</button>`,'', {
      allowHtml: true,
      timeOut: 0,
      extendedTimeOut: 0,
      positionClass: "toast-top-full-width",
      preventDuplicates: true,
      onShown: function (toast) {
        s("#dl").onclick = function(){
          saveAs(new DOMParser().parseFromString(s("#qrcontainer").innerHTML, 'text/html').querySelector("img").src, `${openData.name || "QR"}.png`);
        };
      }
    });
  };
  s("#deleteItem").onclick = function() {
    toastr.info("<button type='button' id='deleteConfirmed' class='btn border mx-1'>Yes</button><button type='button' id='deleteCanceled' class='btn border'>No</button>",`Are you sure want to delete this item: ${s("#addName").value}, ${s("#addAccount").value}`, {
      allowHtml: true,
      timeOut: 0,
      extendedTimeOut: 0,
      positionClass: "toast-top-full-width",
      preventDuplicates: true,
      onShown: function (toast) {
        s("#deleteConfirmed").onclick = function(){
          var preDataall = JSON.parse(localStorage.data), preData = JSON.parse(decrypt(JSON.parse(localStorage.data)[parseInt(localStorage.user) - 1 || 0], localStorage.session));
          delete preData[parseInt(sessionStorage.item) - 1];
          preData = preData.filter(function(x) { return x !== null });
          preDataall[parseInt(localStorage.user) - 1 || 0] = encrypt(JSON.stringify(preData), localStorage.session);
          localStorage.setItem("data", JSON.stringify(preDataall));
          loadItemlist();
          closeSidenav();
          toastr.success("Item deleted");
        };
      }
    });
  };
}
[].forEach.call(document.querySelectorAll("button.itemlist"), function(el) {
  el.onclick = loadItem;
});
s("#save").onclick = function() {
  if (s("#addSecret").value) {
    var preDataall = JSON.parse(localStorage.data), preData = JSON.parse(decrypt(JSON.parse(localStorage.data)[parseInt(localStorage.user) - 1 || 0], localStorage.session));
    var newData = {"name":"","account":"","secret":"","URI":"","digits":"","period":"","notes":""};
    newData.name = s("#addName").value || "";
    newData.account = s("#addAccount").value || "";
    newData.secret = s("#addSecret").value || "";
    if (s("#digits").value != 6 || s("#digits").value != 8) {
      newData.digits = 6;
    } else {
      newData.digits = s("#digits").value || 6;
    }
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
    preData[parseInt(sessionStorage.item) - 1] = newData;
    preDataall[parseInt(localStorage.user) - 1 || 0] = encrypt(JSON.stringify(preData), localStorage.session);
    localStorage.setItem("data", JSON.stringify(preDataall));
    toastr.success("Data saved !");
  } else {
    toastr.error("Secret key cannot be empty !");
  }
};
s("#addURIbtn").onclick = containerBtn;
function closeSidenav() {
  clearInterval(totpLoop);
  toastr.clear();
  s("body").style.overflow = "";
  s("html").classList.remove("no-scrollbar");
  loadItemlist();
  [].forEach.call(document.querySelectorAll("button.itemlist"), function(el) {
    el.onclick = loadItem;
  });
  qrc.clear();
  sessionStorage.removeItem("item");
  s(".sidenav").style.width = "0";
}
s("#closebtn").onclick = closeSidenav;
s("#copy").onclick = function() {
  copyText(s(".h1").innerText);
  toastr.success("OTP code copied !");
};
$(document).ready(function(){
  $('.py-1').keyup(function() {
    var searchField = $(this).val();
    if (tryRegex(searchField)) {
      var regex = new RegExp(searchField, "i");
      var count = 0;
      var htmlItemlist = "";
      $.each(itemslist, function(key, val){
          if (val.webOTPname.search(regex) != -1 || val.webOTPaccount.search(regex) != -1) {
              htmlItemlist += `<div class="d-grid gap-2 m-1"><button class="btn btn-large itemlist" id="item${val.itemIndex}"><div class="media m-0"><div class="media-body m-0"><h5 class="m-0">${val.webOTPname}</h5><p class="m-0">${val.webOTPaccount}</p></div></div></button></div>`;
              count++;
          }
      });
      var countHTML = `<div class="d-flex justify-content-center"><h5>${count}${(count > 1)?" items":" item"}</h5></div>`;
      $('#main').html(countHTML + htmlItemlist);
    } else {
      $('#main').html(`<div class="d-flex justify-content-center"><h5>0 item</h5></div>`);
    }
    $("button.itemlist").click(loadItem);
  });
});
