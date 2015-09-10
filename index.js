
/**
 * Module dependencies
 */

var relative = require('path').relative
var unglob = require('unglob')
var join = require('path').join
var each = require('co-each')
var fs = require('co-fs')

/**
 * Return an array of files in `folder`
 *
 * @param {String} folder: full path to folder
 * @todo ignore folders/files
 */

module.exports = function* (folder, opts) {
  var files = [];
  var root = folder;
  opts = opts || {};
  opts.symlinks = !!opts.symlinks;

  function* walk (folder) {
    var nodes = yield fs.readdir(folder);

    yield each(nodes, function* (node) {
      var path = join(folder, node);
      var stats = yield fs.lstat(path);

      if (opts.symlinks && stats.isSymbolicLink()) {
        path = join(folder, yield fs.readlink(path));
      }
      var rel = relative(root, path)

      if (!(typeof opts.ignore === 'function' && opts.ignore(node, rel, path) ||
          Array.isArray(opts.ignore) &&
          (yield unglob.list(opts.ignore, [rel])).indexOf(rel) > -1)) {

        if (stats.isDirectory()) {
          yield walk(path);
        }
        else {
          files.push(rel);
        }

      }
    })
  }

  yield walk(folder);
  return files;
}