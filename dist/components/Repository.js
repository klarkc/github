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
      return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
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
            log('Deprecated: This method contains a typo and it has been deprecated. It will be removed in next major version. Use updatePullRequest() instead.');

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
            return this._request('POST', '/repos/' + this.__fullname + '/projects/columns/cards/' + cardId + '/moves', { position: position, column_id: colId }, cb);
         }
      }]);

      return Repository;
   }(_Requestable3.default);

   module.exports = Repository;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJlcG9zaXRvcnkuanMiXSwibmFtZXMiOlsibG9nIiwiUmVwb3NpdG9yeSIsImZ1bGxuYW1lIiwiYXV0aCIsImFwaUJhc2UiLCJfX2Z1bGxuYW1lIiwiX19jdXJyZW50VHJlZSIsImJyYW5jaCIsInNoYSIsInJlZiIsImNiIiwiX3JlcXVlc3QiLCJvcHRpb25zIiwibnVtYmVyIiwiYmFzZSIsImhlYWQiLCJzaW5jZSIsIl9kYXRlVG9JU08iLCJ1bnRpbCIsInBhdGgiLCJ0cmVlU0hBIiwiY29udGVudCIsInBvc3RCb2R5IiwiX2dldENvbnRlbnRPYmplY3QiLCJlbmNvZGUiLCJlbmNvZGluZyIsIkJ1ZmZlciIsInRvU3RyaW5nIiwiQmxvYiIsIkpTT04iLCJzdHJpbmdpZnkiLCJFcnJvciIsImJhc2VUcmVlU0hBIiwiYmxvYlNIQSIsIm5ld1RyZWUiLCJiYXNlX3RyZWUiLCJ0cmVlIiwibW9kZSIsInR5cGUiLCJiYXNlU0hBIiwicGFyZW50IiwibWVzc2FnZSIsImRhdGEiLCJwYXJlbnRzIiwidGhlbiIsInJlc3BvbnNlIiwiY29tbWl0U0hBIiwiZm9yY2UiLCJ1c2VybmFtZSIsInJhdyIsImVuY29kZVVSSSIsIm9sZEJyYW5jaCIsIm5ld0JyYW5jaCIsImdldFJlZiIsIm9iamVjdCIsImNyZWF0ZVJlZiIsInVwZGF0ZVB1bGxSZXF1ZXN0IiwiaWQiLCJnZXRTaGEiLCJkZWxldGVDb21taXQiLCJvbGRQYXRoIiwibmV3UGF0aCIsIm9sZFNoYSIsImdldFRyZWUiLCJtYXAiLCJjcmVhdGVUcmVlIiwiY29tbWl0IiwidXBkYXRlSGVhZCIsImZpbGVQYXRoIiwic2hvdWxkRW5jb2RlIiwiYXV0aG9yIiwiY29tbWl0dGVyIiwiX3JlcXVlc3QyMDRvcjQwNCIsInByb2plY3ROdW1iZXIiLCJjb2xJZCIsInBvc2l0aW9uIiwiY2FyZElkIiwiY29sdW1uX2lkIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUVNLEtBQUtOLFVBRlgsZ0NBRWdEdUUsTUFGaEQsYUFHSixFQUFDRCxVQUFVQSxRQUFYLEVBQXFCRSxXQUFXSCxLQUFoQyxFQUhJLEVBSUpoRSxFQUpJLENBQVA7QUFNRjs7Ozs7O0FBSUpvRSxVQUFPQyxPQUFQLEdBQWlCOUUsVUFBakIiLCJmaWxlIjoiUmVwb3NpdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVcbiAqIEBjb3B5cmlnaHQgIDIwMTMgTWljaGFlbCBBdWZyZWl0ZXIgKERldmVsb3BtZW50IFNlZWQpIGFuZCAyMDE2IFlhaG9vIEluYy5cbiAqIEBsaWNlbnNlICAgIExpY2Vuc2VkIHVuZGVyIHtAbGluayBodHRwczovL3NwZHgub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZS1DbGVhci5odG1sIEJTRC0zLUNsYXVzZS1DbGVhcn0uXG4gKiAgICAgICAgICAgICBHaXRodWIuanMgaXMgZnJlZWx5IGRpc3RyaWJ1dGFibGUuXG4gKi9cblxuaW1wb3J0IFJlcXVlc3RhYmxlIGZyb20gJy4vUmVxdWVzdGFibGUnO1xuaW1wb3J0IFV0ZjggZnJvbSAndXRmOCc7XG5pbXBvcnQge1xuICAgQmFzZTY0XG59IGZyb20gJ2pzLWJhc2U2NCc7XG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuY29uc3QgbG9nID0gZGVidWcoJ2dpdGh1YjpyZXBvc2l0b3J5Jyk7XG5cbi8qKlxuICogUmVzcG9zaXRvcnkgZW5jYXBzdWxhdGVzIHRoZSBmdW5jdGlvbmFsaXR5IHRvIGNyZWF0ZSwgcXVlcnksIGFuZCBtb2RpZnkgZmlsZXMuXG4gKi9cbmNsYXNzIFJlcG9zaXRvcnkgZXh0ZW5kcyBSZXF1ZXN0YWJsZSB7XG4gICAvKipcbiAgICAqIENyZWF0ZSBhIFJlcG9zaXRvcnkuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gZnVsbG5hbWUgLSB0aGUgZnVsbCBuYW1lIG9mIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmF1dGh9IFthdXRoXSAtIGluZm9ybWF0aW9uIHJlcXVpcmVkIHRvIGF1dGhlbnRpY2F0ZSB0byBHaXRodWJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbYXBpQmFzZT1odHRwczovL2FwaS5naXRodWIuY29tXSAtIHRoZSBiYXNlIEdpdGh1YiBBUEkgVVJMXG4gICAgKi9cbiAgIGNvbnN0cnVjdG9yKGZ1bGxuYW1lLCBhdXRoLCBhcGlCYXNlKSB7XG4gICAgICBzdXBlcihhdXRoLCBhcGlCYXNlKTtcbiAgICAgIHRoaXMuX19mdWxsbmFtZSA9IGZ1bGxuYW1lO1xuICAgICAgdGhpcy5fX2N1cnJlbnRUcmVlID0ge1xuICAgICAgICAgYnJhbmNoOiBudWxsLFxuICAgICAgICAgc2hhOiBudWxsXG4gICAgICB9O1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCBhIHJlZmVyZW5jZVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2dpdC9yZWZzLyNnZXQtYS1yZWZlcmVuY2VcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWYgLSB0aGUgcmVmZXJlbmNlIHRvIGdldFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgcmVmZXJlbmNlJ3MgcmVmU3BlYyBvciBhIGxpc3Qgb2YgcmVmU3BlY3MgdGhhdCBtYXRjaCBgcmVmYFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBnZXRSZWYocmVmLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2dpdC9yZWZzLyR7cmVmfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGUgYSByZWZlcmVuY2VcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXQvcmVmcy8jY3JlYXRlLWEtcmVmZXJlbmNlXG4gICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIHRoZSBvYmplY3QgZGVzY3JpYmluZyB0aGUgcmVmXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSByZWZcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgY3JlYXRlUmVmKG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2dpdC9yZWZzYCwgb3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIERlbGV0ZSBhIHJlZmVyZW5jZVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2dpdC9yZWZzLyNkZWxldGUtYS1yZWZlcmVuY2VcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWYgLSB0aGUgbmFtZSBvZiB0aGUgcmVmIHRvIGRlbHRlXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIHJlcXVlc3QgaXMgc3VjY2Vzc2Z1bFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBkZWxldGVSZWYocmVmLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0RFTEVURScsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2dpdC9yZWZzLyR7cmVmfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBEZWxldGUgYSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvI2RlbGV0ZS1hLXJlcG9zaXRvcnlcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdHJ1ZSBpZiB0aGUgcmVxdWVzdCBpcyBzdWNjZXNzZnVsXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGRlbGV0ZVJlcG8oY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdERUxFVEUnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBMaXN0IHRoZSB0YWdzIG9uIGEgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zLyNsaXN0LXRhZ3NcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdGhlIHRhZyBkYXRhXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGxpc3RUYWdzKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vdGFnc2AsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBMaXN0IHRoZSBvcGVuIHB1bGwgcmVxdWVzdHMgb24gdGhlIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9wdWxscy8jbGlzdC1wdWxsLXJlcXVlc3RzXG4gICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIG9wdGlvbnMgdG8gZmlsdGVyIHRoZSBzZWFyY2hcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdGhlIGxpc3Qgb2YgUFJzXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGxpc3RQdWxsUmVxdWVzdHMob3B0aW9ucywgY2IpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3B1bGxzYCwgb3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCBpbmZvcm1hdGlvbiBhYm91dCBhIHNwZWNpZmljIHB1bGwgcmVxdWVzdFxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3B1bGxzLyNnZXQtYS1zaW5nbGUtcHVsbC1yZXF1ZXN0XG4gICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIC0gdGhlIFBSIHlvdSB3aXNoIHRvIGZldGNoXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSBQUiBmcm9tIHRoZSBBUElcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZ2V0UHVsbFJlcXVlc3QobnVtYmVyLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3B1bGxzLyR7bnVtYmVyfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBMaXN0IHRoZSBmaWxlcyBvZiBhIHNwZWNpZmljIHB1bGwgcmVxdWVzdFxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3B1bGxzLyNsaXN0LXB1bGwtcmVxdWVzdHMtZmlsZXNcbiAgICAqIEBwYXJhbSB7bnVtYmVyfHN0cmluZ30gbnVtYmVyIC0gdGhlIFBSIHlvdSB3aXNoIHRvIGZldGNoXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSBsaXN0IG9mIGZpbGVzIGZyb20gdGhlIEFQSVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBsaXN0UHVsbFJlcXVlc3RGaWxlcyhudW1iZXIsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHVsbHMvJHtudW1iZXJ9L2ZpbGVzYCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENvbXBhcmUgdHdvIGJyYW5jaGVzL2NvbW1pdHMvcmVwb3NpdG9yaWVzXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvY29tbWl0cy8jY29tcGFyZS10d28tY29tbWl0c1xuICAgICogQHBhcmFtIHtzdHJpbmd9IGJhc2UgLSB0aGUgYmFzZSBjb21taXRcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBoZWFkIC0gdGhlIGhlYWQgY29tbWl0XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgY29tcGFyaXNvblxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBjb21wYXJlQnJhbmNoZXMoYmFzZSwgaGVhZCwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9jb21wYXJlLyR7YmFzZX0uLi4ke2hlYWR9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIExpc3QgYWxsIHRoZSBicmFuY2hlcyBmb3IgdGhlIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy8jbGlzdC1icmFuY2hlc1xuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGxpc3Qgb2YgYnJhbmNoZXNcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgbGlzdEJyYW5jaGVzKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vYnJhbmNoZXNgLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogR2V0IGEgcmF3IGJsb2IgZnJvbSB0aGUgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2dpdC9ibG9icy8jZ2V0LWEtYmxvYlxuICAgICogQHBhcmFtIHtzdHJpbmd9IHNoYSAtIHRoZSBzaGEgb2YgdGhlIGJsb2IgdG8gZmV0Y2hcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBibG9iIGZyb20gdGhlIEFQSVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBnZXRCbG9iKHNoYSwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9naXQvYmxvYnMvJHtzaGF9YCwgbnVsbCwgY2IsICdyYXcnKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQgYSBzaW5nbGUgYnJhbmNoXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvYnJhbmNoZXMvI2dldC1icmFuY2hcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBicmFuY2ggLSB0aGUgbmFtZSBvZiB0aGUgYnJhbmNoIHRvIGZldGNoXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgYnJhbmNoIGZyb20gdGhlIEFQSVxuICAgICogQHJldHVybnMge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZ2V0QnJhbmNoKGJyYW5jaCwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9icmFuY2hlcy8ke2JyYW5jaH1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogR2V0IGEgY29tbWl0IGZyb20gdGhlIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9jb21taXRzLyNnZXQtYS1zaW5nbGUtY29tbWl0XG4gICAgKiBAcGFyYW0ge3N0cmluZ30gc2hhIC0gdGhlIHNoYSBmb3IgdGhlIGNvbW1pdCB0byBmZXRjaFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGNvbW1pdCBkYXRhXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldENvbW1pdChzaGEsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vZ2l0L2NvbW1pdHMvJHtzaGF9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIExpc3QgdGhlIGNvbW1pdHMgb24gYSByZXBvc2l0b3J5LCBvcHRpb25hbGx5IGZpbHRlcmluZyBieSBwYXRoLCBhdXRob3Igb3IgdGltZSByYW5nZVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2NvbW1pdHMvI2xpc3QtY29tbWl0cy1vbi1hLXJlcG9zaXRvcnlcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSB0aGUgZmlsdGVyaW5nIG9wdGlvbnMgZm9yIGNvbW1pdHNcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5zaGFdIC0gdGhlIFNIQSBvciBicmFuY2ggdG8gc3RhcnQgZnJvbVxuICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLnBhdGhdIC0gdGhlIHBhdGggdG8gc2VhcmNoIG9uXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuYXV0aG9yXSAtIHRoZSBjb21taXQgYXV0aG9yXG4gICAgKiBAcGFyYW0geyhEYXRlfHN0cmluZyl9IFtvcHRpb25zLnNpbmNlXSAtIG9ubHkgY29tbWl0cyBhZnRlciB0aGlzIGRhdGUgd2lsbCBiZSByZXR1cm5lZFxuICAgICogQHBhcmFtIHsoRGF0ZXxzdHJpbmcpfSBbb3B0aW9ucy51bnRpbF0gLSBvbmx5IGNvbW1pdHMgYmVmb3JlIHRoaXMgZGF0ZSB3aWxsIGJlIHJldHVybmVkXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbGlzdCBvZiBjb21taXRzIGZvdW5kIG1hdGNoaW5nIHRoZSBjcml0ZXJpYVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBsaXN0Q29tbWl0cyhvcHRpb25zLCBjYikge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIG9wdGlvbnMuc2luY2UgPSB0aGlzLl9kYXRlVG9JU08ob3B0aW9ucy5zaW5jZSk7XG4gICAgICBvcHRpb25zLnVudGlsID0gdGhpcy5fZGF0ZVRvSVNPKG9wdGlvbnMudW50aWwpO1xuXG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vY29tbWl0c2AsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBzaW5nbGUgY29tbWl0IGluZm9ybWF0aW9uIGZvciBhIHJlcG9zaXRvcnlcbiAgICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvY29tbWl0cy8jZ2V0LWEtc2luZ2xlLWNvbW1pdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWYgLSB0aGUgcmVmZXJlbmNlIGZvciB0aGUgY29tbWl0LWlzaFxuICAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBjb21taXQgaW5mb3JtYXRpb25cbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgICovXG4gICBnZXRTaW5nbGVDb21taXQocmVmLCBjYikge1xuICAgICAgcmVmID0gcmVmIHx8ICcnO1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2NvbW1pdHMvJHtyZWZ9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCB0aGEgc2hhIGZvciBhIHBhcnRpY3VsYXIgb2JqZWN0IGluIHRoZSByZXBvc2l0b3J5LiBUaGlzIGlzIGEgY29udmVuaWVuY2UgZnVuY3Rpb25cbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9jb250ZW50cy8jZ2V0LWNvbnRlbnRzXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW2JyYW5jaF0gLSB0aGUgYnJhbmNoIHRvIGxvb2sgaW4sIG9yIHRoZSByZXBvc2l0b3J5J3MgZGVmYXVsdCBicmFuY2ggaWYgb21pdHRlZFxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSB0aGUgcGF0aCBvZiB0aGUgZmlsZSBvciBkaXJlY3RvcnlcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIGEgZGVzY3JpcHRpb24gb2YgdGhlIHJlcXVlc3RlZCBvYmplY3QsIGluY2x1ZGluZyBhIGBTSEFgIHByb3BlcnR5XG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldFNoYShicmFuY2gsIHBhdGgsIGNiKSB7XG4gICAgICBicmFuY2ggPSBicmFuY2ggPyBgP3JlZj0ke2JyYW5jaH1gIDogJyc7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vY29udGVudHMvJHtwYXRofSR7YnJhbmNofWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBMaXN0IHRoZSBjb21taXQgc3RhdHVzZXMgZm9yIGEgcGFydGljdWxhciBzaGEsIGJyYW5jaCwgb3IgdGFnXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3Mvc3RhdHVzZXMvI2xpc3Qtc3RhdHVzZXMtZm9yLWEtc3BlY2lmaWMtcmVmXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gc2hhIC0gdGhlIHNoYSwgYnJhbmNoLCBvciB0YWcgdG8gZ2V0IHN0YXR1c2VzIGZvclxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGxpc3Qgb2Ygc3RhdHVzZXNcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgbGlzdFN0YXR1c2VzKHNoYSwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9jb21taXRzLyR7c2hhfS9zdGF0dXNlc2AsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQgYSBkZXNjcmlwdGlvbiBvZiBhIGdpdCB0cmVlXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2l0L3RyZWVzLyNnZXQtYS10cmVlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gdHJlZVNIQSAtIHRoZSBTSEEgb2YgdGhlIHRyZWUgdG8gZmV0Y2hcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBjYWxsYmFjayBkYXRhXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldFRyZWUodHJlZVNIQSwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9naXQvdHJlZXMvJHt0cmVlU0hBfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGUgYSBibG9iXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2l0L2Jsb2JzLyNjcmVhdGUtYS1ibG9iXG4gICAgKiBAcGFyYW0geyhzdHJpbmd8QnVmZmVyfEJsb2IpfSBjb250ZW50IC0gdGhlIGNvbnRlbnQgdG8gYWRkIHRvIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgZGV0YWlscyBvZiB0aGUgY3JlYXRlZCBibG9iXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGNyZWF0ZUJsb2IoY29udGVudCwgY2IpIHtcbiAgICAgIGxldCBwb3N0Qm9keSA9IHRoaXMuX2dldENvbnRlbnRPYmplY3QoY29udGVudCk7XG5cbiAgICAgIGxvZygnc2VuZGluZyBjb250ZW50JywgcG9zdEJvZHkpO1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BPU1QnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9naXQvYmxvYnNgLCBwb3N0Qm9keSwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCB0aGUgb2JqZWN0IHRoYXQgcmVwcmVzZW50cyB0aGUgcHJvdmlkZWQgY29udGVudFxuICAgICogQHBhcmFtIHtzdHJpbmd8QnVmZmVyfEJsb2J9IGNvbnRlbnQgLSB0aGUgY29udGVudCB0byBzZW5kIHRvIHRoZSBzZXJ2ZXJcbiAgICAqIEByZXR1cm4ge09iamVjdH0gdGhlIHJlcHJlc2VudGF0aW9uIG9mIGBjb250ZW50YCBmb3IgdGhlIEdpdEh1YiBBUElcbiAgICAqL1xuICAgX2dldENvbnRlbnRPYmplY3QoY29udGVudCkge1xuICAgICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgbG9nKCdjb250ZXQgaXMgYSBzdHJpbmcnKTtcbiAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb250ZW50OiBVdGY4LmVuY29kZShjb250ZW50KSxcbiAgICAgICAgICAgIGVuY29kaW5nOiAndXRmLTgnXG4gICAgICAgICB9O1xuXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIGNvbnRlbnQgaW5zdGFuY2VvZiBCdWZmZXIpIHtcbiAgICAgICAgIGxvZygnV2UgYXBwZWFyIHRvIGJlIGluIE5vZGUnKTtcbiAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb250ZW50OiBjb250ZW50LnRvU3RyaW5nKCdiYXNlNjQnKSxcbiAgICAgICAgICAgIGVuY29kaW5nOiAnYmFzZTY0J1xuICAgICAgICAgfTtcblxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgQmxvYiAhPT0gJ3VuZGVmaW5lZCcgJiYgY29udGVudCBpbnN0YW5jZW9mIEJsb2IpIHtcbiAgICAgICAgIGxvZygnV2UgYXBwZWFyIHRvIGJlIGluIHRoZSBicm93c2VyJyk7XG4gICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29udGVudDogQmFzZTY0LmVuY29kZShjb250ZW50KSxcbiAgICAgICAgICAgIGVuY29kaW5nOiAnYmFzZTY0J1xuICAgICAgICAgfTtcblxuICAgICAgfSBlbHNlIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgICAgbG9nKGBOb3Qgc3VyZSB3aGF0IHRoaXMgY29udGVudCBpczogJHt0eXBlb2YgY29udGVudH0sICR7SlNPTi5zdHJpbmdpZnkoY29udGVudCl9YCk7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gY29udGVudCBwYXNzZWQgdG8gcG9zdEJsb2IuIE11c3QgYmUgc3RyaW5nIG9yIEJ1ZmZlciAobm9kZSkgb3IgQmxvYiAod2ViKScpO1xuICAgICAgfVxuICAgfVxuXG4gICAvKipcbiAgICAqIFVwZGF0ZSBhIHRyZWUgaW4gR2l0XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvZ2l0L3RyZWVzLyNjcmVhdGUtYS10cmVlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gYmFzZVRyZWVTSEEgLSB0aGUgU0hBIG9mIHRoZSB0cmVlIHRvIHVwZGF0ZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSB0aGUgcGF0aCBmb3IgdGhlIG5ldyBmaWxlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gYmxvYlNIQSAtIHRoZSBTSEEgZm9yIHRoZSBibG9iIHRvIHB1dCBhdCBgcGF0aGBcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBuZXcgdHJlZSB0aGF0IGlzIGNyZWF0ZWRcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqIEBkZXByZWNhdGVkIHVzZSB7QGxpbmsgUmVwb3NpdG9yeSNjcmVhdGVUcmVlfSBpbnN0ZWFkXG4gICAgKi9cbiAgIHVwZGF0ZVRyZWUoYmFzZVRyZWVTSEEsIHBhdGgsIGJsb2JTSEEsIGNiKSB7XG4gICAgICBsZXQgbmV3VHJlZSA9IHtcbiAgICAgICAgIGJhc2VfdHJlZTogYmFzZVRyZWVTSEEsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgIHRyZWU6IFt7XG4gICAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgICAgc2hhOiBibG9iU0hBLFxuICAgICAgICAgICAgbW9kZTogJzEwMDY0NCcsXG4gICAgICAgICAgICB0eXBlOiAnYmxvYidcbiAgICAgICAgIH1dXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2dpdC90cmVlc2AsIG5ld1RyZWUsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGUgYSBuZXcgdHJlZSBpbiBnaXRcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXQvdHJlZXMvI2NyZWF0ZS1hLXRyZWVcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSB0cmVlIC0gdGhlIHRyZWUgdG8gY3JlYXRlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gYmFzZVNIQSAtIHRoZSByb290IHNoYSBvZiB0aGUgdHJlZVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIG5ldyB0cmVlIHRoYXQgaXMgY3JlYXRlZFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBjcmVhdGVUcmVlKHRyZWUsIGJhc2VTSEEsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2dpdC90cmVlc2AsIHtcbiAgICAgICAgIHRyZWUsXG4gICAgICAgICBiYXNlX3RyZWU6IGJhc2VTSEEgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgfSwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEFkZCBhIGNvbW1pdCB0byB0aGUgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2dpdC9jb21taXRzLyNjcmVhdGUtYS1jb21taXRcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXJlbnQgLSB0aGUgU0hBIG9mIHRoZSBwYXJlbnQgY29tbWl0XG4gICAgKiBAcGFyYW0ge3N0cmluZ30gdHJlZSAtIHRoZSBTSEEgb2YgdGhlIHRyZWUgZm9yIHRoaXMgY29tbWl0XG4gICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSAtIHRoZSBjb21taXQgbWVzc2FnZVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGNvbW1pdCB0aGF0IGlzIGNyZWF0ZWRcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgY29tbWl0KHBhcmVudCwgdHJlZSwgbWVzc2FnZSwgY2IpIHtcbiAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgIHRyZWUsXG4gICAgICAgICBwYXJlbnRzOiBbcGFyZW50XVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BPU1QnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9naXQvY29tbWl0c2AsIGRhdGEsIGNiKVxuICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9fY3VycmVudFRyZWUuc2hhID0gcmVzcG9uc2UuZGF0YS5zaGE7IC8vIFVwZGF0ZSBsYXRlc3QgY29tbWl0XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICB9KTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBVcGRhdGUgYSByZWZcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9naXQvcmVmcy8jdXBkYXRlLWEtcmVmZXJlbmNlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcmVmIC0gdGhlIHJlZiB0byB1cGRhdGVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb21taXRTSEEgLSB0aGUgU0hBIHRvIHBvaW50IHRoZSByZWZlcmVuY2UgdG9cbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBpbmRpY2F0ZXMgd2hldGhlciB0byBmb3JjZSBvciBlbnN1cmUgYSBmYXN0LWZvcndhcmQgdXBkYXRlXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgdXBkYXRlZCByZWYgYmFja1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICB1cGRhdGVIZWFkKHJlZiwgY29tbWl0U0hBLCBmb3JjZSwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQQVRDSCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2dpdC9yZWZzLyR7cmVmfWAsIHtcbiAgICAgICAgIHNoYTogY29tbWl0U0hBLFxuICAgICAgICAgZm9yY2U6IGZvcmNlXG4gICAgICB9LCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogR2V0IGluZm9ybWF0aW9uIGFib3V0IHRoZSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvI2dldFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGluZm9ybWF0aW9uIGFib3V0IHRoZSByZXBvc2l0b3J5XG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldERldGFpbHMoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBMaXN0IHRoZSBjb250cmlidXRvcnMgdG8gdGhlIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy8jbGlzdC1jb250cmlidXRvcnNcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBsaXN0IG9mIGNvbnRyaWJ1dG9yc1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBnZXRDb250cmlidXRvcnMoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9zdGF0cy9jb250cmlidXRvcnNgLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogTGlzdCB0aGUgdXNlcnMgd2hvIGFyZSBjb2xsYWJvcmF0b3JzIG9uIHRoZSByZXBvc2l0b3J5LiBUaGUgY3VycmVudGx5IGF1dGhlbnRpY2F0ZWQgdXNlciBtdXN0IGhhdmVcbiAgICAqIHB1c2ggYWNjZXNzIHRvIHVzZSB0aGlzIG1ldGhvZFxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2NvbGxhYm9yYXRvcnMvI2xpc3QtY29sbGFib3JhdG9yc1xuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGxpc3Qgb2YgY29sbGFib3JhdG9yc1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBnZXRDb2xsYWJvcmF0b3JzKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vY29sbGFib3JhdG9yc2AsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDaGVjayBpZiBhIHVzZXIgaXMgYSBjb2xsYWJvcmF0b3Igb24gdGhlIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9jb2xsYWJvcmF0b3JzLyNjaGVjay1pZi1hLXVzZXItaXMtYS1jb2xsYWJvcmF0b3JcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSB1c2VybmFtZSAtIHRoZSB1c2VyIHRvIGNoZWNrXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0cnVlIGlmIHRoZSB1c2VyIGlzIGEgY29sbGFib3JhdG9yIGFuZCBmYWxzZSBpZiB0aGV5IGFyZSBub3RcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3Qge0Jvb2xlYW59IFtkZXNjcmlwdGlvbl1cbiAgICAqL1xuICAgaXNDb2xsYWJvcmF0b3IodXNlcm5hbWUsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vY29sbGFib3JhdG9ycy8ke3VzZXJuYW1lfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQgdGhlIGNvbnRlbnRzIG9mIGEgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2NvbnRlbnRzLyNnZXQtY29udGVudHNcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWYgLSB0aGUgcmVmIHRvIGNoZWNrXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIHRoZSBwYXRoIGNvbnRhaW5pbmcgdGhlIGNvbnRlbnQgdG8gZmV0Y2hcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmF3IC0gYHRydWVgIGlmIHRoZSByZXN1bHRzIHNob3VsZCBiZSByZXR1cm5lZCByYXcgaW5zdGVhZCBvZiBHaXRIdWIncyBub3JtYWxpemVkIGZvcm1hdFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGZldGNoZWQgZGF0YVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBnZXRDb250ZW50cyhyZWYsIHBhdGgsIHJhdywgY2IpIHtcbiAgICAgIHBhdGggPSBwYXRoID8gYCR7ZW5jb2RlVVJJKHBhdGgpfWAgOiAnJztcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9jb250ZW50cy8ke3BhdGh9YCwge1xuICAgICAgICAgcmVmXG4gICAgICB9LCBjYiwgcmF3KTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQgdGhlIFJFQURNRSBvZiBhIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9jb250ZW50cy8jZ2V0LXRoZS1yZWFkbWVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWYgLSB0aGUgcmVmIHRvIGNoZWNrXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJhdyAtIGB0cnVlYCBpZiB0aGUgcmVzdWx0cyBzaG91bGQgYmUgcmV0dXJuZWQgcmF3IGluc3RlYWQgb2YgR2l0SHViJ3Mgbm9ybWFsaXplZCBmb3JtYXRcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBmZXRjaGVkIGRhdGFcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZ2V0UmVhZG1lKHJlZiwgcmF3LCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3JlYWRtZWAsIHtcbiAgICAgICAgIHJlZlxuICAgICAgfSwgY2IsIHJhdyk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRm9yayBhIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9mb3Jrcy8jY3JlYXRlLWEtZm9ya1xuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBuZXdseSBjcmVhdGVkIGZvcmtcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZm9yayhjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BPU1QnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9mb3Jrc2AsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBMaXN0IGEgcmVwb3NpdG9yeSdzIGZvcmtzXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvZm9ya3MvI2xpc3QtZm9ya3NcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBsaXN0IG9mIHJlcG9zaXRvcmllcyBmb3JrZWQgZnJvbSB0aGlzIG9uZVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBsaXN0Rm9ya3MoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9mb3Jrc2AsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGUgYSBuZXcgYnJhbmNoIGZyb20gYW4gZXhpc3RpbmcgYnJhbmNoLlxuICAgICogQHBhcmFtIHtzdHJpbmd9IFtvbGRCcmFuY2g9bWFzdGVyXSAtIHRoZSBuYW1lIG9mIHRoZSBleGlzdGluZyBicmFuY2hcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBuZXdCcmFuY2ggLSB0aGUgbmFtZSBvZiB0aGUgbmV3IGJyYW5jaFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGNvbW1pdCBkYXRhIGZvciB0aGUgaGVhZCBvZiB0aGUgbmV3IGJyYW5jaFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBjcmVhdGVCcmFuY2gob2xkQnJhbmNoLCBuZXdCcmFuY2gsIGNiKSB7XG4gICAgICBpZiAodHlwZW9mIG5ld0JyYW5jaCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgY2IgPSBuZXdCcmFuY2g7XG4gICAgICAgICBuZXdCcmFuY2ggPSBvbGRCcmFuY2g7XG4gICAgICAgICBvbGRCcmFuY2ggPSAnbWFzdGVyJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVmKGBoZWFkcy8ke29sZEJyYW5jaH1gKVxuICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBsZXQgc2hhID0gcmVzcG9uc2UuZGF0YS5vYmplY3Quc2hhO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUmVmKHtcbiAgICAgICAgICAgICAgIHNoYSxcbiAgICAgICAgICAgICAgIHJlZjogYHJlZnMvaGVhZHMvJHtuZXdCcmFuY2h9YFxuICAgICAgICAgICAgfSwgY2IpO1xuICAgICAgICAgfSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgbmV3IHB1bGwgcmVxdWVzdFxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3B1bGxzLyNjcmVhdGUtYS1wdWxsLXJlcXVlc3RcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdGhlIHB1bGwgcmVxdWVzdCBkZXNjcmlwdGlvblxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIG5ldyBwdWxsIHJlcXVlc3RcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgY3JlYXRlUHVsbFJlcXVlc3Qob3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQT1NUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHVsbHNgLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogVXBkYXRlIGEgcHVsbCByZXF1ZXN0XG4gICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDIuNC4wXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcHVsbHMvI3VwZGF0ZS1hLXB1bGwtcmVxdWVzdFxuICAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfSBudW1iZXIgLSB0aGUgbnVtYmVyIG9mIHRoZSBwdWxsIHJlcXVlc3QgdG8gdXBkYXRlXG4gICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIHRoZSBwdWxsIHJlcXVlc3QgZGVzY3JpcHRpb25cbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdGhlIHB1bGwgcmVxdWVzdCBpbmZvcm1hdGlvblxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICB1cGRhdGVQdWxsUmVxdXN0KG51bWJlciwgb3B0aW9ucywgY2IpIHtcbiAgICAgIGxvZygnRGVwcmVjYXRlZDogVGhpcyBtZXRob2QgY29udGFpbnMgYSB0eXBvIGFuZCBpdCBoYXMgYmVlbiBkZXByZWNhdGVkLiBJdCB3aWxsIGJlIHJlbW92ZWQgaW4gbmV4dCBtYWpvciB2ZXJzaW9uLiBVc2UgdXBkYXRlUHVsbFJlcXVlc3QoKSBpbnN0ZWFkLicpO1xuXG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVQdWxsUmVxdWVzdChudW1iZXIsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBVcGRhdGUgYSBwdWxsIHJlcXVlc3RcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9wdWxscy8jdXBkYXRlLWEtcHVsbC1yZXF1ZXN0XG4gICAgKiBAcGFyYW0ge251bWJlcnxzdHJpbmd9IG51bWJlciAtIHRoZSBudW1iZXIgb2YgdGhlIHB1bGwgcmVxdWVzdCB0byB1cGRhdGVcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdGhlIHB1bGwgcmVxdWVzdCBkZXNjcmlwdGlvblxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gW2NiXSAtIHdpbGwgcmVjZWl2ZSB0aGUgcHVsbCByZXF1ZXN0IGluZm9ybWF0aW9uXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIHVwZGF0ZVB1bGxSZXF1ZXN0KG51bWJlciwgb3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQQVRDSCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3B1bGxzLyR7bnVtYmVyfWAsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBMaXN0IHRoZSBob29rcyBmb3IgdGhlIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9ob29rcy8jbGlzdC1ob29rc1xuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGxpc3Qgb2YgaG9va3NcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgbGlzdEhvb2tzKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vaG9va3NgLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogR2V0IGEgaG9vayBmb3IgdGhlIHJlcG9zaXRvcnlcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9ob29rcy8jZ2V0LXNpbmdsZS1ob29rXG4gICAgKiBAcGFyYW0ge251bWJlcn0gaWQgLSB0aGUgaWQgb2YgdGhlIHdlYm9va1xuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGRldGFpbHMgb2YgdGhlIHdlYm9va1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBnZXRIb29rKGlkLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2hvb2tzLyR7aWR9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEFkZCBhIG5ldyBob29rIHRvIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvaG9va3MvI2NyZWF0ZS1hLWhvb2tcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdGhlIGNvbmZpZ3VyYXRpb24gZGVzY3JpYmluZyB0aGUgbmV3IGhvb2tcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBuZXcgd2ViaG9va1xuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBjcmVhdGVIb29rKG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2hvb2tzYCwgb3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEVkaXQgYW4gZXhpc3Rpbmcgd2ViaG9va1xuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2hvb2tzLyNlZGl0LWEtaG9va1xuICAgICogQHBhcmFtIHtudW1iZXJ9IGlkIC0gdGhlIGlkIG9mIHRoZSB3ZWJob29rXG4gICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIHRoZSBuZXcgZGVzY3JpcHRpb24gb2YgdGhlIHdlYmhvb2tcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSB1cGRhdGVkIHdlYmhvb2tcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgdXBkYXRlSG9vayhpZCwgb3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQQVRDSCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2hvb2tzLyR7aWR9YCwgb3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIERlbGV0ZSBhIHdlYmhvb2tcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9ob29rcy8jZGVsZXRlLWEtaG9va1xuICAgICogQHBhcmFtIHtudW1iZXJ9IGlkIC0gdGhlIGlkIG9mIHRoZSB3ZWJob29rIHRvIGJlIGRlbGV0ZWRcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIGNhbGwgaXMgc3VjY2Vzc2Z1bFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBkZWxldGVIb29rKGlkLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0RFTEVURScsIGAke3RoaXMuX19mdWxsbmFtZX0vaG9va3MvJHtpZH1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogTGlzdCB0aGUgZGVwbG95IGtleXMgZm9yIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3Mva2V5cy8jbGlzdC1kZXBsb3kta2V5c1xuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGxpc3Qgb2YgZGVwbG95IGtleXNcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgbGlzdEtleXMoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9rZXlzYCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCBhIGRlcGxveSBrZXkgZm9yIHRoZSByZXBvc2l0b3J5XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3Mva2V5cy8jZ2V0LWEtZGVwbG95LWtleVxuICAgICogQHBhcmFtIHtudW1iZXJ9IGlkIC0gdGhlIGlkIG9mIHRoZSBkZXBsb3kga2V5XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgZGV0YWlscyBvZiB0aGUgZGVwbG95IGtleVxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBnZXRLZXkoaWQsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0va2V5cy8ke2lkfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBBZGQgYSBuZXcgZGVwbG95IGtleSB0byB0aGUgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2tleXMvI2FkZC1hLW5ldy1kZXBsb3kta2V5XG4gICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIHRoZSBjb25maWd1cmF0aW9uIGRlc2NyaWJpbmcgdGhlIG5ldyBkZXBsb3kga2V5XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbmV3IGRlcGxveSBrZXlcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgY3JlYXRlS2V5KG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2tleXNgLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRGVsZXRlIGEgZGVwbG95IGtleVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2tleXMvI3JlbW92ZS1hLWRlcGxveS1rZXlcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBpZCAtIHRoZSBpZCBvZiB0aGUgZGVwbG95IGtleSB0byBiZSBkZWxldGVkXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0cnVlIGlmIHRoZSBjYWxsIGlzIHN1Y2Nlc3NmdWxcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZGVsZXRlS2V5KGlkLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0RFTEVURScsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2tleXMvJHtpZH1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRGVsZXRlIGEgZmlsZSBmcm9tIGEgYnJhbmNoXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvY29udGVudHMvI2RlbGV0ZS1hLWZpbGVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBicmFuY2ggLSB0aGUgYnJhbmNoIHRvIGRlbGV0ZSBmcm9tLCBvciB0aGUgZGVmYXVsdCBicmFuY2ggaWYgbm90IHNwZWNpZmllZFxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSB0aGUgcGF0aCBvZiB0aGUgZmlsZSB0byByZW1vdmVcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBjb21taXQgaW4gd2hpY2ggdGhlIGRlbGV0ZSBvY2N1cnJlZFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBkZWxldGVGaWxlKGJyYW5jaCwgcGF0aCwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFNoYShicmFuY2gsIHBhdGgpXG4gICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRlbGV0ZUNvbW1pdCA9IHtcbiAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBEZWxldGUgdGhlIGZpbGUgYXQgJyR7cGF0aH0nYCxcbiAgICAgICAgICAgICAgIHNoYTogcmVzcG9uc2UuZGF0YS5zaGEsXG4gICAgICAgICAgICAgICBicmFuY2hcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnREVMRVRFJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vY29udGVudHMvJHtwYXRofWAsIGRlbGV0ZUNvbW1pdCwgY2IpO1xuICAgICAgICAgfSk7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ2hhbmdlIGFsbCByZWZlcmVuY2VzIGluIGEgcmVwbyBmcm9tIG9sZFBhdGggdG8gbmV3X3BhdGhcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBicmFuY2ggLSB0aGUgYnJhbmNoIHRvIGNhcnJ5IG91dCB0aGUgcmVmZXJlbmNlIGNoYW5nZSwgb3IgdGhlIGRlZmF1bHQgYnJhbmNoIGlmIG5vdCBzcGVjaWZpZWRcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBvbGRQYXRoIC0gb3JpZ2luYWwgcGF0aFxuICAgICogQHBhcmFtIHtzdHJpbmd9IG5ld1BhdGggLSBuZXcgcmVmZXJlbmNlIHBhdGhcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBjb21taXQgaW4gd2hpY2ggdGhlIG1vdmUgb2NjdXJyZWRcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgbW92ZShicmFuY2gsIG9sZFBhdGgsIG5ld1BhdGgsIGNiKSB7XG4gICAgICBsZXQgb2xkU2hhO1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVmKGBoZWFkcy8ke2JyYW5jaH1gKVxuICAgICAgICAgLnRoZW4oKHtkYXRhOiB7b2JqZWN0fX0pID0+IHRoaXMuZ2V0VHJlZShgJHtvYmplY3Quc2hhfT9yZWN1cnNpdmU9dHJ1ZWApKVxuICAgICAgICAgLnRoZW4oKHtkYXRhOiB7dHJlZSwgc2hhfX0pID0+IHtcbiAgICAgICAgICAgIG9sZFNoYSA9IHNoYTtcbiAgICAgICAgICAgIGxldCBuZXdUcmVlID0gdHJlZS5tYXAoKHJlZikgPT4ge1xuICAgICAgICAgICAgICAgaWYgKHJlZi5wYXRoID09PSBvbGRQYXRoKSB7XG4gICAgICAgICAgICAgICAgICByZWYucGF0aCA9IG5ld1BhdGg7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICBpZiAocmVmLnR5cGUgPT09ICd0cmVlJykge1xuICAgICAgICAgICAgICAgICAgZGVsZXRlIHJlZi5zaGE7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICByZXR1cm4gcmVmO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVUcmVlKG5ld1RyZWUpO1xuICAgICAgICAgfSlcbiAgICAgICAgIC50aGVuKCh7ZGF0YTogdHJlZX0pID0+IHRoaXMuY29tbWl0KG9sZFNoYSwgdHJlZS5zaGEsIGBSZW5hbWVkICcke29sZFBhdGh9JyB0byAnJHtuZXdQYXRofSdgKSlcbiAgICAgICAgIC50aGVuKCh7ZGF0YTogY29tbWl0fSkgPT4gdGhpcy51cGRhdGVIZWFkKGBoZWFkcy8ke2JyYW5jaH1gLCBjb21taXQuc2hhLCB0cnVlLCBjYikpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIFdyaXRlIGEgZmlsZSB0byB0aGUgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL2NvbnRlbnRzLyN1cGRhdGUtYS1maWxlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gYnJhbmNoIC0gdGhlIG5hbWUgb2YgdGhlIGJyYW5jaFxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSB0aGUgcGF0aCBmb3IgdGhlIGZpbGVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50IC0gdGhlIGNvbnRlbnRzIG9mIHRoZSBmaWxlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSAtIHRoZSBjb21taXQgbWVzc2FnZVxuICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIGNvbW1pdCBvcHRpb25zXG4gICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuYXV0aG9yXSAtIHRoZSBhdXRob3Igb2YgdGhlIGNvbW1pdFxuICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmNvbW1pdGVyXSAtIHRoZSBjb21taXR0ZXJcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuZW5jb2RlXSAtIHRydWUgaWYgdGhlIGNvbnRlbnQgc2hvdWxkIGJlIGJhc2U2NCBlbmNvZGVkXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbmV3IGNvbW1pdFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICB3cml0ZUZpbGUoYnJhbmNoLCBwYXRoLCBjb250ZW50LCBtZXNzYWdlLCBvcHRpb25zLCBjYikge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICBjYiA9IG9wdGlvbnM7XG4gICAgICAgICBvcHRpb25zID0ge307XG4gICAgICB9XG4gICAgICBsZXQgZmlsZVBhdGggPSBwYXRoID8gZW5jb2RlVVJJKHBhdGgpIDogJyc7XG4gICAgICBsZXQgc2hvdWxkRW5jb2RlID0gb3B0aW9ucy5lbmNvZGUgIT09IGZhbHNlO1xuICAgICAgbGV0IGNvbW1pdCA9IHtcbiAgICAgICAgIGJyYW5jaCxcbiAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICBhdXRob3I6IG9wdGlvbnMuYXV0aG9yLFxuICAgICAgICAgY29tbWl0dGVyOiBvcHRpb25zLmNvbW1pdHRlcixcbiAgICAgICAgIGNvbnRlbnQ6IHNob3VsZEVuY29kZSA/IEJhc2U2NC5lbmNvZGUoY29udGVudCkgOiBjb250ZW50XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gdGhpcy5nZXRTaGEoYnJhbmNoLCBmaWxlUGF0aClcbiAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgY29tbWl0LnNoYSA9IHJlc3BvbnNlLmRhdGEuc2hhO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BVVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L2NvbnRlbnRzLyR7ZmlsZVBhdGh9YCwgY29tbWl0LCBjYik7XG4gICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUFVUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vY29udGVudHMvJHtmaWxlUGF0aH1gLCBjb21taXQsIGNiKTtcbiAgICAgICAgIH0pO1xuICAgfVxuXG4gICAvKipcbiAgICAqIENoZWNrIGlmIGEgcmVwb3NpdG9yeSBpcyBzdGFycmVkIGJ5IHlvdVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2FjdGl2aXR5L3N0YXJyaW5nLyNjaGVjay1pZi15b3UtYXJlLXN0YXJyaW5nLWEtcmVwb3NpdG9yeVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdHJ1ZSBpZiB0aGUgcmVwb3NpdG9yeSBpcyBzdGFycmVkIGFuZCBmYWxzZSBpZiB0aGUgcmVwb3NpdG9yeVxuICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXMgbm90IHN0YXJyZWRcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3Qge0Jvb2xlYW59IFtkZXNjcmlwdGlvbl1cbiAgICAqL1xuICAgaXNTdGFycmVkKGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdDIwNG9yNDA0KGAvdXNlci9zdGFycmVkLyR7dGhpcy5fX2Z1bGxuYW1lfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBTdGFyIGEgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2FjdGl2aXR5L3N0YXJyaW5nLyNzdGFyLWEtcmVwb3NpdG9yeVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdHJ1ZSBpZiB0aGUgcmVwb3NpdG9yeSBpcyBzdGFycmVkXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIHN0YXIoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQVVQnLCBgL3VzZXIvc3RhcnJlZC8ke3RoaXMuX19mdWxsbmFtZX1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogVW5zdGFyIGEgcmVwb3NpdG9yeVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2FjdGl2aXR5L3N0YXJyaW5nLyN1bnN0YXItYS1yZXBvc2l0b3J5XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0cnVlIGlmIHRoZSByZXBvc2l0b3J5IGlzIHVuc3RhcnJlZFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICB1bnN0YXIoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdERUxFVEUnLCBgL3VzZXIvc3RhcnJlZC8ke3RoaXMuX19mdWxsbmFtZX1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgbmV3IHJlbGVhc2VcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9yZWxlYXNlcy8jY3JlYXRlLWEtcmVsZWFzZVxuICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGUgZGVzY3JpcHRpb24gb2YgdGhlIHJlbGVhc2VcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBuZXdseSBjcmVhdGVkIHJlbGVhc2VcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgY3JlYXRlUmVsZWFzZShvcHRpb25zLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BPU1QnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9yZWxlYXNlc2AsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBFZGl0IGEgcmVsZWFzZVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL3JlbGVhc2VzLyNlZGl0LWEtcmVsZWFzZVxuICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gdGhlIGlkIG9mIHRoZSByZWxlYXNlXG4gICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIHRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgcmVsZWFzZVxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIG1vZGlmaWVkIHJlbGVhc2VcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgdXBkYXRlUmVsZWFzZShpZCwgb3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQQVRDSCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3JlbGVhc2VzLyR7aWR9YCwgb3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCBpbmZvcm1hdGlvbiBhYm91dCBhbGwgcmVsZWFzZXNcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9yZWxlYXNlcy8jbGlzdC1yZWxlYXNlcy1mb3ItYS1yZXBvc2l0b3J5XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgcmVsZWFzZSBpbmZvcm1hdGlvblxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBsaXN0UmVsZWFzZXMoY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9yZWxlYXNlc2AsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQgaW5mb3JtYXRpb24gYWJvdXQgYSByZWxlYXNlXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcmVsZWFzZXMvI2dldC1hLXNpbmdsZS1yZWxlYXNlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgLSB0aGUgaWQgb2YgdGhlIHJlbGVhc2VcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSByZWxlYXNlIGluZm9ybWF0aW9uXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldFJlbGVhc2UoaWQsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcmVsZWFzZXMvJHtpZH1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogRGVsZXRlIGEgcmVsZWFzZVxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL3JlbGVhc2VzLyNkZWxldGUtYS1yZWxlYXNlXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgLSB0aGUgcmVsZWFzZSB0byBiZSBkZWxldGVkXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0cnVlIGlmIHRoZSBvcGVyYXRpb24gaXMgc3VjY2Vzc2Z1bFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBkZWxldGVSZWxlYXNlKGlkLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0RFTEVURScsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3JlbGVhc2VzLyR7aWR9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIE1lcmdlIGEgcHVsbCByZXF1ZXN0XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcHVsbHMvI21lcmdlLWEtcHVsbC1yZXF1ZXN0LW1lcmdlLWJ1dHRvblxuICAgICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfSBudW1iZXIgLSB0aGUgbnVtYmVyIG9mIHRoZSBwdWxsIHJlcXVlc3QgdG8gbWVyZ2VcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdGhlIG1lcmdlIG9wdGlvbnMgZm9yIHRoZSBwdWxsIHJlcXVlc3RcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdGhlIG1lcmdlIGluZm9ybWF0aW9uIGlmIHRoZSBvcGVyYXRpb24gaXMgc3VjY2Vzc2Z1bFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBtZXJnZVB1bGxSZXF1ZXN0KG51bWJlciwgb3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQVVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9wdWxscy8ke251bWJlcn0vbWVyZ2VgLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogR2V0IGluZm9ybWF0aW9uIGFib3V0IGFsbCBwcm9qZWN0c1xuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL3Byb2plY3RzLyNsaXN0LXByb2plY3RzXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSBsaXN0IG9mIHByb2plY3RzXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGxpc3RQcm9qZWN0cyhjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3Byb2plY3RzYCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCBpbmZvcm1hdGlvbiBhYm91dCBhIHByb2plY3RcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9wcm9qZWN0cy8jbGlzdC1hLXByb2plY3RcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9qZWN0TnVtYmVyIC0gdGhlIG51bWJlciBvZiB0aGUgcHJvamVjdFxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIHByb2plY3QgaW5mb3JtYXRpb25cbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgZ2V0UHJvamVjdChwcm9qZWN0TnVtYmVyLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0dFVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3Byb2plY3RzLyR7cHJvamVjdE51bWJlcn1gLCBudWxsLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlIGEgbmV3IHByb2plY3RcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9wcm9qZWN0cy8jY3JlYXRlLWEtcHJvamVjdFxuICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGUgZGVzY3JpcHRpb24gb2YgdGhlIHByb2plY3RcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBuZXdseSBjcmVhdGVkIHByb2plY3RcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgY3JlYXRlUHJvamVjdChvcHRpb25zLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BPU1QnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9wcm9qZWN0c2AsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBFZGl0IGEgcHJvamVjdFxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL3Byb2plY3RzLyN1cGRhdGUtYS1wcm9qZWN0XG4gICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvamVjdE51bWJlciAtIHRoZSBudW1iZXIgb2YgdGhlIHByb2plY3RcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBwcm9qZWN0XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgbW9kaWZpZWQgcHJvamVjdFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICB1cGRhdGVQcm9qZWN0KHByb2plY3ROdW1iZXIsIG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUEFUQ0gnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9wcm9qZWN0cy8ke3Byb2plY3ROdW1iZXJ9YCwgb3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIERlbGV0ZSBhIHByb2plY3RcbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9wcm9qZWN0cy8jZGVsZXRlLWEtcHJvamVjdFxuICAgICogQHBhcmFtIHtzdHJpbmd9IHByb2plY3ROdW1iZXIgLSB0aGUgcHJvamVjdCB0byBiZSBkZWxldGVkXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0cnVlIGlmIHRoZSBvcGVyYXRpb24gaXMgc3VjY2Vzc2Z1bFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBkZWxldGVQcm9qZWN0KHByb2plY3ROdW1iZXIsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnREVMRVRFJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHJvamVjdHMvJHtwcm9qZWN0TnVtYmVyfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQgaW5mb3JtYXRpb24gYWJvdXQgYWxsIGNvbHVtbnMgb2YgYSBwcm9qZWN0XG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcHJvamVjdHMvI2xpc3QtY29sdW1uc1xuICAgICogQHBhcmFtIHtzdHJpbmd9IHByb2plY3ROdW1iZXIgLSB0aGUgbnVtYmVyIG9mIHRoZSBwcm9qZWN0XG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBbY2JdIC0gd2lsbCByZWNlaXZlIHRoZSBsaXN0IG9mIGNvbHVtbnNcbiAgICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIHByb21pc2UgZm9yIHRoZSBodHRwIHJlcXVlc3RcbiAgICAqL1xuICAgbGlzdFByb2plY3RDb2x1bW5zKHByb2plY3ROdW1iZXIsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHJvamVjdHMvJHtwcm9qZWN0TnVtYmVyfS9jb2x1bW5zYCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCBpbmZvcm1hdGlvbiBhYm91dCBhIGNvbHVtblxuICAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL3Byb2plY3RzLyNnZXQtYS1jb2x1bW5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb2xJZCAtIHRoZSBpZCBvZiB0aGUgY29sdW1uXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0aGUgY29sdW1uIGluZm9ybWF0aW9uXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGdldFByb2plY3RDb2x1bW4oY29sSWQsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHJvamVjdHMvY29sdW1ucy8ke2NvbElkfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGUgYSBuZXcgY29sdW1uXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcHJvamVjdHMvI2NyZWF0ZS1hLWNvbHVtblxuICAgICogQHBhcmFtIHtzdHJpbmd9IHByb2plY3ROdW1iZXIgLSB0aGUgcHJvamVjdCBudW1iZXJcbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBjb2x1bW5cbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRoZSBuZXdseSBjcmVhdGVkIGNvbHVtblxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBjcmVhdGVQcm9qZWN0Q29sdW1uKHByb2plY3ROdW1iZXIsIG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3Byb2plY3RzLyR7cHJvamVjdE51bWJlcn0vY29sdW1uc2AsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBFZGl0IGEgY29sdW1uXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcHJvamVjdHMvI3VwZGF0ZS1hLWNvbHVtblxuICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbElkIC0gdGhlIGNvbHVtbiBpZFxuICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGUgZGVzY3JpcHRpb24gb2YgdGhlIGNvbHVtblxuICAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIG1vZGlmaWVkIGNvbHVtblxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICB1cGRhdGVQcm9qZWN0Q29sdW1uKGNvbElkLCBvcHRpb25zLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ1BBVENIJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHJvamVjdHMvY29sdW1ucy8ke2NvbElkfWAsIG9wdGlvbnMsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBEZWxldGUgYSBjb2x1bW5cbiAgICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9wcm9qZWN0cy8jZGVsZXRlLWEtY29sdW1uXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gY29sSWQgLSB0aGUgY29sdW1uIHRvIGJlIGRlbGV0ZWRcbiAgICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IGNiIC0gd2lsbCByZWNlaXZlIHRydWUgaWYgdGhlIG9wZXJhdGlvbiBpcyBzdWNjZXNzZnVsXG4gICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAgKi9cbiAgIGRlbGV0ZVByb2plY3RDb2x1bW4oY29sSWQsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnREVMRVRFJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHJvamVjdHMvY29sdW1ucy8ke2NvbElkfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAgKiBNb3ZlIGEgY29sdW1uXG4gICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcHJvamVjdHMvI21vdmUtYS1jb2x1bW5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb2xJZCAtIHRoZSBjb2x1bW4gdG8gYmUgbW92ZWRcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwb3NpdGlvbiAtIGNhbiBiZSBvbmUgb2YgZmlyc3QsIGxhc3QsIG9yIGFmdGVyOjxjb2x1bW4taWQ+LFxuICAgICogd2hlcmUgPGNvbHVtbi1pZD4gaXMgdGhlIGlkIHZhbHVlIG9mIGEgY29sdW1uIGluIHRoZSBzYW1lIHByb2plY3QuXG4gICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0cnVlIGlmIHRoZSBvcGVyYXRpb24gaXMgc3VjY2Vzc2Z1bFxuICAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgICovXG4gICBtb3ZlUHJvamVjdENvbHVtbihjb2xJZCwgcG9zaXRpb24sIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdChcbiAgICAgICAgICdQT1NUJyxcbiAgICAgICAgIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3Byb2plY3RzL2NvbHVtbnMvJHtjb2xJZH0vbW92ZXNgLFxuICAgICAgICAge3Bvc2l0aW9uOiBwb3NpdGlvbn0sXG4gICAgICAgICBjYlxuICAgICAgKTtcbiAgIH1cblxuICAgLyoqXG4gICAqIEdldCBpbmZvcm1hdGlvbiBhYm91dCBhbGwgY2FyZHMgb2YgYSBjb2x1bW5cbiAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL3Byb2plY3RzLyNsaXN0LXByb2plY3RzLWNhcmRzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb2xJZCAtIHRoZSBpZCBvZiB0aGUgY29sdW1uXG4gICAqIEBwYXJhbSB7UmVxdWVzdGFibGUuY2FsbGJhY2t9IFtjYl0gLSB3aWxsIHJlY2VpdmUgdGhlIGxpc3Qgb2YgY2FyZHNcbiAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgKi9cbiAgIGxpc3RQcm9qZWN0Q2FyZHMoY29sSWQsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnR0VUJywgYC9yZXBvcy8ke3RoaXMuX19mdWxsbmFtZX0vcHJvamVjdHMvY29sdW1ucy8ke2NvbElkfS9jYXJkc2AsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAqIEdldCBpbmZvcm1hdGlvbiBhYm91dCBhIGNhcmRcbiAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL3Byb2plY3RzLyNsaXN0LWEtcHJvamVjdC1jYXJkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYXJkSWQgLSB0aGUgaWQgb2YgdGhlIGNhcmRcbiAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIGNhcmQgaW5mb3JtYXRpb25cbiAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgKi9cbiAgIGdldFByb2plY3RDYXJkKGNhcmRJZCwgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdHRVQnLCBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9wcm9qZWN0cy9jb2x1bW5zL2NhcmRzLyR7Y2FyZElkfWAsIG51bGwsIGNiKTtcbiAgIH1cblxuICAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBjYXJkXG4gICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9yZXBvcy9wcm9qZWN0cy8jY3JlYXRlLWEtcHJvamVjdC1jYXJkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb2xJZCAtIHRoZSBjb2x1bW4gaWRcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGUgZGVzY3JpcHRpb24gb2YgdGhlIGNhcmRcbiAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIG5ld2x5IGNyZWF0ZWQgY2FyZFxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAqL1xuICAgY3JlYXRlUHJvamVjdENhcmQoY29sSWQsIG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVxdWVzdCgnUE9TVCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3Byb2plY3RzL2NvbHVtbnMvJHtjb2xJZH0vY2FyZHNgLCBvcHRpb25zLCBjYik7XG4gICB9XG5cbiAgIC8qKlxuICAgKiBFZGl0IGEgY2FyZFxuICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcHJvamVjdHMvI3VwZGF0ZS1hLXByb2plY3QtY2FyZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FyZElkIC0gdGhlIGNhcmQgaWRcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGUgZGVzY3JpcHRpb24gb2YgdGhlIGNhcmRcbiAgICogQHBhcmFtIHtSZXF1ZXN0YWJsZS5jYWxsYmFja30gY2IgLSB3aWxsIHJlY2VpdmUgdGhlIG1vZGlmaWVkIGNhcmRcbiAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgcHJvbWlzZSBmb3IgdGhlIGh0dHAgcmVxdWVzdFxuICAgKi9cbiAgIHVwZGF0ZVByb2plY3RDYXJkKGNhcmRJZCwgb3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KCdQQVRDSCcsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3Byb2plY3RzL2NvbHVtbnMvY2FyZHMvJHtjYXJkSWR9YCwgb3B0aW9ucywgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICogRGVsZXRlIGEgY2FyZFxuICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVwb3MvcHJvamVjdHMvI2RlbGV0ZS1hLXByb2plY3QtY2FyZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FyZElkIC0gdGhlIGNhcmQgdG8gYmUgZGVsZXRlZFxuICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0cnVlIGlmIHRoZSBvcGVyYXRpb24gaXMgc3VjY2Vzc2Z1bFxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAqL1xuICAgZGVsZXRlUHJvamVjdENhcmQoY2FyZElkLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoJ0RFTEVURScsIGAvcmVwb3MvJHt0aGlzLl9fZnVsbG5hbWV9L3Byb2plY3RzL2NvbHVtbnMvY2FyZHMvJHtjYXJkSWR9YCwgbnVsbCwgY2IpO1xuICAgfVxuXG4gICAvKipcbiAgICogTW92ZSBhIGNhcmRcbiAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL3JlcG9zL3Byb2plY3RzLyNtb3ZlLWEtcHJvamVjdC1jYXJkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYXJkSWQgLSB0aGUgY2FyZCB0byBiZSBtb3ZlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcG9zaXRpb24gLSBjYW4gYmUgb25lIG9mIHRvcCwgYm90dG9tLCBvciBhZnRlcjo8Y2FyZC1pZD4sXG4gICAqIHdoZXJlIDxjYXJkLWlkPiBpcyB0aGUgaWQgdmFsdWUgb2YgYSBjYXJkIGluIHRoZSBzYW1lIHByb2plY3QuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb2xJZCAtIHRoZSBpZCB2YWx1ZSBvZiBhIGNvbHVtbiBpbiB0aGUgc2FtZSBwcm9qZWN0LlxuICAgKiBAcGFyYW0ge1JlcXVlc3RhYmxlLmNhbGxiYWNrfSBjYiAtIHdpbGwgcmVjZWl2ZSB0cnVlIGlmIHRoZSBvcGVyYXRpb24gaXMgc3VjY2Vzc2Z1bFxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBwcm9taXNlIGZvciB0aGUgaHR0cCByZXF1ZXN0XG4gICAqL1xuICAgbW92ZVByb2plY3RDYXJkKGNhcmRJZCwgcG9zaXRpb24sIGNvbElkLCBjYikge1xuICAgICAgcmV0dXJuIHRoaXMuX3JlcXVlc3QoXG4gICAgICAgICAnUE9TVCcsXG4gICAgICAgICBgL3JlcG9zLyR7dGhpcy5fX2Z1bGxuYW1lfS9wcm9qZWN0cy9jb2x1bW5zL2NhcmRzLyR7Y2FyZElkfS9tb3Zlc2AsXG4gICAgICAgICB7cG9zaXRpb246IHBvc2l0aW9uLCBjb2x1bW5faWQ6IGNvbElkfSxcbiAgICAgICAgIGNiXG4gICAgICApO1xuICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVwb3NpdG9yeTtcbiJdfQ==
//# sourceMappingURL=Repository.js.map
