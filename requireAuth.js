import jwt from 'jsonwebtoken';


export function requireAuthMiddleware(req, res, next) {
    if (!req.body) {
        return res.status(400).send("request body is required");
    }

    if (!req.body.Authorization) {
        return res.status(401).send("Unauthorized");
    }

    const token = req.body.Authorization.split(' ')[1];
    const SECRET = process.env.JWT_SECRET;

    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.status(401).send("Unauthorized");
        }

        req.user = user
        next();
    })
}