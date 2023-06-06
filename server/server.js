const express = require('express');
const app  = express();
const cors = require('cors');
const cookieParser =  require('cookie-parser');
const users =  require('./routes/users')
const occurrences =  require('./routes/occurrences')


app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/', users);
app.use('/', occurrences);

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));