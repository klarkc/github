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
    global.Organization = mod.exports;
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

  var Organization = function (_Requestable) {
    _inherits(Organization, _Requestable);

    /**
     * Create a new Organization
     * @param {string} organization - the name of the organization
     * @param {Requestable.auth} [auth] - information required to authenticate to Github
     * @param {string} [apiBase=https://api.github.com] - the base Github API URL
     */
    function Organization(organization, auth, apiBase) {
      _classCallCheck(this, Organization);

      var _this = _possibleConstructorReturn(this, (Organization.__proto__ || Object.getPrototypeOf(Organization)).call(this, auth, apiBase));

      _this.__name = organization;
      return _this;
    }

    /**
     * Create a repository in an organization
     * @see https://developer.github.com/v3/repos/#create
     * @param {Object} options - the repository definition
     * @param {Requestable.callback} [cb] - will receive the created repository
     * @return {Promise} - the promise for the http request
     */


    _createClass(Organization, [{
      key: 'createRepo',
      value: function createRepo(options, cb) {
        return this._request('POST', '/orgs/' + this.__name + '/repos', options, cb);
      }
    }, {
      key: 'getRepos',
      value: function getRepos(cb) {
        var requestOptions = this._getOptionsWithDefaults({ direction: 'desc' });

        return this._requestAllPages('/orgs/' + this.__name + '/repos', requestOptions, cb);
      }
    }, {
      key: 'isMember',
      value: function isMember(username, cb) {
        return this._request204or404('/orgs/' + this.__name + '/members/' + username, null, cb);
      }
    }, {
      key: 'listMembers',
      value: function listMembers(options, cb) {
        return this._request('GET', '/orgs/' + this.__name + '/members', options, cb);
      }
    }, {
      key: 'getTeams',
      value: function getTeams(cb) {
        return this._requestAllPages('/orgs/' + this.__name + '/teams', undefined, cb);
      }
    }, {
      key: 'createTeam',
      value: function createTeam(options, cb) {
        return this._request('POST', '/orgs/' + this.__name + '/teams', options, cb);
      }
    }]);

    return Organization;
  }(_Requestable3.default);

  module.exports = Organization;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9yZ2FuaXphdGlvbi5qcyJdLCJuYW1lcyI6WyJPcmdhbml6YXRpb24iLCJvcmdhbml6YXRpb24iLCJhdXRoIiwiYXBpQmFzZSIsIl9fbmFtZSIsIm9wdGlvbnMiLCJjYiIsIl9yZXF1ZXN0IiwicmVxdWVzdE9wdGlvbnMiLCJfZ2V0T3B0aW9uc1dpdGhEZWZhdWx0cyIsImRpcmVjdGlvbiIsIl9yZXF1ZXN0QWxsUGFnZXMiLCJ1c2VybmFtZSIsIl9yZXF1ZXN0MjA0b3I0MDQiLCJ1bmRlZmluZWQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVlNQSxZOzs7QUFDSDs7Ozs7O0FBTUEsMEJBQVlDLFlBQVosRUFBMEJDLElBQTFCLEVBQWdDQyxPQUFoQyxFQUF5QztBQUFBOztBQUFBLDhIQUNoQ0QsSUFEZ0MsRUFDMUJDLE9BRDBCOztBQUV0QyxZQUFLQyxNQUFMLEdBQWNILFlBQWQ7QUFGc0M7QUFHeEM7O0FBRUQ7Ozs7Ozs7Ozs7O2lDQU9XSSxPLEVBQVNDLEUsRUFBSTtBQUNyQixlQUFPLEtBQUtDLFFBQUwsQ0FBYyxNQUFkLGFBQStCLEtBQUtILE1BQXBDLGFBQW9EQyxPQUFwRCxFQUE2REMsRUFBN0QsQ0FBUDtBQUNGOzs7K0JBUVFBLEUsRUFBSTtBQUNWLFlBQUlFLGlCQUFpQixLQUFLQyx1QkFBTCxDQUE2QixFQUFDQyxXQUFXLE1BQVosRUFBN0IsQ0FBckI7O0FBRUEsZUFBTyxLQUFLQyxnQkFBTCxZQUErQixLQUFLUCxNQUFwQyxhQUFvREksY0FBcEQsRUFBb0VGLEVBQXBFLENBQVA7QUFDRjs7OytCQVFRTSxRLEVBQVVOLEUsRUFBSTtBQUNwQixlQUFPLEtBQUtPLGdCQUFMLFlBQStCLEtBQUtULE1BQXBDLGlCQUFzRFEsUUFBdEQsRUFBa0UsSUFBbEUsRUFBd0VOLEVBQXhFLENBQVA7QUFDRjs7O2tDQVdXRCxPLEVBQVNDLEUsRUFBSTtBQUN0QixlQUFPLEtBQUtDLFFBQUwsQ0FBYyxLQUFkLGFBQThCLEtBQUtILE1BQW5DLGVBQXFEQyxPQUFyRCxFQUE4REMsRUFBOUQsQ0FBUDtBQUNGOzs7K0JBUVFBLEUsRUFBSTtBQUNWLGVBQU8sS0FBS0ssZ0JBQUwsWUFBK0IsS0FBS1AsTUFBcEMsYUFBb0RVLFNBQXBELEVBQStEUixFQUEvRCxDQUFQO0FBQ0Y7OztpQ0FjVUQsTyxFQUFTQyxFLEVBQUk7QUFDckIsZUFBTyxLQUFLQyxRQUFMLENBQWMsTUFBZCxhQUErQixLQUFLSCxNQUFwQyxhQUFvREMsT0FBcEQsRUFBNkRDLEVBQTdELENBQVA7QUFDRjs7Ozs7O0FBR0pTLFNBQU9DLE9BQVAsR0FBaUJoQixZQUFqQiIsImZpbGUiOiJPcmdhbml6YXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlXG4gKiBAY29weXJpZ2h0ICAyMDEzIE1pY2hhZWwgQXVmcmVpdGVyIChEZXZlbG9wbWVudCBTZWVkKSBhbmQgMjAxNiBZYWhvbyBJbmMuXG4gKiBAbGljZW5zZSAgICBMaWNlbnNlZCB1bmRlciB7QGxpbmsgaHR0cHM6Ly9zcGR4Lm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2UtQ2xlYXIuaHRtbCBCU0QtMy1DbGF1c2UtQ2xlYXJ9LlxuICogICAgICAgICAgICAgR2l0aHViLmpzIGlzIGZyZWVseSBkaXN0cmlidXRhYmxlLlxuICovXG5cbmltcG9ydCBSZXF1ZXN0YWJsZSBmcm9tICcuL1JlcXVlc3RhYmxlJztcblxuLyoqXG4gKiBPcmdhbml6YXRpb24gZW5jYXBzdWxhdGVzIHRoZSBmdW5jdGlvbmFsaXR5IHRvIGNyZWF0ZSByZXBvc2l0b3JpZXMgaW4gb3JnYW5pemF0aW9uc1xuICovXG5jbGFzcyBPcmdhbml6YXRpb24gZXh0ZW5kcyBSZXF1ZXN0YWJsZSB7XG4gICAvKipcbiAgICAqIENyZWF0ZSBhIG5ldyBPcmdhbml6YXRpb25cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBvcmdhbml6YXRpb24gLSB0aGUgbmFtZSBvZiB0aGUgb3JnYW5pemF0aW9uXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmF1dGh9IFthdXRoXSAtIGluZm9ybWF0aW9uIHJlcXVpcmVkIHRvIGF1dGhlbnRpY2F0ZSB0byBHaXRodWJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbYXBpQmFzZT1odHRwczovL2FwaS5naXRodWIuY29tXSAtIHRoZSBiYXNlIEdpdGh1YiBBUEkgVVJMXG4gICAgKi9cbiAgIGNvbnN0cnVjdG9yKG9yZ2FuaXphdGlvbiwgYXV0aCwgYXBpQmFzZSkge1xuICAgICAgc3VwZXIoYXV0aCwgYXBpQmFzZSk7XG4gICAgICB0aGlzLl9fbmFtZSA9IG9yZ2FuaXphdGlvbjtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGUgYSByZXBvc2l0b3J5IGluIGFuIG9yZ2FuaXphdGlvblxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zLyNjcmVhdGVcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdGhlIHJlcG9zaXRvcnkgZGVmaW5pdGlvblxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgY3JlYXRlZCByZXBvc2l0b3J5XG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGNyZWF0ZVJlcG8ob3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQT1NUJywgYC9vcmdzLyR7dGhpcy5fX25hbWV9L3JlcG9zYCwgb3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIExpc3QgdGhlIHJlcG9zaXRvcmllcyBpbiBhbiBvcmdhbml6YXRpb25cbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy8jbGlzdC1vcmdhbml6YXRpb24tcmVwb3NpdG9yaWVzXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSBsaXN0IG9mIHJlcG9zaXRvcmllc1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBnZXRSZXBvcyhjYikge1xuICAgICAgbGV0IHJlcXVlc3RPcHRpb25zID0gdGhpcy5fZ2V0T3B0aW9uc1dpdGhEZWZhdWx0cyh7ZGlyZWN0aW9uOiAnZGVzYyd9KTtcblxuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3RBbGxQYWdlcyhgL29yZ3MvJHt0aGlzLl9fbmFtZX0vcmVwb3NgLCByZXF1ZXN0T3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIFF1ZXJ5IGlmIHRoZSB1c2VyIGlzIGEgbWVtYmVyIG9yIG5vdFxuICAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIC0gdGhlIHVzZXIgaW4gcXVlc3Rpb25cbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdHJ1ZSBpZiB0aGUgdXNlciBpcyBhIG1lbWJlclxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBpc01lbWJlcih1c2VybmFtZSwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0MjA0b3I0MDQoYC9vcmdzLyR7dGhpcy5fX25hbWV9L21lbWJlcnMvJHt1c2VybmFtZX1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogTGlzdCB0aGUgdXNlcnMgd2hvIGFyZSBtZW1iZXJzIG9mIHRoZSBjb21wYW55XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvb3Jncy9tZW1iZXJzLyNtZW1iZXJzLWxpc3RcbiAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gZmlsdGVyaW5nIG9wdGlvbnNcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5maWx0ZXI9YWxsXSAtIGNhbiBiZSBlaXRoZXIgYDJmYV9kaXNhYmxlZGAgb3IgYGFsbGBcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5yb2xlPWFsbF0gLSBjYW4gYmUgb25lIG9mOiBgYWxsYCwgYGFkbWluYCwgb3IgYG1lbWJlcmBcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdGhlIGxpc3Qgb2YgdXNlcnNcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgbGlzdE1lbWJlcnMob3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL29yZ3MvJHt0aGlzLl9fbmFtZX0vbWVtYmVyc2AsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBMaXN0IHRoZSBUZWFtcyBpbiB0aGUgT3JnYW5pemF0aW9uXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvb3Jncy90ZWFtcy8jbGlzdC10ZWFtc1xuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgbGlzdCBvZiB0ZWFtc1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBnZXRUZWFtcyhjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3RBbGxQYWdlcyhgL29yZ3MvJHt0aGlzLl9fbmFtZX0vdGVhbXNgLCB1bmRlZmluZWQsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGUgYSB0ZWFtXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvb3Jncy90ZWFtcy8jY3JlYXRlLXRlYW1cbiAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gVGVhbSBjcmVhdGlvbiBwYXJhbWV0ZXJzXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5uYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHRlYW1cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5kZXNjcmlwdGlvbl0gLSBUZWFtIGRlc2NyaXB0aW9uXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMucmVwb19uYW1lc10gLSBSZXBvcyB0byBhZGQgdGhlIHRlYW0gdG9cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5wcml2YWN5PXNlY3JldF0gLSBUaGUgbGV2ZWwgb2YgcHJpdmFjeSB0aGUgdGVhbSBzaG91bGQgaGF2ZS4gQ2FuIGJlIGVpdGhlciBvbmVcbiAgICAqIG9mOiBgc2VjcmV0YCwgb3IgYGNsb3NlZGBcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdGhlIGNyZWF0ZWQgdGVhbVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBjcmVhdGVUZWFtKG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvb3Jncy8ke3RoaXMuX19uYW1lfS90ZWFtc2AsIG9wdGlvbnMsIGNiKTtcbiAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPcmdhbml6YXRpb247XG4iXX0=
//# sourceMappingURL=Organization.js.map
