if (getUrl("event") === "import") {
  s("form").onsubmit = function(e){
    e.preventDefault();
    var preData;
    if (isEmpty(localStorage.getItem("usernames"))) {
      localStorage.setItem("usernames", JSON.stringify([s("#registerUsername").value]));
    } else {
      if (searchArrayElement(JSON.parse(localStorage.getItem("usernames")), s("#registerUsername").value) === false) {
        var x = JSON.parse(localStorage.getItem("usernames"));
        x[x.length] = s("#registerUsername").value;
        localStorage.setItem("usernames", JSON.stringify(x));
      } else {
        toastr.error("Username already exists !");
        return;
      }
    }
    if (getUrl("type") === "single") {
      preData = "[" + localStorage.importDecrypted + "]";
    } else if (getUrl("type") === "multiple") {
      preData = localStorage.importDecrypted;
    }
    if (isEmpty(localStorage.getItem("data"))) {
      localStorage.setItem("data", '["' + encrypt(preData, CryptoJS.SHA512(s("#registerPassword").value).toString()) + '"]');
    } else {
      var y = JSON.parse(localStorage.getItem("data"));
      y[y.length] = encrypt(preData, CryptoJS.SHA512(s("#registerPassword").value).toString());
      localStorage.setItem("data", JSON.stringify(y));
    }
    localStorage.removeItem("importDecrypted");
    if (isEmpty(localStorage.getItem("session"))) {
      localStorage.setItem("session", CryptoJS.SHA512(s("#registerPassword").value).toString());
      redirect("vault.html");
    } else {
      redirect("login.html");
    }
  };
} else {
  s("form").onsubmit = function(e){
    e.preventDefault();
    if (isEmpty(localStorage.getItem("usernames"))) {
      localStorage.setItem("usernames", JSON.stringify([s("#registerUsername").value]));
    } else {
      if (searchArrayElement(JSON.parse(localStorage.getItem("usernames")), s("#registerUsername").value) === false) {
        var x = JSON.parse(localStorage.getItem("usernames"));
        x[x.length] = s("#registerUsername").value;
        localStorage.setItem("usernames", JSON.stringify(x));
      } else {
        toastr.error("Username already exists !");
        return;
      }
    }
    if (isEmpty(localStorage.getItem("data"))) {
      localStorage.setItem("data", '["' + encrypt('[]', CryptoJS.SHA512(s("#registerPassword").value).toString()) + '"]');
    } else {
      var y = JSON.parse(localStorage.getItem("data"));
      y[y.length] = encrypt('[]', CryptoJS.SHA512(s("#registerPassword").value).toString());
      localStorage.setItem("data", JSON.stringify(y));
    }
    if (isEmpty(localStorage.getItem("session"))) {
      localStorage.setItem("session", CryptoJS.SHA512(s("#registerPassword").value).toString());
      redirect("vault.html");
    } else {
      redirect("login.html");
    }
  };
}
