const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}
const uuid = require('uuid-int');

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//register
const handleNewUser = async (req, res) => {
    const {name, password, email} =  req.body;
    if (!name || !password || !email) return res.status(400).json({'message': 'User name and password are required'});

    //check duplicate usernames in the db
    const duplicate =  usersDB.users.find(person => person.email === email);
    if(duplicate) return res.status(409).json({message: "E-mail já cadastrado"});

    try {
        //encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const ToBeId = 0;
        const generator = uuid(ToBeId);
        const id = generator.uuid();
        //store the new user
        const newUser =  {
            "id": id,
            "name": name,
            "email": email,  
            "password": hashedPassword
        };
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users);
        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

//login
const handleLogin = async (req, res) => {
    const {email, password} =  req.body;
    if (!email || !password) return res.status(400).json({'message': 'email and password are required'});

    const foundUser = usersDB.users.find(person => person.email === email);
    if(!foundUser) return res.sendStatus(401).json({message: "Essas credenciais não correspondem aos nossos registros. -- USUÁRIO NÃ0 ENCONTRADO"}); //Unauthorized

    //evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if(!match) return res.sendStatus(401).json({message: "Essas credenciais não correspondem aos nossos registros. -- SENHA INCORRETA"}); //Unauthorized

    const secret = process.env.ACCESS_TOKEN_SECRET;

    //create a JWTs

    const accessToken = jwt.sign({ 
        expiresIn: '1h',
        id: foundUser.id
    },
    secret
);

    res.status(200).json({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        token: accessToken
    });


    //saving resfresehToken with current user
    const otherUsers =  usersDB.users.filter(person => person.email !== foundUser.email);
    const currentUser = {...foundUser};
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    );

}


//logout
const handleLogout = async (req, res) => {    


    //delete  refreshToken in DB 
    const otherUsers = usersDB.users.filter(person => person.token !== foundUser.token);
    const currentUser = {...foundUser, token: ''};
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'users.json'),
        JSON.stringify(usersDB.users)
    );

    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true}); //sercure: true - only servers on https
    res.sendStatus(204);
 
}


module.exports = { 
    handleNewUser,
    handleLogin,
    handleLogout 
};