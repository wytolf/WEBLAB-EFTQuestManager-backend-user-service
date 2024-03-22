require('dotenv').config();
const express = require('express');
const winston = require('winston');

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

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.align(),
            winston.format.printf(info => `${info.timestamp} ${info.service} ${info.level}: ${info.message}`)
        ),
        defaultMeta: { service: 'user-service' },
        transports: [
            new winston.transports.Console(),
        ],
    });

    server.listen(process.env.PORT, () => {
        logger.info('Server is listening');
    });

    server.put('/api/user', async (req, res) => {
        logger.info(`PUT /user wurde aufgerufen.`);
        const {email, role, quests} = req.body;

        logger.info('PUT /user -> Request received {Email: ' + email + ', Role: ' + role + ' }');
        try {
            const baseDocument = {
                id: email, role
            }
            await setDoc(doc(db, "users", email), {
                ...baseDocument, ...(quests ? {quests} : {})
            });
        } catch (error) {
            logger.error('PUT /user -> Error post user:', error);
            res.status(500).send({message:'PUT /user -> Internal Server Error'});
        }

        res.status(200).send({message: "user with id " + email + " saved."});
    });

    server.get('/api/user', async (req, res) => {
        logger.info(`GET /user wurde aufgerufen.`);
        try {
            const userList = await getUsers(db);
            res.status(200).json(userList);
            logger.info(`GET /user -> Daten erfolgreich gesendet`);
        } catch (error) {
            logger.error('GET /user -> Error fetching users:', error);
            res.status(500).send('GET /user -> Internal Server Error');
        }
    });

    server.get('/api/user/:id', async (req, res) => {
        const id = req.params.id;
        logger.info(`GET /user/` + id + ` wurde aufgerufen.`);

        try {
            const userDocument = doc(db, "users", id);
            const userSnapshot = await getDoc(userDocument);


            if (userSnapshot.exists()) {
                let user = userSnapshot.data();
                logger.info(`GET /user/` + id + ` -> User gefunden` + user);
                res.status(200).json(user);
                logger.info(`GET /user/` + id + ` -> Daten erfolgreich gesendet`);
            } else {
                logger.info("GET /user/" + id + " -> Document existiert nicht in db");
                res.status(404).send("GET /user/" + id + ' -> User nicht gefunden');
            }

        } catch (error) {
            logger.error('Error fetching user:', error);
            res.status(500).send('GET /user/' + id + ' -> Error fetching user:' + error);
        }
    });

    async function getUsers(db) {
        const users = collection(db, 'users');
        const userSnapshot = await getDocs(users);
        return  userSnapshot.docs.map(doc => doc.data());
    }
}



main();