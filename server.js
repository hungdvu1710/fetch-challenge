const express = require('express');
const app = express();
const receipts_router = require('./routes/receipts');

app.use(express.json());

app.use("/receipts", receipts_router)

app.listen(3000, () => console.log('Server running on port 3000'));