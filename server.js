require('dotenv').config();
const express = require('express');

const {getFirestore, collection, getDocs, doc, getDoc, setDoc} = require('firebase/firestore');
const initializeApp = require('firebase/app');

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

function main() {
    const server = express();
    server.use(express.json())

    const app = initializeApp.initializeApp(firebaseConfig);
    const db = getFirestore();

    server.listen(process.env.PORT, () => {
        console.log('Server is listening....');
    });

    server.post('/api/user', async (req, res) => {
        console.log(`User Service: POST /user wurde aufgerufen.`);
        const {id, username, role, quests} = req.body;
        console.log('Request received {Username: ' + username + ', Role: ' + role + ' }');
        await setDoc(doc(db, "users", id.toString()), {
            id: id.toString(),
            username: username,
            role: role,
            quests: quests
        });

        res.status(200).send("user with id " + id +  " saved.");
    });

    server.get('/api/user', async (req, res) => {
        console.log(`User Service: GET /user wurde aufgerufen.`);
        try {
            const userList = await getUsers(db);
            res.status(200).json(userList);
            console.log(`User Service: GET /user -> Daten erfolgreich gesendet`);
        } catch (error) {
            console.error('User Service: GET /user -> Error fetching users:', error);
            res.status(500).send('User Service: GET /user -> Internal Server Error');
        }
    });

    server.get('/api/user/:id', async (req, res) => {
        const id = req.params.id;
        console.log(`User Service: GET /user/` + id + ` wurde aufgerufen.`);

        try {
            const userDocument = doc(db, "users", id);
            const userSnapshot = await getDoc(userDocument);


            if (userSnapshot.exists()) {
                let user = userSnapshot.data();
                console.log(`User Service: GET /user/` + id + ` -> User gefunden` + user);
                res.status(200).json(user);
                console.log(`User Service: GET /user/` + id + ` -> Daten erfolgreich gesendet`);
            } else {
                console.log("User Service: GET /user/" + id + " -> Document existiert nicht in db");
                res.status(404).send("User Service: GET /user/" + id + ' -> User nicht gefunden');
            }

        } catch
            (error) {
            console.error('Error fetching user:', error);
            res.status(500).send('User Service: GET /user/' + id + ' -> Error fetching user:' + error);
        }
    });
}

async function getUsers(db) {
    const users = collection(db, 'users');
    const userSnapshot = await getDocs(users);
    const userList = userSnapshot.docs.map(doc => doc.data());
    console.log(`User Service: GET /api/user -> UserList: ${userList}`);
    return userList;
}

main();