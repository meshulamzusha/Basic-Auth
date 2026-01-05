import express from 'express';
import { verifiedUsers } from './authRoute.js';
import { decodeMessageService } from './services.js';

const router = express.Router();


router.post('/decode-message', (req, res) => {
    if (!req.body) {
        return res.status(400).send("request body is required")
    }

    if (!req.body.username || !req.body.message) {
        return res.status(400).send("username and message is required in request body.")
    }

    const { username, message } = req.body;
    if (!username in verifiedUsers || !verifiedUsers[username]) {
        return res.status(401).send("Unauthorized user")
    }

    const response = decodeMessageService(message)

    if (response == -1) {
        return res.status(200).send(-1)
    }

    res.status(200).json({
        decode: response
    })
})


export default router;