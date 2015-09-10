
/**
 * Module dependencies.
 */

var relative = require('path').relative
var assert = require('assert')
var each = require('co-each')
var walk = require('../')
var fs = require('co-fs')
var co = require('co')

/**
 * Test Scaffold api
 */

describe('.walk()', function () {
  it('should walk a folder', co(function* () {
    var folder = __dirname + '/fixtures/basic'
    var actual = yield walk(folder)

    var expected = [
      'index.js',
      'lib/app.js'
    ]

    assert.deepEqual(actual, expected)
  }))

  it('should ignore symlinks by default', co(function* () {
    var folder = __dirname + '/fixtures/symlink'
    var actual = yield walk(folder)

    var expected = [
      '.gitignore',
      'index.js'
    ]

    assert.deepEqual(actual, expected)
  }))

  it('should follow symlinks when set', co(function* () {
    var folder = __dirname + '/fixtures/symlink'

    var actual = yield walk(folder, {
      symlinks: true
    })

    var expected = [
      '.gitignore',
      '../basic/index.js'
    ]

    assert.deepEqual(actual, expected)
  }))

  describe('ignore', function () {

    it('should ignore folders / files by a list of globs', co(function* () {
      var folder = __dirname + '/fixtures/basic'

      var actual = yield walk(folder, {
        ignore: ['lib/**']
      })

      var expected = [
        'index.js'
      ]

      assert.deepEqual(actual, expected)
    }))

    it('should ignore folders via a predicate function', co(function* () {
      var folder = __dirname + '/fixtures/basic'

      var actual = yield walk(folder, {
        ignore: function (node) { return node === 'lib'}
      })

      assert.deepEqual(actual, ['index.js'])
    }))


    it('should ignore files via a predicate function', co(function* () {
      var folder = __dirname + '/fixtures/basic'
      var actual = yield walk(folder, {
        ignore: function (node) { return node === 'app.js' }
      })

      assert.deepEqual(actual, ['index.js'])

      actual = yield walk(folder, {
        ignore: function (node) { return node === 'index.js' }
      })

      assert.deepEqual(actual, ['lib/app.js'])
    }))

    it('should ignore files via a predicate function that also passes the relative path', co(function* () {
      var folder = __dirname + '/fixtures/basic'
      var actual = yield walk(folder, {
        ignore: function (node, rel) { return rel === 'lib/app.js' }
      })

      assert.deepEqual(actual, ['index.js'])
    }))

  })

})