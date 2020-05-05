
require("url");

exports.isURLValid = (urlStr) => {
  let url = {};
  try {
    url = new URL(urlStr);
  } catch (e) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

