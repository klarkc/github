(function (global, factory) {
   if (typeof define === "function" && define.amd) {
      define(['module', 'axios', 'debug', 'js-base64', 'es6-promise'], factory);
   } else if (typeof exports !== "undefined") {
      factory(module, require('axios'), require('debug'), require('js-base64'), require('es6-promise'));
   } else {
      var mod = {
         exports: {}
      };
      factory(mod, global.axios, global.debug, global.jsBase64, global.Promise);
      global.Requestable = mod.exports;
   }
})(this, function (module, _axios, _debug, _jsBase, _es6Promise) {
   'use strict';

   var _axios2 = _interopRequireDefault(_axios);

   var _debug2 = _interopRequireDefault(_debug);

   function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
         default: obj
      };
   }

   var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
   } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
   };

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

   function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
         throw new TypeError("Cannot call a class as a function");
      }
   }

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

   var log = (0, _debug2.default)('github:request');

   if (typeof Promise === 'undefined') {
      (0, _es6Promise.polyfill)();
   }

   /**
    * The error structure returned when a network call fails
    */

   var ResponseError = function (_Error) {
      _inherits(ResponseError, _Error);

      /**
       * Construct a new ResponseError
       * @param {string} message - an message to return instead of the the default error message
       * @param {string} path - the requested path
       * @param {Object} response - the object returned by Axios
       */
      function ResponseError(message, path, response) {
         _classCallCheck(this, ResponseError);

         var _this = _possibleConstructorReturn(this, (ResponseError.__proto__ || Object.getPrototypeOf(ResponseError)).call(this, message));

         _this.path = path;
         _this.request = response.config;
         _this.response = response;
         _this.status = response.status;
         return _this;
      }

      return ResponseError;
   }(Error);

   var Requestable = function () {
      /**
       * Either a username and password or an oauth token for Github
       * @typedef {Object} Requestable.auth
       * @prop {string} [username] - the Github username
       * @prop {string} [password] - the user's password
       * @prop {token} [token] - an OAuth token
       */
      /**
       * Initialize the http internals.
       * @param {Requestable.auth} [auth] - the credentials to authenticate to Github. If auth is
       *                                  not provided request will be made unauthenticated
       * @param {string} [apiBase=https://api.github.com] - the base Github API URL
       */
      function Requestable(auth, apiBase) {
         _classCallCheck(this, Requestable);

         this.__apiBase = apiBase || 'https://api.github.com';
         this.__auth = {
            token: auth.token,
            username: auth.username,
            password: auth.password
         };

         if (auth.token) {
            this.__authorizationHeader = 'token ' + auth.token;
         } else if (auth.username && auth.password) {
            this.__authorizationHeader = 'Basic ' + _jsBase.Base64.encode(auth.username + ':' + auth.password);
         }
      }

      /**
       * Compute the URL to use to make a request.
       * @private
       * @param {string} path - either a URL relative to the API base or an absolute URL
       * @return {string} - the URL to use
       */


      _createClass(Requestable, [{
         key: '__getURL',
         value: function __getURL(path) {
            var url = path;

            if (path.indexOf('//') === -1) {
               url = this.__apiBase + path;
            }

            var newCacheBuster = 'timestamp=' + new Date().getTime();
            return url.replace(/(timestamp=\d+)/, newCacheBuster);
         }
      }, {
         key: '__getRequestHeaders',
         value: function __getRequestHeaders(raw, preview) {
            var headers = {
               'Content-Type': 'application/json;charset=UTF-8'
            };

            if (preview && raw) {
               headers.Accept = 'application/vnd.github.inertia-preview.raw+json';
            } else if (preview) {
               headers.Accept = 'application/vnd.github.inertia-preview+json';
            } else {
               headers.Accept = raw ? 'application/vnd.github.v3.raw+json' : 'application/vnd.github.v3+json';
            }

            if (this.__authorizationHeader) {
               headers.Authorization = this.__authorizationHeader;
            }

            return headers;
         }
      }, {
         key: '_getOptionsWithDefaults',
         value: function _getOptionsWithDefaults() {
            var requestOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            if (!(requestOptions.visibility || requestOptions.affiliation)) {
               requestOptions.type = requestOptions.type || 'all';
            }
            requestOptions.sort = requestOptions.sort || 'updated';
            requestOptions.per_page = requestOptions.per_page || '100'; // eslint-disable-line

            return requestOptions;
         }
      }, {
         key: '_dateToISO',
         value: function _dateToISO(date) {
            if (date && date instanceof Date) {
               date = date.toISOString();
            }

            return date;
         }
      }, {
         key: '_request',
         value: function _request(method, path, data, cb, raw) {
            var url = this.__getURL(path);

            var headers = void 0;

            // Enable preview api only for projects calls
            if (path.includes('projects')) {
               headers = this.__getRequestHeaders(raw, true);
            } else {
               headers = this.__getRequestHeaders(raw);
            }
            var queryParams = {};

            var shouldUseDataAsParams = data && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && methodHasNoBody(method);
            if (shouldUseDataAsParams) {
               queryParams = data;
               data = undefined;
            }

            var config = {
               url: url,
               method: method,
               headers: headers,
               params: queryParams,
               data: data,
               responseType: raw ? 'text' : 'json'
            };

            log(config.method + ' to ' + config.url);
            var requestPromise = (0, _axios2.default)(config).catch(callbackErrorOrThrow(cb, path));

            if (cb) {
               requestPromise.then(function (response) {
                  if (response.data && Object.keys(response.data).length > 0) {
                     // When data has results
                     cb(null, response.data, response);
                  } else {
                     // True when success
                     cb(null, response.status < 300, response);
                  }
               });
            }

            return requestPromise;
         }
      }, {
         key: '_request204or404',
         value: function _request204or404(path, data, cb) {
            var method = arguments.length <= 3 || arguments[3] === undefined ? 'GET' : arguments[3];

            return this._request(method, path, data).then(function success(response) {
               if (cb) {
                  cb(null, true, response);
               }
               return true;
            }, function failure(response) {
               if (response.status === 404) {
                  if (cb) {
                     cb(null, false, response);
                  }
                  return false;
               }

               if (cb) {
                  cb(response);
               }
               throw response;
            });
         }
      }, {
         key: '_requestAllPages',
         value: function _requestAllPages(path, options, cb, results) {
            var _this2 = this;

            results = results || [];

            return this._request('GET', path, options).then(function (response) {
               var thisGroup = void 0;
               if (response.data instanceof Array) {
                  thisGroup = response.data;
               } else if (response.data.items instanceof Array) {
                  thisGroup = response.data.items;
               } else {
                  var message = 'cannot figure out how to append ' + response.data + ' to the result set';
                  throw new ResponseError(message, path, response);
               }
               results.push.apply(results, thisGroup);

               var nextUrl = getNextPage(response.headers.link);
               if (nextUrl) {
                  log('getting next page: ' + nextUrl);
                  return _this2._requestAllPages(nextUrl, options, cb, results);
               }

               if (cb) {
                  cb(null, results, response);
               }

               response.data = results;
               return response;
            }).catch(callbackErrorOrThrow(cb, path));
         }
      }]);

      return Requestable;
   }();

   module.exports = Requestable;

   // ////////////////////////// //
   //  Private helper functions  //
   // ////////////////////////// //
   var METHODS_WITH_NO_BODY = ['GET', 'HEAD', 'DELETE'];
   function methodHasNoBody(method) {
      return METHODS_WITH_NO_BODY.indexOf(method) !== -1;
   }

   function getNextPage() {
      var linksHeader = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

      var links = linksHeader.split(/\s*,\s*/); // splits and strips the urls
      return links.reduce(function (nextUrl, link) {
         if (link.search(/rel="next"/) !== -1) {
            return (link.match(/<(.*)>/) || [])[1];
         }

         return nextUrl;
      }, undefined);
   }

   function callbackErrorOrThrow(cb, path) {
      return function handler(object) {
         var error = void 0;
         if (object.hasOwnProperty('config')) {
            var status = object.status;
            var statusText = object.statusText;
            var _object$config = object.config;
            var method = _object$config.method;
            var url = _object$config.url;

            var message = status + ' error making request ' + method + ' ' + url + ': "' + statusText + '"';
            error = new ResponseError(message, path, object);
            log(message + ' ' + JSON.stringify(object.data));
         } else {
            error = object;
         }
         if (cb) {
            log('going to error callback');
            cb(error);
         } else {
            log('throwing error');
            throw error;
         }
      };
   }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJlcXVlc3RhYmxlLmpzIl0sIm5hbWVzIjpbImxvZyIsIlByb21pc2UiLCJSZXNwb25zZUVycm9yIiwibWVzc2FnZSIsInBhdGgiLCJyZXNwb25zZSIsInJlcXVlc3QiLCJjb25maWciLCJzdGF0dXMiLCJFcnJvciIsIlJlcXVlc3RhYmxlIiwiYXV0aCIsImFwaUJhc2UiLCJfX2FwaUJhc2UiLCJfX2F1dGgiLCJ0b2tlbiIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJfX2F1dGhvcml6YXRpb25IZWFkZXIiLCJlbmNvZGUiLCJ1cmwiLCJpbmRleE9mIiwibmV3Q2FjaGVCdXN0ZXIiLCJEYXRlIiwiZ2V0VGltZSIsInJlcGxhY2UiLCJyYXciLCJwcmV2aWV3IiwiaGVhZGVycyIsIkFjY2VwdCIsIkF1dGhvcml6YXRpb24iLCJyZXF1ZXN0T3B0aW9ucyIsInZpc2liaWxpdHkiLCJhZmZpbGlhdGlvbiIsInR5cGUiLCJzb3J0IiwicGVyX3BhZ2UiLCJkYXRlIiwidG9JU09TdHJpbmciLCJtZXRob2QiLCJkYXRhIiwiY2IiLCJfX2dldFVSTCIsImluY2x1ZGVzIiwiX19nZXRSZXF1ZXN0SGVhZGVycyIsInF1ZXJ5UGFyYW1zIiwic2hvdWxkVXNlRGF0YUFzUGFyYW1zIiwibWV0aG9kSGFzTm9Cb2R5IiwidW5kZWZpbmVkIiwicGFyYW1zIiwicmVzcG9uc2VUeXBlIiwicmVxdWVzdFByb21pc2UiLCJjYXRjaCIsImNhbGxiYWNrRXJyb3JPclRocm93IiwidGhlbiIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJfcmVxdWVzdCIsInN1Y2Nlc3MiLCJmYWlsdXJlIiwib3B0aW9ucyIsInJlc3VsdHMiLCJ0aGlzR3JvdXAiLCJBcnJheSIsIml0ZW1zIiwicHVzaCIsImFwcGx5IiwibmV4dFVybCIsImdldE5leHRQYWdlIiwibGluayIsIl9yZXF1ZXN0QWxsUGFnZXMiLCJtb2R1bGUiLCJleHBvcnRzIiwiTUVUSE9EU19XSVRIX05PX0JPRFkiLCJsaW5rc0hlYWRlciIsImxpbmtzIiwic3BsaXQiLCJyZWR1Y2UiLCJzZWFyY2giLCJtYXRjaCIsImhhbmRsZXIiLCJvYmplY3QiLCJlcnJvciIsImhhc093blByb3BlcnR5Iiwic3RhdHVzVGV4dCIsIkpTT04iLCJzdHJpbmdpZnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFZQSxPQUFNQSxNQUFNLHFCQUFNLGdCQUFOLENBQVo7O0FBRUEsT0FBSSxPQUFPQyxPQUFQLEtBQW1CLFdBQXZCLEVBQW9DO0FBQ2pDO0FBQ0Y7O0FBRUQ7Ozs7T0FHTUMsYTs7O0FBQ0g7Ozs7OztBQU1BLDZCQUFZQyxPQUFaLEVBQXFCQyxJQUFyQixFQUEyQkMsUUFBM0IsRUFBcUM7QUFBQTs7QUFBQSxtSUFDNUJGLE9BRDRCOztBQUVsQyxlQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDQSxlQUFLRSxPQUFMLEdBQWVELFNBQVNFLE1BQXhCO0FBQ0EsZUFBS0YsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxlQUFLRyxNQUFMLEdBQWNILFNBQVNHLE1BQXZCO0FBTGtDO0FBTXBDOzs7S0Fid0JDLEs7O09BbUJ0QkMsVztBQUNIOzs7Ozs7O0FBT0E7Ozs7OztBQU1BLDJCQUFZQyxJQUFaLEVBQWtCQyxPQUFsQixFQUEyQjtBQUFBOztBQUN4QixjQUFLQyxTQUFMLEdBQWlCRCxXQUFXLHdCQUE1QjtBQUNBLGNBQUtFLE1BQUwsR0FBYztBQUNYQyxtQkFBT0osS0FBS0ksS0FERDtBQUVYQyxzQkFBVUwsS0FBS0ssUUFGSjtBQUdYQyxzQkFBVU4sS0FBS007QUFISixVQUFkOztBQU1BLGFBQUlOLEtBQUtJLEtBQVQsRUFBZ0I7QUFDYixpQkFBS0cscUJBQUwsR0FBNkIsV0FBV1AsS0FBS0ksS0FBN0M7QUFDRixVQUZELE1BRU8sSUFBSUosS0FBS0ssUUFBTCxJQUFpQkwsS0FBS00sUUFBMUIsRUFBb0M7QUFDeEMsaUJBQUtDLHFCQUFM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a0JILE1BRGxCLENBQ1AzRSxNQURPO0FBQUEsZ0JBQ0VnQyxNQURGLGtCQUNFQSxNQURGO0FBQUEsZ0JBQ1VuQixHQURWLGtCQUNVQSxHQURWOztBQUVsQyxnQkFBSWpCLFVBQWNLLE1BQWQsOEJBQTZDK0IsTUFBN0MsU0FBdURuQixHQUF2RCxXQUFnRWlFLFVBQWhFLE1BQUo7QUFDQUYsb0JBQVEsSUFBSWpGLGFBQUosQ0FBa0JDLE9BQWxCLEVBQTJCQyxJQUEzQixFQUFpQzhFLE1BQWpDLENBQVI7QUFDQWxGLGdCQUFPRyxPQUFQLFNBQWtCbUYsS0FBS0MsU0FBTCxDQUFlTCxPQUFPMUMsSUFBdEIsQ0FBbEI7QUFDRixVQUxELE1BS087QUFDSjJDLG9CQUFRRCxNQUFSO0FBQ0Y7QUFDRCxhQUFJekMsRUFBSixFQUFRO0FBQ0x6QyxnQkFBSSx5QkFBSjtBQUNBeUMsZUFBRzBDLEtBQUg7QUFDRixVQUhELE1BR087QUFDSm5GLGdCQUFJLGdCQUFKO0FBQ0Esa0JBQU1tRixLQUFOO0FBQ0Y7QUFDSCxPQWpCRDtBQWtCRiIsImZpbGUiOiJSZXF1ZXN0YWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVcbiAqIEBjb3B5cmlnaHQgIDIwMTYgWWFob28gSW5jLlxuICogQGxpY2Vuc2UgICAgTGljZW5zZWQgdW5kZXIge0BsaW5rIGh0dHBzOi8vc3BkeC5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlLUNsZWFyLmh0bWwgQlNELTMtQ2xhdXNlLUNsZWFyfS5cbiAqICAgICAgICAgICAgIEdpdGh1Yi5qcyBpcyBmcmVlbHkgZGlzdHJpYnV0YWJsZS5cbiAqL1xuXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnO1xuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCB7QmFzZTY0fSBmcm9tICdqcy1iYXNlNjQnO1xuaW1wb3J0IHtwb2x5ZmlsbH0gZnJvbSAnZXM2LXByb21pc2UnO1xuXG5jb25zdCBsb2cgPSBkZWJ1ZygnZ2l0aHViOnJlcXVlc3QnKTtcblxuaWYgKHR5cGVvZiBQcm9taXNlID09PSAndW5kZWZpbmVkJykge1xuICAgcG9seWZpbGwoKTtcbn1cblxuLyoqXG4gKiBUaGUgZXJyb3Igc3RydWN0dXJlIHJldHVybmVkIHdoZW4gYSBuZXR3b3JrIGNhbGwgZmFpbHNcbiAqL1xuY2xhc3MgUmVzcG9uc2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgIC8qKlxuICAgICogQ29uc3RydWN0IGEgbmV3IFJlc3BvbnNlRXJyb3JcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gYW4gbWVzc2FnZSB0byByZXR1cm4gaW5zdGVhZCBvZiB0aGUgdGhlIGRlZmF1bHQgZXJyb3IgbWVzc2FnZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSB0aGUgcmVxdWVzdGVkIHBhdGhcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSAtIHRoZSBvYmplY3QgcmV0dXJuZWQgYnkgQXhpb3NcbiAgICAqL1xuICAgY29uc3RydWN0b3IobWVzc2FnZSwgcGF0aCwgcmVzcG9uc2UpIHtcbiAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICAgIHRoaXMucmVxdWVzdCA9IHJlc3BvbnNlLmNvbmZpZztcbiAgICAgIHRoaXMucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgICAgIHRoaXMuc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xuICAgfVxufVxuXG4vKipcbiAqIFJlcXVlc3RhYmxlIHdyYXBzIHRoZSBsb2dpYyBmb3IgbWFraW5nIGh0dHAgcmVxdWVzdHMgdG8gdGhlIEFQSVxuICovXG5jbGFzcyBSZXF1ZXN0YWJsZSB7XG4gICAvKipcbiAgICAqIEVpdGhlciBhIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBvciBhbiBvYXV0aCB0b2tlbiBmb3IgR2l0aHViXG4gICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBSZXF1ZXN0YWJsZS5hdXRoXG4gICAgKiBAcHJvcCB7c3RyaW5nfSBbdXNlcm5hbWVdIC0gdGhlIEdpdGh1YiB1c2VybmFtZVxuICAgICogQHByb3Age3N0cmluZ30gW3Bhc3N3b3JkXSAtIHRoZSB1c2VyJ3MgcGFzc3dvcmRcbiAgICAqIEBwcm9wIHt0b2tlbn0gW3Rva2VuXSAtIGFuIE9BdXRoIHRva2VuXG4gICAgKi9cbiAgIC8qKlxuICAgICogSW5pdGlhbGl6ZSB0aGUgaHR0cCBpbnRlcm5hbHMuXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmF1dGh9IFthdXRoXSAtIHRoZSBjcmVkZW50aWFscyB0byBhdXRoZW50aWNhdGUgdG8gR2l0aHViLiBJZiBhdXRoIGlzXG4gICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3QgcHJvdmlkZWQgcmVxdWVzdCB3aWxsIGJlIG1hZGUgdW5hdXRoZW50aWNhdGVkXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW2FwaUJhc2U9aHR0cHM6Ly9hcGkuZ2l0aHViLmNvbV0gLSB0aGUgYmFzZSBHaXRodWIgQVBJIFVSTFxuICAgICovXG4gICBjb25zdHJ1Y3RvcihhdXRoLCBhcGlCYXNlKSB7XG4gICAgICB0aGlzLl9fYXBpQmFzZSA9IGFwaUJhc2UgfHwgJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20nO1xuICAgICAgdGhpcy5fX2F1dGggPSB7XG4gICAgICAgICB0b2tlbjogYXV0aC50b2tlbixcbiAgICAgICAgIHVzZXJuYW1lOiBhdXRoLnVzZXJuYW1lLFxuICAgICAgICAgcGFzc3dvcmQ6IGF1dGgucGFzc3dvcmRcbiAgICAgIH07XG5cbiAgICAgIGlmIChhdXRoLnRva2VuKSB7XG4gICAgICAgICB0aGlzLl9fYXV0aG9yaXphdGlvbkhlYWRlciA9ICd0b2tlbiAnICsgYXV0aC50b2tlbjtcbiAgICAgIH0gZWxzZSBpZiAoYXV0aC51c2VybmFtZSAmJiBhdXRoLnBhc3N3b3JkKSB7XG4gICAgICAgICB0aGlzLl9fYXV0aG9yaXphdGlvbkhlYWRlciA9ICdCYXNpYyAnICsgQmFzZTY0LmVuY29kZShhdXRoLnVzZXJuYW1lICsgJzonICsgYXV0aC5wYXNzd29yZCk7XG4gICAgICB9XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ29tcHV0ZSB0aGUgVVJMIHRvIHVzZSB0byBtYWtlIGEgcmVxdWVzdC5cbiAgICAqIEBwcml2YXRlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIGVpdGhlciBhIFVSTCByZWxhdGl2ZSB0byB0aGUgQVBJIGJhc2Ugb3IgYW4gYWJzb2x1dGUgVVJMXG4gICAgKiBAcmV0dXJuIHtzdHJpbmd9IC0gdGhlIFVSTCB0byB1c2VcbiAgICAqL1xuICAgX19nZXRVUkwocGF0aCkge1xuICAgICAgbGV0IHVybCA9IHBhdGg7XG5cbiAgICAgIGlmIChwYXRoLmluZGV4T2YoJy8vJykgPT09IC0xKSB7XG4gICAgICAgICB1cmwgPSB0aGlzLl9fYXBpQmFzZSArIHBhdGg7XG4gICAgICB9XG5cbiAgICAgIGxldCBuZXdDYWNoZUJ1c3RlciA9ICd0aW1lc3RhbXA9JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgcmV0dXJuIHVybC5yZXBsYWNlKC8odGltZXN0YW1wPVxcZCspLywgbmV3Q2FjaGVCdXN0ZXIpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENvbXB1dGUgdGhlIGhlYWRlcnMgcmVxdWlyZWQgZm9yIGFuIEFQSSByZXF1ZXN0LlxuICAgICogQHByaXZhdGVcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmF3IC0gaWYgdGhlIHJlcXVlc3Qgc2hvdWxkIGJlIHRyZWF0ZWQgYXMgSlNPTiBvciBhcyBhIHJhdyByZXF1ZXN0XG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IHByZXZpZXcgLSBzZXQgdHJ1ZSB0byBhbGxvdyB0aGUgcHJldmlldyBhcGlcbiAgICAqIEByZXR1cm4ge09iamVjdH0gLSB0aGUgaGVhZGVycyB0byB1c2UgaW4gdGhlIHJlcXVlc3RcbiAgICAqL1xuICAgX19nZXRSZXF1ZXN0SGVhZGVycyhyYXcsIHByZXZpZXcpIHtcbiAgICAgIGxldCBoZWFkZXJzID0ge1xuICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLTgnXG4gICAgICB9O1xuXG4gICAgICBpZiAocHJldmlldyAmJiByYXcpIHtcbiAgICAgICAgIGhlYWRlcnMuQWNjZXB0ID0gJ2FwcGxpY2F0aW9uL3ZuZC5naXRodWIuaW5lcnRpYS1wcmV2aWV3LnJhdytqc29uJztcbiAgICAgIH0gZWxzZSBpZiAocHJldmlldykge1xuICAgICAgICAgaGVhZGVycy5BY2NlcHQgPSAnYXBwbGljYXRpb24vdm5kLmdpdGh1Yi5pbmVydGlhLXByZXZpZXcranNvbic7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgaGVhZGVycy5BY2NlcHQgPSAocmF3KSA/ICdhcHBsaWNhdGlvbi92bmQuZ2l0aHViLnYzLnJhdytqc29uJyA6ICdhcHBsaWNhdGlvbi92bmQuZ2l0aHViLnYzK2pzb24nO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fX2F1dGhvcml6YXRpb25IZWFkZXIpIHtcbiAgICAgICAgIGhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IHRoaXMuX19hdXRob3JpemF0aW9uSGVhZGVyO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaGVhZGVycztcbiAgIH1cblxuICAgLyoqXG4gICAgKiBTZXRzIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIEFQSSByZXF1ZXN0c1xuICAgICogQHByb3RlY3RlZFxuICAgICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0T3B0aW9ucz17fV0gLSB0aGUgY3VycmVudCBvcHRpb25zIGZvciB0aGUgcmVxdWVzdFxuICAgICogQHJldHVybiB7T2JqZWN0fSAtIHRoZSBvcHRpb25zIHRvIHBhc3MgdG8gdGhlIHJlcXVlc3RcbiAgICAqL1xuICAgX2dldE9wdGlvbnNXaXRoRGVmYXVsdHMocmVxdWVzdE9wdGlvbnMgPSB7fSkge1xuICAgICAgaWYgKCEocmVxdWVzdE9wdGlvbnMudmlzaWJpbGl0eSB8fCByZXF1ZXN0T3B0aW9ucy5hZmZpbGlhdGlvbikpIHtcbiAgICAgICAgIHJlcXVlc3RPcHRpb25zLnR5cGUgPSByZXF1ZXN0T3B0aW9ucy50eXBlIHx8ICdhbGwnO1xuICAgICAgfVxuICAgICAgcmVxdWVzdE9wdGlvbnMuc29ydCA9IHJlcXVlc3RPcHRpb25zLnNvcnQgfHwgJ3VwZGF0ZWQnO1xuICAgICAgcmVxdWVzdE9wdGlvbnMucGVyX3BhZ2UgPSByZXF1ZXN0T3B0aW9ucy5wZXJfcGFnZSB8fCAnMTAwJzsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXG4gICAgICByZXR1cm4gcmVxdWVzdE9wdGlvbnM7XG4gICB9XG5cbiAgIC8qKlxuICAgICogaWYgYSBgRGF0ZWAgaXMgcGFzc2VkIHRvIHRoaXMgZnVuY3Rpb24gaXQgd2lsbCBiZSBjb252ZXJ0ZWQgdG8gYW4gSVNPIHN0cmluZ1xuICAgICogQHBhcmFtIHsqfSBkYXRlIC0gdGhlIG9iamVjdCB0byBhdHRlbXB0IHRvIGNvb2VyY2UgaW50byBhbiBJU08gZGF0ZSBzdHJpbmdcbiAgICAqIEByZXR1cm4ge3N0cmluZ30gLSB0aGUgSVNPIHJlcHJlc2VudGF0aW9uIG9mIGBkYXRlYCBvciB3aGF0ZXZlciB3YXMgcGFzc2VkIGluIGlmIGl0IHdhcyBub3QgYSBkYXRlXG4gICAgKi9cbiAgIF9kYXRlVG9JU08oZGF0ZSkge1xuICAgICAgaWYgKGRhdGUgJiYgKGRhdGUgaW5zdGFuY2VvZiBEYXRlKSkge1xuICAgICAgICAgZGF0ZSA9IGRhdGUudG9JU09TdHJpbmcoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRhdGU7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQSBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIHRoZSByZXN1bHQgb2YgdGhlIEFQSSByZXF1ZXN0LlxuICAgICogQGNhbGxiYWNrIFJlcXVlc3RhYmxlLmNhbGxiYWNrXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLkVycm9yfSBlcnJvciAtIHRoZSBlcnJvciByZXR1cm5lZCBieSB0aGUgQVBJIG9yIGBudWxsYFxuICAgICogQHBhcmFtIHsoT2JqZWN0fHRydWUpfSByZXN1bHQgLSB0aGUgZGF0YSByZXR1cm5lZCBieSB0aGUgQVBJIG9yIGB0cnVlYCBpZiB0aGUgQVBJIHJldHVybnMgYDIwNCBObyBDb250ZW50YFxuICAgICogQHBhcmFtIHtPYmplY3R9IHJlcXVlc3QgLSB0aGUgcmF3IHtAbGlua2NvZGUgaHR0cHM6Ly9naXRodWIuY29tL216YWJyaXNraWUvYXhpb3MjcmVzcG9uc2Utc2NoZW1hIFJlc3BvbnNlfVxuICAgICovXG4gICAvKipcbiAgICAqIE1ha2UgYSByZXF1ZXN0LlxuICAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCAtIHRoZSBtZXRob2QgZm9yIHRoZSByZXF1ZXN0IChHRVQsIFBVVCwgUE9TVCwgREVMRVRFKVxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSB0aGUgcGF0aCBmb3IgdGhlIHJlcXVlc3RcbiAgICAqIEBwYXJhbSB7Kn0gW2RhdGFdIC0gdGhlIGRhdGEgdG8gc2VuZCB0byB0aGUgc2VydmVyLiBGb3IgSFRUUCBtZXRob2RzIHRoYXQgZG9uJ3QgaGF2ZSBhIGJvZHkgdGhlIGRhdGFcbiAgICAqICAgICAgICAgICAgICAgICAgIHdpbGwgYmUgc2VudCBhcyBxdWVyeSBwYXJhbWV0ZXJzXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gdGhlIGNhbGxiYWNrIGZvciB0aGUgcmVxdWVzdFxuICAgICogQHBhcmFtIHtib29sZWFufSBbcmF3PWZhbHNlXSAtIGlmIHRoZSByZXF1ZXN0IHNob3VsZCBiZSBzZW50IGFzIHJhdy4gSWYgdGhpcyBpcyBhIGZhbHN5IHZhbHVlIHRoZW4gdGhlXG4gICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3Qgd2lsbCBiZSBtYWRlIGFzIEpTT05cbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIFByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgX3JlcXVlc3QobWV0aG9kLCBwYXRoLCBkYXRhLCBjYiwgcmF3KSB7XG4gICAgICBjb25zdCB1cmwgPSB0aGlzLl9fZ2V0VVJMKHBhdGgpO1xuXG4gICAgICBsZXQgaGVhZGVycztcblxuICAgICAgLy8gRW5hYmxlIHByZXZpZXcgYXBpIG9ubHkgZm9yIHByb2plY3RzIGNhbGxzXG4gICAgICBpZiAocGF0aC5pbmNsdWRlcygncHJvamVjdHMnKSkge1xuICAgICAgICAgaGVhZGVycyA9IHRoaXMuX19nZXRSZXF1ZXN0SGVhZGVycyhyYXcsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIGhlYWRlcnMgPSB0aGlzLl9fZ2V0UmVxdWVzdEhlYWRlcnMocmF3KTtcbiAgICAgIH1cbiAgICAgIGxldCBxdWVyeVBhcmFtcyA9IHt9O1xuXG4gICAgICBjb25zdCBzaG91bGRVc2VEYXRhQXNQYXJhbXMgPSBkYXRhICYmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpICYmIG1ldGhvZEhhc05vQm9keShtZXRob2QpO1xuICAgICAgaWYgKHNob3VsZFVzZURhdGFBc1BhcmFtcykge1xuICAgICAgICAgcXVlcnlQYXJhbXMgPSBkYXRhO1xuICAgICAgICAgZGF0YSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICBwYXJhbXM6IHF1ZXJ5UGFyYW1zLFxuICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgIHJlc3BvbnNlVHlwZTogcmF3ID8gJ3RleHQnIDogJ2pzb24nXG4gICAgICB9O1xuXG4gICAgICBsb2coYCR7Y29uZmlnLm1ldGhvZH0gdG8gJHtjb25maWcudXJsfWApO1xuICAgICAgY29uc3QgcmVxdWVzdFByb21pc2UgPSBheGlvcyhjb25maWcpLmNhdGNoKGNhbGxiYWNrRXJyb3JPclRocm93KGNiLCBwYXRoKSk7XG5cbiAgICAgIGlmIChjYikge1xuICAgICAgICAgcmVxdWVzdFByb21pc2UudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhICYmIE9iamVjdC5rZXlzKHJlc3BvbnNlLmRhdGEpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgIC8vIFdoZW4gZGF0YSBoYXMgcmVzdWx0c1xuICAgICAgICAgICAgICAgY2IobnVsbCwgcmVzcG9uc2UuZGF0YSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgIC8vIFRydWUgd2hlbiBzdWNjZXNzXG4gICAgICAgICAgICAgICBjYihudWxsLCAocmVzcG9uc2Uuc3RhdHVzIDwgMzAwKSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXF1ZXN0UHJvbWlzZTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBNYWtlIGEgcmVxdWVzdCB0byBhbiBlbmRwb2ludCB0aGUgcmV0dXJucyAyMDQgd2hlbiB0cnVlIGFuZCA0MDQgd2hlbiBmYWxzZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSB0aGUgcGF0aCB0byByZXF1ZXN0XG4gICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGFueSBxdWVyeSBwYXJhbWV0ZXJzIGZvciB0aGUgcmVxdWVzdFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB0aGUgY2FsbGJhY2sgdGhhdCB3aWxsIHJlY2VpdmUgYHRydWVgIG9yIGBmYWxzZWBcbiAgICAqIEBwYXJhbSB7bWV0aG9kfSBbbWV0aG9kPUdFVF0gLSBIVFRQIE1ldGhvZCB0byB1c2VcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgX3JlcXVlc3QyMDRvcjQwNChwYXRoLCBkYXRhLCBjYiwgbWV0aG9kID0gJ0dFVCcpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KG1ldGhvZCwgcGF0aCwgZGF0YSlcbiAgICAgICAgIC50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChjYikge1xuICAgICAgICAgICAgICAgY2IobnVsbCwgdHJ1ZSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICB9LCBmdW5jdGlvbiBmYWlsdXJlKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDQpIHtcbiAgICAgICAgICAgICAgIGlmIChjYikge1xuICAgICAgICAgICAgICAgICAgY2IobnVsbCwgZmFsc2UsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgICAgICBjYihyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyByZXNwb25zZTtcbiAgICAgICAgIH0pO1xuICAgfVxuXG4gICAvKipcbiAgICAqIE1ha2UgYSByZXF1ZXN0IGFuZCBmZXRjaCBhbGwgdGhlIGF2YWlsYWJsZSBkYXRhLiBHaXRodWIgd2lsbCBwYWdpbmF0ZSByZXNwb25zZXMgc28gZm9yIHF1ZXJpZXNcbiAgICAqIHRoYXQgbWlnaHQgc3BhbiBtdWx0aXBsZSBwYWdlcyB0aGlzIG1ldGhvZCBpcyBwcmVmZXJyZWQgdG8ge0BsaW5rIFJlcXVlc3RhYmxlI3JlcXVlc3R9XG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIHRoZSBwYXRoIHRvIHJlcXVlc3RcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gaW5jbHVkZVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHRoZSBmdW5jdGlvbiB0byByZWNlaXZlIHRoZSBkYXRhLiBUaGUgcmV0dXJuZWQgZGF0YSB3aWxsIGFsd2F5cyBiZSBhbiBhcnJheS5cbiAgICAqIEBwYXJhbSB7T2JqZWN0W119IHJlc3VsdHMgLSB0aGUgcGFydGlhbCByZXN1bHRzLiBUaGlzIGFyZ3VtZW50IGlzIGludGVuZGVkIGZvciBpbnRlcmFsIHVzZSBvbmx5LlxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSBhIHByb21pc2Ugd2hpY2ggd2lsbCByZXNvbHZlIHdoZW4gYWxsIHBhZ2VzIGhhdmUgYmVlbiBmZXRjaGVkXG4gICAgKiBAZGVwcmVjYXRlZCBUaGlzIHdpbGwgYmUgZm9sZGVkIGludG8ge0BsaW5rIFJlcXVlc3RhYmxlI19yZXF1ZXN0fSBpbiB0aGUgMi4wIHJlbGVhc2UuXG4gICAgKi9cbiAgIF9yZXF1ZXN0QWxsUGFnZXMocGF0aCwgb3B0aW9ucywgY2IsIHJlc3VsdHMpIHtcbiAgICAgIHJlc3VsdHMgPSByZXN1bHRzIHx8IFtdO1xuXG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgcGF0aCwgb3B0aW9ucylcbiAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgbGV0IHRoaXNHcm91cDtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgIHRoaXNHcm91cCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLmRhdGEuaXRlbXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgdGhpc0dyb3VwID0gcmVzcG9uc2UuZGF0YS5pdGVtcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICBsZXQgbWVzc2FnZSA9IGBjYW5ub3QgZmlndXJlIG91dCBob3cgdG8gYXBwZW5kICR7cmVzcG9uc2UuZGF0YX0gdG8gdGhlIHJlc3VsdCBzZXRgO1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJlc3BvbnNlRXJyb3IobWVzc2FnZSwgcGF0aCwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoLmFwcGx5KHJlc3VsdHMsIHRoaXNHcm91cCk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5leHRVcmwgPSBnZXROZXh0UGFnZShyZXNwb25zZS5oZWFkZXJzLmxpbmspO1xuICAgICAgICAgICAgaWYgKG5leHRVcmwpIHtcbiAgICAgICAgICAgICAgIGxvZyhgZ2V0dGluZyBuZXh0IHBhZ2U6ICR7bmV4dFVybH1gKTtcbiAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0QWxsUGFnZXMobmV4dFVybCwgb3B0aW9ucywgY2IsIHJlc3VsdHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgICAgIGNiKG51bGwsIHJlc3VsdHMsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzcG9uc2UuZGF0YSA9IHJlc3VsdHM7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICB9KS5jYXRjaChjYWxsYmFja0Vycm9yT3JUaHJvdyhjYiwgcGF0aCkpO1xuICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlcXVlc3RhYmxlO1xuXG4vLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyAvL1xuLy8gIFByaXZhdGUgaGVscGVyIGZ1bmN0aW9ucyAgLy9cbi8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIC8vXG5jb25zdCBNRVRIT0RTX1dJVEhfTk9fQk9EWSA9IFsnR0VUJywgJ0hFQUQnLCAnREVMRVRFJ107XG5mdW5jdGlvbiBtZXRob2RIYXNOb0JvZHkobWV0aG9kKSB7XG4gICByZXR1cm4gTUVUSE9EU19XSVRIX05PX0JPRFkuaW5kZXhPZihtZXRob2QpICE9PSAtMTtcbn1cblxuZnVuY3Rpb24gZ2V0TmV4dFBhZ2UobGlua3NIZWFkZXIgPSAnJykge1xuICAgY29uc3QgbGlua3MgPSBsaW5rc0hlYWRlci5zcGxpdCgvXFxzKixcXHMqLyk7IC8vIHNwbGl0cyBhbmQgc3RyaXBzIHRoZSB1cmxzXG4gICByZXR1cm4gbGlua3MucmVkdWNlKGZ1bmN0aW9uKG5leHRVcmwsIGxpbmspIHtcbiAgICAgIGlmIChsaW5rLnNlYXJjaCgvcmVsPVwibmV4dFwiLykgIT09IC0xKSB7XG4gICAgICAgICByZXR1cm4gKGxpbmsubWF0Y2goLzwoLiopPi8pIHx8IFtdKVsxXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5leHRVcmw7XG4gICB9LCB1bmRlZmluZWQpO1xufVxuXG5mdW5jdGlvbiBjYWxsYmFja0Vycm9yT3JUaHJvdyhjYiwgcGF0aCkge1xuICAgcmV0dXJuIGZ1bmN0aW9uIGhhbmRsZXIob2JqZWN0KSB7XG4gICAgICBsZXQgZXJyb3I7XG4gICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KCdjb25maWcnKSkge1xuICAgICAgICAgY29uc3Qge3N0YXR1cywgc3RhdHVzVGV4dCwgY29uZmlnOiB7bWV0aG9kLCB1cmx9fSA9IG9iamVjdDtcbiAgICAgICAgIGxldCBtZXNzYWdlID0gKGAke3N0YXR1c30gZXJyb3IgbWFraW5nIHJlcXVlc3QgJHttZXRob2R9ICR7dXJsfTogXCIke3N0YXR1c1RleHR9XCJgKTtcbiAgICAgICAgIGVycm9yID0gbmV3IFJlc3BvbnNlRXJyb3IobWVzc2FnZSwgcGF0aCwgb2JqZWN0KTtcbiAgICAgICAgIGxvZyhgJHttZXNzYWdlfSAke0pTT04uc3RyaW5naWZ5KG9iamVjdC5kYXRhKX1gKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICBlcnJvciA9IG9iamVjdDtcbiAgICAgIH1cbiAgICAgIGlmIChjYikge1xuICAgICAgICAgbG9nKCdnb2luZyB0byBlcnJvciBjYWxsYmFjaycpO1xuICAgICAgICAgY2IoZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIGxvZygndGhyb3dpbmcgZXJyb3InKTtcbiAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgfTtcbn1cbiJdfQ==
//# sourceMappingURL=Requestable.js.map
