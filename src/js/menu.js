s("#login").onclick = function() {
  redirect("login.html");
};
s("#register").onclick = function() {
  redirect("register.html");
};
s("#import").onclick = function() {
  redirect("import.html");
};
s("#settings").onclick = function() {
  redirect("settings.html");
};
if (getUrl("action") !== "welcome") {
  s("div.left").innerHTML = '<button type="button" class="btn btn-header sharp" id="back">Back</button>';
  s("#back").onclick = function(e){
    e.preventDefault();
    window.history.back();
  };
}