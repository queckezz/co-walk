# co-walk

walk a file tree and return a list of files

## Installation

```
$ npm install co-walk
```

## Example

```js
var path = __dirname + '/app'

var files = yield walk(path, {
  symlinks: true,
  ignore: ['art/**', 'node_modules']
})
// -> ['/home/user/app/.gitignore', ...]
```

## Api

### walk(path, opts)

walk a file tree and return a list of files

  * `path`: full path to folder
  * `opts`:
    * `symlinks`: follow symlinks and return origin path _[false]_
    * `ignore`: a list which folders, files you want to ignore

## Tests

```
$ make test
```

## Licence

  MIT