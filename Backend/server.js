require('dotenv').config()
const app = require('./app');
const connectDB = require('./config/database')

connectDB() 

// Commented out to prevent exceeding API quota on every nodemon reload.
// Uncomment to run the test once, or trigger it via a route.
// generateInterviewReport({resume, selfDescription, jobDescription})

app.listen(process.env.PORT || 3000 , ()=>{
    console.log(`Server is running on port ${process.env.PORT || 3000}`)
})


