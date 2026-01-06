import express from 'express';
import jwt from 'jsonwebtoken';
import { signupService, verifyService } from './services.js';
import { getSupabaseClient } from './supabase.js';

const supabase = getSupabaseClient();
const router = express.Router();


router.post('/signup', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send("request body is required")
        }

        if (!req.body.username || !req.body.password) {
            return res.status(400).send("username and password is required in request body.")
        }

        const { username, password } = req.body;

        const { data, error } = await supabase
            .from("users")
            .select()
            .eq('username', username);

        if (error) {
            throw error;
        }

        if (data.length > 0) {
            return res.status(401).send(`user with username ${username} already exist`)
        }

        const insertResult = await signupService(username, password)

        if (insertResult.error) {
            console.log(insertResult.error);
            return res.status(500).send("Failed signup user.")
        }

        res.status(201).send("User signed successfully.");

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
})


router.post('/verify', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send("request body is required")
        }

        if (!req.body.username || !req.body.password) {
            return res.status(400).send("username and password is required in request body.")
        }

        const { username, password } = req.body;
        const { data, error} = await supabase
            .from("users")
            .select()
            .eq('username', username)

        if (error) {
            throw error;
        }

        if (data.length == 0) {
            return res.status(401).send(`user with username ${username} not exist`, isUsernameExist)
        }

        const isPasswordCorrect = await verifyService(username, password);

        if (!isPasswordCorrect) {
            return res.status(401).send("Unauthorized");
        }

        const SECRET = process.env.JWT_SECRET;
        const EXPIRES_IN = process.env.JWT_EXPIRES_IN;
        const token = jwt.sign(
            {
                username: data.username,
                id: data.id
            },
            SECRET,
            {
                expiresIn: EXPIRES_IN
            }
        )

        res.status(200).json({
            status: "Verified",
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
})


export default router;