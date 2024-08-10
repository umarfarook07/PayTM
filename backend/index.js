const express = require("express");
const app = express();
const cors = require('cors');
const apiRouter = require('./routers/index')
const userRoutes = require('./routers/user')
const accountRoutes = require('./routers/accounts')
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/v2', apiRouter)
app.use('/api/v2/user', userRoutes);
app.use('/api/v2/account', accountRoutes);

app.listen(PORT);