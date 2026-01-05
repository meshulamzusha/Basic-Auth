import express from 'express'
import authRoute from './authRoute.js'
import messageRoute from './messageRoute.js'

const SERVER_PORT = process.env.SERVER_PORT;
const app = express();
app.use(express.json());

app.use('/', authRoute);
app.use('/', messageRoute)


app.listen(SERVER_PORT, () => {
    console.log(`app listening on port ${SERVER_PORT}`);
})


