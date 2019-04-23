function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import RRNLError from './RRNLError';

var RelayRequestBatch =
/*#__PURE__*/
function () {
  function RelayRequestBatch(requests) {
    this.requests = requests;
    this.fetchOpts = {
      method: 'POST',
      headers: {},
      body: this.prepareBody()
    };
  }

  var _proto = RelayRequestBatch.prototype;

  _proto.setFetchOption = function setFetchOption(name, value) {
    this.fetchOpts[name] = value;
  };

  _proto.setFetchOptions = function setFetchOptions(opts) {
    this.fetchOpts = _objectSpread({}, this.fetchOpts, opts);
  };

  _proto.getBody = function getBody() {
    if (!this.fetchOpts.body) {
      this.fetchOpts.body = this.prepareBody();
    }

    return this.fetchOpts.body || '';
  };

  _proto.prepareBody = function prepareBody() {
    return "[" + this.requests.map(function (r) {
      return r.getBody();
    }).join(',') + "]";
  };

  _proto.getIds = function getIds() {
    return this.requests.map(function (r) {
      return r.getID();
    });
  };

  _proto.getID = function getID() {
    return "BATCH_REQUEST:" + this.getIds().join(':');
  };

  _proto.isMutation = function isMutation() {
    return false;
  };

  _proto.isFormData = function isFormData() {
    return false;
  };

  _proto.clone = function clone() {
    // $FlowFixMe
    var newRequest = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    newRequest.fetchOpts = _objectSpread({}, this.fetchOpts);
    newRequest.fetchOpts.headers = _objectSpread({}, this.fetchOpts.headers);
    return newRequest;
  };

  _proto.getVariables = function getVariables() {
    throw new RRNLError('Batch request does not have variables.');
  };

  _proto.getQueryString = function getQueryString() {
    return this.prepareBody();
  };

  return RelayRequestBatch;
}();

export { RelayRequestBatch as default };