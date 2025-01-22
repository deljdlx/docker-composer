const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/containers",
    createProxyMiddleware({
      target: "http://docker-proxy:2375", // 🔥 Remplace localhost par docker-proxy
      changeOrigin: true,
      secure: false,
      logLevel: "debug", // 🔍 Active le debug pour voir les requêtes proxy
    })
  );
};
