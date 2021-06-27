s("#menu").onclick = function(){
  redirect("menu.html");
};
if (isEmpty(localStorage.getItem("usernames")) || localStorage.getItem("usernames") === "[]") {
  s("#buttoncontainer").innerHTML = '<button class="btn btn-large" type="button" disabled>No Local Account Found</button><button class="btn btn-large" type="button" id="import">Import Item</button><button class="btn btn-large" type="button" id="home">Back to Home</button>';
} else {
  var allbtnContent = "";
  var usernamesObj = JSON.parse(localStorage.getItem("usernames"));
  for (i = 0; i < usernamesObj.length; i++) {
    allbtnContent += '<button class="btn btn-large localaccountlist" type="button" id="account' + (i + 1).toString() + '">Local Account: ' + usernamesObj[i] + '</button>';
  }
  s(".d-flex").classList.remove("d-none");
  s("h5").innerText = usernamesObj.length.toString() + " Local Accounts";
  s("#buttoncontainer").innerHTML = allbtnContent;
}
if (s("#home")) {
  s("#home").onclick = function(){
    redirect("menu.html");
  };
  s("#import").onclick = function(){
    redirect("import.html");
  };
}
[].forEach.call(document.querySelectorAll("button.localaccountlist"), function(el) {
  el.onclick = function() {
    if (tryDecrypt(JSON.parse(localStorage.data)[parseInt(this.id.replace("account","")) - 1], localStorage.session)) {
      redirect("vault.html");
    } else {
      redirect("verify.html?user=" + this.id.replace("account",""));
    }
  };
});
