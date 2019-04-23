function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import RRNLError from './RRNLError';

function getFormDataInterface() {
  return typeof window !== 'undefined' && window.FormData || global && global.FormData;
}

var RelayRequest =
/*#__PURE__*/
function () {
  function RelayRequest(operation, variables, cacheConfig, uploadables) {
    this.operation = operation;
    this.variables = variables;
    this.cacheConfig = cacheConfig;
    this.uploadables = uploadables;
    this.id = this.operation.id || this.operation.name || this._generateID();
    var fetchOpts = {
      method: 'POST',
      headers: {},
      body: this.prepareBody()
    };
    this.controller = window.AbortController ? new window.AbortController() : null;
    if (this.controller) fetchOpts.signal = this.controller.signal;
    this.fetchOpts = fetchOpts;
  }

  var _proto = RelayRequest.prototype;

  _proto.getBody = function getBody() {
    return this.fetchOpts.body;
  };

  _proto.prepareBody = function prepareBody() {
    var uploadables = this.uploadables;

    if (uploadables) {
      var _FormData_ = getFormDataInterface();

      if (!_FormData_) {
        throw new RRNLError('Uploading files without `FormData` interface does not supported.');
      }

      var formData = new _FormData_();
      formData.append('id', this.getID());
      formData.append('query', this.getQueryString());
      formData.append('variables', JSON.stringify(this.getVariables()));
      Object.keys(uploadables).forEach(function (key) {
        if (Object.prototype.hasOwnProperty.call(uploadables, key)) {
          formData.append(key, uploadables[key]);
        }
      });
      return formData;
    }

    return JSON.stringify({
      id: this.getID(),
      query: this.getQueryString(),
      variables: this.getVariables()
    });
  };

  _proto.getID = function getID() {
    return this.id;
  };

  _proto._generateID = function _generateID() {
    if (!this.constructor.lastGenId) {
      this.constructor.lastGenId = 0;
    }

    this.constructor.lastGenId += 1;
    return this.constructor.lastGenId.toString();
  };

  _proto.getQueryString = function getQueryString() {
    return this.operation.text || '';
  };

  _proto.getVariables = function getVariables() {
    return this.variables;
  };

  _proto.isMutation = function isMutation() {
    return this.getQueryString().startsWith('mutation');
  };

  _proto.isFormData = function isFormData() {
    var _FormData_ = getFormDataInterface();

    return !!_FormData_ && this.fetchOpts.body instanceof _FormData_;
  };

  _proto.cancel = function cancel() {
    if (this.controller) {
      this.controller.abort();
      return true;
    }

    return false;
  };

  _proto.clone = function clone() {
    // $FlowFixMe
    var newRequest = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    newRequest.fetchOpts = _objectSpread({}, this.fetchOpts);
    newRequest.fetchOpts.headers = _objectSpread({}, this.fetchOpts.headers);
    return newRequest;
  };

  return RelayRequest;
}();

export { RelayRequest as default };