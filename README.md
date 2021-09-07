# inline-worker-loader
Inline Worker Loader: Convert File Paths to Data URLs

# install
```bash
npm install inline-worker-loader
```

# purpose
| before | after |
| ------ | ----- |
| `new Worker("./hello-world.js");` | `new Worker("data:application/javascript,console.log(%22Hello%2C%20World%22)%3B")`

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