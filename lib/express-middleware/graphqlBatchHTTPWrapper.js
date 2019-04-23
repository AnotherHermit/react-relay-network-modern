"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

require("core-js/modules/es6.array.filter");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.promise");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.string.iterator");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _default(graphqlHTTPMiddleware) {
  return function (req, res) {
    var subResponses = [];
    return Promise.all(req.body.map(function (data) {
      return new Promise(function (resolve) {
        var subRequest = _objectSpread({
          __proto__: req.__proto__
        }, req, {
          body: data
        });

        var subResponse = {
          status: function status(st) {
            this.statusCode = st;
            return this;
          },
          set: function set() {
            return this;
          },
          send: function send(payload) {
            resolve({
              status: this.statusCode,
              id: data.id,
              payload: payload
            });
          },
          // support express-graphql@0.5.2
          setHeader: function setHeader() {
            return this;
          },
          header: function header() {},
          write: function write(payload) {
            this.payload = payload;
          },
          end: function end(payload) {
            // support express-graphql@0.5.4
            if (payload) {
              this.payload = payload;
            }

            resolve({
              status: this.statusCode,
              id: data.id,
              payload: this.payload
            });
          }
        };
        subResponses.push(subResponse);
        graphqlHTTPMiddleware(subRequest, subResponse);
      });
    })).then(function (responses) {
      var response = '';
      responses.forEach(function (_ref, idx) {
        var status = _ref.status,
            id = _ref.id,
            payload = _ref.payload;

        if (status) {
          res.status(status);
        }

        var comma = responses.length - 1 > idx ? ',' : '';
        response += "{ \"id\":\"".concat(id, "\", \"payload\":").concat(payload, " }").concat(comma);
      });
      res.set('Content-Type', 'application/json');
      res.send("[".concat(response, "]"));
    })["catch"](function (err) {
      res.status(500).send({
        error: err.message
      });
    });
  };
}