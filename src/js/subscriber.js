// Inspired by: https://github.com/gorhill/uBlock/blob/master/src/js/scriptlets/subscriber.js
// License: https://github.com/gorhill/uBlock/blob/master/LICENSE.txt
'use strict';
(( ) => {
if ( document instanceof HTMLDocument === false ) { return; }
const onMaybeSubscriptionLinkClicked = function(ev) {
    if ( ev.button !== 0 || ev.isTrusted === false ) { return; }
    const target = ev.target.closest('a');
    if ( target instanceof HTMLAnchorElement === false ) { return; }
    if (target.href.indexOf("otpauth://totp/") !== -1) {
      const [pre, post] = target.href.split('?');
      const decodedLabel = decodeURIComponent(pre.replace('otpauth://totp/', ''));
      var info = {};
      if (decodedLabel.split(":").length === 1) {
        info.name = decodedLabel || "";
      } else {
        info.name = decodedLabel.split(":")[0] || "";
        info.account = decodedLabel.split(":")[1] || "";
      }
      var fix, args = new URLSearchParams(post);
      info.secret = args.get('secret') || "";
      info.digits = args.get('digits') || 6;
      info.period = args.get('period') || 30;
      Object.keys(info).forEach(key => {
        fix += `&${key}=${info[key]}`;
      });
      chrome.tabs.create({
        url: `${windowurl.origin}/add.html?import=1${fix}`,
        selected: true
      });
      ev.stopPropagation();
      ev.preventDefault();
    } else {
      return;
    }
};
document.addEventListener('click', onMaybeSubscriptionLinkClicked);
})();
void 0;
