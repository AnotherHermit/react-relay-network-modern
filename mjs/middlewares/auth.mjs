function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/* eslint-disable no-param-reassign, arrow-body-style, dot-notation */
import { isFunction } from '../utils';
import RRNLError from '../RRNLError';
export var RRNLAuthMiddlewareError =
/*#__PURE__*/
function (_RRNLError) {
  _inheritsLoose(RRNLAuthMiddlewareError, _RRNLError);

  function RRNLAuthMiddlewareError(msg) {
    var _this;

    _this = _RRNLError.call(this, msg) || this;
    _this.name = 'RRNLAuthMiddlewareError';
    return _this;
  }

  return RRNLAuthMiddlewareError;
}(RRNLError);
export default function authMiddleware(opts) {
  var _ref = opts || {},
      tokenOrThunk = _ref.token,
      tokenRefreshPromise = _ref.tokenRefreshPromise,
      _ref$allowEmptyToken = _ref.allowEmptyToken,
      allowEmptyToken = _ref$allowEmptyToken === void 0 ? false : _ref$allowEmptyToken,
      _ref$prefix = _ref.prefix,
      prefix = _ref$prefix === void 0 ? 'Bearer ' : _ref$prefix,
      _ref$header = _ref.header,
      header = _ref$header === void 0 ? 'Authorization' : _ref$header;

  var tokenRefreshInProgress = null;
  return function (next) {
    return (
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(req) {
          var token, _res;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return isFunction(tokenOrThunk) ? tokenOrThunk(req) : tokenOrThunk;

                case 3:
                  token = _context.sent;

                  if (!(!token && tokenRefreshPromise && !allowEmptyToken)) {
                    _context.next = 6;
                    break;
                  }

                  throw new RRNLAuthMiddlewareError('Empty token');

                case 6:
                  if (token) {
                    req.fetchOpts.headers[header] = "" + prefix + token;
                  }

                  _context.next = 9;
                  return next(req);

                case 9:
                  _res = _context.sent;
                  return _context.abrupt("return", _res);

                case 13:
                  _context.prev = 13;
                  _context.t0 = _context["catch"](0);

                  if (!(_context.t0 && tokenRefreshPromise)) {
                    _context.next = 20;
                    break;
                  }

                  if (!(_context.t0.message === 'Empty token' || _context.t0.res && _context.t0.res.status === 401)) {
                    _context.next = 20;
                    break;
                  }

                  if (!tokenRefreshPromise) {
                    _context.next = 20;
                    break;
                  }

                  if (!tokenRefreshInProgress) {
                    tokenRefreshInProgress = Promise.resolve(tokenRefreshPromise(req, _context.t0.res)).then(function (newToken) {
                      tokenRefreshInProgress = null;
                      return newToken;
                    })["catch"](function (err) {
                      tokenRefreshInProgress = null;
                      throw err;
                    });
                  }

                  return _context.abrupt("return", tokenRefreshInProgress.then(function (newToken) {
                    var newReq = req.clone();
                    newReq.fetchOpts.headers[header] = "" + prefix + newToken;
                    return next(newReq); // re-run query with new token
                  }));

                case 20:
                  throw _context.t0;

                case 21:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[0, 13]]);
        }));

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }()
    );
  };
}