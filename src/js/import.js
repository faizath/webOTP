var json;
if (theme === "light") {
  s("#remove").style.color = "#000";
}
s("input[type=file]").addEventListener('change', (event) => {
  s("#txtJson").value = "";
  s("#txtJson").setAttribute("disabled", "");
  event.target.files[0].text().then(function(value){
    if (IsJsonString(value)) {
      json = JSON.parse(value);
    } else {
      json = null;
      toastr.error("Invalid JSON format !");
    }
  });
});
s("#remove").onclick = function(){
  s("#file").value = "";
  s("#txtJson").removeAttribute("disabled");
};
if (!isEmpty(s("#txtJson").value)) {
  s("#file").setAttribute("disabled", "");
}
s("#txtJson").onkeyup = function(){
  if (!isEmpty(s("#txtJson").value)) {
    s("#file").setAttribute("disabled", "");
  } else {
    if (s("#file").disabled) {
      s("#file").removeAttribute("disabled");
    }
  }
};
s("#submit").onclick = function(){
  if (!isEmpty(s("#file").value) && !isEmpty(s("#txtJson").value)){
    toastr.error("Please choose only one method !");
  } else if (s("#file").disabled) {
    if (!IsJsonString(s("#txtJson").value)) {
      toastr.error("Invalid JSON format !");
    } else {
      if (!isEmpty(JSON.parse(s("#txtJson").value)[0])) {
        if (!isEmpty(JSON.parse(s("#txtJson").value)[0].name)) {
          localStorage.setItem("importDecrypted", JSON.stringify(JSON.parse(s("#txtJson").value)));
          redirect("verify.html?event=importdecrypted&type=multiple");
        } else {
          if (JSON.parse(s("#txtJson").value).length > 1) {
            toastr.error("Invalid webOTP data export format !");
          } else {
            localStorage.setItem("importEncrypted", JSON.stringify(JSON.parse(s("#txtJson").value)));
            redirect("verify.html?event=importencrypted");
          }
        }
      } else {
        if (!isEmpty(JSON.parse(s("#txtJson").value).name)) {
          localStorage.setItem("importDecrypted", JSON.stringify(JSON.parse(s("#txtJson").value)));
          redirect("verify.html?event=importdecrypted&type=single");
        } else {
          toastr.error("Invalid webOTP data export format !");
        }
      }
    }
  } else if (s("#txtJson").disabled) {
    if (isEmpty(json)) {
      toastr.error("Invalid JSON format !");
    } else {
      if (!isEmpty(json[0])) {
        if (!isEmpty(json[0].name)) {
          localStorage.setItem("importDecrypted", JSON.stringify(json));
          redirect("verify.html?event=importdecrypted&type=multiple");
        } else {
          if (json.length > 1) {
            toastr.error("Invalid webOTP data export format !");
          } else {
            localStorage.setItem("importEncrypted", JSON.stringify(json));
            redirect("verify.html?event=importencrypted");
          }
        }
      } else {
        if (!isEmpty(json.name)) {
          localStorage.setItem("importDecrypted", JSON.stringify(json));
          redirect("verify.html?event=importdecrypted&type=single");
        } else {
          toastr.error("Invalid webOTP data export format !");
        }
      }
    }
  } else {
    toastr.error("Form cannot be empty !");
  }
};