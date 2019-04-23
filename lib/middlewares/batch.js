"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = batchMiddleware;
exports.RRNLBatchMiddlewareError = void 0;

require("core-js/modules/es6.array.index-of");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.array.is-array");

require("core-js/modules/es6.array.map");

require("regenerator-runtime/runtime");

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.set-prototype-of");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.function.name");

var _utils = require("../utils");

var _RelayRequestBatch = _interopRequireDefault(require("../RelayRequestBatch"));

var _RelayRequest = _interopRequireDefault(require("../RelayRequest"));

var _RRNLError2 = _interopRequireDefault(require("../RRNLError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// Max out at roughly 100kb (express-graphql imposed max)
var DEFAULT_BATCH_SIZE = 102400;

var RRNLBatchMiddlewareError =
/*#__PURE__*/
function (_RRNLError) {
  _inherits(RRNLBatchMiddlewareError, _RRNLError);

  function RRNLBatchMiddlewareError(msg) {
    var _this;

    _classCallCheck(this, RRNLBatchMiddlewareError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RRNLBatchMiddlewareError).call(this, msg));
    _this.name = 'RRNLBatchMiddlewareError';
    return _this;
  }

  return RRNLBatchMiddlewareError;
}(_RRNLError2["default"]);

exports.RRNLBatchMiddlewareError = RRNLBatchMiddlewareError;

function batchMiddleware(options) {
  var opts = options || {};
  var batchTimeout = opts.batchTimeout || 0; // 0 is the same as nextTick in nodeJS

  var allowMutations = opts.allowMutations || false;
  var batchUrl = opts.batchUrl || '/graphql/batch';
  var maxBatchSize = opts.maxBatchSize || DEFAULT_BATCH_SIZE;
  var singleton = {};
  var fetchOpts = {};
  if (opts.method) fetchOpts.method = opts.method;
  if (opts.credentials) fetchOpts.credentials = opts.credentials;
  if (opts.mode) fetchOpts.mode = opts.mode;
  if (opts.cache) fetchOpts.cache = opts.cache;
  if (opts.redirect) fetchOpts.redirect = opts.redirect;
  if (opts.headers) fetchOpts.headersOrThunk = opts.headers;
  return function (next) {
    return function (req) {
      // do not batch mutations unless allowMutations = true
      if (req.isMutation() && !allowMutations) {
        return next(req);
      }

      if (!(req instanceof _RelayRequest["default"])) {
        throw new RRNLBatchMiddlewareError('Relay batch middleware accepts only simple RelayRequest. Did you add batchMiddleware twice?');
      } // req with FormData can not be batched


      if (req.isFormData()) {
        return next(req);
      }

      return passThroughBatch(req, next, {
        batchTimeout: batchTimeout,
        batchUrl: batchUrl,
        singleton: singleton,
        maxBatchSize: maxBatchSize,
        fetchOpts: fetchOpts
      });
    };
  };
}

function passThroughBatch(req, next, opts) {
  var singleton = opts.singleton;
  var bodyLength = req.fetchOpts.body.length;

  if (!bodyLength) {
    return next(req);
  }

  if (!singleton.batcher || !singleton.batcher.acceptRequests) {
    singleton.batcher = prepareNewBatcher(next, opts);
  }

  if (singleton.batcher.bodySize + bodyLength + 1 > opts.maxBatchSize) {
    singleton.batcher = prepareNewBatcher(next, opts);
  } // +1 accounts for tailing comma after joining


  singleton.batcher.bodySize += bodyLength + 1; // queue request

  return new Promise(function (resolve, reject) {
    var relayReqId = req.getID();
    var requestMap = singleton.batcher.requestMap;
    var requestWrapper = {
      req: req,
      completeOk: function completeOk(res) {
        requestWrapper.done = true;
        resolve(res);
        requestWrapper.duplicates.forEach(function (r) {
          return r.completeOk(res);
        });
      },
      completeErr: function completeErr(err) {
        requestWrapper.done = true;
        reject(err);
        requestWrapper.duplicates.forEach(function (r) {
          return r.completeErr(err);
        });
      },
      done: false,
      duplicates: []
    };

    if (requestMap[relayReqId]) {
      /*
        I've run into a scenario with Relay Classic where if you have 2 components
        that make the exact same query, Relay will dedup the queries and reuse
        the request ids but still make 2 requests. The batch code then loses track
        of all the duplicate requests being made and never resolves or rejects
        the duplicate requests
        https://github.com/nodkz/react-relay-network-layer/pull/52
      */
      requestMap[relayReqId].duplicates.push(requestWrapper);
    } else {
      requestMap[relayReqId] = requestWrapper;
    }
  });
}

function prepareNewBatcher(next, opts) {
  var batcher = {
    bodySize: 2,
    // account for '[]'
    requestMap: {},
    acceptRequests: true
  };
  setTimeout(function () {
    batcher.acceptRequests = false;
    sendRequests(batcher.requestMap, next, opts).then(function () {
      return finalizeUncompleted(batcher.requestMap);
    })["catch"](function () {
      return finalizeUncompleted(batcher.requestMap);
    });
  }, opts.batchTimeout);
  return batcher;
}

function sendRequests(_x, _x2, _x3) {
  return _sendRequests.apply(this, arguments);
} // check that server returns responses for all requests


function _sendRequests() {
  _sendRequests = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(requestMap, next, opts) {
    var ids, request, _res, batchRequest, url, _opts$fetchOpts, headersOrThunk, fetchOpts, headers, batchResponse;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ids = Object.keys(requestMap);

            if (!(ids.length === 1)) {
              _context.next = 11;
              break;
            }

            // SEND AS SINGLE QUERY
            request = requestMap[ids[0]];
            _context.next = 5;
            return next(request.req);

          case 5:
            _res = _context.sent;
            request.completeOk(_res);
            request.duplicates.forEach(function (r) {
              return r.completeOk(_res);
            });
            return _context.abrupt("return", _res);

          case 11:
            if (!(ids.length > 1)) {
              _context.next = 37;
              break;
            }

            // SEND AS BATCHED QUERY
            batchRequest = new _RelayRequestBatch["default"](ids.map(function (id) {
              return requestMap[id].req;
            })); // $FlowFixMe

            _context.next = 15;
            return (0, _utils.isFunction)(opts.batchUrl) ? opts.batchUrl(requestMap) : opts.batchUrl;

          case 15:
            url = _context.sent;
            batchRequest.setFetchOption('url', url);
            _opts$fetchOpts = opts.fetchOpts, headersOrThunk = _opts$fetchOpts.headersOrThunk, fetchOpts = _objectWithoutProperties(_opts$fetchOpts, ["headersOrThunk"]);
            batchRequest.setFetchOptions(fetchOpts);

            if (!headersOrThunk) {
              _context.next = 24;
              break;
            }

            _context.next = 22;
            return (0, _utils.isFunction)(headersOrThunk) ? headersOrThunk(batchRequest) : headersOrThunk;

          case 22:
            headers = _context.sent;
            batchRequest.setFetchOption('headers', headers);

          case 24:
            _context.prev = 24;
            _context.next = 27;
            return next(batchRequest);

          case 27:
            batchResponse = _context.sent;

            if (!(!batchResponse || !Array.isArray(batchResponse.json))) {
              _context.next = 30;
              break;
            }

            throw new RRNLBatchMiddlewareError('Wrong response from server. Did your server support batch request?');

          case 30:
            batchResponse.json.forEach(function (payload) {
              if (!payload) return;
              var request = requestMap[payload.id];

              if (request) {
                var _res2 = createSingleResponse(batchResponse, payload);

                request.completeOk(_res2);
              }
            });
            return _context.abrupt("return", batchResponse);

          case 34:
            _context.prev = 34;
            _context.t0 = _context["catch"](24);
            ids.forEach(function (id) {
              requestMap[id].completeErr(_context.t0);
            });

          case 37:
            return _context.abrupt("return", Promise.resolve());

          case 38:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[24, 34]]);
  }));
  return _sendRequests.apply(this, arguments);
}

function finalizeUncompleted(requestMap) {
  Object.keys(requestMap).forEach(function (id) {
    var request = requestMap[id];

    if (!request.done) {
      request.completeErr(new RRNLBatchMiddlewareError("Server does not return response for request with id ".concat(id, " \n") + "Response should have following shape { \"id\": \"".concat(id, "\", \"data\": {} }")));
    }
  });
}

function createSingleResponse(batchResponse, json) {
  // Fallback for graphql-graphene and apollo-server batch responses
  var data = json.payload || json;
  var res = batchResponse.clone();
  res.processJsonData(data);
  return res;
}