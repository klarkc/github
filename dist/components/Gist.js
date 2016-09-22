(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', './Requestable'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('./Requestable'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.Requestable);
    global.Gist = mod.exports;
  }
})(this, function (module, _Requestable2) {
  'use strict';

  var _Requestable3 = _interopRequireDefault(_Requestable2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var Gist = function (_Requestable) {
    _inherits(Gist, _Requestable);

    /**
     * Create a Gist.
     * @param {string} id - the id of the gist (not required when creating a gist)
     * @param {Requestable.auth} [auth] - information required to authenticate to Github
     * @param {string} [apiBase=https://api.github.com] - the base Github API URL
     */
    function Gist(id, auth, apiBase) {
      _classCallCheck(this, Gist);

      var _this = _possibleConstructorReturn(this, (Gist.__proto__ || Object.getPrototypeOf(Gist)).call(this, auth, apiBase));

      _this.__id = id;
      return _this;
    }

    /**
     * Fetch a gist.
     * @see https://developer.github.com/v3/gists/#get-a-single-gist
     * @param {Requestable.callback} [cb] - will receive the gist
     * @return {Promise} - the Promise for the http request
     */


    _createClass(Gist, [{
      key: 'read',
      value: function read(cb) {
        return this._request('GET', '/gists/' + this.__id, null, cb);
      }
    }, {
      key: 'create',
      value: function create(gist, cb) {
        var _this2 = this;

        return this._request('POST', '/gists', gist, cb).then(function (response) {
          _this2.__id = response.data.id;
          return response;
        });
      }
    }, {
      key: 'delete',
      value: function _delete(cb) {
        return this._request('DELETE', '/gists/' + this.__id, null, cb);
      }
    }, {
      key: 'fork',
      value: function fork(cb) {
        return this._request('POST', '/gists/' + this.__id + '/forks', null, cb);
      }
    }, {
      key: 'update',
      value: function update(gist, cb) {
        return this._request('PATCH', '/gists/' + this.__id, gist, cb);
      }
    }, {
      key: 'star',
      value: function star(cb) {
        return this._request('PUT', '/gists/' + this.__id + '/star', null, cb);
      }
    }, {
      key: 'unstar',
      value: function unstar(cb) {
        return this._request('DELETE', '/gists/' + this.__id + '/star', null, cb);
      }
    }, {
      key: 'isStarred',
      value: function isStarred(cb) {
        return this._request204or404('/gists/' + this.__id + '/star', null, cb);
      }
    }, {
      key: 'listComments',
      value: function listComments(cb) {
        return this._requestAllPages('/gists/' + this.__id + '/comments', null, cb);
      }
    }, {
      key: 'getComment',
      value: function getComment(comment, cb) {
        return this._request('GET', '/gists/' + this.__id + '/comments/' + comment, null, cb);
      }
    }, {
      key: 'createComment',
      value: function createComment(comment, cb) {
        return this._request('POST', '/gists/' + this.__id + '/comments', { body: comment }, cb);
      }
    }, {
      key: 'editComment',
      value: function editComment(comment, body, cb) {
        return this._request('PATCH', '/gists/' + this.__id + '/comments/' + comment, { body: body }, cb);
      }
    }, {
      key: 'deleteComment',
      value: function deleteComment(comment, cb) {
        return this._request('DELETE', '/gists/' + this.__id + '/comments/' + comment, null, cb);
      }
    }]);

    return Gist;
  }(_Requestable3.default);

  module.exports = Gist;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdpc3QuanMiXSwibmFtZXMiOlsiR2lzdCIsImlkIiwiYXV0aCIsImFwaUJhc2UiLCJfX2lkIiwiY2IiLCJfcmVxdWVzdCIsImdpc3QiLCJ0aGVuIiwicmVzcG9uc2UiLCJkYXRhIiwiX3JlcXVlc3QyMDRvcjQwNCIsIl9yZXF1ZXN0QWxsUGFnZXMiLCJjb21tZW50IiwiYm9keSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BWU1BLEk7OztBQUNIOzs7Ozs7QUFNQSxrQkFBWUMsRUFBWixFQUFnQkMsSUFBaEIsRUFBc0JDLE9BQXRCLEVBQStCO0FBQUE7O0FBQUEsOEdBQ3RCRCxJQURzQixFQUNoQkMsT0FEZ0I7O0FBRTVCLFlBQUtDLElBQUwsR0FBWUgsRUFBWjtBQUY0QjtBQUc5Qjs7QUFFRDs7Ozs7Ozs7OzsyQkFNS0ksRSxFQUFJO0FBQ04sZUFBTyxLQUFLQyxRQUFMLENBQWMsS0FBZCxjQUErQixLQUFLRixJQUFwQyxFQUE0QyxJQUE1QyxFQUFrREMsRUFBbEQsQ0FBUDtBQUNGOzs7NkJBU01FLEksRUFBTUYsRSxFQUFJO0FBQUE7O0FBQ2QsZUFBTyxLQUFLQyxRQUFMLENBQWMsTUFBZCxFQUFzQixRQUF0QixFQUFnQ0MsSUFBaEMsRUFBc0NGLEVBQXRDLEVBQ0hHLElBREcsQ0FDRSxVQUFDQyxRQUFELEVBQWM7QUFDakIsaUJBQUtMLElBQUwsR0FBWUssU0FBU0MsSUFBVCxDQUFjVCxFQUExQjtBQUNBLGlCQUFPUSxRQUFQO0FBQ0YsU0FKRyxDQUFQO0FBS0Y7Ozs4QkFRTUosRSxFQUFJO0FBQ1IsZUFBTyxLQUFLQyxRQUFMLENBQWMsUUFBZCxjQUFrQyxLQUFLRixJQUF2QyxFQUErQyxJQUEvQyxFQUFxREMsRUFBckQsQ0FBUDtBQUNGOzs7MkJBUUlBLEUsRUFBSTtBQUNOLGVBQU8sS0FBS0MsUUFBTCxDQUFjLE1BQWQsY0FBZ0MsS0FBS0YsSUFBckMsYUFBbUQsSUFBbkQsRUFBeURDLEVBQXpELENBQVA7QUFDRjs7OzZCQVNNRSxJLEVBQU1GLEUsRUFBSTtBQUNkLGVBQU8sS0FBS0MsUUFBTCxDQUFjLE9BQWQsY0FBaUMsS0FBS0YsSUFBdEMsRUFBOENHLElBQTlDLEVBQW9ERixFQUFwRCxDQUFQO0FBQ0Y7OzsyQkFRSUEsRSxFQUFJO0FBQ04sZUFBTyxLQUFLQyxRQUFMLENBQWMsS0FBZCxjQUErQixLQUFLRixJQUFwQyxZQUFpRCxJQUFqRCxFQUF1REMsRUFBdkQsQ0FBUDtBQUNGOzs7NkJBUU1BLEUsRUFBSTtBQUNSLGVBQU8sS0FBS0MsUUFBTCxDQUFjLFFBQWQsY0FBa0MsS0FBS0YsSUFBdkMsWUFBb0QsSUFBcEQsRUFBMERDLEVBQTFELENBQVA7QUFDRjs7O2dDQVFTQSxFLEVBQUk7QUFDWCxlQUFPLEtBQUtNLGdCQUFMLGFBQWdDLEtBQUtQLElBQXJDLFlBQWtELElBQWxELEVBQXdEQyxFQUF4RCxDQUFQO0FBQ0Y7OzttQ0FRWUEsRSxFQUFJO0FBQ2QsZUFBTyxLQUFLTyxnQkFBTCxhQUFnQyxLQUFLUixJQUFyQyxnQkFBc0QsSUFBdEQsRUFBNERDLEVBQTVELENBQVA7QUFDRjs7O2lDQVNVUSxPLEVBQVNSLEUsRUFBSTtBQUNyQixlQUFPLEtBQUtDLFFBQUwsQ0FBYyxLQUFkLGNBQStCLEtBQUtGLElBQXBDLGtCQUFxRFMsT0FBckQsRUFBZ0UsSUFBaEUsRUFBc0VSLEVBQXRFLENBQVA7QUFDRjs7O29DQVNhUSxPLEVBQVNSLEUsRUFBSTtBQUN4QixlQUFPLEtBQUtDLFFBQUwsQ0FBYyxNQUFkLGNBQWdDLEtBQUtGLElBQXJDLGdCQUFzRCxFQUFDVSxNQUFNRCxPQUFQLEVBQXRELEVBQXVFUixFQUF2RSxDQUFQO0FBQ0Y7OztrQ0FVV1EsTyxFQUFTQyxJLEVBQU1ULEUsRUFBSTtBQUM1QixlQUFPLEtBQUtDLFFBQUwsQ0FBYyxPQUFkLGNBQWlDLEtBQUtGLElBQXRDLGtCQUF1RFMsT0FBdkQsRUFBa0UsRUFBQ0MsTUFBTUEsSUFBUCxFQUFsRSxFQUFnRlQsRUFBaEYsQ0FBUDtBQUNGOzs7b0NBU2FRLE8sRUFBU1IsRSxFQUFJO0FBQ3hCLGVBQU8sS0FBS0MsUUFBTCxDQUFjLFFBQWQsY0FBa0MsS0FBS0YsSUFBdkMsa0JBQXdEUyxPQUF4RCxFQUFtRSxJQUFuRSxFQUF5RVIsRUFBekUsQ0FBUDtBQUNGOzs7Ozs7QUFHSlUsU0FBT0MsT0FBUCxHQUFpQmhCLElBQWpCIiwiZmlsZSI6Ikdpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlXG4gKiBAY29weXJpZ2h0ICAyMDEzIE1pY2hhZWwgQXVmcmVpdGVyIChEZXZlbG9wbWVudCBTZWVkKSBhbmQgMjAxNiBZYWhvbyBJbmMuXG4gKiBAbGljZW5zZSAgICBMaWNlbnNlZCB1bmRlciB7QGxpbmsgaHR0cHM6Ly9zcGR4Lm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2UtQ2xlYXIuaHRtbCBCU0QtMy1DbGF1c2UtQ2xlYXJ9LlxuICogICAgICAgICAgICAgR2l0aHViLmpzIGlzIGZyZWVseSBkaXN0cmlidXRhYmxlLlxuICovXG5cbmltcG9ydCBSZXF1ZXN0YWJsZSBmcm9tICcuL1JlcXVlc3RhYmxlJztcblxuLyoqXG4gKiBBIEdpc3QgY2FuIHJldHJpZXZlIGFuZCBtb2RpZnkgZ2lzdHMuXG4gKi9cbmNsYXNzIEdpc3QgZXh0ZW5kcyBSZXF1ZXN0YWJsZSB7XG4gICAvKipcbiAgICAqIENyZWF0ZSBhIEdpc3QuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgLSB0aGUgaWQgb2YgdGhlIGdpc3QgKG5vdCByZXF1aXJlZCB3aGVuIGNyZWF0aW5nIGEgZ2lzdClcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuYXV0aH0gW2F1dGhdIC0gaW5mb3JtYXRpb24gcmVxdWlyZWQgdG8gYXV0aGVudGljYXRlIHRvIEdpdGh1YlxuICAgICogQHBhcmFtIHtzdHJpbmd9IFthcGlCYXNlPWh0dHBzOi8vYXBpLmdpdGh1Yi5jb21dIC0gdGhlIGJhc2UgR2l0aHViIEFQSSBVUkxcbiAgICAqL1xuICAgY29uc3RydWN0b3IoaWQsIGF1dGgsIGFwaUJhc2UpIHtcbiAgICAgIHN1cGVyKGF1dGgsIGFwaUJhc2UpO1xuICAgICAgdGhpcy5fX2lkID0gaWQ7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRmV0Y2ggYSBnaXN0LlxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2dpc3RzLyNnZXQtYS1zaW5nbGUtZ2lzdFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgZ2lzdFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgUHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICByZWFkKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9naXN0cy8ke3RoaXMuX19pZH1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgbmV3IGdpc3QuXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2lzdHMvI2NyZWF0ZS1hLWdpc3RcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBnaXN0IC0gdGhlIGRhdGEgZm9yIHRoZSBuZXcgZ2lzdFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgbmV3IGdpc3QgdXBvbiBjcmVhdGlvblxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgUHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBjcmVhdGUoZ2lzdCwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQT1NUJywgJy9naXN0cycsIGdpc3QsIGNiKVxuICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9faWQgPSByZXNwb25zZS5kYXRhLmlkO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgfSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRGVsZXRlIGEgZ2lzdC5cbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXN0cy8jZGVsZXRlLWEtZ2lzdFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0cnVlIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRzXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBQcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGRlbGV0ZShjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0RFTEVURScsIGAvZ2lzdHMvJHt0aGlzLl9faWR9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEZvcmsgYSBnaXN0LlxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2dpc3RzLyNmb3JrLWEtZ2lzdFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgcmVjZWl2ZSB0aGUgZ2lzdFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgUHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBmb3JrKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvZ2lzdHMvJHt0aGlzLl9faWR9L2ZvcmtzYCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIFVwZGF0ZSBhIGdpc3QuXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2lzdHMvI2VkaXQtYS1naXN0XG4gICAgKiBAcGFyYW0ge09iamVjdH0gZ2lzdCAtIHRoZSBuZXcgZGF0YSBmb3IgdGhlIGdpc3RcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB0aGUgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyB0aGUgQVBJIHJlc3VsdFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgUHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICB1cGRhdGUoZ2lzdCwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQQVRDSCcsIGAvZ2lzdHMvJHt0aGlzLl9faWR9YCwgZ2lzdCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIFN0YXIgYSBnaXN0LlxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2dpc3RzLyNzdGFyLWEtZ2lzdFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0cnVlIGlmIHRoZSByZXF1ZXN0IGlzIHN1Y2Nlc3NmdWxcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIFByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgc3RhcihjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BVVCcsIGAvZ2lzdHMvJHt0aGlzLl9faWR9L3N0YXJgLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogVW5zdGFyIGEgZ2lzdC5cbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXN0cy8jdW5zdGFyLWEtZ2lzdFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0cnVlIGlmIHRoZSByZXF1ZXN0IGlzIHN1Y2Nlc3NmdWxcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIFByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgdW5zdGFyKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnREVMRVRFJywgYC9naXN0cy8ke3RoaXMuX19pZH0vc3RhcmAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDaGVjayBpZiBhIGdpc3QgaXMgc3RhcnJlZCBieSB0aGUgdXNlci5cbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXN0cy8jY2hlY2staWYtYS1naXN0LWlzLXN0YXJyZWRcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdHJ1ZSBpZiB0aGUgZ2lzdCBpcyBzdGFycmVkIGFuZCBmYWxzZSBpZiB0aGUgZ2lzdCBpcyBub3Qgc3RhcnJlZFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgUHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBpc1N0YXJyZWQoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0MjA0b3I0MDQoYC9naXN0cy8ke3RoaXMuX19pZH0vc3RhcmAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBMaXN0IHRoZSBnaXN0J3MgY29tbWVudHNcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXN0cy9jb21tZW50cy8jbGlzdC1jb21tZW50cy1vbi1hLWdpc3RcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdGhlIGFycmF5IG9mIGNvbW1lbnRzXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGxpc3RDb21tZW50cyhjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3RBbGxQYWdlcyhgL2dpc3RzLyR7dGhpcy5fX2lkfS9jb21tZW50c2AsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBGZXRjaCBvbmUgb2YgdGhlIGdpc3QncyBjb21tZW50c1xuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2dpc3RzL2NvbW1lbnRzLyNnZXQtYS1zaW5nbGUtY29tbWVudFxuICAgICogQHBhcmFtIHtudW1iZXJ9IGNvbW1lbnQgLSB0aGUgaWQgb2YgdGhlIGNvbW1lbnRcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdGhlIGNvbW1lbnRcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIFByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZ2V0Q29tbWVudChjb21tZW50LCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvZ2lzdHMvJHt0aGlzLl9faWR9L2NvbW1lbnRzLyR7Y29tbWVudH1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ29tbWVudCBvbiBhIGdpc3RcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXN0cy9jb21tZW50cy8jY3JlYXRlLWEtY29tbWVudFxuICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1lbnQgLSB0aGUgY29tbWVudCB0byBhZGRcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB0aGUgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyB0aGUgQVBJIHJlc3VsdFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgUHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBjcmVhdGVDb21tZW50KGNvbW1lbnQsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvZ2lzdHMvJHt0aGlzLl9faWR9L2NvbW1lbnRzYCwge2JvZHk6IGNvbW1lbnR9LCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRWRpdCBhIGNvbW1lbnQgb24gdGhlIGdpc3RcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXN0cy9jb21tZW50cy8jZWRpdC1hLWNvbW1lbnRcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb21tZW50IC0gdGhlIGlkIG9mIHRoZSBjb21tZW50XG4gICAgKiBAcGFyYW0ge3N0cmluZ30gYm9keSAtIHRoZSBuZXcgY29tbWVudFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgbW9kaWZpZWQgY29tbWVudFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBlZGl0Q29tbWVudChjb21tZW50LCBib2R5LCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BBVENIJywgYC9naXN0cy8ke3RoaXMuX19pZH0vY29tbWVudHMvJHtjb21tZW50fWAsIHtib2R5OiBib2R5fSwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIERlbGV0ZSBhIGNvbW1lbnQgb24gdGhlIGdpc3QuXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2lzdHMvY29tbWVudHMvI2RlbGV0ZS1hLWNvbW1lbnRcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb21tZW50IC0gdGhlIGlkIG9mIHRoZSBjb21tZW50XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIHJlcXVlc3Qgc3VjY2VlZHNcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIFByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZGVsZXRlQ29tbWVudChjb21tZW50LCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0RFTEVURScsIGAvZ2lzdHMvJHt0aGlzLl9faWR9L2NvbW1lbnRzLyR7Y29tbWVudH1gLCBudWxsLCBjYik7XG4gICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2lzdDtcbiJdfQ==
//# sourceMappingURL=Gist.js.map
