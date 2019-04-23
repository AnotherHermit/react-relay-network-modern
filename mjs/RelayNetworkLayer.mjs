import { Network } from 'relay-runtime'; // eslint-disable-line

import RelayRequest from './RelayRequest';
import fetchWithMiddleware from './fetchWithMiddleware';

var RelayNetworkLayer = function RelayNetworkLayer(middlewares, opts) {
  var _this = this;

  this._middlewares = [];
  this._rawMiddlewares = [];
  this._middlewaresSync = [];
  this.noThrow = false;
  var mws = Array.isArray(middlewares) ? middlewares : [middlewares];
  mws.forEach(function (mw) {
    if (mw) {
      if (mw.execute) {
        _this._middlewaresSync.push(mw.execute);
      } else if (mw.isRawMiddleware) {
        _this._rawMiddlewares.push(mw);
      } else {
        _this._middlewares.push(mw);
      }
    }
  });

  if (opts) {
    this.subscribeFn = opts.subscribeFn;
    this.noThrow = opts.noThrow === true; // TODO deprecate

    if (opts.beforeFetch) {
      this._middlewaresSync.push(opts.beforeFetch);
    }
  }

  this.fetchFn = function (operation, variables, cacheConfig, uploadables) {
    for (var i = 0; i < _this._middlewaresSync.length; i++) {
      var _res = _this._middlewaresSync[i](operation, variables, cacheConfig, uploadables);

      if (_res) return _res;
    }

    var req = new RelayRequest(operation, variables, cacheConfig, uploadables);
    var res = fetchWithMiddleware(req, _this._middlewares, _this._rawMiddlewares, _this.noThrow);
    return {
      subscribe: function subscribe(sink) {
        res.then(function (value) {
          sink.next(value);
          sink.complete();
        }, function (error) {
          if (error && error.name && error.name === 'AbortError') {
            sink.complete();
          } else sink.error(error);
        }) // avoid unhandled promise rejection error
        ["catch"](function () {});
        return function () {
          req.cancel();
        };
      }
    };
  };

  var network = Network.create(this.fetchFn, this.subscribeFn);
  this.execute = network.execute;
  this.executeWithEvents = network.executeWithEvents;
};

export { RelayNetworkLayer as default };