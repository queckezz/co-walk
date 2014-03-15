
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

      if (stats.isDirectory()) {
        return yield walk(path);
      }

      else if (opts.symlinks && stats.isSymbolicLink()) {
        path = join(folder, yield fs.readlink(path));
      }

      var rel = relative(root, path)

      if (opts.ignore) {
        var blacklist = yield unglob.list(opts.ignore, [rel]);
        if (blacklist.indexOf(rel) > -1) return;
      }

      files.push(rel);
    })
  }

  yield walk(folder);
  return files;
}