/* eslint-disable no-console */
export default function performanceMiddleware(opts) {
  var logger = opts && opts.logger || console.log.bind(console, '[RELAY-NETWORK]');
  return function (next) {
    return function (req) {
      var start = new Date().getTime();
      return next(req).then(function (res) {
        var end = new Date().getTime();
        logger("[" + (end - start) + "ms] " + req.getID(), req, res);
        return res;
      });
    };
  };
}