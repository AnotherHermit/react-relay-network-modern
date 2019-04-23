"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = performanceMiddleware;

require("core-js/modules/es6.function.bind");

/* eslint-disable no-console */
function performanceMiddleware(opts) {
  var logger = opts && opts.logger || console.log.bind(console, '[RELAY-NETWORK]');
  return function (next) {
    return function (req) {
      var start = new Date().getTime();
      return next(req).then(function (res) {
        var end = new Date().getTime();
        logger("[".concat(end - start, "ms] ").concat(req.getID()), req, res);
        return res;
      });
    };
  };
}