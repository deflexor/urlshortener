const expect = require("chai").expect;

const util = require("../util");

describe("util.js", () => {
  describe("isURLValid()", () => {
    it("should return true on correct URL", () => {      
      expect( util.isURLValid("http://yandex.ru/") ).to.equal(true);
      expect( util.isURLValid("http://yandex") ).to.equal(true);
      expect( util.isURLValid("https://mail.yandex.ru/") ).to.equal(true);
    });
    it("should return false on incorreect URL", () => {
      expect( util.isURLValid("//yandex.ru/") ).to.equal(false);
      expect( util.isURLValid("") ).to.equal(false);
      expect( util.isURLValid("http://") ).to.equal(false);
      expect( util.isURLValid("zzz") ).to.equal(false);
      expect( util.isURLValid("123") ).to.equal(false);
      expect( util.isURLValid("#$@#$@") ).to.equal(false);
      expect( util.isURLValid("yandex.ru") ).to.equal(false);
    });
  });
});
