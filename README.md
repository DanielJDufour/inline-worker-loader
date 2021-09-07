# inline-worker-loader: beta
> Convert File Paths to Data URLs

# features
- bundles dependencies with worker
- compatible with [universal-worker](https://github.com/danieljdufour/universal-worker)
- supports CommonJS and ES6 modules

# install
```bash
npm install inline-worker-loader
```

# purpose
#### before
`new Worker("./hello-world.js");`
#### after
`new Worker("data:application/javascript,console.log(%22Hello%2C%20World%22)%3B")`

# usage
```js
// inside webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "inline-worker-loader",
          // optional options
          options: {
            // set debug to true for more logging
            debug: false
          }
        }
      }
    ]
  }
};
```
