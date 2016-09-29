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
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
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
            var requestOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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
                  } else if (config.method !== 'GET' && Object.keys(response.data).length < 1) {
                     // True when successful submit a request and receive a empty object
                     cb(null, response.status < 300, response);
                  } else {
                     cb(null, response.data, response);
                  }
               });
            }

            return requestPromise;
         }
      }, {
         key: '_request204or404',
         value: function _request204or404(path, data, cb) {
            var method = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'GET';

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
      var linksHeader = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJlcXVlc3RhYmxlLmpzIl0sIm5hbWVzIjpbImxvZyIsIlByb21pc2UiLCJSZXNwb25zZUVycm9yIiwibWVzc2FnZSIsInBhdGgiLCJyZXNwb25zZSIsInJlcXVlc3QiLCJjb25maWciLCJzdGF0dXMiLCJFcnJvciIsIlJlcXVlc3RhYmxlIiwiYXV0aCIsImFwaUJhc2UiLCJfX2FwaUJhc2UiLCJfX2F1dGgiLCJ0b2tlbiIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJfX2F1dGhvcml6YXRpb25IZWFkZXIiLCJlbmNvZGUiLCJ1cmwiLCJpbmRleE9mIiwibmV3Q2FjaGVCdXN0ZXIiLCJEYXRlIiwiZ2V0VGltZSIsInJlcGxhY2UiLCJyYXciLCJwcmV2aWV3IiwiaGVhZGVycyIsIkFjY2VwdCIsIkF1dGhvcml6YXRpb24iLCJyZXF1ZXN0T3B0aW9ucyIsInZpc2liaWxpdHkiLCJhZmZpbGlhdGlvbiIsInR5cGUiLCJzb3J0IiwicGVyX3BhZ2UiLCJkYXRlIiwidG9JU09TdHJpbmciLCJtZXRob2QiLCJkYXRhIiwiY2IiLCJfX2dldFVSTCIsImluY2x1ZGVzIiwiX19nZXRSZXF1ZXN0SGVhZGVycyIsInF1ZXJ5UGFyYW1zIiwic2hvdWxkVXNlRGF0YUFzUGFyYW1zIiwibWV0aG9kSGFzTm9Cb2R5IiwidW5kZWZpbmVkIiwicGFyYW1zIiwicmVzcG9uc2VUeXBlIiwicmVxdWVzdFByb21pc2UiLCJjYXRjaCIsImNhbGxiYWNrRXJyb3JPclRocm93IiwidGhlbiIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJfcmVxdWVzdCIsInN1Y2Nlc3MiLCJmYWlsdXJlIiwib3B0aW9ucyIsInJlc3VsdHMiLCJ0aGlzR3JvdXAiLCJBcnJheSIsIml0ZW1zIiwicHVzaCIsImFwcGx5IiwibmV4dFVybCIsImdldE5leHRQYWdlIiwibGluayIsIl9yZXF1ZXN0QWxsUGFnZXMiLCJtb2R1bGUiLCJleHBvcnRzIiwiTUVUSE9EU19XSVRIX05PX0JPRFkiLCJsaW5rc0hlYWRlciIsImxpbmtzIiwic3BsaXQiLCJyZWR1Y2UiLCJzZWFyY2giLCJtYXRjaCIsImhhbmRsZXIiLCJvYmplY3QiLCJlcnJvciIsImhhc093blByb3BlcnR5Iiwic3RhdHVzVGV4dCIsIkpTT04iLCJzdHJpbmdpZnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFZQSxPQUFNQSxNQUFNLHFCQUFNLGdCQUFOLENBQVo7O0FBRUEsT0FBSSxPQUFPQyxPQUFQLEtBQW1CLFdBQXZCLEVBQW9DO0FBQ2pDO0FBQ0Y7O0FBRUQ7Ozs7T0FHTUMsYTs7O0FBQ0g7Ozs7OztBQU1BLDZCQUFZQyxPQUFaLEVBQXFCQyxJQUFyQixFQUEyQkMsUUFBM0IsRUFBcUM7QUFBQTs7QUFBQSxtSUFDNUJGLE9BRDRCOztBQUVsQyxlQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDQSxlQUFLRSxPQUFMLEdBQWVELFNBQVNFLE1BQXhCO0FBQ0EsZUFBS0YsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxlQUFLRyxNQUFMLEdBQWNILFNBQVNHLE1BQXZCO0FBTGtDO0FBTXBDOzs7S0Fid0JDLEs7O09BbUJ0QkMsVztBQUNIOzs7Ozs7O0FBT0E7Ozs7OztBQU1BLDJCQUFZQyxJQUFaLEVBQWtCQyxPQUFsQixFQUEyQjtBQUFBOztBQUN4QixjQUFLQyxTQUFMLEdBQWlCRCxXQUFXLHdCQUE1QjtBQUNBLGNBQUtFLE1BQUwsR0FBYztBQUNYQyxtQkFBT0osS0FBS0ksS0FERDtBQUVYQyxzQkFBVUwsS0FBS0ssUUFGSjtBQUdYQyxzQkFBVU4sS0FBS007QUFISixVQUFkOztBQU1BLGFBQUlOLEtBQUtJLEtBQVQsRUFBZ0I7QUFDYixpQkFBS0cscUJBQUwsR0FBNkIsV0FBV1AsS0FBS0ksS0FBN0M7QUFDRixVQUZELE1BRU8sSUFBSUosS0FBS0ssUUFBTCxJQUFpQkwsS0FBS00sUUFBMUIsRUFBb0M7QUFDeEMsaUJBQUtDLHFCQUFM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QUF5QjtBQUM3QixhQUFJQyxjQUFKO0FBQ0EsYUFBSUQsT0FBT0UsY0FBUCxDQUFzQixRQUF0QixDQUFKLEVBQXFDO0FBQUEsZ0JBQzNCNUUsTUFEMkIsR0FDa0IwRSxNQURsQixDQUMzQjFFLE1BRDJCO0FBQUEsZ0JBQ25CNkUsVUFEbUIsR0FDa0JILE1BRGxCLENBQ25CRyxVQURtQjtBQUFBLGlDQUNrQkgsTUFEbEIsQ0FDUDNFLE1BRE87QUFBQSxnQkFDRWdDLE1BREYsa0JBQ0VBLE1BREY7QUFBQSxnQkFDVW5CLEdBRFYsa0JBQ1VBLEdBRFY7O0FBRWxDLGdCQUFJakIsVUFBY0ssTUFBZCw4QkFBNkMrQixNQUE3QyxTQUF1RG5CLEdBQXZELFdBQWdFaUUsVUFBaEUsTUFBSjtBQUNBRixvQkFBUSxJQUFJakYsYUFBSixDQUFrQkMsT0FBbEIsRUFBMkJDLElBQTNCLEVBQWlDOEUsTUFBakMsQ0FBUjtBQUNBbEYsZ0JBQU9HLE9BQVAsU0FBa0JtRixLQUFLQyxTQUFMLENBQWVMLE9BQU8xQyxJQUF0QixDQUFsQjtBQUNGLFVBTEQsTUFLTztBQUNKMkMsb0JBQVFELE1BQVI7QUFDRjtBQUNELGFBQUl6QyxFQUFKLEVBQVE7QUFDTHpDLGdCQUFJLHlCQUFKO0FBQ0F5QyxlQUFHMEMsS0FBSDtBQUNGLFVBSEQsTUFHTztBQUNKbkYsZ0JBQUksZ0JBQUo7QUFDQSxrQkFBTW1GLEtBQU47QUFDRjtBQUNILE9BakJEO0FBa0JGIiwiZmlsZSI6IlJlcXVlc3RhYmxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZVxuICogQGNvcHlyaWdodCAgMjAxNiBZYWhvbyBJbmMuXG4gKiBAbGljZW5zZSAgICBMaWNlbnNlZCB1bmRlciB7QGxpbmsgaHR0cHM6Ly9zcGR4Lm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2UtQ2xlYXIuaHRtbCBCU0QtMy1DbGF1c2UtQ2xlYXJ9LlxuICogICAgICAgICAgICAgR2l0aHViLmpzIGlzIGZyZWVseSBkaXN0cmlidXRhYmxlLlxuICovXG5cbmltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IHtCYXNlNjR9IGZyb20gJ2pzLWJhc2U2NCc7XG5pbXBvcnQge3BvbHlmaWxsfSBmcm9tICdlczYtcHJvbWlzZSc7XG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdnaXRodWI6cmVxdWVzdCcpO1xuXG5pZiAodHlwZW9mIFByb21pc2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICBwb2x5ZmlsbCgpO1xufVxuXG4vKipcbiAqIFRoZSBlcnJvciBzdHJ1Y3R1cmUgcmV0dXJuZWQgd2hlbiBhIG5ldHdvcmsgY2FsbCBmYWlsc1xuICovXG5jbGFzcyBSZXNwb25zZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgLyoqXG4gICAgKiBDb25zdHJ1Y3QgYSBuZXcgUmVzcG9uc2VFcnJvclxuICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSBhbiBtZXNzYWdlIHRvIHJldHVybiBpbnN0ZWFkIG9mIHRoZSB0aGUgZGVmYXVsdCBlcnJvciBtZXNzYWdlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIHRoZSByZXF1ZXN0ZWQgcGF0aFxuICAgICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlIC0gdGhlIG9iamVjdCByZXR1cm5lZCBieSBBeGlvc1xuICAgICovXG4gICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBwYXRoLCByZXNwb25zZSkge1xuICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgICAgdGhpcy5yZXF1ZXN0ID0gcmVzcG9uc2UuY29uZmlnO1xuICAgICAgdGhpcy5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgICAgdGhpcy5zdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XG4gICB9XG59XG5cbi8qKlxuICogUmVxdWVzdGFibGUgd3JhcHMgdGhlIGxvZ2ljIGZvciBtYWtpbmcgaHR0cCByZXF1ZXN0cyB0byB0aGUgQVBJXG4gKi9cbmNsYXNzIFJlcXVlc3RhYmxlIHtcbiAgIC8qKlxuICAgICogRWl0aGVyIGEgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIG9yIGFuIG9hdXRoIHRva2VuIGZvciBHaXRodWJcbiAgICAqIEB0eXBlZGVmIHtPYmplY3R9IFJlcXVlc3RhYmxlLmF1dGhcbiAgICAqIEBwcm9wIHtzdHJpbmd9IFt1c2VybmFtZV0gLSB0aGUgR2l0aHViIHVzZXJuYW1lXG4gICAgKiBAcHJvcCB7c3RyaW5nfSBbcGFzc3dvcmRdIC0gdGhlIHVzZXIncyBwYXNzd29yZFxuICAgICogQHByb3Age3Rva2VufSBbdG9rZW5dIC0gYW4gT0F1dGggdG9rZW5cbiAgICAqL1xuICAgLyoqXG4gICAgKiBJbml0aWFsaXplIHRoZSBodHRwIGludGVybmFscy5cbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuYXV0aH0gW2F1dGhdIC0gdGhlIGNyZWRlbnRpYWxzIHRvIGF1dGhlbnRpY2F0ZSB0byBHaXRodWIuIElmIGF1dGggaXNcbiAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdCBwcm92aWRlZCByZXF1ZXN0IHdpbGwgYmUgbWFkZSB1bmF1dGhlbnRpY2F0ZWRcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbYXBpQmFzZT1odHRwczovL2FwaS5naXRodWIuY29tXSAtIHRoZSBiYXNlIEdpdGh1YiBBUEkgVVJMXG4gICAgKi9cbiAgIGNvbnN0cnVjdG9yKGF1dGgsIGFwaUJhc2UpIHtcbiAgICAgIHRoaXMuX19hcGlCYXNlID0gYXBpQmFzZSB8fCAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbSc7XG4gICAgICB0aGlzLl9fYXV0aCA9IHtcbiAgICAgICAgIHRva2VuOiBhdXRoLnRva2VuLFxuICAgICAgICAgdXNlcm5hbWU6IGF1dGgudXNlcm5hbWUsXG4gICAgICAgICBwYXNzd29yZDogYXV0aC5wYXNzd29yZFxuICAgICAgfTtcblxuICAgICAgaWYgKGF1dGgudG9rZW4pIHtcbiAgICAgICAgIHRoaXMuX19hdXRob3JpemF0aW9uSGVhZGVyID0gJ3Rva2VuICcgKyBhdXRoLnRva2VuO1xuICAgICAgfSBlbHNlIGlmIChhdXRoLnVzZXJuYW1lICYmIGF1dGgucGFzc3dvcmQpIHtcbiAgICAgICAgIHRoaXMuX19hdXRob3JpemF0aW9uSGVhZGVyID0gJ0Jhc2ljICcgKyBCYXNlNjQuZW5jb2RlKGF1dGgudXNlcm5hbWUgKyAnOicgKyBhdXRoLnBhc3N3b3JkKTtcbiAgICAgIH1cbiAgIH1cblxuICAgLyoqXG4gICAgKiBDb21wdXRlIHRoZSBVUkwgdG8gdXNlIHRvIG1ha2UgYSByZXF1ZXN0LlxuICAgICogQHByaXZhdGVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gZWl0aGVyIGEgVVJMIHJlbGF0aXZlIHRvIHRoZSBBUEkgYmFzZSBvciBhbiBhYnNvbHV0ZSBVUkxcbiAgICAqIEByZXR1cm4ge3N0cmluZ30gLSB0aGUgVVJMIHRvIHVzZVxuICAgICovXG4gICBfX2dldFVSTChwYXRoKSB7XG4gICAgICBsZXQgdXJsID0gcGF0aDtcblxuICAgICAgaWYgKHBhdGguaW5kZXhPZignLy8nKSA9PT0gLTEpIHtcbiAgICAgICAgIHVybCA9IHRoaXMuX19hcGlCYXNlICsgcGF0aDtcbiAgICAgIH1cblxuICAgICAgbGV0IG5ld0NhY2hlQnVzdGVyID0gJ3RpbWVzdGFtcD0nICsgbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICByZXR1cm4gdXJsLnJlcGxhY2UoLyh0aW1lc3RhbXA9XFxkKykvLCBuZXdDYWNoZUJ1c3Rlcik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ29tcHV0ZSB0aGUgaGVhZGVycyByZXF1aXJlZCBmb3IgYW4gQVBJIHJlcXVlc3QuXG4gICAgKiBAcHJpdmF0ZVxuICAgICogQHBhcmFtIHtib29sZWFufSByYXcgLSBpZiB0aGUgcmVxdWVzdCBzaG91bGQgYmUgdHJlYXRlZCBhcyBKU09OIG9yIGFzIGEgcmF3IHJlcXVlc3RcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcHJldmlldyAtIHNldCB0cnVlIHRvIGFsbG93IHRoZSBwcmV2aWV3IGFwaVxuICAgICogQHJldHVybiB7T2JqZWN0fSAtIHRoZSBoZWFkZXJzIHRvIHVzZSBpbiB0aGUgcmVxdWVzdFxuICAgICovXG4gICBfX2dldFJlcXVlc3RIZWFkZXJzKHJhdywgcHJldmlldykge1xuICAgICAgbGV0IGhlYWRlcnMgPSB7XG4gICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD1VVEYtOCdcbiAgICAgIH07XG5cbiAgICAgIGlmIChwcmV2aWV3ICYmIHJhdykge1xuICAgICAgICAgaGVhZGVycy5BY2NlcHQgPSAnYXBwbGljYXRpb24vdm5kLmdpdGh1Yi5pbmVydGlhLXByZXZpZXcucmF3K2pzb24nO1xuICAgICAgfSBlbHNlIGlmIChwcmV2aWV3KSB7XG4gICAgICAgICBoZWFkZXJzLkFjY2VwdCA9ICdhcHBsaWNhdGlvbi92bmQuZ2l0aHViLmluZXJ0aWEtcHJldmlldytqc29uJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICBoZWFkZXJzLkFjY2VwdCA9IChyYXcpID8gJ2FwcGxpY2F0aW9uL3ZuZC5naXRodWIudjMucmF3K2pzb24nIDogJ2FwcGxpY2F0aW9uL3ZuZC5naXRodWIudjMranNvbic7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9fYXV0aG9yaXphdGlvbkhlYWRlcikge1xuICAgICAgICAgaGVhZGVycy5BdXRob3JpemF0aW9uID0gdGhpcy5fX2F1dGhvcml6YXRpb25IZWFkZXI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoZWFkZXJzO1xuICAgfVxuXG4gICAvKipcbiAgICAqIFNldHMgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgQVBJIHJlcXVlc3RzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RPcHRpb25zPXt9XSAtIHRoZSBjdXJyZW50IG9wdGlvbnMgZm9yIHRoZSByZXF1ZXN0XG4gICAgKiBAcmV0dXJuIHtPYmplY3R9IC0gdGhlIG9wdGlvbnMgdG8gcGFzcyB0byB0aGUgcmVxdWVzdFxuICAgICovXG4gICBfZ2V0T3B0aW9uc1dpdGhEZWZhdWx0cyhyZXF1ZXN0T3B0aW9ucyA9IHt9KSB7XG4gICAgICBpZiAoIShyZXF1ZXN0T3B0aW9ucy52aXNpYmlsaXR5IHx8IHJlcXVlc3RPcHRpb25zLmFmZmlsaWF0aW9uKSkge1xuICAgICAgICAgcmVxdWVzdE9wdGlvbnMudHlwZSA9IHJlcXVlc3RPcHRpb25zLnR5cGUgfHwgJ2FsbCc7XG4gICAgICB9XG4gICAgICByZXF1ZXN0T3B0aW9ucy5zb3J0ID0gcmVxdWVzdE9wdGlvbnMuc29ydCB8fCAndXBkYXRlZCc7XG4gICAgICByZXF1ZXN0T3B0aW9ucy5wZXJfcGFnZSA9IHJlcXVlc3RPcHRpb25zLnBlcl9wYWdlIHx8ICcxMDAnOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cbiAgICAgIHJldHVybiByZXF1ZXN0T3B0aW9ucztcbiAgIH1cblxuICAgLyoqXG4gICAgKiBpZiBhIGBEYXRlYCBpcyBwYXNzZWQgdG8gdGhpcyBmdW5jdGlvbiBpdCB3aWxsIGJlIGNvbnZlcnRlZCB0byBhbiBJU08gc3RyaW5nXG4gICAgKiBAcGFyYW0geyp9IGRhdGUgLSB0aGUgb2JqZWN0IHRvIGF0dGVtcHQgdG8gY29vZXJjZSBpbnRvIGFuIElTTyBkYXRlIHN0cmluZ1xuICAgICogQHJldHVybiB7c3RyaW5nfSAtIHRoZSBJU08gcmVwcmVzZW50YXRpb24gb2YgYGRhdGVgIG9yIHdoYXRldmVyIHdhcyBwYXNzZWQgaW4gaWYgaXQgd2FzIG5vdCBhIGRhdGVcbiAgICAqL1xuICAgX2RhdGVUb0lTTyhkYXRlKSB7XG4gICAgICBpZiAoZGF0ZSAmJiAoZGF0ZSBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICBkYXRlID0gZGF0ZS50b0lTT1N0cmluZygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGF0ZTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBBIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgdGhlIHJlc3VsdCBvZiB0aGUgQVBJIHJlcXVlc3QuXG4gICAgKiBAY2FsbGJhY2sgUmVxdWVzdGFibGUuY2FsbGJhY2tcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuRXJyb3J9IGVycm9yIC0gdGhlIGVycm9yIHJldHVybmVkIGJ5IHRoZSBBUEkgb3IgYG51bGxgXG4gICAgKiBAcGFyYW0geyhPYmplY3R8dHJ1ZSl9IHJlc3VsdCAtIHRoZSBkYXRhIHJldHVybmVkIGJ5IHRoZSBBUEkgb3IgYHRydWVgIGlmIHRoZSBBUEkgcmV0dXJucyBgMjA0IE5vIENvbnRlbnRgXG4gICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdCAtIHRoZSByYXcge0BsaW5rY29kZSBodHRwczovL2dpdGh1Yi5jb20vbXphYnJpc2tpZS9heGlvcyNyZXNwb25zZS1zY2hlbWEgUmVzcG9uc2V9XG4gICAgKi9cbiAgIC8qKlxuICAgICogTWFrZSBhIHJlcXVlc3QuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIC0gdGhlIG1ldGhvZCBmb3IgdGhlIHJlcXVlc3QgKEdFVCwgUFVULCBQT1NULCBERUxFVEUpXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIHRoZSBwYXRoIGZvciB0aGUgcmVxdWVzdFxuICAgICogQHBhcmFtIHsqfSBbZGF0YV0gLSB0aGUgZGF0YSB0byBzZW5kIHRvIHRoZSBzZXJ2ZXIuIEZvciBIVFRQIG1ldGhvZHMgdGhhdCBkb24ndCBoYXZlIGEgYm9keSB0aGUgZGF0YVxuICAgICogICAgICAgICAgICAgICAgICAgd2lsbCBiZSBzZW50IGFzIHF1ZXJ5IHBhcmFtZXRlcnNcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB0aGUgY2FsbGJhY2sgZm9yIHRoZSByZXF1ZXN0XG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtyYXc9ZmFsc2VdIC0gaWYgdGhlIHJlcXVlc3Qgc2hvdWxkIGJlIHNlbnQgYXMgcmF3LiBJZiB0aGlzIGlzIGEgZmFsc3kgdmFsdWUgdGhlbiB0aGVcbiAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdCB3aWxsIGJlIG1hZGUgYXMgSlNPTlxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgUHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBfcmVxdWVzdChtZXRob2QsIHBhdGgsIGRhdGEsIGNiLCByYXcpIHtcbiAgICAgIGNvbnN0IHVybCA9IHRoaXMuX19nZXRVUkwocGF0aCk7XG5cbiAgICAgIGxldCBoZWFkZXJzO1xuXG4gICAgICAvLyBFbmFibGUgcHJldmlldyBhcGkgb25seSBmb3IgcHJvamVjdHMgY2FsbHNcbiAgICAgIGlmIChwYXRoLmluY2x1ZGVzKCdwcm9qZWN0cycpKSB7XG4gICAgICAgICBoZWFkZXJzID0gdGhpcy5fX2dldFJlcXVlc3RIZWFkZXJzKHJhdywgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgaGVhZGVycyA9IHRoaXMuX19nZXRSZXF1ZXN0SGVhZGVycyhyYXcpO1xuICAgICAgfVxuICAgICAgbGV0IHF1ZXJ5UGFyYW1zID0ge307XG5cbiAgICAgIGNvbnN0IHNob3VsZFVzZURhdGFBc1BhcmFtcyA9IGRhdGEgJiYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JykgJiYgbWV0aG9kSGFzTm9Cb2R5KG1ldGhvZCk7XG4gICAgICBpZiAoc2hvdWxkVXNlRGF0YUFzUGFyYW1zKSB7XG4gICAgICAgICBxdWVyeVBhcmFtcyA9IGRhdGE7XG4gICAgICAgICBkYXRhID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgIHBhcmFtczogcXVlcnlQYXJhbXMsXG4gICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgcmVzcG9uc2VUeXBlOiByYXcgPyAndGV4dCcgOiAnanNvbidcbiAgICAgIH07XG5cbiAgICAgIGxvZyhgJHtjb25maWcubWV0aG9kfSB0byAke2NvbmZpZy51cmx9YCk7XG4gICAgICBjb25zdCByZXF1ZXN0UHJvbWlzZSA9IGF4aW9zKGNvbmZpZykuY2F0Y2goY2FsbGJhY2tFcnJvck9yVGhyb3coY2IsIHBhdGgpKTtcblxuICAgICAgaWYgKGNiKSB7XG4gICAgICAgICByZXF1ZXN0UHJvbWlzZS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEgJiYgT2JqZWN0LmtleXMocmVzcG9uc2UuZGF0YSkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgLy8gV2hlbiBkYXRhIGhhcyByZXN1bHRzXG4gICAgICAgICAgICAgICBjYihudWxsLCByZXNwb25zZS5kYXRhLCByZXNwb25zZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5tZXRob2QgIT09ICdHRVQnICYmIE9iamVjdC5rZXlzKHJlc3BvbnNlLmRhdGEpLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICAgIC8vIFRydWUgd2hlbiBzdWNjZXNzZnVsIHN1Ym1pdCBhIHJlcXVlc3QgYW5kIHJlY2VpdmUgYSBlbXB0eSBvYmplY3RcbiAgICAgICAgICAgICAgIGNiKG51bGwsIChyZXNwb25zZS5zdGF0dXMgPCAzMDApLCByZXNwb25zZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgY2IobnVsbCwgcmVzcG9uc2UuZGF0YSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXF1ZXN0UHJvbWlzZTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBNYWtlIGEgcmVxdWVzdCB0byBhbiBlbmRwb2ludCB0aGUgcmV0dXJucyAyMDQgd2hlbiB0cnVlIGFuZCA0MDQgd2hlbiBmYWxzZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSB0aGUgcGF0aCB0byByZXF1ZXN0XG4gICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGFueSBxdWVyeSBwYXJhbWV0ZXJzIGZvciB0aGUgcmVxdWVzdFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB0aGUgY2FsbGJhY2sgdGhhdCB3aWxsIHJlY2VpdmUgYHRydWVgIG9yIGBmYWxzZWBcbiAgICAqIEBwYXJhbSB7bWV0aG9kfSBbbWV0aG9kPUdFVF0gLSBIVFRQIE1ldGhvZCB0byB1c2VcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgX3JlcXVlc3QyMDRvcjQwNChwYXRoLCBkYXRhLCBjYiwgbWV0aG9kID0gJ0dFVCcpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KG1ldGhvZCwgcGF0aCwgZGF0YSlcbiAgICAgICAgIC50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChjYikge1xuICAgICAgICAgICAgICAgY2IobnVsbCwgdHJ1ZSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICB9LCBmdW5jdGlvbiBmYWlsdXJlKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MDQpIHtcbiAgICAgICAgICAgICAgIGlmIChjYikge1xuICAgICAgICAgICAgICAgICAgY2IobnVsbCwgZmFsc2UsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgICAgICBjYihyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyByZXNwb25zZTtcbiAgICAgICAgIH0pO1xuICAgfVxuXG4gICAvKipcbiAgICAqIE1ha2UgYSByZXF1ZXN0IGFuZCBmZXRjaCBhbGwgdGhlIGF2YWlsYWJsZSBkYXRhLiBHaXRodWIgd2lsbCBwYWdpbmF0ZSByZXNwb25zZXMgc28gZm9yIHF1ZXJpZXNcbiAgICAqIHRoYXQgbWlnaHQgc3BhbiBtdWx0aXBsZSBwYWdlcyB0aGlzIG1ldGhvZCBpcyBwcmVmZXJyZWQgdG8ge0BsaW5rIFJlcXVlc3RhYmxlI3JlcXVlc3R9XG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIHRoZSBwYXRoIHRvIHJlcXVlc3RcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdGhlIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gaW5jbHVkZVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHRoZSBmdW5jdGlvbiB0byByZWNlaXZlIHRoZSBkYXRhLiBUaGUgcmV0dXJuZWQgZGF0YSB3aWxsIGFsd2F5cyBiZSBhbiBhcnJheS5cbiAgICAqIEBwYXJhbSB7T2JqZWN0W119IHJlc3VsdHMgLSB0aGUgcGFydGlhbCByZXN1bHRzLiBUaGlzIGFyZ3VtZW50IGlzIGludGVuZGVkIGZvciBpbnRlcmFsIHVzZSBvbmx5LlxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSBhIHByb21pc2Ugd2hpY2ggd2lsbCByZXNvbHZlIHdoZW4gYWxsIHBhZ2VzIGhhdmUgYmVlbiBmZXRjaGVkXG4gICAgKiBAZGVwcmVjYXRlZCBUaGlzIHdpbGwgYmUgZm9sZGVkIGludG8ge0BsaW5rIFJlcXVlc3RhYmxlI19yZXF1ZXN0fSBpbiB0aGUgMi4wIHJlbGVhc2UuXG4gICAgKi9cbiAgIF9yZXF1ZXN0QWxsUGFnZXMocGF0aCwgb3B0aW9ucywgY2IsIHJlc3VsdHMpIHtcbiAgICAgIHJlc3VsdHMgPSByZXN1bHRzIHx8IFtdO1xuXG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgcGF0aCwgb3B0aW9ucylcbiAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgbGV0IHRoaXNHcm91cDtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgIHRoaXNHcm91cCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLmRhdGEuaXRlbXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgdGhpc0dyb3VwID0gcmVzcG9uc2UuZGF0YS5pdGVtcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICBsZXQgbWVzc2FnZSA9IGBjYW5ub3QgZmlndXJlIG91dCBob3cgdG8gYXBwZW5kICR7cmVzcG9uc2UuZGF0YX0gdG8gdGhlIHJlc3VsdCBzZXRgO1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJlc3BvbnNlRXJyb3IobWVzc2FnZSwgcGF0aCwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoLmFwcGx5KHJlc3VsdHMsIHRoaXNHcm91cCk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5leHRVcmwgPSBnZXROZXh0UGFnZShyZXNwb25zZS5oZWFkZXJzLmxpbmspO1xuICAgICAgICAgICAgaWYgKG5leHRVcmwpIHtcbiAgICAgICAgICAgICAgIGxvZyhgZ2V0dGluZyBuZXh0IHBhZ2U6ICR7bmV4dFVybH1gKTtcbiAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0QWxsUGFnZXMobmV4dFVybCwgb3B0aW9ucywgY2IsIHJlc3VsdHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgICAgIGNiKG51bGwsIHJlc3VsdHMsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzcG9uc2UuZGF0YSA9IHJlc3VsdHM7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICB9KS5jYXRjaChjYWxsYmFja0Vycm9yT3JUaHJvdyhjYiwgcGF0aCkpO1xuICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlcXVlc3RhYmxlO1xuXG4vLyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyAvL1xuLy8gIFByaXZhdGUgaGVscGVyIGZ1bmN0aW9ucyAgLy9cbi8vIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vIC8vXG5jb25zdCBNRVRIT0RTX1dJVEhfTk9fQk9EWSA9IFsnR0VUJywgJ0hFQUQnLCAnREVMRVRFJ107XG5mdW5jdGlvbiBtZXRob2RIYXNOb0JvZHkobWV0aG9kKSB7XG4gICByZXR1cm4gTUVUSE9EU19XSVRIX05PX0JPRFkuaW5kZXhPZihtZXRob2QpICE9PSAtMTtcbn1cblxuZnVuY3Rpb24gZ2V0TmV4dFBhZ2UobGlua3NIZWFkZXIgPSAnJykge1xuICAgY29uc3QgbGlua3MgPSBsaW5rc0hlYWRlci5zcGxpdCgvXFxzKixcXHMqLyk7IC8vIHNwbGl0cyBhbmQgc3RyaXBzIHRoZSB1cmxzXG4gICByZXR1cm4gbGlua3MucmVkdWNlKGZ1bmN0aW9uKG5leHRVcmwsIGxpbmspIHtcbiAgICAgIGlmIChsaW5rLnNlYXJjaCgvcmVsPVwibmV4dFwiLykgIT09IC0xKSB7XG4gICAgICAgICByZXR1cm4gKGxpbmsubWF0Y2goLzwoLiopPi8pIHx8IFtdKVsxXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5leHRVcmw7XG4gICB9LCB1bmRlZmluZWQpO1xufVxuXG5mdW5jdGlvbiBjYWxsYmFja0Vycm9yT3JUaHJvdyhjYiwgcGF0aCkge1xuICAgcmV0dXJuIGZ1bmN0aW9uIGhhbmRsZXIob2JqZWN0KSB7XG4gICAgICBsZXQgZXJyb3I7XG4gICAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KCdjb25maWcnKSkge1xuICAgICAgICAgY29uc3Qge3N0YXR1cywgc3RhdHVzVGV4dCwgY29uZmlnOiB7bWV0aG9kLCB1cmx9fSA9IG9iamVjdDtcbiAgICAgICAgIGxldCBtZXNzYWdlID0gKGAke3N0YXR1c30gZXJyb3IgbWFraW5nIHJlcXVlc3QgJHttZXRob2R9ICR7dXJsfTogXCIke3N0YXR1c1RleHR9XCJgKTtcbiAgICAgICAgIGVycm9yID0gbmV3IFJlc3BvbnNlRXJyb3IobWVzc2FnZSwgcGF0aCwgb2JqZWN0KTtcbiAgICAgICAgIGxvZyhgJHttZXNzYWdlfSAke0pTT04uc3RyaW5naWZ5KG9iamVjdC5kYXRhKX1gKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICBlcnJvciA9IG9iamVjdDtcbiAgICAgIH1cbiAgICAgIGlmIChjYikge1xuICAgICAgICAgbG9nKCdnb2luZyB0byBlcnJvciBjYWxsYmFjaycpO1xuICAgICAgICAgY2IoZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIGxvZygndGhyb3dpbmcgZXJyb3InKTtcbiAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgfTtcbn1cbiJdfQ==
//# sourceMappingURL=Requestable.js.map
