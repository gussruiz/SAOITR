const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}
const { v4: uuid } = require('uuid');

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const {user, pwd, email} =  req.body;
    if (!user || !pwd || !email) return res.status(400).json({'message': 'User name and password are required'});

    //check duplicate usernames in the db
    const duplicate =  usersDB.users.find(person => person.email === email);
    if(duplicate) return res.status(409);

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //store the new user
        const newUser =  {
            "id": uuid(),
            "username": user,
            "email": email,  
            "roles": {"User": 2001},
            "password": hashedPwd
        };
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users);
        res.status(201).json({"sucess": `New user ${user} cerated`});
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };