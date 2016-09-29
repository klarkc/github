(function (global, factory) {
   if (typeof define === "function" && define.amd) {
      define(['module', './Requestable', 'utf8', 'js-base64', 'debug'], factory);
   } else if (typeof exports !== "undefined") {
      factory(module, require('./Requestable'), require('utf8'), require('js-base64'), require('debug'));
   } else {
      var mod = {
         exports: {}
      };
      factory(mod, global.Requestable, global.utf8, global.jsBase64, global.debug);
      global.Repository = mod.exports;
   }
})(this, function (module, _Requestable2, _utf, _jsBase, _debug) {
   'use strict';

   var _Requestable3 = _interopRequireDefault(_Requestable2);

   var _utf2 = _interopRequireDefault(_utf);

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

   var log = (0, _debug2.default)('github:repository');

   /**
    * Respository encapsulates the functionality to create, query, and modify files.
    */

   var Repository = function (_Requestable) {
      _inherits(Repository, _Requestable);

      /**
       * Create a Repository.
       * @param {string} fullname - the full name of the repository
       * @param {Requestable.auth} [auth] - information required to authenticate to Github
       * @param {string} [apiBase=https://api.github.com] - the base Github API URL
       */
      function Repository(fullname, auth, apiBase) {
         _classCallCheck(this, Repository);

         var _this = _possibleConstructorReturn(this, (Repository.__proto__ || Object.getPrototypeOf(Repository)).call(this, auth, apiBase));

         _this.__fullname = fullname;
         _this.__currentTree = {
            branch: null,
            sha: null
         };
         return _this;
      }

      /**
       * Get a reference
       * @see https://developer.github.com/v3/git/refs/#get-a-reference
       * @param {string} ref - the reference to get
       * @param {Requestable.callback} [cb] - will receive the reference's refSpec or a list of refSpecs that match `ref`
       * @return {Promise} - the promise for the http request
       */


      _createClass(Repository, [{
         key: 'getRef',
         value: function getRef(ref, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/git/refs/' + ref, null, cb);
         }
      }, {
         key: 'createRef',
         value: function createRef(options, cb) {
            return this._request('POST', '/repos/' + this.__fullname + '/git/refs', options, cb);
         }
      }, {
         key: 'deleteRef',
         value: function deleteRef(ref, cb) {
            return this._request('DELETE', '/repos/' + this.__fullname + '/git/refs/' + ref, null, cb);
         }
      }, {
         key: 'deleteRepo',
         value: function deleteRepo(cb) {
            return this._request('DELETE', '/repos/' + this.__fullname, null, cb);
         }
      }, {
         key: 'listTags',
         value: function listTags(cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/tags', null, cb);
         }
      }, {
         key: 'listPullRequests',
         value: function listPullRequests(options, cb) {
            options = options || {};
            return this._request('GET', '/repos/' + this.__fullname + '/pulls', options, cb);
         }
      }, {
         key: 'getPullRequest',
         value: function getPullRequest(number, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/pulls/' + number, null, cb);
         }
      }, {
         key: 'listPullRequestFiles',
         value: function listPullRequestFiles(number, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/pulls/' + number + '/files', null, cb);
         }
      }, {
         key: 'compareBranches',
         value: function compareBranches(base, head, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/compare/' + base + '...' + head, null, cb);
         }
      }, {
         key: 'listBranches',
         value: function listBranches(cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/branches', null, cb);
         }
      }, {
         key: 'getBlob',
         value: function getBlob(sha, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/git/blobs/' + sha, null, cb, 'raw');
         }
      }, {
         key: 'getBranch',
         value: function getBranch(branch, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/branches/' + branch, null, cb);
         }
      }, {
         key: 'getCommit',
         value: function getCommit(sha, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/git/commits/' + sha, null, cb);
         }
      }, {
         key: 'listCommits',
         value: function listCommits(options, cb) {
            options = options || {};

            options.since = this._dateToISO(options.since);
            options.until = this._dateToISO(options.until);

            return this._request('GET', '/repos/' + this.__fullname + '/commits', options, cb);
         }
      }, {
         key: 'getSingleCommit',
         value: function getSingleCommit(ref, cb) {
            ref = ref || '';
            return this._request('GET', '/repos/' + this.__fullname + '/commits/' + ref, null, cb);
         }
      }, {
         key: 'getSha',
         value: function getSha(branch, path, cb) {
            branch = branch ? '?ref=' + branch : '';
            return this._request('GET', '/repos/' + this.__fullname + '/contents/' + path + branch, null, cb);
         }
      }, {
         key: 'listStatuses',
         value: function listStatuses(sha, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/commits/' + sha + '/statuses', null, cb);
         }
      }, {
         key: 'getTree',
         value: function getTree(treeSHA, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/git/trees/' + treeSHA, null, cb);
         }
      }, {
         key: 'createBlob',
         value: function createBlob(content, cb) {
            var postBody = this._getContentObject(content);

            log('sending content', postBody);
            return this._request('POST', '/repos/' + this.__fullname + '/git/blobs', postBody, cb);
         }
      }, {
         key: '_getContentObject',
         value: function _getContentObject(content) {
            if (typeof content === 'string') {
               log('contet is a string');
               return {
                  content: _utf2.default.encode(content),
                  encoding: 'utf-8'
               };
            } else if (typeof Buffer !== 'undefined' && content instanceof Buffer) {
               log('We appear to be in Node');
               return {
                  content: content.toString('base64'),
                  encoding: 'base64'
               };
            } else if (typeof Blob !== 'undefined' && content instanceof Blob) {
               log('We appear to be in the browser');
               return {
                  content: _jsBase.Base64.encode(content),
                  encoding: 'base64'
               };
            } else {
               // eslint-disable-line
               log('Not sure what this content is: ' + (typeof content === 'undefined' ? 'undefined' : _typeof(content)) + ', ' + JSON.stringify(content));
               throw new Error('Unknown content passed to postBlob. Must be string or Buffer (node) or Blob (web)');
            }
         }
      }, {
         key: 'updateTree',
         value: function updateTree(baseTreeSHA, path, blobSHA, cb) {
            var newTree = {
               base_tree: baseTreeSHA, // eslint-disable-line
               tree: [{
                  path: path,
                  sha: blobSHA,
                  mode: '100644',
                  type: 'blob'
               }]
            };

            return this._request('POST', '/repos/' + this.__fullname + '/git/trees', newTree, cb);
         }
      }, {
         key: 'createTree',
         value: function createTree(tree, baseSHA, cb) {
            return this._request('POST', '/repos/' + this.__fullname + '/git/trees', {
               tree: tree,
               base_tree: baseSHA // eslint-disable-line
            }, cb);
         }
      }, {
         key: 'commit',
         value: function commit(parent, tree, message, cb) {
            var _this2 = this;

            var data = {
               message: message,
               tree: tree,
               parents: [parent]
            };

            return this._request('POST', '/repos/' + this.__fullname + '/git/commits', data, cb).then(function (response) {
               _this2.__currentTree.sha = response.data.sha; // Update latest commit
               return response;
            });
         }
      }, {
         key: 'updateHead',
         value: function updateHead(ref, commitSHA, force, cb) {
            return this._request('PATCH', '/repos/' + this.__fullname + '/git/refs/' + ref, {
               sha: commitSHA,
               force: force
            }, cb);
         }
      }, {
         key: 'getDetails',
         value: function getDetails(cb) {
            return this._request('GET', '/repos/' + this.__fullname, null, cb);
         }
      }, {
         key: 'getContributors',
         value: function getContributors(cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/stats/contributors', null, cb);
         }
      }, {
         key: 'getCollaborators',
         value: function getCollaborators(cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/collaborators', null, cb);
         }
      }, {
         key: 'isCollaborator',
         value: function isCollaborator(username, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/collaborators/' + username, null, cb);
         }
      }, {
         key: 'getContents',
         value: function getContents(ref, path, raw, cb) {
            path = path ? '' + encodeURI(path) : '';
            return this._request('GET', '/repos/' + this.__fullname + '/contents/' + path, {
               ref: ref
            }, cb, raw);
         }
      }, {
         key: 'getReadme',
         value: function getReadme(ref, raw, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/readme', {
               ref: ref
            }, cb, raw);
         }
      }, {
         key: 'fork',
         value: function fork(cb) {
            return this._request('POST', '/repos/' + this.__fullname + '/forks', null, cb);
         }
      }, {
         key: 'listForks',
         value: function listForks(cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/forks', null, cb);
         }
      }, {
         key: 'createBranch',
         value: function createBranch(oldBranch, newBranch, cb) {
            var _this3 = this;

            if (typeof newBranch === 'function') {
               cb = newBranch;
               newBranch = oldBranch;
               oldBranch = 'master';
            }

            return this.getRef('heads/' + oldBranch).then(function (response) {
               var sha = response.data.object.sha;
               return _this3.createRef({
                  sha: sha,
                  ref: 'refs/heads/' + newBranch
               }, cb);
            });
         }
      }, {
         key: 'createPullRequest',
         value: function createPullRequest(options, cb) {
            return this._request('POST', '/repos/' + this.__fullname + '/pulls', options, cb);
         }
      }, {
         key: 'updatePullRequst',
         value: function updatePullRequst(number, options, cb) {
            log('Deprecated: This method contains a typo and it has been deprecated.' + 'It will be removed in next major version. Use updatePullRequest() instead.');

            return this.updatePullRequest(number, options, cb);
         }
      }, {
         key: 'updatePullRequest',
         value: function updatePullRequest(number, options, cb) {
            return this._request('PATCH', '/repos/' + this.__fullname + '/pulls/' + number, options, cb);
         }
      }, {
         key: 'listHooks',
         value: function listHooks(cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/hooks', null, cb);
         }
      }, {
         key: 'getHook',
         value: function getHook(id, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/hooks/' + id, null, cb);
         }
      }, {
         key: 'createHook',
         value: function createHook(options, cb) {
            return this._request('POST', '/repos/' + this.__fullname + '/hooks', options, cb);
         }
      }, {
         key: 'updateHook',
         value: function updateHook(id, options, cb) {
            return this._request('PATCH', '/repos/' + this.__fullname + '/hooks/' + id, options, cb);
         }
      }, {
         key: 'deleteHook',
         value: function deleteHook(id, cb) {
            return this._request('DELETE', this.__fullname + '/hooks/' + id, null, cb);
         }
      }, {
         key: 'listKeys',
         value: function listKeys(cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/keys', null, cb);
         }
      }, {
         key: 'getKey',
         value: function getKey(id, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/keys/' + id, null, cb);
         }
      }, {
         key: 'createKey',
         value: function createKey(options, cb) {
            return this._request('POST', '/repos/' + this.__fullname + '/keys', options, cb);
         }
      }, {
         key: 'deleteKey',
         value: function deleteKey(id, cb) {
            return this._request('DELETE', '/repos/' + this.__fullname + '/keys/' + id, null, cb);
         }
      }, {
         key: 'deleteFile',
         value: function deleteFile(branch, path, cb) {
            var _this4 = this;

            return this.getSha(branch, path).then(function (response) {
               var deleteCommit = {
                  message: 'Delete the file at \'' + path + '\'',
                  sha: response.data.sha,
                  branch: branch
               };
               return _this4._request('DELETE', '/repos/' + _this4.__fullname + '/contents/' + path, deleteCommit, cb);
            });
         }
      }, {
         key: 'move',
         value: function move(branch, oldPath, newPath, cb) {
            var _this5 = this;

            var oldSha = void 0;
            return this.getRef('heads/' + branch).then(function (_ref) {
               var object = _ref.data.object;
               return _this5.getTree(object.sha + '?recursive=true');
            }).then(function (_ref2) {
               var _ref2$data = _ref2.data;
               var tree = _ref2$data.tree;
               var sha = _ref2$data.sha;

               oldSha = sha;
               var newTree = tree.map(function (ref) {
                  if (ref.path === oldPath) {
                     ref.path = newPath;
                  }
                  if (ref.type === 'tree') {
                     delete ref.sha;
                  }
                  return ref;
               });
               return _this5.createTree(newTree);
            }).then(function (_ref3) {
               var tree = _ref3.data;
               return _this5.commit(oldSha, tree.sha, 'Renamed \'' + oldPath + '\' to \'' + newPath + '\'');
            }).then(function (_ref4) {
               var commit = _ref4.data;
               return _this5.updateHead('heads/' + branch, commit.sha, true, cb);
            });
         }
      }, {
         key: 'writeFile',
         value: function writeFile(branch, path, content, message, options, cb) {
            var _this6 = this;

            if (typeof options === 'function') {
               cb = options;
               options = {};
            }
            var filePath = path ? encodeURI(path) : '';
            var shouldEncode = options.encode !== false;
            var commit = {
               branch: branch,
               message: message,
               author: options.author,
               committer: options.committer,
               content: shouldEncode ? _jsBase.Base64.encode(content) : content
            };

            return this.getSha(branch, filePath).then(function (response) {
               commit.sha = response.data.sha;
               return _this6._request('PUT', '/repos/' + _this6.__fullname + '/contents/' + filePath, commit, cb);
            }, function () {
               return _this6._request('PUT', '/repos/' + _this6.__fullname + '/contents/' + filePath, commit, cb);
            });
         }
      }, {
         key: 'isStarred',
         value: function isStarred(cb) {
            return this._request204or404('/user/starred/' + this.__fullname, null, cb);
         }
      }, {
         key: 'star',
         value: function star(cb) {
            return this._request('PUT', '/user/starred/' + this.__fullname, null, cb);
         }
      }, {
         key: 'unstar',
         value: function unstar(cb) {
            return this._request('DELETE', '/user/starred/' + this.__fullname, null, cb);
         }
      }, {
         key: 'createRelease',
         value: function createRelease(options, cb) {
            return this._request('POST', '/repos/' + this.__fullname + '/releases', options, cb);
         }
      }, {
         key: 'updateRelease',
         value: function updateRelease(id, options, cb) {
            return this._request('PATCH', '/repos/' + this.__fullname + '/releases/' + id, options, cb);
         }
      }, {
         key: 'listReleases',
         value: function listReleases(cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/releases', null, cb);
         }
      }, {
         key: 'getRelease',
         value: function getRelease(id, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/releases/' + id, null, cb);
         }
      }, {
         key: 'deleteRelease',
         value: function deleteRelease(id, cb) {
            return this._request('DELETE', '/repos/' + this.__fullname + '/releases/' + id, null, cb);
         }
      }, {
         key: 'mergePullRequest',
         value: function mergePullRequest(number, options, cb) {
            return this._request('PUT', '/repos/' + this.__fullname + '/pulls/' + number + '/merge', options, cb);
         }
      }, {
         key: 'listProjects',
         value: function listProjects(cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/projects', null, cb);
         }
      }, {
         key: 'getProject',
         value: function getProject(projectNumber, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/projects/' + projectNumber, null, cb);
         }
      }, {
         key: 'createProject',
         value: function createProject(options, cb) {
            return this._request('POST', '/repos/' + this.__fullname + '/projects', options, cb);
         }
      }, {
         key: 'updateProject',
         value: function updateProject(projectNumber, options, cb) {
            return this._request('PATCH', '/repos/' + this.__fullname + '/projects/' + projectNumber, options, cb);
         }
      }, {
         key: 'deleteProject',
         value: function deleteProject(projectNumber, cb) {
            return this._request('DELETE', '/repos/' + this.__fullname + '/projects/' + projectNumber, null, cb);
         }
      }, {
         key: 'listProjectColumns',
         value: function listProjectColumns(projectNumber, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/projects/' + projectNumber + '/columns', null, cb);
         }
      }, {
         key: 'getProjectColumn',
         value: function getProjectColumn(colId, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/projects/columns/' + colId, null, cb);
         }
      }, {
         key: 'createProjectColumn',
         value: function createProjectColumn(projectNumber, options, cb) {
            return this._request('POST', '/repos/' + this.__fullname + '/projects/' + projectNumber + '/columns', options, cb);
         }
      }, {
         key: 'updateProjectColumn',
         value: function updateProjectColumn(colId, options, cb) {
            return this._request('PATCH', '/repos/' + this.__fullname + '/projects/columns/' + colId, options, cb);
         }
      }, {
         key: 'deleteProjectColumn',
         value: function deleteProjectColumn(colId, cb) {
            return this._request('DELETE', '/repos/' + this.__fullname + '/projects/columns/' + colId, null, cb);
         }
      }, {
         key: 'moveProjectColumn',
         value: function moveProjectColumn(colId, position, cb) {
            return this._request('POST', '/repos/' + this.__fullname + '/projects/columns/' + colId + '/moves', { position: position }, cb);
         }
      }, {
         key: 'listProjectCards',
         value: function listProjectCards(colId, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/projects/columns/' + colId + '/cards', null, cb);
         }
      }, {
         key: 'getProjectCard',
         value: function getProjectCard(cardId, cb) {
            return this._request('GET', '/repos/' + this.__fullname + '/projects/columns/cards/' + cardId, null, cb);
         }
      }, {
         key: 'createProjectCard',
         value: function createProjectCard(colId, options, cb) {
            return this._request('POST', '/repos/' + this.__fullname + '/projects/columns/' + colId + '/cards', options, cb);
         }
      }, {
         key: 'updateProjectCard',
         value: function updateProjectCard(cardId, options, cb) {
            return this._request('PATCH', '/repos/' + this.__fullname + '/projects/columns/cards/' + cardId, options, cb);
         }
      }, {
         key: 'deleteProjectCard',
         value: function deleteProjectCard(cardId, cb) {
            return this._request('DELETE', '/repos/' + this.__fullname + '/projects/columns/cards/' + cardId, null, cb);
         }
      }, {
         key: 'moveProjectCard',
         value: function moveProjectCard(cardId, position, colId, cb) {
            /* eslint-disable quote-props*/
            return this._request('POST', '/repos/' + this.__fullname + '/projects/columns/cards/' + cardId + '/moves', { 'position': position, 'column_id': colId }, cb);
            /* eslint-enable */
         }
      }]);

      return Repository;
   }(_Requestable3.default);

   module.exports = Repository;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJlcG9zaXRvcnkuanMiXSwibmFtZXMiOlsibG9nIiwiUmVwb3NpdG9yeSIsImZ1bGxuYW1lIiwiYXV0aCIsImFwaUJhc2UiLCJfX2Z1bGxuYW1lIiwiX19jdXJyZW50VHJlZSIsImJyYW5jaCIsInNoYSIsInJlZiIsImNiIiwiX3JlcXVlc3QiLCJvcHRpb25zIiwibnVtYmVyIiwiYmFzZSIsImhlYWQiLCJzaW5jZSIsIl9kYXRlVG9JU08iLCJ1bnRpbCIsInBhdGgiLCJ0cmVlU0hBIiwiY29udGVudCIsInBvc3RCb2R5IiwiX2dldENvbnRlbnRPYmplY3QiLCJlbmNvZGUiLCJlbmNvZGluZyIsIkJ1ZmZlciIsInRvU3RyaW5nIiwiQmxvYiIsIkpTT04iLCJzdHJpbmdpZnkiLCJFcnJvciIsImJhc2VUcmVlU0hBIiwiYmxvYlNIQSIsIm5ld1RyZWUiLCJiYXNlX3RyZWUiLCJ0cmVlIiwibW9kZSIsInR5cGUiLCJiYXNlU0hBIiwicGFyZW50IiwibWVzc2FnZSIsImRhdGEiLCJwYXJlbnRzIiwidGhlbiIsInJlc3BvbnNlIiwiY29tbWl0U0hBIiwiZm9yY2UiLCJ1c2VybmFtZSIsInJhdyIsImVuY29kZVVSSSIsIm9sZEJyYW5jaCIsIm5ld0JyYW5jaCIsImdldFJlZiIsIm9iamVjdCIsImNyZWF0ZVJlZiIsInVwZGF0ZVB1bGxSZXF1ZXN0IiwiaWQiLCJnZXRTaGEiLCJkZWxldGVDb21taXQiLCJvbGRQYXRoIiwibmV3UGF0aCIsIm9sZFNoYSIsImdldFRyZWUiLCJtYXAiLCJjcmVhdGVUcmVlIiwiY29tbWl0IiwidXBkYXRlSGVhZCIsImZpbGVQYXRoIiwic2hvdWxkRW5jb2RlIiwiYXV0aG9yIiwiY29tbWl0dGVyIiwiX3JlcXVlc3QyMDRvcjQwNCIsInByb2plY3ROdW1iZXIiLCJjb2xJZCIsInBvc2l0aW9uIiwiY2FyZElkIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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RU0sS0FBS04sVUFGWCxnQ0FFZ0R1RSxNQUZoRCxhQUdKLEVBQUMsWUFBWUQsUUFBYixFQUF1QixhQUFhRCxLQUFwQyxFQUhJLEVBSUpoRSxFQUpJLENBQVA7QUFNQTtBQUNGOzs7Ozs7QUFJSm1FLFVBQU9DLE9BQVAsR0FBaUI3RSxVQUFqQiIsImZpbGUiOiJSZXBvc2l0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZVxuICogQGNvcHlyaWdodCAgMjAxMyBNaWNoYWVsIEF1ZnJlaXRlciAoRGV2ZWxvcG1lbnQgU2VlZCkgYW5kIDIwMTYgWWFob28gSW5jLlxuICogQGxpY2Vuc2UgICAgTGljZW5zZWQgdW5kZXIge0BsaW5rIGh0dHBzOi8vc3BkeC5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlLUNsZWFyLmh0bWwgQlNELTMtQ2xhdXNlLUNsZWFyfS5cbiAqICAgICAgICAgICAgIEdpdGh1Yi5qcyBpcyBmcmVlbHkgZGlzdHJpYnV0YWJsZS5cbiAqL1xuXG5pbXBvcnQgUmVxdWVzdGFibGUgZnJvbSAnLi9SZXF1ZXN0YWJsZSc7XG5pbXBvcnQgVXRmOCBmcm9tICd1dGY4JztcbmltcG9ydCB7XG4gICBCYXNlNjRcbn0gZnJvbSAnanMtYmFzZTY0JztcbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5jb25zdCBsb2cgPSBkZWJ1ZygnZ2l0aHViOnJlcG9zaXRvcnknKTtcblxuLyoqXG4gKiBSZXNwb3NpdG9yeSBlbmNhcHN1bGF0ZXMgdGhlIGZ1bmN0aW9uYWxpdHkgdG8gY3JlYXRlLCBxdWVyeSwgYW5kIG1vZGlmeSBmaWxlcy5cbiAqL1xuY2xhc3MgUmVwb3NpdG9yeSBleHRlbmRzIFJlcXVlc3RhYmxlIHtcbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgUmVwb3NpdG9yeS5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBmdWxsbmFtZSAtIHRoZSBmdWxsIG5hbWUgb2YgdGhlIHJlcG9zaXRvcnlcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuYXV0aH0gW2F1dGhdIC0gaW5mb3JtYXRpb24gcmVxdWlyZWQgdG8gYXV0aGVudGljYXRlIHRvIEdpdGh1YlxuICAgICogQHBhcmFtIHtzdHJpbmd9IFthcGlCYXNlPWh0dHBzOi8vYXBpLmdpdGh1Yi5jb21dIC0gdGhlIGJhc2UgR2l0aHViIEFQSSBVUkxcbiAgICAqL1xuICAgY29uc3RydWN0b3IoZnVsbG5hbWUsIGF1dGgsIGFwaUJhc2UpIHtcbiAgICAgIHN1cGVyKGF1dGgsIGFwaUJhc2UpO1xuICAgICAgdGhpcy5fX2Z1bGxuYW1lID0gZnVsbG5hbWU7XG4gICAgICB0aGlzLl9fY3VycmVudFRyZWUgPSB7XG4gICAgICAgICBicmFuY2g6IG51bGwsXG4gICAgICAgICBzaGE6IG51bGxcbiAgICAgIH07XG4gICB9XG5cbiAgIC8qKlxuICAgICogR2V0IGEgcmVmZXJlbmNlXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2l0L3JlZnMvI2dldC1hLXJlZmVyZW5jZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IHJlZiAtIHRoZSByZWZlcmVuY2UgdG8gZ2V0XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSByZWZlcmVuY2UncyByZWZTcGVjIG9yIGEgbGlzdCBvZiByZWZTcGVjcyB0aGF0IG1hdGNoIGByZWZgXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldFJlZihyZWYsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vZ2l0L3JlZnMvJHtyZWZ9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENyZWF0ZSBhIHJlZmVyZW5jZVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2dpdC9yZWZzLyNjcmVhdGUtYS1yZWZlcmVuY2VcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdGhlIG9iamVjdCBkZXNjcmliaW5nIHRoZSByZWZcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdGhlIHJlZlxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBjcmVhdGVSZWYob3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQT1NUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vZ2l0L3JlZnNgLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRGVsZXRlIGEgcmVmZXJlbmNlXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2l0L3JlZnMvI2RlbGV0ZS1hLXJlZmVyZW5jZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IHJlZiAtIHRoZSBuYW1lIG9mIHRoZSByZWYgdG8gZGVsdGVcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdHJ1ZSBpZiB0aGUgcmVxdWVzdCBpcyBzdWNjZXNzZnVsXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGRlbGV0ZVJlZihyZWYsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnREVMRVRFJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vZ2l0L3JlZnMvJHtyZWZ9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIERlbGV0ZSBhIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy8jZGVsZXRlLWEtcmVwb3NpdG9yeVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0cnVlIGlmIHRoZSByZXF1ZXN0IGlzIHN1Y2Nlc3NmdWxcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZGVsZXRlUmVwbyhjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0RFTEVURScsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIExpc3QgdGhlIHRhZ3Mgb24gYSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvI2xpc3QtdGFnc1xuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgdGFnIGRhdGFcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgbGlzdFRhZ3MoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS90YWdzYCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIExpc3QgdGhlIG9wZW4gcHVsbCByZXF1ZXN0cyBvbiB0aGUgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3B1bGxzLyNsaXN0LXB1bGwtcmVxdWVzdHNcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gb3B0aW9ucyB0byBmaWx0ZXIgdGhlIHNlYXJjaFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgbGlzdCBvZiBQUnNcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgbGlzdFB1bGxSZXF1ZXN0cyhvcHRpb25zLCBjYikge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHVsbHNgLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogR2V0IGluZm9ybWF0aW9uIGFib3V0IGEgc3BlY2lmaWMgcHVsbCByZXF1ZXN0XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcHVsbHMvI2dldC1hLXNpbmdsZS1wdWxsLXJlcXVlc3RcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgLSB0aGUgUFIgeW91IHdpc2ggdG8gZmV0Y2hcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdGhlIFBSIGZyb20gdGhlIEFQSVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBnZXRQdWxsUmVxdWVzdChudW1iZXIsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHVsbHMvJHtudW1iZXJ9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIExpc3QgdGhlIGZpbGVzIG9mIGEgc3BlY2lmaWMgcHVsbCByZXF1ZXN0XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcHVsbHMvI2xpc3QtcHVsbC1yZXF1ZXN0cy1maWxlc1xuICAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfSBudW1iZXIgLSB0aGUgUFIgeW91IHdpc2ggdG8gZmV0Y2hcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdGhlIGxpc3Qgb2YgZmlsZXMgZnJvbSB0aGUgQVBJXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGxpc3RQdWxsUmVxdWVzdEZpbGVzKG51bWJlciwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9wdWxscy8ke251bWJlcn0vZmlsZXNgLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ29tcGFyZSB0d28gYnJhbmNoZXMvY29tbWl0cy9yZXBvc2l0b3JpZXNcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9jb21taXRzLyNjb21wYXJlLXR3by1jb21taXRzXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gYmFzZSAtIHRoZSBiYXNlIGNvbW1pdFxuICAgICogQHBhcmFtIHtzdHJpbmd9IGhlYWQgLSB0aGUgaGVhZCBjb21taXRcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBjb21wYXJpc29uXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGNvbXBhcmVCcmFuY2hlcyhiYXNlLCBoZWFkLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2NvbXBhcmUvJHtiYXNlfS4uLiR7aGVhZH1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogTGlzdCBhbGwgdGhlIGJyYW5jaGVzIGZvciB0aGUgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zLyNsaXN0LWJyYW5jaGVzXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbGlzdCBvZiBicmFuY2hlc1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBsaXN0QnJhbmNoZXMoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9icmFuY2hlc2AsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQgYSByYXcgYmxvYiBmcm9tIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2l0L2Jsb2JzLyNnZXQtYS1ibG9iXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gc2hhIC0gdGhlIHNoYSBvZiB0aGUgYmxvYiB0byBmZXRjaFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGJsb2IgZnJvbSB0aGUgQVBJXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldEJsb2Ioc2hhLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2dpdC9ibG9icy8ke3NoYX1gLCBudWxsLCBjYiwgJ3JhdycpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCBhIHNpbmdsZSBicmFuY2hcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9icmFuY2hlcy8jZ2V0LWJyYW5jaFxuICAgICogQHBhcmFtIHtzdHJpbmd9IGJyYW5jaCAtIHRoZSBuYW1lIG9mIHRoZSBicmFuY2ggdG8gZmV0Y2hcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBicmFuY2ggZnJvbSB0aGUgQVBJXG4gICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBnZXRCcmFuY2goYnJhbmNoLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2JyYW5jaGVzLyR7YnJhbmNofWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQgYSBjb21taXQgZnJvbSB0aGUgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2NvbW1pdHMvI2dldC1hLXNpbmdsZS1jb21taXRcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBzaGEgLSB0aGUgc2hhIGZvciB0aGUgY29tbWl0IHRvIGZldGNoXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgY29tbWl0IGRhdGFcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZ2V0Q29tbWl0KHNoYSwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9naXQvY29tbWl0cy8ke3NoYX1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogTGlzdCB0aGUgY29tbWl0cyBvbiBhIHJlcG9zaXRvcnksIG9wdGlvbmFsbHkgZmlsdGVyaW5nIGJ5IHBhdGgsIGF1dGhvciBvciB0aW1lIHJhbmdlXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvY29tbWl0cy8jbGlzdC1jb21taXRzLW9uLWEtcmVwb3NpdG9yeVxuICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIHRoZSBmaWx0ZXJpbmcgb3B0aW9ucyBmb3IgY29tbWl0c1xuICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLnNoYV0gLSB0aGUgU0hBIG9yIGJyYW5jaCB0byBzdGFydCBmcm9tXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMucGF0aF0gLSB0aGUgcGF0aCB0byBzZWFyY2ggb25cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5hdXRob3JdIC0gdGhlIGNvbW1pdCBhdXRob3JcbiAgICAqIEBwYXJhbSB7KERhdGV8c3RyaW5nKX0gW29wdGlvbnMuc2luY2VdIC0gb25seSBjb21taXRzIGFmdGVyIHRoaXMgZGF0ZSB3aWxsIGJlIHJldHVybmVkXG4gICAgKiBAcGFyYW0geyhEYXRlfHN0cmluZyl9IFtvcHRpb25zLnVudGlsXSAtIG9ubHkgY29tbWl0cyBiZWZvcmUgdGhpcyBkYXRlIHdpbGwgYmUgcmV0dXJuZWRcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBsaXN0IG9mIGNvbW1pdHMgZm91bmQgbWF0Y2hpbmcgdGhlIGNyaXRlcmlhXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGxpc3RDb21taXRzKG9wdGlvbnMsIGNiKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgb3B0aW9ucy5zaW5jZSA9IHRoaXMuX2RhdGVUb0lTTyhvcHRpb25zLnNpbmNlKTtcbiAgICAgIG9wdGlvbnMudW50aWwgPSB0aGlzLl9kYXRlVG9JU08ob3B0aW9ucy51bnRpbCk7XG5cbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9jb21taXRzYCwgb3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIHNpbmdsZSBjb21taXQgaW5mb3JtYXRpb24gZm9yIGEgcmVwb3NpdG9yeVxuICAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9jb21taXRzLyNnZXQtYS1zaW5nbGUtY29tbWl0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJlZiAtIHRoZSByZWZlcmVuY2UgZm9yIHRoZSBjb21taXQtaXNoXG4gICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGNvbW1pdCBpbmZvcm1hdGlvblxuICAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAgKi9cbiAgIGdldFNpbmdsZUNvbW1pdChyZWYsIGNiKSB7XG4gICAgICByZWYgPSByZWYgfHwgJyc7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vY29tbWl0cy8ke3JlZn1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogR2V0IHRoYSBzaGEgZm9yIGEgcGFydGljdWxhciBvYmplY3QgaW4gdGhlIHJlcG9zaXRvcnkuIFRoaXMgaXMgYSBjb252ZW5pZW5jZSBmdW5jdGlvblxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2NvbnRlbnRzLyNnZXQtY29udGVudHNcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbYnJhbmNoXSAtIHRoZSBicmFuY2ggdG8gbG9vayBpbiwgb3IgdGhlIHJlcG9zaXRvcnkncyBkZWZhdWx0IGJyYW5jaCBpZiBvbWl0dGVkXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIHRoZSBwYXRoIG9mIHRoZSBmaWxlIG9yIGRpcmVjdG9yeVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgYSBkZXNjcmlwdGlvbiBvZiB0aGUgcmVxdWVzdGVkIG9iamVjdCwgaW5jbHVkaW5nIGEgYFNIQWAgcHJvcGVydHlcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZ2V0U2hhKGJyYW5jaCwgcGF0aCwgY2IpIHtcbiAgICAgIGJyYW5jaCA9IGJyYW5jaCA/IGA/cmVmPSR7YnJhbmNofWAgOiAnJztcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9jb250ZW50cy8ke3BhdGh9JHticmFuY2h9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIExpc3QgdGhlIGNvbW1pdCBzdGF0dXNlcyBmb3IgYSBwYXJ0aWN1bGFyIHNoYSwgYnJhbmNoLCBvciB0YWdcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9zdGF0dXNlcy8jbGlzdC1zdGF0dXNlcy1mb3ItYS1zcGVjaWZpYy1yZWZcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBzaGEgLSB0aGUgc2hhLCBicmFuY2gsIG9yIHRhZyB0byBnZXQgc3RhdHVzZXMgZm9yXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbGlzdCBvZiBzdGF0dXNlc1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBsaXN0U3RhdHVzZXMoc2hhLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2NvbW1pdHMvJHtzaGF9L3N0YXR1c2VzYCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCBhIGRlc2NyaXB0aW9uIG9mIGEgZ2l0IHRyZWVcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXQvdHJlZXMvI2dldC1hLXRyZWVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSB0cmVlU0hBIC0gdGhlIFNIQSBvZiB0aGUgdHJlZSB0byBmZXRjaFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGNhbGxiYWNrIGRhdGFcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZ2V0VHJlZSh0cmVlU0hBLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2dpdC90cmVlcy8ke3RyZWVTSEF9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENyZWF0ZSBhIGJsb2JcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXQvYmxvYnMvI2NyZWF0ZS1hLWJsb2JcbiAgICAqIEBwYXJhbSB7KHN0cmluZ3xCdWZmZXJ8QmxvYil9IGNvbnRlbnQgLSB0aGUgY29udGVudCB0byBhZGQgdG8gdGhlIHJlcG9zaXRvcnlcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBkZXRhaWxzIG9mIHRoZSBjcmVhdGVkIGJsb2JcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgY3JlYXRlQmxvYihjb250ZW50LCBjYikge1xuICAgICAgbGV0IHBvc3RCb2R5ID0gdGhpcy5fZ2V0Q29udGVudE9iamVjdChjb250ZW50KTtcblxuICAgICAgbG9nKCdzZW5kaW5nIGNvbnRlbnQnLCBwb3N0Qm9keSk7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2dpdC9ibG9ic2AsIHBvc3RCb2R5LCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogR2V0IHRoZSBvYmplY3QgdGhhdCByZXByZXNlbnRzIHRoZSBwcm92aWRlZCBjb250ZW50XG4gICAgKiBAcGFyYW0ge3N0cmluZ3xCdWZmZXJ8QmxvYn0gY29udGVudCAtIHRoZSBjb250ZW50IHRvIHNlbmQgdG8gdGhlIHNlcnZlclxuICAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgcmVwcmVzZW50YXRpb24gb2YgYGNvbnRlbnRgIGZvciB0aGUgR2l0SHViIEFQSVxuICAgICovXG4gICBfZ2V0Q29udGVudE9iamVjdChjb250ZW50KSB7XG4gICAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICBsb2coJ2NvbnRldCBpcyBhIHN0cmluZycpO1xuICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbnRlbnQ6IFV0ZjguZW5jb2RlKGNvbnRlbnQpLFxuICAgICAgICAgICAgZW5jb2Rpbmc6ICd1dGYtOCdcbiAgICAgICAgIH07XG5cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIEJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgY29udGVudCBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgICAgICAgbG9nKCdXZSBhcHBlYXIgdG8gYmUgaW4gTm9kZScpO1xuICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbnRlbnQ6IGNvbnRlbnQudG9TdHJpbmcoJ2Jhc2U2NCcpLFxuICAgICAgICAgICAgZW5jb2Rpbmc6ICdiYXNlNjQnXG4gICAgICAgICB9O1xuXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBCbG9iICE9PSAndW5kZWZpbmVkJyAmJiBjb250ZW50IGluc3RhbmNlb2YgQmxvYikge1xuICAgICAgICAgbG9nKCdXZSBhcHBlYXIgdG8gYmUgaW4gdGhlIGJyb3dzZXInKTtcbiAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb250ZW50OiBCYXNlNjQuZW5jb2RlKGNvbnRlbnQpLFxuICAgICAgICAgICAgZW5jb2Rpbmc6ICdiYXNlNjQnXG4gICAgICAgICB9O1xuXG4gICAgICB9IGVsc2UgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgICBsb2coYE5vdCBzdXJlIHdoYXQgdGhpcyBjb250ZW50IGlzOiAke3R5cGVvZiBjb250ZW50fSwgJHtKU09OLnN0cmluZ2lmeShjb250ZW50KX1gKTtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBjb250ZW50IHBhc3NlZCB0byBwb3N0QmxvYi4gTXVzdCBiZSBzdHJpbmcgb3IgQnVmZmVyIChub2RlKSBvciBCbG9iICh3ZWIpJyk7XG4gICAgICB9XG4gICB9XG5cbiAgIC8qKlxuICAgICogVXBkYXRlIGEgdHJlZSBpbiBHaXRcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXQvdHJlZXMvI2NyZWF0ZS1hLXRyZWVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlVHJlZVNIQSAtIHRoZSBTSEEgb2YgdGhlIHRyZWUgdG8gdXBkYXRlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIHRoZSBwYXRoIGZvciB0aGUgbmV3IGZpbGVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBibG9iU0hBIC0gdGhlIFNIQSBmb3IgdGhlIGJsb2IgdG8gcHV0IGF0IGBwYXRoYFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIG5ldyB0cmVlIHRoYXQgaXMgY3JlYXRlZFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICogQGRlcHJlY2F0ZWQgdXNlIHtAbGluayBSZXBvc2l0b3J5I2NyZWF0ZVRyZWV9IGluc3RlYWRcbiAgICAqL1xuICAgdXBkYXRlVHJlZShiYXNlVHJlZVNIQSwgcGF0aCwgYmxvYlNIQSwgY2IpIHtcbiAgICAgIGxldCBuZXdUcmVlID0ge1xuICAgICAgICAgYmFzZV90cmVlOiBiYXNlVHJlZVNIQSwgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgICAgdHJlZTogW3tcbiAgICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgICBzaGE6IGJsb2JTSEEsXG4gICAgICAgICAgICBtb2RlOiAnMTAwNjQ0JyxcbiAgICAgICAgICAgIHR5cGU6ICdibG9iJ1xuICAgICAgICAgfV1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQT1NUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vZ2l0L3RyZWVzYCwgbmV3VHJlZSwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENyZWF0ZSBhIG5ldyB0cmVlIGluIGdpdFxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2dpdC90cmVlcy8jY3JlYXRlLWEtdHJlZVxuICAgICogQHBhcmFtIHtPYmplY3R9IHRyZWUgLSB0aGUgdHJlZSB0byBjcmVhdGVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlU0hBIC0gdGhlIHJvb3Qgc2hhIG9mIHRoZSB0cmVlXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbmV3IHRyZWUgdGhhdCBpcyBjcmVhdGVkXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGNyZWF0ZVRyZWUodHJlZSwgYmFzZVNIQSwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQT1NUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vZ2l0L3RyZWVzYCwge1xuICAgICAgICAgdHJlZSxcbiAgICAgICAgIGJhc2VfdHJlZTogYmFzZVNIQSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICB9LCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQWRkIGEgY29tbWl0IHRvIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2l0L2NvbW1pdHMvI2NyZWF0ZS1hLWNvbW1pdFxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmVudCAtIHRoZSBTSEEgb2YgdGhlIHBhcmVudCBjb21taXRcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSB0cmVlIC0gdGhlIFNIQSBvZiB0aGUgdHJlZSBmb3IgdGhpcyBjb21taXRcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gdGhlIGNvbW1pdCBtZXNzYWdlXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgY29tbWl0IHRoYXQgaXMgY3JlYXRlZFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBjb21taXQocGFyZW50LCB0cmVlLCBtZXNzYWdlLCBjYikge1xuICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgdHJlZSxcbiAgICAgICAgIHBhcmVudHM6IFtwYXJlbnRdXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2dpdC9jb21taXRzYCwgZGF0YSwgY2IpXG4gICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX19jdXJyZW50VHJlZS5zaGEgPSByZXNwb25zZS5kYXRhLnNoYTsgLy8gVXBkYXRlIGxhdGVzdCBjb21taXRcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgIH0pO1xuICAgfVxuXG4gICAvKipcbiAgICAqIFVwZGF0ZSBhIHJlZlxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2dpdC9yZWZzLyN1cGRhdGUtYS1yZWZlcmVuY2VcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWYgLSB0aGUgcmVmIHRvIHVwZGF0ZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1pdFNIQSAtIHRoZSBTSEEgdG8gcG9pbnQgdGhlIHJlZmVyZW5jZSB0b1xuICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIGluZGljYXRlcyB3aGV0aGVyIHRvIGZvcmNlIG9yIGVuc3VyZSBhIGZhc3QtZm9yd2FyZCB1cGRhdGVcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSB1cGRhdGVkIHJlZiBiYWNrXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIHVwZGF0ZUhlYWQocmVmLCBjb21taXRTSEEsIGZvcmNlLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BBVENIJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vZ2l0L3JlZnMvJHtyZWZ9YCwge1xuICAgICAgICAgc2hhOiBjb21taXRTSEEsXG4gICAgICAgICBmb3JjZTogZm9yY2VcbiAgICAgIH0sIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy8jZ2V0XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHJlcG9zaXRvcnlcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZ2V0RGV0YWlscyhjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIExpc3QgdGhlIGNvbnRyaWJ1dG9ycyB0byB0aGUgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zLyNsaXN0LWNvbnRyaWJ1dG9yc1xuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGxpc3Qgb2YgY29udHJpYnV0b3JzXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldENvbnRyaWJ1dG9ycyhjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3N0YXRzL2NvbnRyaWJ1dG9yc2AsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBMaXN0IHRoZSB1c2VycyB3aG8gYXJlIGNvbGxhYm9yYXRvcnMgb24gdGhlIHJlcG9zaXRvcnkuIFRoZSBjdXJyZW50bHkgYXV0aGVudGljYXRlZCB1c2VyIG11c3QgaGF2ZVxuICAgICogcHVzaCBhY2Nlc3MgdG8gdXNlIHRoaXMgbWV0aG9kXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvY29sbGFib3JhdG9ycy8jbGlzdC1jb2xsYWJvcmF0b3JzXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbGlzdCBvZiBjb2xsYWJvcmF0b3JzXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldENvbGxhYm9yYXRvcnMoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9jb2xsYWJvcmF0b3JzYCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENoZWNrIGlmIGEgdXNlciBpcyBhIGNvbGxhYm9yYXRvciBvbiB0aGUgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2NvbGxhYm9yYXRvcnMvI2NoZWNrLWlmLWEtdXNlci1pcy1hLWNvbGxhYm9yYXRvclxuICAgICogQHBhcmFtIHtzdHJpbmd9IHVzZXJuYW1lIC0gdGhlIHVzZXIgdG8gY2hlY2tcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIHVzZXIgaXMgYSBjb2xsYWJvcmF0b3IgYW5kIGZhbHNlIGlmIHRoZXkgYXJlIG5vdFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdCB7Qm9vbGVhbn0gW2Rlc2NyaXB0aW9uXVxuICAgICovXG4gICBpc0NvbGxhYm9yYXRvcih1c2VybmFtZSwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9jb2xsYWJvcmF0b3JzLyR7dXNlcm5hbWV9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCB0aGUgY29udGVudHMgb2YgYSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvY29udGVudHMvI2dldC1jb250ZW50c1xuICAgICogQHBhcmFtIHtzdHJpbmd9IHJlZiAtIHRoZSByZWYgdG8gY2hlY2tcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gdGhlIHBhdGggY29udGFpbmluZyB0aGUgY29udGVudCB0byBmZXRjaFxuICAgICogQHBhcmFtIHtib29sZWFufSByYXcgLSBgdHJ1ZWAgaWYgdGhlIHJlc3VsdHMgc2hvdWxkIGJlIHJldHVybmVkIHJhdyBpbnN0ZWFkIG9mIEdpdEh1YidzIG5vcm1hbGl6ZWQgZm9ybWF0XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgZmV0Y2hlZCBkYXRhXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldENvbnRlbnRzKHJlZiwgcGF0aCwgcmF3LCBjYikge1xuICAgICAgcGF0aCA9IHBhdGggPyBgJHtlbmNvZGVVUkkocGF0aCl9YCA6ICcnO1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2NvbnRlbnRzLyR7cGF0aH1gLCB7XG4gICAgICAgICByZWZcbiAgICAgIH0sIGNiLCByYXcpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCB0aGUgUkVBRE1FIG9mIGEgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2NvbnRlbnRzLyNnZXQtdGhlLXJlYWRtZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IHJlZiAtIHRoZSByZWYgdG8gY2hlY2tcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmF3IC0gYHRydWVgIGlmIHRoZSByZXN1bHRzIHNob3VsZCBiZSByZXR1cm5lZCByYXcgaW5zdGVhZCBvZiBHaXRIdWIncyBub3JtYWxpemVkIGZvcm1hdFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGZldGNoZWQgZGF0YVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBnZXRSZWFkbWUocmVmLCByYXcsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcmVhZG1lYCwge1xuICAgICAgICAgcmVmXG4gICAgICB9LCBjYiwgcmF3KTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBGb3JrIGEgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2ZvcmtzLyNjcmVhdGUtYS1mb3JrXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIG5ld2x5IGNyZWF0ZWQgZm9ya1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBmb3JrKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2ZvcmtzYCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIExpc3QgYSByZXBvc2l0b3J5J3MgZm9ya3NcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9mb3Jrcy8jbGlzdC1mb3Jrc1xuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGxpc3Qgb2YgcmVwb3NpdG9yaWVzIGZvcmtlZCBmcm9tIHRoaXMgb25lXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGxpc3RGb3JrcyhjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2ZvcmtzYCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENyZWF0ZSBhIG5ldyBicmFuY2ggZnJvbSBhbiBleGlzdGluZyBicmFuY2guXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW29sZEJyYW5jaD1tYXN0ZXJdIC0gdGhlIG5hbWUgb2YgdGhlIGV4aXN0aW5nIGJyYW5jaFxuICAgICogQHBhcmFtIHtzdHJpbmd9IG5ld0JyYW5jaCAtIHRoZSBuYW1lIG9mIHRoZSBuZXcgYnJhbmNoXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgY29tbWl0IGRhdGEgZm9yIHRoZSBoZWFkIG9mIHRoZSBuZXcgYnJhbmNoXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGNyZWF0ZUJyYW5jaChvbGRCcmFuY2gsIG5ld0JyYW5jaCwgY2IpIHtcbiAgICAgIGlmICh0eXBlb2YgbmV3QnJhbmNoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICBjYiA9IG5ld0JyYW5jaDtcbiAgICAgICAgIG5ld0JyYW5jaCA9IG9sZEJyYW5jaDtcbiAgICAgICAgIG9sZEJyYW5jaCA9ICdtYXN0ZXInO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5nZXRSZWYoYGhlYWRzLyR7b2xkQnJhbmNofWApXG4gICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGxldCBzaGEgPSByZXNwb25zZS5kYXRhLm9iamVjdC5zaGE7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVSZWYoe1xuICAgICAgICAgICAgICAgc2hhLFxuICAgICAgICAgICAgICAgcmVmOiBgcmVmcy9oZWFkcy8ke25ld0JyYW5jaH1gXG4gICAgICAgICAgICB9LCBjYik7XG4gICAgICAgICB9KTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGUgYSBuZXcgcHVsbCByZXF1ZXN0XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcHVsbHMvI2NyZWF0ZS1hLXB1bGwtcmVxdWVzdFxuICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGUgcHVsbCByZXF1ZXN0IGRlc2NyaXB0aW9uXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbmV3IHB1bGwgcmVxdWVzdFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBjcmVhdGVQdWxsUmVxdWVzdChvcHRpb25zLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BPU1QnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9wdWxsc2AsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBVcGRhdGUgYSBwdWxsIHJlcXVlc3RcbiAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMi40LjBcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9wdWxscy8jdXBkYXRlLWEtcHVsbC1yZXF1ZXN0XG4gICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd9IG51bWJlciAtIHRoZSBudW1iZXIgb2YgdGhlIHB1bGwgcmVxdWVzdCB0byB1cGRhdGVcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdGhlIHB1bGwgcmVxdWVzdCBkZXNjcmlwdGlvblxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgcHVsbCByZXF1ZXN0IGluZm9ybWF0aW9uXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIHVwZGF0ZVB1bGxSZXF1c3QobnVtYmVyLCBvcHRpb25zLCBjYikge1xuICAgICAgbG9nKFxuICAgICAgICAgJ0RlcHJlY2F0ZWQ6IFRoaXMgbWV0aG9kIGNvbnRhaW5zIGEgdHlwbyBhbmQgaXQgaGFzIGJlZW4gZGVwcmVjYXRlZC4nICtcbiAgICAgICAgICdJdCB3aWxsIGJlIHJlbW92ZWQgaW4gbmV4dCBtYWpvciB2ZXJzaW9uLiBVc2UgdXBkYXRlUHVsbFJlcXVlc3QoKSBpbnN0ZWFkLidcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVB1bGxSZXF1ZXN0KG51bWJlciwgb3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIFVwZGF0ZSBhIHB1bGwgcmVxdWVzdFxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3B1bGxzLyN1cGRhdGUtYS1wdWxsLXJlcXVlc3RcbiAgICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ30gbnVtYmVyIC0gdGhlIG51bWJlciBvZiB0aGUgcHVsbCByZXF1ZXN0IHRvIHVwZGF0ZVxuICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGUgcHVsbCByZXF1ZXN0IGRlc2NyaXB0aW9uXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSBwdWxsIHJlcXVlc3QgaW5mb3JtYXRpb25cbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgdXBkYXRlUHVsbFJlcXVlc3QobnVtYmVyLCBvcHRpb25zLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BBVENIJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHVsbHMvJHtudW1iZXJ9YCwgb3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIExpc3QgdGhlIGhvb2tzIGZvciB0aGUgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2hvb2tzLyNsaXN0LWhvb2tzXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbGlzdCBvZiBob29rc1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBsaXN0SG9va3MoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9ob29rc2AsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQgYSBob29rIGZvciB0aGUgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2hvb2tzLyNnZXQtc2luZ2xlLWhvb2tcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBpZCAtIHRoZSBpZCBvZiB0aGUgd2Vib29rXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgZGV0YWlscyBvZiB0aGUgd2Vib29rXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldEhvb2soaWQsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vaG9va3MvJHtpZH1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQWRkIGEgbmV3IGhvb2sgdG8gdGhlIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9ob29rcy8jY3JlYXRlLWEtaG9va1xuICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGUgY29uZmlndXJhdGlvbiBkZXNjcmliaW5nIHRoZSBuZXcgaG9va1xuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIG5ldyB3ZWJob29rXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGNyZWF0ZUhvb2sob3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQT1NUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vaG9va3NgLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRWRpdCBhbiBleGlzdGluZyB3ZWJob29rXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvaG9va3MvI2VkaXQtYS1ob29rXG4gICAgKiBAcGFyYW0ge251bWJlcn0gaWQgLSB0aGUgaWQgb2YgdGhlIHdlYmhvb2tcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdGhlIG5ldyBkZXNjcmlwdGlvbiBvZiB0aGUgd2ViaG9va1xuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIHVwZGF0ZWQgd2ViaG9va1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICB1cGRhdGVIb29rKGlkLCBvcHRpb25zLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BBVENIJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vaG9va3MvJHtpZH1gLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRGVsZXRlIGEgd2ViaG9va1xuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2hvb2tzLyNkZWxldGUtYS1ob29rXG4gICAgKiBAcGFyYW0ge251bWJlcn0gaWQgLSB0aGUgaWQgb2YgdGhlIHdlYmhvb2sgdG8gYmUgZGVsZXRlZFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdHJ1ZSBpZiB0aGUgY2FsbCBpcyBzdWNjZXNzZnVsXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGRlbGV0ZUhvb2soaWQsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnREVMRVRFJywgYCR7dGhpcy5fX2Z1bGxuYW1lfS9ob29rcy8ke2lkfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBMaXN0IHRoZSBkZXBsb3kga2V5cyBmb3IgdGhlIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9rZXlzLyNsaXN0LWRlcGxveS1rZXlzXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbGlzdCBvZiBkZXBsb3kga2V5c1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBsaXN0S2V5cyhjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2tleXNgLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogR2V0IGEgZGVwbG95IGtleSBmb3IgdGhlIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9rZXlzLyNnZXQtYS1kZXBsb3kta2V5XG4gICAgKiBAcGFyYW0ge251bWJlcn0gaWQgLSB0aGUgaWQgb2YgdGhlIGRlcGxveSBrZXlcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBkZXRhaWxzIG9mIHRoZSBkZXBsb3kga2V5XG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldEtleShpZCwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9rZXlzLyR7aWR9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEFkZCBhIG5ldyBkZXBsb3kga2V5IHRvIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3Mva2V5cy8jYWRkLWEtbmV3LWRlcGxveS1rZXlcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdGhlIGNvbmZpZ3VyYXRpb24gZGVzY3JpYmluZyB0aGUgbmV3IGRlcGxveSBrZXlcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBuZXcgZGVwbG95IGtleVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBjcmVhdGVLZXkob3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQT1NUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0va2V5c2AsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBEZWxldGUgYSBkZXBsb3kga2V5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3Mva2V5cy8jcmVtb3ZlLWEtZGVwbG95LWtleVxuICAgICogQHBhcmFtIHtudW1iZXJ9IGlkIC0gdGhlIGlkIG9mIHRoZSBkZXBsb3kga2V5IHRvIGJlIGRlbGV0ZWRcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIGNhbGwgaXMgc3VjY2Vzc2Z1bFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBkZWxldGVLZXkoaWQsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnREVMRVRFJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0va2V5cy8ke2lkfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBEZWxldGUgYSBmaWxlIGZyb20gYSBicmFuY2hcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9jb250ZW50cy8jZGVsZXRlLWEtZmlsZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IGJyYW5jaCAtIHRoZSBicmFuY2ggdG8gZGVsZXRlIGZyb20sIG9yIHRoZSBkZWZhdWx0IGJyYW5jaCBpZiBub3Qgc3BlY2lmaWVkXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIHRoZSBwYXRoIG9mIHRoZSBmaWxlIHRvIHJlbW92ZVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGNvbW1pdCBpbiB3aGljaCB0aGUgZGVsZXRlIG9jY3VycmVkXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGRlbGV0ZUZpbGUoYnJhbmNoLCBwYXRoLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0U2hhKGJyYW5jaCwgcGF0aClcbiAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGVsZXRlQ29tbWl0ID0ge1xuICAgICAgICAgICAgICAgbWVzc2FnZTogYERlbGV0ZSB0aGUgZmlsZSBhdCAnJHtwYXRofSdgLFxuICAgICAgICAgICAgICAgc2hhOiByZXNwb25zZS5kYXRhLnNoYSxcbiAgICAgICAgICAgICAgIGJyYW5jaFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdERUxFVEUnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9jb250ZW50cy8ke3BhdGh9YCwgZGVsZXRlQ29tbWl0LCBjYik7XG4gICAgICAgICB9KTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDaGFuZ2UgYWxsIHJlZmVyZW5jZXMgaW4gYSByZXBvIGZyb20gb2xkUGF0aCB0byBuZXdfcGF0aFxuICAgICogQHBhcmFtIHtzdHJpbmd9IGJyYW5jaCAtIHRoZSBicmFuY2ggdG8gY2Fycnkgb3V0IHRoZSByZWZlcmVuY2UgY2hhbmdlLCBvciB0aGUgZGVmYXVsdCBicmFuY2ggaWYgbm90IHNwZWNpZmllZFxuICAgICogQHBhcmFtIHtzdHJpbmd9IG9sZFBhdGggLSBvcmlnaW5hbCBwYXRoXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gbmV3UGF0aCAtIG5ldyByZWZlcmVuY2UgcGF0aFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGNvbW1pdCBpbiB3aGljaCB0aGUgbW92ZSBvY2N1cnJlZFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBtb3ZlKGJyYW5jaCwgb2xkUGF0aCwgbmV3UGF0aCwgY2IpIHtcbiAgICAgIGxldCBvbGRTaGE7XG4gICAgICByZXR1cm4gdGhpcy5nZXRSZWYoYGhlYWRzLyR7YnJhbmNofWApXG4gICAgICAgICAudGhlbigoe2RhdGE6IHtvYmplY3R9fSkgPT4gdGhpcy5nZXRUcmVlKGAke29iamVjdC5zaGF9P3JlY3Vyc2l2ZT10cnVlYCkpXG4gICAgICAgICAudGhlbigoe2RhdGE6IHt0cmVlLCBzaGF9fSkgPT4ge1xuICAgICAgICAgICAgb2xkU2hhID0gc2hhO1xuICAgICAgICAgICAgbGV0IG5ld1RyZWUgPSB0cmVlLm1hcCgocmVmKSA9PiB7XG4gICAgICAgICAgICAgICBpZiAocmVmLnBhdGggPT09IG9sZFBhdGgpIHtcbiAgICAgICAgICAgICAgICAgIHJlZi5wYXRoID0gbmV3UGF0aDtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIGlmIChyZWYudHlwZSA9PT0gJ3RyZWUnKSB7XG4gICAgICAgICAgICAgICAgICBkZWxldGUgcmVmLnNoYTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIHJldHVybiByZWY7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVRyZWUobmV3VHJlZSk7XG4gICAgICAgICB9KVxuICAgICAgICAgLnRoZW4oKHtkYXRhOiB0cmVlfSkgPT4gdGhpcy5jb21taXQob2xkU2hhLCB0cmVlLnNoYSwgYFJlbmFtZWQgJyR7b2xkUGF0aH0nIHRvICcke25ld1BhdGh9J2ApKVxuICAgICAgICAgLnRoZW4oKHtkYXRhOiBjb21taXR9KSA9PiB0aGlzLnVwZGF0ZUhlYWQoYGhlYWRzLyR7YnJhbmNofWAsIGNvbW1pdC5zaGEsIHRydWUsIGNiKSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogV3JpdGUgYSBmaWxlIHRvIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvY29udGVudHMvI3VwZGF0ZS1hLWZpbGVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBicmFuY2ggLSB0aGUgbmFtZSBvZiB0aGUgYnJhbmNoXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIHRoZSBwYXRoIGZvciB0aGUgZmlsZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnQgLSB0aGUgY29udGVudHMgb2YgdGhlIGZpbGVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gdGhlIGNvbW1pdCBtZXNzYWdlXG4gICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gY29tbWl0IG9wdGlvbnNcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5hdXRob3JdIC0gdGhlIGF1dGhvciBvZiB0aGUgY29tbWl0XG4gICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuY29tbWl0ZXJdIC0gdGhlIGNvbW1pdHRlclxuICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5lbmNvZGVdIC0gdHJ1ZSBpZiB0aGUgY29udGVudCBzaG91bGQgYmUgYmFzZTY0IGVuY29kZWRcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBuZXcgY29tbWl0XG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIHdyaXRlRmlsZShicmFuY2gsIHBhdGgsIGNvbnRlbnQsIG1lc3NhZ2UsIG9wdGlvbnMsIGNiKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgIGNiID0gb3B0aW9ucztcbiAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgIH1cbiAgICAgIGxldCBmaWxlUGF0aCA9IHBhdGggPyBlbmNvZGVVUkkocGF0aCkgOiAnJztcbiAgICAgIGxldCBzaG91bGRFbmNvZGUgPSBvcHRpb25zLmVuY29kZSAhPT0gZmFsc2U7XG4gICAgICBsZXQgY29tbWl0ID0ge1xuICAgICAgICAgYnJhbmNoLFxuICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgIGF1dGhvcjogb3B0aW9ucy5hdXRob3IsXG4gICAgICAgICBjb21taXR0ZXI6IG9wdGlvbnMuY29tbWl0dGVyLFxuICAgICAgICAgY29udGVudDogc2hvdWxkRW5jb2RlID8gQmFzZTY0LmVuY29kZShjb250ZW50KSA6IGNvbnRlbnRcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiB0aGlzLmdldFNoYShicmFuY2gsIGZpbGVQYXRoKVxuICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBjb21taXQuc2hhID0gcmVzcG9uc2UuZGF0YS5zaGE7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUFVUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vY29udGVudHMvJHtmaWxlUGF0aH1gLCBjb21taXQsIGNiKTtcbiAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQVVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9jb250ZW50cy8ke2ZpbGVQYXRofWAsIGNvbW1pdCwgY2IpO1xuICAgICAgICAgfSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ2hlY2sgaWYgYSByZXBvc2l0b3J5IGlzIHN0YXJyZWQgYnkgeW91XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvYWN0aXZpdHkvc3RhcnJpbmcvI2NoZWNrLWlmLXlvdS1hcmUtc3RhcnJpbmctYS1yZXBvc2l0b3J5XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0cnVlIGlmIHRoZSByZXBvc2l0b3J5IGlzIHN0YXJyZWQgYW5kIGZhbHNlIGlmIHRoZSByZXBvc2l0b3J5XG4gICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpcyBub3Qgc3RhcnJlZFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdCB7Qm9vbGVhbn0gW2Rlc2NyaXB0aW9uXVxuICAgICovXG4gICBpc1N0YXJyZWQoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0MjA0b3I0MDQoYC91c2VyL3N0YXJyZWQvJHt0aGlzLl9fZnVsbG5hbWV9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIFN0YXIgYSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvYWN0aXZpdHkvc3RhcnJpbmcvI3N0YXItYS1yZXBvc2l0b3J5XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0cnVlIGlmIHRoZSByZXBvc2l0b3J5IGlzIHN0YXJyZWRcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgc3RhcihjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BVVCcsIGAvdXNlci9zdGFycmVkLyR7dGhpcy5fX2Z1bGxuYW1lfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBVbnN0YXIgYSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvYWN0aXZpdHkvc3RhcnJpbmcvI3Vuc3Rhci1hLXJlcG9zaXRvcnlcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIHJlcG9zaXRvcnkgaXMgdW5zdGFycmVkXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIHVuc3RhcihjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0RFTEVURScsIGAvdXNlci9zdGFycmVkLyR7dGhpcy5fX2Z1bGxuYW1lfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGUgYSBuZXcgcmVsZWFzZVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL3JlbGVhc2VzLyNjcmVhdGUtYS1yZWxlYXNlXG4gICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIHRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgcmVsZWFzZVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIG5ld2x5IGNyZWF0ZWQgcmVsZWFzZVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBjcmVhdGVSZWxlYXNlKG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3JlbGVhc2VzYCwgb3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEVkaXQgYSByZWxlYXNlXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcmVsZWFzZXMvI2VkaXQtYS1yZWxlYXNlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgLSB0aGUgaWQgb2YgdGhlIHJlbGVhc2VcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdGhlIGRlc2NyaXB0aW9uIG9mIHRoZSByZWxlYXNlXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbW9kaWZpZWQgcmVsZWFzZVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICB1cGRhdGVSZWxlYXNlKGlkLCBvcHRpb25zLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BBVENIJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcmVsZWFzZXMvJHtpZH1gLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogR2V0IGluZm9ybWF0aW9uIGFib3V0IGFsbCByZWxlYXNlc1xuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL3JlbGVhc2VzLyNsaXN0LXJlbGVhc2VzLWZvci1hLXJlcG9zaXRvcnlcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSByZWxlYXNlIGluZm9ybWF0aW9uXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGxpc3RSZWxlYXNlcyhjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3JlbGVhc2VzYCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCBpbmZvcm1hdGlvbiBhYm91dCBhIHJlbGVhc2VcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9yZWxlYXNlcy8jZ2V0LWEtc2luZ2xlLXJlbGVhc2VcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIHRoZSBpZCBvZiB0aGUgcmVsZWFzZVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIHJlbGVhc2UgaW5mb3JtYXRpb25cbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZ2V0UmVsZWFzZShpZCwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9yZWxlYXNlcy8ke2lkfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBEZWxldGUgYSByZWxlYXNlXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcmVsZWFzZXMvI2RlbGV0ZS1hLXJlbGVhc2VcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIHRoZSByZWxlYXNlIHRvIGJlIGRlbGV0ZWRcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIG9wZXJhdGlvbiBpcyBzdWNjZXNzZnVsXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGRlbGV0ZVJlbGVhc2UoaWQsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnREVMRVRFJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcmVsZWFzZXMvJHtpZH1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogTWVyZ2UgYSBwdWxsIHJlcXVlc3RcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9wdWxscy8jbWVyZ2UtYS1wdWxsLXJlcXVlc3QtbWVyZ2UtYnV0dG9uXG4gICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd9IG51bWJlciAtIHRoZSBudW1iZXIgb2YgdGhlIHB1bGwgcmVxdWVzdCB0byBtZXJnZVxuICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGUgbWVyZ2Ugb3B0aW9ucyBmb3IgdGhlIHB1bGwgcmVxdWVzdFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgbWVyZ2UgaW5mb3JtYXRpb24gaWYgdGhlIG9wZXJhdGlvbiBpcyBzdWNjZXNzZnVsXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIG1lcmdlUHVsbFJlcXVlc3QobnVtYmVyLCBvcHRpb25zLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BVVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3B1bGxzLyR7bnVtYmVyfS9tZXJnZWAsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQgaW5mb3JtYXRpb24gYWJvdXQgYWxsIHByb2plY3RzXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcHJvamVjdHMvI2xpc3QtcHJvamVjdHNcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdGhlIGxpc3Qgb2YgcHJvamVjdHNcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgbGlzdFByb2plY3RzKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHJvamVjdHNgLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogR2V0IGluZm9ybWF0aW9uIGFib3V0IGEgcHJvamVjdFxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL3Byb2plY3RzLyNsaXN0LWEtcHJvamVjdFxuICAgICogQHBhcmFtIHtzdHJpbmd9IHByb2plY3ROdW1iZXIgLSB0aGUgbnVtYmVyIG9mIHRoZSBwcm9qZWN0XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgcHJvamVjdCBpbmZvcm1hdGlvblxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBnZXRQcm9qZWN0KHByb2plY3ROdW1iZXIsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHJvamVjdHMvJHtwcm9qZWN0TnVtYmVyfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGUgYSBuZXcgcHJvamVjdFxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL3Byb2plY3RzLyNjcmVhdGUtYS1wcm9qZWN0XG4gICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIHRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgcHJvamVjdFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIG5ld2x5IGNyZWF0ZWQgcHJvamVjdFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBjcmVhdGVQcm9qZWN0KG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3Byb2plY3RzYCwgb3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEVkaXQgYSBwcm9qZWN0XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcHJvamVjdHMvI3VwZGF0ZS1hLXByb2plY3RcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9qZWN0TnVtYmVyIC0gdGhlIG51bWJlciBvZiB0aGUgcHJvamVjdFxuICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGUgZGVzY3JpcHRpb24gb2YgdGhlIHByb2plY3RcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBtb2RpZmllZCBwcm9qZWN0XG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIHVwZGF0ZVByb2plY3QocHJvamVjdE51bWJlciwgb3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQQVRDSCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3Byb2plY3RzLyR7cHJvamVjdE51bWJlcn1gLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRGVsZXRlIGEgcHJvamVjdFxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL3Byb2plY3RzLyNkZWxldGUtYS1wcm9qZWN0XG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvamVjdE51bWJlciAtIHRoZSBwcm9qZWN0IHRvIGJlIGRlbGV0ZWRcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIG9wZXJhdGlvbiBpcyBzdWNjZXNzZnVsXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGRlbGV0ZVByb2plY3QocHJvamVjdE51bWJlciwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdERUxFVEUnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9wcm9qZWN0cy8ke3Byb2plY3ROdW1iZXJ9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCBpbmZvcm1hdGlvbiBhYm91dCBhbGwgY29sdW1ucyBvZiBhIHByb2plY3RcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9wcm9qZWN0cy8jbGlzdC1jb2x1bW5zXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvamVjdE51bWJlciAtIHRoZSBudW1iZXIgb2YgdGhlIHByb2plY3RcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdGhlIGxpc3Qgb2YgY29sdW1uc1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBsaXN0UHJvamVjdENvbHVtbnMocHJvamVjdE51bWJlciwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9wcm9qZWN0cy8ke3Byb2plY3ROdW1iZXJ9L2NvbHVtbnNgLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogR2V0IGluZm9ybWF0aW9uIGFib3V0IGEgY29sdW1uXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcHJvamVjdHMvI2dldC1hLWNvbHVtblxuICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbElkIC0gdGhlIGlkIG9mIHRoZSBjb2x1bW5cbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBjb2x1bW4gaW5mb3JtYXRpb25cbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZ2V0UHJvamVjdENvbHVtbihjb2xJZCwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9wcm9qZWN0cy9jb2x1bW5zLyR7Y29sSWR9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENyZWF0ZSBhIG5ldyBjb2x1bW5cbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9wcm9qZWN0cy8jY3JlYXRlLWEtY29sdW1uXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvamVjdE51bWJlciAtIHRoZSBwcm9qZWN0IG51bWJlclxuICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGUgZGVzY3JpcHRpb24gb2YgdGhlIGNvbHVtblxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIG5ld2x5IGNyZWF0ZWQgY29sdW1uXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGNyZWF0ZVByb2plY3RDb2x1bW4ocHJvamVjdE51bWJlciwgb3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQT1NUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHJvamVjdHMvJHtwcm9qZWN0TnVtYmVyfS9jb2x1bW5zYCwgb3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEVkaXQgYSBjb2x1bW5cbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9wcm9qZWN0cy8jdXBkYXRlLWEtY29sdW1uXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gY29sSWQgLSB0aGUgY29sdW1uIGlkXG4gICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIHRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgY29sdW1uXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbW9kaWZpZWQgY29sdW1uXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIHVwZGF0ZVByb2plY3RDb2x1bW4oY29sSWQsIG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUEFUQ0gnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9wcm9qZWN0cy9jb2x1bW5zLyR7Y29sSWR9YCwgb3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIERlbGV0ZSBhIGNvbHVtblxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL3Byb2plY3RzLyNkZWxldGUtYS1jb2x1bW5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb2xJZCAtIHRoZSBjb2x1bW4gdG8gYmUgZGVsZXRlZFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdHJ1ZSBpZiB0aGUgb3BlcmF0aW9uIGlzIHN1Y2Nlc3NmdWxcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZGVsZXRlUHJvamVjdENvbHVtbihjb2xJZCwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdERUxFVEUnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9wcm9qZWN0cy9jb2x1bW5zLyR7Y29sSWR9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIE1vdmUgYSBjb2x1bW5cbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9wcm9qZWN0cy8jbW92ZS1hLWNvbHVtblxuICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbElkIC0gdGhlIGNvbHVtbiB0byBiZSBtb3ZlZFxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBvc2l0aW9uIC0gY2FuIGJlIG9uZSBvZiBmaXJzdCwgbGFzdCwgb3IgYWZ0ZXI6PGNvbHVtbi1pZD4sXG4gICAgKiB3aGVyZSA8Y29sdW1uLWlkPiBpcyB0aGUgaWQgdmFsdWUgb2YgYSBjb2x1bW4gaW4gdGhlIHNhbWUgcHJvamVjdC5cbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIG9wZXJhdGlvbiBpcyBzdWNjZXNzZnVsXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIG1vdmVQcm9qZWN0Q29sdW1uKGNvbElkLCBwb3NpdGlvbiwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KFxuICAgICAgICAgJ1BPU1QnLFxuICAgICAgICAgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHJvamVjdHMvY29sdW1ucy8ke2NvbElkfS9tb3Zlc2AsXG4gICAgICAgICB7cG9zaXRpb246IHBvc2l0aW9ufSxcbiAgICAgICAgIGNiXG4gICAgICApO1xuICAgfVxuXG4gICAvKipcbiAgICogR2V0IGluZm9ybWF0aW9uIGFib3V0IGFsbCBjYXJkcyBvZiBhIGNvbHVtblxuICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcHJvamVjdHMvI2xpc3QtcHJvamVjdHMtY2FyZHNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbElkIC0gdGhlIGlkIG9mIHRoZSBjb2x1bW5cbiAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgbGlzdCBvZiBjYXJkc1xuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAqL1xuICAgbGlzdFByb2plY3RDYXJkcyhjb2xJZCwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9wcm9qZWN0cy9jb2x1bW5zLyR7Y29sSWR9L2NhcmRzYCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICogR2V0IGluZm9ybWF0aW9uIGFib3V0IGEgY2FyZFxuICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcHJvamVjdHMvI2xpc3QtYS1wcm9qZWN0LWNhcmRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhcmRJZCAtIHRoZSBpZCBvZiB0aGUgY2FyZFxuICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgY2FyZCBpbmZvcm1hdGlvblxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAqL1xuICAgZ2V0UHJvamVjdENhcmQoY2FyZElkLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3Byb2plY3RzL2NvbHVtbnMvY2FyZHMvJHtjYXJkSWR9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGNhcmRcbiAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL3Byb2plY3RzLyNjcmVhdGUtYS1wcm9qZWN0LWNhcmRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbElkIC0gdGhlIGNvbHVtbiBpZFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIHRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgY2FyZFxuICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbmV3bHkgY3JlYXRlZCBjYXJkXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICovXG4gICBjcmVhdGVQcm9qZWN0Q2FyZChjb2xJZCwgb3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQT1NUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHJvamVjdHMvY29sdW1ucy8ke2NvbElkfS9jYXJkc2AsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAqIEVkaXQgYSBjYXJkXG4gICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9wcm9qZWN0cy8jdXBkYXRlLWEtcHJvamVjdC1jYXJkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYXJkSWQgLSB0aGUgY2FyZCBpZFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIHRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgY2FyZFxuICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbW9kaWZpZWQgY2FyZFxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAqL1xuICAgdXBkYXRlUHJvamVjdENhcmQoY2FyZElkLCBvcHRpb25zLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BBVENIJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHJvamVjdHMvY29sdW1ucy9jYXJkcy8ke2NhcmRJZH1gLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgKiBEZWxldGUgYSBjYXJkXG4gICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9wcm9qZWN0cy8jZGVsZXRlLWEtcHJvamVjdC1jYXJkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYXJkSWQgLSB0aGUgY2FyZCB0byBiZSBkZWxldGVkXG4gICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIG9wZXJhdGlvbiBpcyBzdWNjZXNzZnVsXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICovXG4gICBkZWxldGVQcm9qZWN0Q2FyZChjYXJkSWQsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnREVMRVRFJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHJvamVjdHMvY29sdW1ucy9jYXJkcy8ke2NhcmRJZH1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgKiBNb3ZlIGEgY2FyZFxuICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcHJvamVjdHMvI21vdmUtYS1wcm9qZWN0LWNhcmRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhcmRJZCAtIHRoZSBjYXJkIHRvIGJlIG1vdmVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwb3NpdGlvbiAtIGNhbiBiZSBvbmUgb2YgdG9wLCBib3R0b20sIG9yIGFmdGVyOjxjYXJkLWlkPixcbiAgICogd2hlcmUgPGNhcmQtaWQ+IGlzIHRoZSBpZCB2YWx1ZSBvZiBhIGNhcmQgaW4gdGhlIHNhbWUgcHJvamVjdC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbElkIC0gdGhlIGlkIHZhbHVlIG9mIGEgY29sdW1uIGluIHRoZSBzYW1lIHByb2plY3QuXG4gICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIG9wZXJhdGlvbiBpcyBzdWNjZXNzZnVsXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICovXG4gICBtb3ZlUHJvamVjdENhcmQoY2FyZElkLCBwb3NpdGlvbiwgY29sSWQsIGNiKSB7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyovXG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdChcbiAgICAgICAgICdQT1NUJyxcbiAgICAgICAgIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3Byb2plY3RzL2NvbHVtbnMvY2FyZHMvJHtjYXJkSWR9L21vdmVzYCxcbiAgICAgICAgIHsncG9zaXRpb24nOiBwb3NpdGlvbiwgJ2NvbHVtbl9pZCc6IGNvbElkfSxcbiAgICAgICAgIGNiXG4gICAgICApO1xuICAgICAgLyogZXNsaW50LWVuYWJsZSAqL1xuICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVwb3NpdG9yeTtcbiJdfQ==
//# sourceMappingURL=Repository.js.map
