const express = require("express");
const middleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const path = require("path");
const app = express();
const compiler = webpack(webpackConfig);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;

app.use(
  middleware(compiler, {
    index: "./src/index.html",
    publicPath: "/",
    stats: {
      colors: true,
    },
  })
);

app.use(
  webpackHotMiddleware(compiler, {
    log: console.log,
    path: "/__webpack_hmr",
    heartbeat: 10 * 1000,
  })
);

app.use(express.static(path.join(__dirname, "src")));
app.listen(PORT, "0.0.0.0", function () {
  console.log(`Running on PORT ${PORT}`);
});
module.exports = app;
