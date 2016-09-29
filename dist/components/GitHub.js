(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', './Gist', './User', './Issue', './Search', './RateLimit', './Repository', './Organization', './Team', './Markdown'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('./Gist'), require('./User'), require('./Issue'), require('./Search'), require('./RateLimit'), require('./Repository'), require('./Organization'), require('./Team'), require('./Markdown'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.Gist, global.User, global.Issue, global.Search, global.RateLimit, global.Repository, global.Organization, global.Team, global.Markdown);
    global.GitHub = mod.exports;
  }
})(this, function (module, _Gist, _User, _Issue, _Search, _RateLimit, _Repository, _Organization, _Team, _Markdown) {
  'use strict';

  var _Gist2 = _interopRequireDefault(_Gist);

  var _User2 = _interopRequireDefault(_User);

  var _Issue2 = _interopRequireDefault(_Issue);

  var _Search2 = _interopRequireDefault(_Search);

  var _RateLimit2 = _interopRequireDefault(_RateLimit);

  var _Repository2 = _interopRequireDefault(_Repository);

  var _Organization2 = _interopRequireDefault(_Organization);

  var _Team2 = _interopRequireDefault(_Team);

  var _Markdown2 = _interopRequireDefault(_Markdown);

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

  var GitHub = function () {
    /**
     * Create a new GitHub.
     * @param {Requestable.auth} [auth] - the credentials to authenticate to Github. If auth is
     *                                  not provided requests will be made unauthenticated
     * @param {string} [apiBase=https://api.github.com] - the base Github API URL
     */
    function GitHub(auth) {
      var apiBase = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'https://api.github.com';

      _classCallCheck(this, GitHub);

      this.__apiBase = apiBase;
      this.__auth = auth || {};
    }

    /**
     * Create a new Gist wrapper
     * @param {number} [id] - the id for the gist, leave undefined when creating a new gist
     * @return {Gist}
     */


    _createClass(GitHub, [{
      key: 'getGist',
      value: function getGist(id) {
        return new _Gist2.default(id, this.__auth, this.__apiBase);
      }
    }, {
      key: 'getUser',
      value: function getUser(user) {
        return new _User2.default(user, this.__auth, this.__apiBase);
      }
    }, {
      key: 'getOrganization',
      value: function getOrganization(organization) {
        return new _Organization2.default(organization, this.__auth, this.__apiBase);
      }
    }, {
      key: 'getTeam',
      value: function getTeam(teamId) {
        return new _Team2.default(teamId, this.__auth, this.__apiBase);
      }
    }, {
      key: 'getRepo',
      value: function getRepo(user, repo) {
        return new _Repository2.default(this._getFullName(user, repo), this.__auth, this.__apiBase);
      }
    }, {
      key: 'getIssues',
      value: function getIssues(user, repo) {
        return new _Issue2.default(this._getFullName(user, repo), this.__auth, this.__apiBase);
      }
    }, {
      key: 'search',
      value: function search(query) {
        return new _Search2.default(query, this.__auth, this.__apiBase);
      }
    }, {
      key: 'getRateLimit',
      value: function getRateLimit() {
        return new _RateLimit2.default(this.__auth, this.__apiBase);
      }
    }, {
      key: 'getMarkdown',
      value: function getMarkdown() {
        return new _Markdown2.default(this.__auth, this.__apiBase);
      }
    }, {
      key: '_getFullName',
      value: function _getFullName(user, repo) {
        var fullname = user;

        if (repo) {
          fullname = user + '/' + repo;
        }

        return fullname;
      }
    }]);

    return GitHub;
  }();

  module.exports = GitHub;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdpdEh1Yi5qcyJdLCJuYW1lcyI6WyJHaXRIdWIiLCJhdXRoIiwiYXBpQmFzZSIsIl9fYXBpQmFzZSIsIl9fYXV0aCIsImlkIiwidXNlciIsIm9yZ2FuaXphdGlvbiIsInRlYW1JZCIsInJlcG8iLCJfZ2V0RnVsbE5hbWUiLCJxdWVyeSIsImZ1bGxuYW1lIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BcUJNQSxNO0FBQ0g7Ozs7OztBQU1BLG9CQUFZQyxJQUFaLEVBQXNEO0FBQUEsVUFBcENDLE9BQW9DLHVFQUExQix3QkFBMEI7O0FBQUE7O0FBQ25ELFdBQUtDLFNBQUwsR0FBaUJELE9BQWpCO0FBQ0EsV0FBS0UsTUFBTCxHQUFjSCxRQUFRLEVBQXRCO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs4QkFLUUksRSxFQUFJO0FBQ1QsZUFBTyxtQkFBU0EsRUFBVCxFQUFhLEtBQUtELE1BQWxCLEVBQTBCLEtBQUtELFNBQS9CLENBQVA7QUFDRjs7OzhCQVFPRyxJLEVBQU07QUFDWCxlQUFPLG1CQUFTQSxJQUFULEVBQWUsS0FBS0YsTUFBcEIsRUFBNEIsS0FBS0QsU0FBakMsQ0FBUDtBQUNGOzs7c0NBT2VJLFksRUFBYztBQUMzQixlQUFPLDJCQUFpQkEsWUFBakIsRUFBK0IsS0FBS0gsTUFBcEMsRUFBNEMsS0FBS0QsU0FBakQsQ0FBUDtBQUNGOzs7OEJBT09LLE0sRUFBUTtBQUNiLGVBQU8sbUJBQVNBLE1BQVQsRUFBaUIsS0FBS0osTUFBdEIsRUFBOEIsS0FBS0QsU0FBbkMsQ0FBUDtBQUNGOzs7OEJBUU9HLEksRUFBTUcsSSxFQUFNO0FBQ2pCLGVBQU8seUJBQWUsS0FBS0MsWUFBTCxDQUFrQkosSUFBbEIsRUFBd0JHLElBQXhCLENBQWYsRUFBOEMsS0FBS0wsTUFBbkQsRUFBMkQsS0FBS0QsU0FBaEUsQ0FBUDtBQUNGOzs7Z0NBUVNHLEksRUFBTUcsSSxFQUFNO0FBQ25CLGVBQU8sb0JBQVUsS0FBS0MsWUFBTCxDQUFrQkosSUFBbEIsRUFBd0JHLElBQXhCLENBQVYsRUFBeUMsS0FBS0wsTUFBOUMsRUFBc0QsS0FBS0QsU0FBM0QsQ0FBUDtBQUNGOzs7NkJBT01RLEssRUFBTztBQUNYLGVBQU8scUJBQVdBLEtBQVgsRUFBa0IsS0FBS1AsTUFBdkIsRUFBK0IsS0FBS0QsU0FBcEMsQ0FBUDtBQUNGOzs7cUNBTWM7QUFDWixlQUFPLHdCQUFjLEtBQUtDLE1BQW5CLEVBQTJCLEtBQUtELFNBQWhDLENBQVA7QUFDRjs7O29DQU1hO0FBQ1gsZUFBTyx1QkFBYSxLQUFLQyxNQUFsQixFQUEwQixLQUFLRCxTQUEvQixDQUFQO0FBQ0Y7OzttQ0FRWUcsSSxFQUFNRyxJLEVBQU07QUFDdEIsWUFBSUcsV0FBV04sSUFBZjs7QUFFQSxZQUFJRyxJQUFKLEVBQVU7QUFDUEcscUJBQWNOLElBQWQsU0FBc0JHLElBQXRCO0FBQ0Y7O0FBRUQsZUFBT0csUUFBUDtBQUNGOzs7Ozs7QUFHSkMsU0FBT0MsT0FBUCxHQUFpQmQsTUFBakIiLCJmaWxlIjoiR2l0SHViLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZVxuICogQGNvcHlyaWdodCAgMjAxMyBNaWNoYWVsIEF1ZnJlaXRlciAoRGV2ZWxvcG1lbnQgU2VlZCkgYW5kIDIwMTYgWWFob28gSW5jLlxuICogQGxpY2Vuc2UgICAgTGljZW5zZWQgdW5kZXIge0BsaW5rIGh0dHBzOi8vc3BkeC5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlLUNsZWFyLmh0bWwgQlNELTMtQ2xhdXNlLUNsZWFyfS5cbiAqICAgICAgICAgICAgIEdpdGh1Yi5qcyBpcyBmcmVlbHkgZGlzdHJpYnV0YWJsZS5cbiAqL1xuLyogZXNsaW50IHZhbGlkLWpzZG9jOiBbXCJlcnJvclwiLCB7XCJyZXF1aXJlUmV0dXJuRGVzY3JpcHRpb25cIjogZmFsc2V9XSAqL1xuXG5pbXBvcnQgR2lzdCBmcm9tICcuL0dpc3QnO1xuaW1wb3J0IFVzZXIgZnJvbSAnLi9Vc2VyJztcbmltcG9ydCBJc3N1ZSBmcm9tICcuL0lzc3VlJztcbmltcG9ydCBTZWFyY2ggZnJvbSAnLi9TZWFyY2gnO1xuaW1wb3J0IFJhdGVMaW1pdCBmcm9tICcuL1JhdGVMaW1pdCc7XG5pbXBvcnQgUmVwb3NpdG9yeSBmcm9tICcuL1JlcG9zaXRvcnknO1xuaW1wb3J0IE9yZ2FuaXphdGlvbiBmcm9tICcuL09yZ2FuaXphdGlvbic7XG5pbXBvcnQgVGVhbSBmcm9tICcuL1RlYW0nO1xuaW1wb3J0IE1hcmtkb3duIGZyb20gJy4vTWFya2Rvd24nO1xuXG4vKipcbiAqIEdpdEh1YiBlbmNhcHN1bGF0ZXMgdGhlIGZ1bmN0aW9uYWxpdHkgdG8gY3JlYXRlIHZhcmlvdXMgQVBJIHdyYXBwZXIgb2JqZWN0cy5cbiAqL1xuY2xhc3MgR2l0SHViIHtcbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgbmV3IEdpdEh1Yi5cbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuYXV0aH0gW2F1dGhdIC0gdGhlIGNyZWRlbnRpYWxzIHRvIGF1dGhlbnRpY2F0ZSB0byBHaXRodWIuIElmIGF1dGggaXNcbiAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdCBwcm92aWRlZCByZXF1ZXN0cyB3aWxsIGJlIG1hZGUgdW5hdXRoZW50aWNhdGVkXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW2FwaUJhc2U9aHR0cHM6Ly9hcGkuZ2l0aHViLmNvbV0gLSB0aGUgYmFzZSBHaXRodWIgQVBJIFVSTFxuICAgICovXG4gICBjb25zdHJ1Y3RvcihhdXRoLCBhcGlCYXNlID0gJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20nKSB7XG4gICAgICB0aGlzLl9fYXBpQmFzZSA9IGFwaUJhc2U7XG4gICAgICB0aGlzLl9fYXV0aCA9IGF1dGggfHwge307XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgbmV3IEdpc3Qgd3JhcHBlclxuICAgICogQHBhcmFtIHtudW1iZXJ9IFtpZF0gLSB0aGUgaWQgZm9yIHRoZSBnaXN0LCBsZWF2ZSB1bmRlZmluZWQgd2hlbiBjcmVhdGluZyBhIG5ldyBnaXN0XG4gICAgKiBAcmV0dXJuIHtHaXN0fVxuICAgICovXG4gICBnZXRHaXN0KGlkKSB7XG4gICAgICByZXR1cm4gbmV3IEdpc3QoaWQsIHRoaXMuX19hdXRoLCB0aGlzLl9fYXBpQmFzZSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgbmV3IFVzZXIgd3JhcHBlclxuICAgICogQHBhcmFtIHtzdHJpbmd9IFt1c2VyXSAtIHRoZSBuYW1lIG9mIHRoZSB1c2VyIHRvIGdldCBpbmZvcm1hdGlvbiBhYm91dFxuICAgICogICAgICAgICAgICAgICAgICAgICAgICBsZWF2ZSB1bmRlZmluZWQgZm9yIHRoZSBhdXRoZW50aWNhdGVkIHVzZXJcbiAgICAqIEByZXR1cm4ge1VzZXJ9XG4gICAgKi9cbiAgIGdldFVzZXIodXNlcikge1xuICAgICAgcmV0dXJuIG5ldyBVc2VyKHVzZXIsIHRoaXMuX19hdXRoLCB0aGlzLl9fYXBpQmFzZSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgbmV3IE9yZ2FuaXphdGlvbiB3cmFwcGVyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gb3JnYW5pemF0aW9uIC0gdGhlIG5hbWUgb2YgdGhlIG9yZ2FuaXphdGlvblxuICAgICogQHJldHVybiB7T3JnYW5pemF0aW9ufVxuICAgICovXG4gICBnZXRPcmdhbml6YXRpb24ob3JnYW5pemF0aW9uKSB7XG4gICAgICByZXR1cm4gbmV3IE9yZ2FuaXphdGlvbihvcmdhbml6YXRpb24sIHRoaXMuX19hdXRoLCB0aGlzLl9fYXBpQmFzZSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogY3JlYXRlIGEgbmV3IFRlYW0gd3JhcHBlclxuICAgICogQHBhcmFtIHtzdHJpbmd9IHRlYW1JZCAtIHRoZSBuYW1lIG9mIHRoZSB0ZWFtXG4gICAgKiBAcmV0dXJuIHt0ZWFtfVxuICAgICovXG4gICBnZXRUZWFtKHRlYW1JZCkge1xuICAgICAgcmV0dXJuIG5ldyBUZWFtKHRlYW1JZCwgdGhpcy5fX2F1dGgsIHRoaXMuX19hcGlCYXNlKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGUgYSBuZXcgUmVwb3NpdG9yeSB3cmFwcGVyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlciAtIHRoZSB1c2VyIHdobyBvd25zIHRoZSByZXNwb3NpdG9yeVxuICAgICogQHBhcmFtIHtzdHJpbmd9IHJlcG8gLSB0aGUgbmFtZSBvZiB0aGUgcmVwb3NpdG9yeVxuICAgICogQHJldHVybiB7UmVwb3NpdG9yeX1cbiAgICAqL1xuICAgZ2V0UmVwbyh1c2VyLCByZXBvKSB7XG4gICAgICByZXR1cm4gbmV3IFJlcG9zaXRvcnkodGhpcy5fZ2V0RnVsbE5hbWUodXNlciwgcmVwbyksIHRoaXMuX19hdXRoLCB0aGlzLl9fYXBpQmFzZSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgbmV3IElzc3VlIHdyYXBwZXJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VyIC0gdGhlIHVzZXIgd2hvIG93bnMgdGhlIHJlc3Bvc2l0b3J5XG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcmVwbyAtIHRoZSBuYW1lIG9mIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAcmV0dXJuIHtJc3N1ZX1cbiAgICAqL1xuICAgZ2V0SXNzdWVzKHVzZXIsIHJlcG8pIHtcbiAgICAgIHJldHVybiBuZXcgSXNzdWUodGhpcy5fZ2V0RnVsbE5hbWUodXNlciwgcmVwbyksIHRoaXMuX19hdXRoLCB0aGlzLl9fYXBpQmFzZSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgbmV3IFNlYXJjaCB3cmFwcGVyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcXVlcnkgLSB0aGUgcXVlcnkgdG8gc2VhcmNoIGZvclxuICAgICogQHJldHVybiB7U2VhcmNofVxuICAgICovXG4gICBzZWFyY2gocXVlcnkpIHtcbiAgICAgIHJldHVybiBuZXcgU2VhcmNoKHF1ZXJ5LCB0aGlzLl9fYXV0aCwgdGhpcy5fX2FwaUJhc2UpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENyZWF0ZSBhIG5ldyBSYXRlTGltaXQgd3JhcHBlclxuICAgICogQHJldHVybiB7UmF0ZUxpbWl0fVxuICAgICovXG4gICBnZXRSYXRlTGltaXQoKSB7XG4gICAgICByZXR1cm4gbmV3IFJhdGVMaW1pdCh0aGlzLl9fYXV0aCwgdGhpcy5fX2FwaUJhc2UpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENyZWF0ZSBhIG5ldyBNYXJrZG93biB3cmFwcGVyXG4gICAgKiBAcmV0dXJuIHtNYXJrZG93bn1cbiAgICAqL1xuICAgZ2V0TWFya2Rvd24oKSB7XG4gICAgICByZXR1cm4gbmV3IE1hcmtkb3duKHRoaXMuX19hdXRoLCB0aGlzLl9fYXBpQmFzZSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ29tcHV0ZXMgdGhlIGZ1bGwgcmVwb3NpdG9yeSBuYW1lXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gdXNlciAtIHRoZSB1c2VybmFtZSAob3IgdGhlIGZ1bGwgbmFtZSlcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSByZXBvIC0gdGhlIHJlcG9zaXRvcnkgbmFtZSwgbXVzdCBub3QgYmUgcGFzc2VkIGlmIGB1c2VyYCBpcyB0aGUgZnVsbCBuYW1lXG4gICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRoZSByZXBvc2l0b3J5J3MgZnVsbCBuYW1lXG4gICAgKi9cbiAgIF9nZXRGdWxsTmFtZSh1c2VyLCByZXBvKSB7XG4gICAgICBsZXQgZnVsbG5hbWUgPSB1c2VyO1xuXG4gICAgICBpZiAocmVwbykge1xuICAgICAgICAgZnVsbG5hbWUgPSBgJHt1c2VyfS8ke3JlcG99YDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZ1bGxuYW1lO1xuICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdpdEh1YjtcbiJdfQ==
//# sourceMappingURL=GitHub.js.map
