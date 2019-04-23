function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* eslint-disable no-param-reassign, prefer-const */
import { createRequestError } from './createRequestError';
import RelayResponse from './RelayResponse';

function runFetch(req) {
  var url = req.fetchOpts.url;
  if (!url) url = '/graphql';
  if (!req.fetchOpts.headers.Accept) req.fetchOpts.headers.Accept = '*/*';

  if (!req.fetchOpts.headers['Content-Type'] && !req.isFormData()) {
    req.fetchOpts.headers['Content-Type'] = 'application/json';
  }

  return fetch(url, req.fetchOpts);
} // convert fetch response to RelayResponse object


var convertResponse = function convertResponse(next) {
  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(req) {
        var resFromFetch, res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return next(req);

              case 2:
                resFromFetch = _context.sent;
                _context.next = 5;
                return RelayResponse.createFromFetch(resFromFetch);

              case 5:
                res = _context.sent;

                if (!(res.status && res.status >= 400)) {
                  _context.next = 8;
                  break;
                }

                throw createRequestError(req, res);

              case 8:
                return _context.abrupt("return", res);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }()
  );
};

export default function fetchWithMiddleware(req, middlewares, // works with RelayResponse
rawFetchMiddlewares, // works with raw fetch response
noThrow) {
  // $FlowFixMe
  var wrappedFetch = compose.apply(void 0, middlewares.concat([convertResponse], rawFetchMiddlewares))(runFetch);
  return wrappedFetch(req).then(function (res) {
    if (!noThrow && (!res || res.errors || !res.data)) {
      throw createRequestError(req, res);
    }

    return res;
  });
}
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  } else {
    var last = funcs[funcs.length - 1];
    var rest = funcs.slice(0, -1); // $FlowFixMe - Suppress error about promise not being callable

    return function () {
      return rest.reduceRight(function (composed, f) {
        return f(composed);
      }, last.apply(void 0, arguments));
    };
  }
}