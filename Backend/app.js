const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express();
app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
    /^http:\/\/localhost(:\d+)?$/,
    process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))

// require all route here
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

app.use("/api/auth" , authRouter)
app.use("/api/interview" , interviewRouter)

module.exports = app
