function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

import RelayRequest from './RelayRequest';
import RRNLError from './RRNLError';
export var RRNLRequestError =
/*#__PURE__*/
function (_RRNLError) {
  _inheritsLoose(RRNLRequestError, _RRNLError);

  function RRNLRequestError(msg) {
    var _this;

    _this = _RRNLError.call(this, msg) || this;
    _this.name = 'RRNLRequestError';
    return _this;
  }

  return RRNLRequestError;
}(RRNLError);
/**
 * Formats an error response from GraphQL server request.
 */

export function formatGraphQLErrors(request, errors) {
  var CONTEXT_BEFORE = 20;
  var CONTEXT_LENGTH = 60;

  if (!request.getQueryString) {
    return errors.join('\n');
  }

  var queryLines = request.getQueryString().split('\n');
  return errors.map(function (_ref, ii) {
    var locations = _ref.locations,
        message = _ref.message;
    var prefix = ii + 1 + ". ";
    var indent = ' '.repeat(prefix.length); // custom errors thrown in graphql-server may not have locations

    var locationMessage = locations ? '\n' + locations.map(function (_ref2) {
      var column = _ref2.column,
          line = _ref2.line;
      var queryLine = queryLines[line - 1];
      var offset = Math.min(column - 1, CONTEXT_BEFORE);
      return [queryLine.substr(column - 1 - offset, CONTEXT_LENGTH), ' '.repeat(Math.max(offset, 0)) + "^^^"].map(function (messageLine) {
        return indent + messageLine;
      }).join('\n');
    }).join('\n') : '';
    return prefix + message + locationMessage;
  }).join('\n');
}
export function createRequestError(req, res) {
  var errorReason = '';

  if (!res) {
    errorReason = 'Server return empty response.';
  } else if (res.errors) {
    if (req instanceof RelayRequest) {
      errorReason = formatGraphQLErrors(req, res.errors);
    } else {
      errorReason = JSON.stringify(res.errors);
    }
  } else if (!res.json) {
    errorReason = (res.text ? res.text : "Server return empty response with Status Code: " + res.status + ".") + (res ? "\n\n" + res.toString() : '');
  } else if (!res.data) {
    errorReason = 'Server return empty response.data.\n\n' + res.toString();
  }

  var error = new RRNLRequestError("Relay request for `" + req.getID() + "` failed by the following reasons:\n\n" + errorReason);
  error.req = req;
  error.res = res;
  return error;
}