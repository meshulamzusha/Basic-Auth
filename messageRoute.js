import express from 'express';
import { decodeMessageService } from './services.js';
import { requireAuthMiddleware } from './requireAuth.js';

const router = express.Router();
router.use(requireAuthMiddleware)


router.post('/decode-message', (req, res) => {
    if (!req.body.message) {
        return res.status(400).send("Message is required in request body.")
    }

    const { message } = req.body;
    const response = decodeMessageService(message)

    if (response == -1) {
        return res.status(200).send(-1)
    }

    res.status(200).json({
        decode: response
    })
})


export default router;