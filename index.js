const express = require('express');
const fs = require('fs');
const dataFile = './data.json';
const port=3000;
const app=express();


app.use(express.json());

function readData() {
    try {

        if(!fs.existsSync(dataFile)){
            fs.writeFileSync(dataFile, JSON.stringify([], null,2));
        }

        const data = fs.readFileSync(dataFile, 'utf8');
        return JSON.parse(data);
    }

    catch (error){
        console.error("Error reading or parsing data file:", error.message);        
        return [];
    }

};

function writeData(data) {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    }
    
    catch (error) {
        console.error("Error writing data file:", error.message);
    }
}


app.post('/users', (req,res)=>{
    const users = readData();
    const newUser= {
        id: Date.now(), 
        ...req.body
    };

    users.push(newUser);
    writeData(users);
    
    res.status(201).json({ message: "user added successfully", newUser });
})


app.get('/users', (req, res) => {
    const users = readData();
    res.json(users);
});


app.get('/users/:id', (req, res) => {
    const users = readData();
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
});


app.put('/users/:id', (req, res) => {
    const users = readData();
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    users[userIndex] = {
        id: userId,
        ...users[userIndex],
        ...req.body
    };

    writeData(users);
    res.json({ message: "User updated successfully", updatedUser: users[userIndex] });
});


app.delete('/users/:id', (req, res) => {
    const users = readData();
    const userId = parseInt(req.params.id);
    
    const filteredUsers = users.filter(u => u.id !== userId);

    if (filteredUsers.length === users.length) {
        return res.status(404).json({ message: "User not found" });
    }

    writeData(filteredUsers);
    res.json({ message: "User deleted successfully" });
});


app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
})

