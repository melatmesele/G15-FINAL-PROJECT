const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const routes = require("./routes/auth/userRoute.js");
const executionRouter = require("./routes/code/code.js");
const examRouters =require("./routes/exam/examRoute")
const dataUploadRouters = require("./routes/userDataUploader/userData");
const sequelize = require("./database/sequelize.js");
const gradingRouter = require("./routes/grading/gradingRoute.js");
const questionRouters = require("./routes/questionRoute/questionRoute.js");
const codeSubmissionRouter = require("./routes/codeSubmission/codeSubmissionRoute.js");
const plagiarismRouter = require("./routes/plagiarism/plagiarismRoute.js");
const ActivateRouter = require(
  "./routes/Activate/activateUserRoute.js"

)
const InfoRouter = require("./routes/info/information.js")



const bodyParser = require('body-parser');


const verifyJWT = require("./middleware/verifyJWT.js")
const checkUserStatus = require("./middleware/userStatus.js")
const seedAdminData = require("./models/auth/seed.js");

dotenv.config({
  path: "./config.env",
});
const app = express();
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

async function initializeDatabase() {
  try {
    await sequelize.sync();
    console.log("Database synchronized");
    seedAdminData();
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
}


initializeDatabase();

app.use(cors());
app.use(cookieParser());


app.use("/information",InfoRouter);


// Routes related to Authentication
app.use("/", routes);
app.use(verifyJWT)
app.use(checkUserStatus)


// Routes for ActivateUser
app.use("/activateUser",ActivateRouter);



//  Routes related to Question
app.use("/question", questionRouters);

// Routes related to Execution
app.use("/execution", executionRouter);

// route related to code submission
app.use("/codeSubmission", codeSubmissionRouter);


// Routes related to DataUpload
app.use("/upload", dataUploadRouters); 

//  Routes related to Exam
app.use("/exam", examRouters); 

  // Routes related to Plagiarism
app.use("/plagiarism", plagiarismRouter); 

  // Routes related to Grading
app.use("/grading", gradingRouter);


const port = process.env.PORT || 5000;

const ipAddress = process.env.IP_ADDRESS || '127.0.0.1';
app.listen(port, () => console.log(`BACK_END_SERVICE_PORT: ${port}: ${ipAddress}`));
