const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();



const app = express();

app.use(express.json());
app.use("/")


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
