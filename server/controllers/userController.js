const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const dataOC = {
    occurrences: require('../model/occurrences.json'),
    setOccurrences: function (data) { this.occurrences = data }
};

const uuid = require('uuid-int');

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleNewUser = async (req, res) => {
    const { name, password, email } = req.body;
    if (!name || !password || !email) return res.status(400).json({ 'message': 'User name and password are required' });

    const duplicate = usersDB.users.find(person => person.email === email);
    if (duplicate) return res.status(422).json({ message: "E-mail already been registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const ToBeId = 0;
    const generator = uuid(ToBeId);
    const id = generator.uuid();

    const newUser = {
        "id": id,
        "name": name,
        "email": email,
        "password": hashedPassword
    };

    usersDB.setUsers([...usersDB.users, newUser]);

    try {
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );

        console.log(`New user rigestred:`);
        console.log(newUser);

        return res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        });
    } catch (err) {
        console.log(error);
        return res.status(500).json({ 'message': err.message });
    }
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'E-mail and password are required' });

    const foundUser = usersDB.users.find(person => person.email === email);
    if (!foundUser) return res.status(401).json({ message: "E-mail not found in our database." });

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({ message: "Password is incorrect." });

    try {
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const accessToken = jwt.sign({
            expiresIn: '1h',
            id: foundUser.id
        },
            secret
        );

        console.log(`User: ${foundUser.name} loged | User's e-mail: ${foundUser.email}`)

        const otherUsers = usersDB.users.filter(person => person.email !== foundUser.email);
        const currentUser = { ...foundUser };
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );

        return res.status(200).json({
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            token: accessToken
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error on login' });
    }

}

const handleLogout = async (req, res) => {
    const { id } = req.body;
    const userId = parseInt(id);
    const foundUser = usersDB.users.find((person) => person.id === userId);

    if (!foundUser) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    const bearerHeader = req.headers['authorization'];
    const bearerToken = bearerHeader.split(' ')[1];
    if (!bearerToken) {
        return res.status(401).json({ message: "Credentials do not correspond to any on the database" });
    }

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            console.log(`Log out realized with sucess`)
            return res.status(200).json({ message: "Logout realizado com sucesso" });
        }
    } catch (error) {

    }
}

const getUser = async (req, res) => {
    let userId = req.params.userId
    userId = parseInt(userId)
    const foundUser = usersDB.users.find(person => person.id === userId);
    if (!foundUser) {
        return res.status(400).json({ message: "Credentials do not correspond to ours database." });
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;
    const bearerHeader = req.headers['authorization'];
    const bearerToken = bearerHeader.split(' ')[1];
    const decoded = jwt.verify(bearerToken, secret);

    if (decoded.id !== foundUser.id) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        return res.status(200).send({
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error on login' });
    }
};

const updateUser = async (req, res) => {
    let userId = req.params.userId
    userId = parseInt(userId)

    const foundUser = usersDB.users.find(person => person.id === userId);
    if (!foundUser) {
        return res.status(400).json({ message: `User ID: ${userId} not found` });
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

    
    console.log(`Old user: ${foundUser.name} | Old user's e-mail:  ${foundUser.email}`);
    
    const duplicate = usersDB.users.find(person => person.email === req.body.email);
    if (duplicate) return res.status(422).json({ message: "E-mail already been registered" });

    foundUser.email = req.body.email;
    foundUser.name = req.body.name;

    if (req.body.password !== null) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        foundUser.password = hashedPassword;
    }


    const otherUsers = usersDB.users.filter(person => person.id !== foundUser.id);
    const updatedUsers = [...otherUsers, foundUser];
    usersDB.setUsers(updatedUsers);


    try {
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(updatedUsers)
        );

        console.log(`New user: ${foundUser.name} | New user's e-mail:  ${foundUser.email}`);
        return res.status(200).json({
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to update user.' });
    }
};

const deleteUser = async (req, res) => {
    const paramId = req.params.userId;
    const userId = parseInt(paramId)
    const foundUserIndex = usersDB.users.findIndex((person) => person.id === userId);
    if (foundUserIndex === -1) {
        return res.status(400).json({ message: `User ID: ${userId} not found` });
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

    const updatedUsers = usersDB.users.filter((person) => person.id !== userId);
    usersDB.setUsers(updatedUsers);

    try {
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(updatedUsers)

        );
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'occurrences.json'),
            JSON.stringify(dataOC.occurrences)
        );
            console.log(`User ID: ${userId} has been deleted`);
        return res.status(200).json({ message: `User ID: ${userId} has been deleted` });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to delete user.' });
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