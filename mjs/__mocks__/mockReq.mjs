function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable import/prefer-default-export, no-param-reassign */
var MockReq =
/*#__PURE__*/
function () {
  function MockReq(reqid, reqData) {
    if (reqData === void 0) {
      reqData = {};
    }

    this.reqid = reqid || Math.random().toString();
    this.reqData = reqData;
  }

  var _proto = MockReq.prototype;

  _proto.getID = function getID() {
    return this.reqid;
  };

  _proto.getQueryString = function getQueryString() {
    return this.reqData.query || '';
  };

  _proto.getDebugName = function getDebugName() {
    return "debugname" + this.reqid;
  };

  _proto.getVariables = function getVariables() {
    return this.reqData.variables || {};
  };

  _proto.getFiles = function getFiles() {
    return this.reqData.files;
  };

  _proto.reject = function reject(err) {
    this.error = err;
  };

  _proto.resolve = function resolve(resp) {
    this.payload = resp;
  };

  _proto.execute = function execute(rnl) {
    var operation = {
      id: this.getID(),
      text: this.getQueryString() || ''
    };
    var variables = this.getVariables() || {};
    var cacheConfig = {};
    var uploadables = this.getFiles();
    var res = rnl.fetchFn(operation, variables, cacheConfig, uploadables);
    var promise = new Promise(function (resolve, reject) {
      res.subscribe({
        complete: function complete() {},
        error: function error(_error) {
          return reject(_error);
        },
        next: function next(value) {
          return resolve(value);
        }
      });
    }); // avoid unhandled rejection in tests

    promise["catch"](function () {}); // but allow to read rejected response

    return promise;
  };

  return MockReq;
}();

export function mockReq(reqid, data) {
  return new MockReq(reqid ? reqid.toString() : undefined, data);
}
export function mockMutationReq(reqid, data) {
  return new MockReq(reqid ? reqid.toString() : undefined, _objectSpread({
    query: 'mutation {}'
  }, data));
}
export function mockFormDataReq(reqid, data) {
  return new MockReq(reqid ? reqid.toString() : undefined, _objectSpread({
    files: {
      file1: 'data'
    }
  }, data));
}
export function mockReqWithSize(reqid, size) {
  return mockReq(reqid, {
    query: "{" + 'x'.repeat(size) + "}"
  });
}
export function mockReqWithFiles(reqid) {
  return mockReq(reqid, {
    files: {
      file1: 'data',
      file2: 'data'
    }
  });
}