const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
// var history = require('connect-history-api-fallback');
import fallback from 'express-history-api-fallback'

let app = express();
const root = `${__dirname}/dist`

// app.use(history()); // used to be able to access direct url in production since we use a SPA in history mode
app.use(express.static(root))
// app.use(serveStatic(__dirname + "/dist"));
app.use(fallback('index.html', { root }))

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port ' + port)
});
