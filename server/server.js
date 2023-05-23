const express = require('express');
const app  = express();
const path = require('path');
const cors = require('cors');
const corsOptions =  require('./config/corsOptions');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT =  require('./middleware/verifyJWT');
const cookieParser =  require('cookie-parser');
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT || 3500;

//custom middleware logger
app.use(logger);

//handle options creedntials check - before CORS!
//and fetch cookies credentials requirement
app.use(credentials);

app.use(cors(corsOptions));

//built in middleware
app.use(express.urlencoded({extended: false}));

//built in middleware
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);

app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')){
        res.json({error: '404 Page Not Found'});
    } else {
        res.type('txt').send('404 Page Not Found');
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));