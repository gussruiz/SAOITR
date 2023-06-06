const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const uuid = require('uuid-int');

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//register
const handleNewUser = async (req, res) => {
    const { name, password, email } = req.body;
    if (!name || !password || !email) return res.status(400).json({ 'message': 'User name and password are required' });

    //check duplicate usernames in the db
    const duplicate = usersDB.users.find(person => person.email === email);
    if (duplicate) return res.status(409).json({ message: "E-mail já cadastrado" });

    try {
        //encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const ToBeId = 0;
        const generator = uuid(ToBeId);
        const id = generator.uuid();
        //store the new user
        const newUser = {
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
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'email and password are required' });

    const foundUser = usersDB.users.find(person => person.email === email);
    if (!foundUser) return res.sendStatus(401).json({ message: "Essas credenciais não correspondem aos nossos registros. -- USUÁRIO NÃ0 ENCONTRADO" }); //Unauthorized

    //evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.sendStatus(401).json({ message: "Essas credenciais não correspondem aos nossos registros. -- SENHA INCORRETA" }); //Unauthorized

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
    const otherUsers = usersDB.users.filter(person => person.email !== foundUser.email);
    const currentUser = { ...foundUser };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    );

}


//logout
const handleLogout = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        res.status(200).json({ message: "Logout realizado com sucesso" });
        console.log('METHOD: POST | ROTA: LOGOUT | STATUS: DESLOGADO');

    }

}

//read unique user

const getUser = async (req, res) => {
    const userId = req.params;
    const foundUser = usersDB.users.find(person => person.id === userId);
    if (!foundUser) return res.sendStatus(401).json({ message: "Essas credenciais não correspondem aos nossos registros. -- USUÁRIO NÃ0 ENCONTRADO" }); //Unauthorized

    const secret = process.env.ACCESS_TOKEN_SECRET;
    const bearerHeader = req.headers['authorization'];
    const bearerToken = bearerHeader.split(' ')[1];
    const decoded = jwt.verify(bearerToken, secret);

    if (decoded.id != user.id) {
        return res.status(401).json({
            message: "Credentials do not correspond to any on data base"
        })
    }
    
    return res.status(200).send({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
    })

}

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const foundUser = usersDB.users.find(person => person.id === userId);
    if (!foundUser) {
        return res.status(404).json({ message: `User ID: ${userId} not found` });
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;
    const bearerHeader = req.headers['authorization'];
    const bearerToken = bearerHeader.split(' ')[1];
    const decoded = jwt.verify(bearerToken, secret);

    if (decoded.id != foundUser.id) {
        return res.status(401).json({
            message: "Credentials do not correspond to any on the database",
        });
    }

    if (req.body.name) foundUser.name = req.body.name;
    if (req.body.email) foundUser.email = req.body.email;
    if (req.body.password) foundUser.password = req.body.password;

    const otherUsers = usersDB.users.filter(person => person.id !== foundUser.id);
    const updatedUsers = [...otherUsers, foundUser];
    usersDB.setUsers(updatedUsers);

    try {
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(updatedUsers)
        );
        res.status(200).json({
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user.' });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;
    const foundUserIndex = usersDB.users.findIndex(person => person.id === userId);
    if (foundUserIndex === -1) {
        return res.status(404).json({ message: `User ID: ${userId} not found` });
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;
    const bearerHeader = req.headers['authorization'];
    const bearerToken = bearerHeader.split(' ')[1];
    const decoded = jwt.verify(bearerToken, secret);

    if (decoded.id !== userId) {
        return res.status(401).json({
            message: "Credentials do not correspond to any in the database",
        });
    }

    const updatedUsers = usersDB.users.filter(person => person.id !== userId);
    usersDB.setUsers(updatedUsers);

    try {
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(updatedUsers)
        );
        res.status(200).json({ message: `User ID: ${userId} has been deleted` });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user.' });
    }
};


module.exports = {
    handleNewUser,
    handleLogin,
    handleLogout,
    getUser,
    updateUser,
    deleteUser
};