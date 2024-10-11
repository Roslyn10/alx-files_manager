const express = require('express');

const app = express();

const routes = require('./routes/index');

app.use('/', routes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});


module.exports = app;
