function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import fetchMock from 'fetch-mock';
import FormData from 'form-data';
import { RelayNetworkLayer, batchMiddleware } from '../..';
import { mockReq, mockReqWithSize, mockMutationReq, mockReqWithFiles } from '../../__mocks__/mockReq';
global.FormData = FormData;
describe('middlewares/batch', function () {
  beforeEach(function () {
    fetchMock.restore();
  });
  it('should make a successfull single request',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var rnl, req, res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fetchMock.post('/graphql', {
              data: {
                ok: 1
              }
            });
            rnl = new RelayNetworkLayer([batchMiddleware()]);
            req = mockReq(1);
            _context.next = 5;
            return req.execute(rnl);

          case 5:
            res = _context.sent;
            expect(res.data).toEqual({
              ok: 1
            });
            expect(fetchMock.lastOptions()).toMatchSnapshot();

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('should make a successfully batch request',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var rnl, req1, req2, _ref3, res1, res2;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            fetchMock.mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  id: 1,
                  data: {
                    ok: 1
                  }
                }, {
                  id: 2,
                  data: {
                    ok: 2
                  }
                }]
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([batchMiddleware()]);
            req1 = mockReq(1);
            req2 = mockReq(2);
            _context2.next = 6;
            return Promise.all([req1.execute(rnl), req2.execute(rnl)]);

          case 6:
            _ref3 = _context2.sent;
            res1 = _ref3[0];
            res2 = _ref3[1];
            expect(res1.data).toEqual({
              ok: 1
            });
            expect(res2.data).toEqual({
              ok: 2
            });
            expect(fetchMock.lastOptions()).toMatchSnapshot();

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  it('should make a successfully batch request with duplicate request ids',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var rnl, req1, req2, req3, _ref5, res1, res2, res3;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            fetchMock.mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  id: 1,
                  data: {
                    ok: 1
                  }
                }, {
                  id: 2,
                  data: {
                    ok: 2
                  }
                }]
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([batchMiddleware()]);
            req1 = mockReq(1);
            req2 = mockReq(2);
            req3 = mockReq(2);
            _context3.next = 7;
            return Promise.all([req1.execute(rnl), req2.execute(rnl), req3.execute(rnl)]);

          case 7:
            _ref5 = _context3.sent;
            res1 = _ref5[0];
            res2 = _ref5[1];
            res3 = _ref5[2];
            expect(res1.data).toEqual({
              ok: 1
            });
            expect(res2.data).toEqual({
              ok: 2
            });
            expect(res3.data).toEqual({
              ok: 2
            });
            expect(fetchMock.lastOptions()).toMatchSnapshot();

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  it('should reject if server does not return response for request',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var rnl, req1, req2, _ref7, res1, res2;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            fetchMock.mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  data: {}
                }, {
                  id: 2,
                  data: {
                    ok: 2
                  }
                }]
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([batchMiddleware()]);
            req1 = mockReq(1);
            req2 = mockReq(2); // prettier-ignore

            _context4.next = 6;
            return Promise.all([req1.execute(rnl)["catch"](function (e) {
              return e;
            }), req2.execute(rnl)]);

          case 6:
            _ref7 = _context4.sent;
            res1 = _ref7[0];
            res2 = _ref7[1];
            expect(res1).toBeInstanceOf(Error);
            expect(res1.toString()).toMatch('Server does not return response for request');
            expect(res2.data).toEqual({
              ok: 2
            });
            expect(fetchMock.lastOptions()).toMatchSnapshot();

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
  it('should reject if server does not return response for duplicate request ids',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5() {
    var rnl, req1, req2, req3, _ref9, res1, res2, res3;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            fetchMock.mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  data: {}
                }, {
                  id: 2,
                  data: {
                    ok: 2
                  }
                }]
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([batchMiddleware()]);
            req1 = mockReq(1);
            req2 = mockReq(2);
            req3 = mockReq(3);
            _context5.next = 7;
            return Promise.all([req1.execute(rnl)["catch"](function (e) {
              return e;
            }), req2.execute(rnl), req3.execute(rnl)["catch"](function (e) {
              return e;
            })]);

          case 7:
            _ref9 = _context5.sent;
            res1 = _ref9[0];
            res2 = _ref9[1];
            res3 = _ref9[2];
            expect(res1).toBeInstanceOf(Error);
            expect(res1.toString()).toMatch('Server does not return response for request');
            expect(res2.data).toEqual({
              ok: 2
            });
            expect(res3).toBeInstanceOf(Error);
            expect(res3.toString()).toMatch('Server does not return response for request');
            expect(fetchMock.lastOptions()).toMatchSnapshot();

          case 17:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  })));
  it('should handle network failure',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6() {
    var rnl, req1, req2, _ref11, res1, res2;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            fetchMock.mock({
              matcher: '/graphql/batch',
              response: {
                "throws": new Error('Network connection error')
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([batchMiddleware()]);
            req1 = mockReq(1);
            req2 = mockReq(2);
            _context6.next = 6;
            return Promise.all([req1.execute(rnl)["catch"](function (e) {
              return e;
            }), req2.execute(rnl)["catch"](function (e) {
              return e;
            })]);

          case 6:
            _ref11 = _context6.sent;
            res1 = _ref11[0];
            res2 = _ref11[1];
            expect(res1).toBeInstanceOf(Error);
            expect(res1.toString()).toMatch('Network connection error');
            expect(res2).toBeInstanceOf(Error);
            expect(res2.toString()).toMatch('Network connection error');
            expect(fetchMock.lastOptions()).toMatchSnapshot();

          case 14:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  })));
  it('should handle server errors for one request',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7() {
    var rnl, req1, req2, _ref13, res1, res2;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            fetchMock.mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  id: 1,
                  payload: {
                    errors: [{
                      location: 1,
                      message: 'major error'
                    }]
                  }
                }, {
                  id: 2,
                  payload: {
                    data: {
                      ok: 2
                    }
                  }
                }]
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([batchMiddleware()]);
            req1 = mockReq(1);
            req2 = mockReq(2); // prettier-ignore

            _context7.next = 6;
            return Promise.all([req1.execute(rnl)["catch"](function (e) {
              return e;
            }), req2.execute(rnl)]);

          case 6:
            _ref13 = _context7.sent;
            res1 = _ref13[0];
            res2 = _ref13[1];
            expect(res1).toBeInstanceOf(Error);
            expect(res1.toString()).toMatch('major error');
            expect(res2.data).toEqual({
              ok: 2
            });
            expect(res2.errors).toBeUndefined();
            expect(fetchMock.lastOptions()).toMatchSnapshot();

          case 14:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  })));
  it('should handle server errors for all requests',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8() {
    var rnl, req1, req2, req3, _ref15, res1, res2, res3;

    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            fetchMock.mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: {
                  errors: [{
                    location: 1,
                    message: 'major error'
                  }]
                }
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([batchMiddleware()]);
            req1 = mockReq(1);
            req2 = mockReq(2);
            req3 = mockReq(3);
            _context8.next = 7;
            return Promise.all([req1.execute(rnl)["catch"](function (e) {
              return e;
            }), req2.execute(rnl)["catch"](function (e) {
              return e;
            }), req3.execute(rnl)["catch"](function (e) {
              return e;
            })]);

          case 7:
            _ref15 = _context8.sent;
            res1 = _ref15[0];
            res2 = _ref15[1];
            res3 = _ref15[2];
            expect(res1.toString()).toMatch('Wrong response');
            expect(res2.toString()).toMatch('Wrong response');
            expect(res3.toString()).toMatch('Wrong response');
            expect(fetchMock.lastOptions()).toMatchSnapshot();

          case 15:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  })));
  it('should handle responses without payload wrapper',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9() {
    var rnl, req1, req2, _ref17, res1, res2;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            fetchMock.mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  id: 1,
                  errors: [{
                    location: 1,
                    message: 'major error'
                  }]
                }, {
                  id: 2,
                  data: {
                    ok: 2
                  }
                }]
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([batchMiddleware()]);
            req1 = mockReq(1);
            req2 = mockReq(2); // prettier-ignore

            _context9.next = 6;
            return Promise.all([req1.execute(rnl)["catch"](function (e) {
              return e;
            }), req2.execute(rnl)]);

          case 6:
            _ref17 = _context9.sent;
            res1 = _ref17[0];
            res2 = _ref17[1];
            expect(res1).toBeInstanceOf(Error);
            expect(res1.toString()).toMatch('major error');
            expect(res2.data).toEqual({
              ok: 2
            });
            expect(res2.errors).toBeUndefined();
            expect(fetchMock.lastOptions()).toMatchSnapshot();

          case 14:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  })));
  describe('option `batchTimeout`', function () {
    beforeEach(function () {
      fetchMock.restore();
    });
    it('should gather different requests into one batch request',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10() {
      var rnl, reqs;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              fetchMock.mock({
                matcher: '/graphql/batch',
                response: {
                  status: 200,
                  body: [{
                    id: 1,
                    data: {}
                  }, {
                    id: 2,
                    data: {}
                  }, {
                    id: 3,
                    data: {}
                  }]
                },
                method: 'POST'
              });
              rnl = new RelayNetworkLayer([batchMiddleware({
                batchTimeout: 50
              })]);
              mockReq(1).execute(rnl);
              setTimeout(function () {
                return mockReq(2).execute(rnl);
              }, 30);
              _context10.next = 6;
              return mockReq(3).execute(rnl);

            case 6:
              reqs = fetchMock.calls('/graphql/batch');
              expect(reqs).toHaveLength(1);
              expect(fetchMock.lastOptions()).toMatchSnapshot();

            case 9:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    })));
    it('should gather different requests into two batch request',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11() {
      var rnl;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              fetchMock.mock({
                matcher: '/graphql/batch',
                response: {
                  status: 200,
                  body: [{
                    id: 1,
                    data: {}
                  }, {
                    id: 2,
                    data: {}
                  }, {
                    id: 3,
                    data: {}
                  }, {
                    id: 4,
                    data: {}
                  }]
                },
                method: 'POST'
              });
              rnl = new RelayNetworkLayer([batchMiddleware({
                batchTimeout: 100
              })]);
              mockReq(1).execute(rnl);
              setTimeout(function () {
                return mockReq(2).execute(rnl);
              }, 160);
              setTimeout(function () {
                return mockReq(3).execute(rnl);
              }, 170);
              mockReq(4).execute(rnl);
              _context11.next = 8;
              return new Promise(function (resolve, reject) {
                setTimeout(function () {
                  try {
                    var reqs = fetchMock.calls('/graphql/batch');
                    expect(reqs).toHaveLength(2);
                    expect(fetchMock.calls('/graphql/batch')).toMatchSnapshot();
                    resolve();
                  } catch (e) {
                    reject(e);
                  }
                }, 300);
              });

            case 8:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    })));
  });
  describe('option `maxBatchSize`', function () {
    beforeEach(function () {
      fetchMock.restore();
    });
    it('should split large batched requests into multiple requests',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee12() {
      var rnl, req1, req2, req3, req4, req5, batchReqs, singleReqs;
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              fetchMock.mock({
                matcher: '/graphql',
                response: {
                  status: 200,
                  body: {
                    id: 5,
                    data: {}
                  }
                },
                method: 'POST'
              });
              fetchMock.mock({
                matcher: '/graphql/batch',
                response: {
                  status: 200,
                  body: [{
                    id: 1,
                    data: {}
                  }, {
                    id: 2,
                    data: {}
                  }, {
                    id: 3,
                    data: {}
                  }, {
                    id: 4,
                    data: {}
                  }]
                },
                method: 'POST'
              });
              rnl = new RelayNetworkLayer([batchMiddleware({
                maxBatchSize: 1024 * 10
              })]);
              req1 = mockReqWithSize(1, 1024 * 7);
              req2 = mockReqWithSize(2, 1024 * 2);
              req3 = mockReqWithSize(3, 1024 * 5);
              req4 = mockReqWithSize(4, 1024 * 4);
              req5 = mockReqWithSize(5, 1024 * 11);
              _context12.next = 10;
              return Promise.all([req1.execute(rnl), req2.execute(rnl), req3.execute(rnl), req4.execute(rnl), req5.execute(rnl)]);

            case 10:
              batchReqs = fetchMock.calls('/graphql/batch');
              singleReqs = fetchMock.calls('/graphql');
              expect(batchReqs).toHaveLength(2);
              expect(singleReqs).toHaveLength(1);

            case 14:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    })));
  });
  describe('option `allowMutations`', function () {
    beforeEach(function () {
      fetchMock.restore();
    });
    it('should not batch mutations by default',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee13() {
      var rnl, singleReqs;
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              fetchMock.mock({
                matcher: '/graphql',
                response: {
                  status: 200,
                  body: {
                    id: 1,
                    data: {}
                  }
                },
                method: 'POST'
              });
              rnl = new RelayNetworkLayer([batchMiddleware({
                batchTimeout: 20
              })]);
              mockMutationReq(1).execute(rnl);
              _context13.next = 5;
              return mockMutationReq(1).execute(rnl);

            case 5:
              singleReqs = fetchMock.calls('/graphql');
              expect(singleReqs).toHaveLength(2);
              expect(fetchMock.calls('/graphql')).toMatchSnapshot();

            case 8:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    })));
    it('should not batch requests with FormData',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee14() {
      var rnl, singleReqs;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              fetchMock.mock({
                matcher: '/graphql',
                response: {
                  status: 200,
                  body: {
                    id: 1,
                    data: {}
                  }
                },
                method: 'POST'
              });
              rnl = new RelayNetworkLayer([batchMiddleware({
                batchTimeout: 20
              })]);
              mockReqWithFiles(1).execute(rnl);
              _context14.next = 5;
              return mockReqWithFiles(1).execute(rnl);

            case 5:
              singleReqs = fetchMock.calls('/graphql');
              expect(singleReqs).toHaveLength(2);

            case 7:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    })));
    it('should batch mutations if `allowMutations=true`',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee15() {
      var rnl, req1, req2, batchReqs;
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              fetchMock.mock({
                matcher: '/graphql/batch',
                response: {
                  status: 200,
                  body: [{
                    id: 1,
                    data: {}
                  }, {
                    id: 2,
                    data: {}
                  }]
                },
                method: 'POST'
              });
              rnl = new RelayNetworkLayer([batchMiddleware({
                batchTimeout: 20,
                allowMutations: true
              })]);
              req1 = mockMutationReq(1);
              req1.execute(rnl);
              req2 = mockMutationReq(2);
              _context15.next = 7;
              return req2.execute(rnl);

            case 7:
              batchReqs = fetchMock.calls('/graphql/batch');
              expect(batchReqs).toHaveLength(1);
              expect(fetchMock.lastOptions()).toMatchSnapshot();

            case 10:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    })));
    it('should not batch mutations with files if `allowMutations=true`',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee16() {
      var rnl, req1, req2, singleReqs;
      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              fetchMock.mock({
                matcher: '/graphql',
                response: {
                  status: 200,
                  body: {
                    id: 1,
                    data: {}
                  }
                },
                method: 'POST'
              });
              rnl = new RelayNetworkLayer([batchMiddleware({
                batchTimeout: 20,
                allowMutations: true
              })]);
              req1 = mockMutationReq(1, {
                files: {
                  file1: 'data'
                }
              });
              req1.execute(rnl);
              req2 = mockMutationReq(2, {
                files: {
                  file1: 'data'
                }
              });
              _context16.next = 7;
              return req2.execute(rnl);

            case 7:
              singleReqs = fetchMock.calls('/graphql');
              expect(singleReqs).toHaveLength(2);

            case 9:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    })));
  });
  it('should pass fetch options',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee17() {
    var rnl, req1, req2, batchReqs;
    return regeneratorRuntime.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            fetchMock.mock({
              matcher: '/graphql/batch',
              response: {
                status: 200,
                body: [{
                  id: 1,
                  data: {}
                }, {
                  id: 2,
                  data: {}
                }]
              },
              method: 'POST'
            });
            rnl = new RelayNetworkLayer([batchMiddleware({
              batchTimeout: 20,
              credentials: 'include',
              mode: 'cors',
              cache: 'no-store',
              redirect: 'follow'
            })]);
            req1 = mockReq(1);
            req1.execute(rnl);
            req2 = mockReq(2);
            _context17.next = 7;
            return req2.execute(rnl);

          case 7:
            batchReqs = fetchMock.calls('/graphql/batch');
            expect(batchReqs).toHaveLength(1);
            expect(fetchMock.lastOptions()).toEqual(expect.objectContaining({
              credentials: 'include',
              mode: 'cors',
              cache: 'no-store',
              redirect: 'follow'
            }));

          case 10:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  })));
  describe('headers option', function () {
    it('`headers` option as Object',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee18() {
      var rnl, req1, req2;
      return regeneratorRuntime.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              fetchMock.mock({
                matcher: '/graphql/batch',
                response: {
                  status: 200,
                  body: [{
                    id: 1,
                    data: {}
                  }, {
                    id: 2,
                    data: {}
                  }]
                },
                method: 'POST'
              });
              rnl = new RelayNetworkLayer([batchMiddleware({
                headers: {
                  'custom-header': '123'
                }
              })]);
              req1 = mockReq(1);
              req2 = mockReq(2);
              _context18.next = 6;
              return Promise.all([req1.execute(rnl), req2.execute(rnl)]);

            case 6:
              expect(fetchMock.lastOptions().headers).toEqual(expect.objectContaining({
                'custom-header': '123'
              }));

            case 7:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18);
    })));
    it('`headers` option as thunk',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee19() {
      var rnl, req1, req2;
      return regeneratorRuntime.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              fetchMock.mock({
                matcher: '/graphql/batch',
                response: {
                  status: 200,
                  body: [{
                    id: 1,
                    data: {}
                  }, {
                    id: 2,
                    data: {}
                  }]
                },
                method: 'POST'
              });
              rnl = new RelayNetworkLayer([batchMiddleware({
                headers: function headers() {
                  return {
                    'thunk-header': '333'
                  };
                }
              })]);
              req1 = mockReq(1);
              req2 = mockReq(2);
              _context19.next = 6;
              return Promise.all([req1.execute(rnl), req2.execute(rnl)]);

            case 6:
              expect(fetchMock.lastOptions().headers).toEqual(expect.objectContaining({
                'thunk-header': '333'
              }));

            case 7:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19);
    })));
    it('`headers` option as thunk with Promise',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee20() {
      var rnl, req1, req2;
      return regeneratorRuntime.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              fetchMock.mock({
                matcher: '/graphql/batch',
                response: {
                  status: 200,
                  body: [{
                    id: 1,
                    data: {}
                  }, {
                    id: 2,
                    data: {}
                  }]
                },
                method: 'POST'
              });
              rnl = new RelayNetworkLayer([batchMiddleware({
                headers: function headers() {
                  return Promise.resolve({
                    'thunk-header': 'as promise'
                  });
                }
              })]);
              req1 = mockReq(1);
              req2 = mockReq(2);
              _context20.next = 6;
              return Promise.all([req1.execute(rnl), req2.execute(rnl)]);

            case 6:
              expect(fetchMock.lastOptions().headers).toEqual(expect.objectContaining({
                'thunk-header': 'as promise'
              }));

            case 7:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20);
    })));
  });
});