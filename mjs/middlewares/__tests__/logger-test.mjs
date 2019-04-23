function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import fetchMock from 'fetch-mock';
import RelayNetworkLayer from '../../RelayNetworkLayer';
import { mockReq } from '../../__mocks__/mockReq';
import loggerMiddleware from '../logger';
describe('middlewares/logger', function () {
  beforeEach(function () {
    fetchMock.restore();
  });
  it('measure request time for request',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var logger, rnl;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fetchMock.mock({
              matcher: '/graphql',
              response: {
                status: 200,
                body: {
                  data: 'PAYLOAD'
                }
              },
              method: 'POST'
            });
            logger = jest.fn();
            rnl = new RelayNetworkLayer([loggerMiddleware({
              logger: logger
            })]);
            _context.next = 5;
            return mockReq('MyRequest').execute(rnl);

          case 5:
            expect(logger).toHaveBeenCalledTimes(2); // fix changing text `in 12ms` for snapshot

            logger.mock.calls[1][0] = logger.mock.calls[1][0].replace(/in \d+ms/, 'in XXXms');
            logger.mock.calls[1][1].req = 'RelayRequest object';
            logger.mock.calls[1][1].res = 'RelayResponse object';
            expect(logger.mock.calls).toMatchSnapshot();

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
});