const TestCase = require("../../models/question_testcase_submission/testCase");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const codeSubmision = require("../../models/codeSubmision/codeSubmision")
const Status = require("../../models/codeSubmision/codeStatus")
const Question = require("../../models/question_testcase_submission/question");
const Difficulty = require("../../models/codeSubmision/difficultyCounter");
const User = require("../../models/auth/user.model");
const Section = require("../../models/auth/section.model");

const getQuestionById = async (questionId) => {
  try {
    const question = await TestCase.findAll({
      where: { labQuestionId: questionId },
    });
   
    if((question.length) === 0){

     return null
    
    }
    
    return question;
  } catch (error) {
    console.error("Error fetching question by ID:", error);
    throw new Error("Failed to fetch question by ID");
  }
};

var errorType =""
const runPythonCode = (pythonCode, nums) => {
  return new Promise((resolve, reject) => {
    const tempFilePath = path.join(__dirname, "tempkol.py");
    const functionNameMatch = pythonCode.match(/def\s+(\w+)\s*\(/);
    const functionName = functionNameMatch ? functionNameMatch[1] : "UnknownFunction";
    
    const modifiedPythonCode = pythonCode.replace(/print\(/g, 'sys.stderr.write(');
    const functionCall = `${functionName}(${JSON.stringify(nums)})`;
    
    const pythonScript = `${modifiedPythonCode}\n\nimport sys\nsys.stdout.write(str(${functionCall}))`;
     
    console.log("Python script:", pythonScript);
    fs.writeFile(tempFilePath, pythonScript, (err) => {
      if (err) {
        reject(err);
      } else {
        const pythonProcess = spawn("python", [tempFilePath,nums]);
        
        let result = "";
        let printOutput = ""; 

        pythonProcess.stdout.on("data", (data) => {
          result += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
          printOutput += data.toString();
          console.error(`Python process error: ${data}`);
        });
        
        pythonProcess.on("close", (code) => {
          fs.unlink(tempFilePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Error deleting temporary file:", unlinkErr);
            }
          });
        
          if (code === 0) {
            resolve({ result: result.trim(), printOutput: printOutput.trim() });
          } else {
            const errorTypeMatch = printOutput.match(/(\w+Error):/);
            if (errorTypeMatch) {
              errorType = errorTypeMatch[1];
             
            } 
            else {}
            // If the process exits with a non-zero code, consider it an error and reject the promise.
            reject(new Error(`Python process exited with code ${code}. Error: ${printOutput.trim()}`));
          }
        });
        
      }
    });
  });
};



module.exports = { runPythonCode };
const submitCode = async (req, res) => {
  const { questionId, id, pythonCode } = req.body;

  try {
    if(!questionId || !id || !pythonCode){
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findByPk(id);
    if (!user ) {
      return res.status(400).json({ error: "User not found" });
    }
    const section = await Section.findOne({
      where: {
        UserInformationId: id,
      },
    });

  
    
    const testCases = await getQuestionById(questionId);
    if (pythonCode === "") {
      return res
        .status(500)
        .json({ error: "you should have to write a correct code " });
    }

    if(testCases){

    const allTestResults = [];
    const statusData = [];

    const questionsFound = await codeSubmision.findOne({
      where: {
        questionId: questionId,
      },
    });
   
    var codes = await codeSubmision.create({
      questionId,
      userId: id,
      section:section.section,
      userCode: pythonCode,
    });
    
    
    

    for (const testCase of testCases) {
      const { input, output } = testCase.dataValues;
      let nums,  score, results;

       if (typeof input === "object") {
      
         // If input is an object, assume it contains 'nums' and 'score'
         const { nums, score } = input;
         results = await runPythonCode(pythonCode, [nums, score]);
       } else {
       
         // If input is a string, assume it contains 'word'
         const word = input;
         const {num} = word
         const inputData = JSON.parse(input);
         const key = Object.keys(inputData[0])[0]; // Get the first key dynamically
         const score = inputData[0][key];
         results = await runPythonCode(pythonCode, score);
       }

      // const results = await runPythonCode(pythonCode, nums || word, target);
     
      const testResults = {
        input: input,
        expectedOutput: JSON.parse(output)[0],
        actualOutput: results,
        passed: JSON.parse(output)[0] === results,
      }; 
     
       if(testResults.passed === true){
       
        statusData.push("Accepted");

        
        
       }else{
        // Status.status = "Wrong Answer";
        statusData.push("Wrong Answer");
        
       }
       

      allTestResults.push(testResults); 
    }


    let overallStatus;
    if (statusData.every((status) => status === "Accepted")) {
      overallStatus = "Accepted";
    } else if (statusData.some((status) => status === "Wrong Answer")) {
      overallStatus = "Wrong Answer";
    } else {
      overallStatus = "Wrong Answer"; // Handle other cases if needed
    }

    const submittedTagStatus = await Status.findAll({
      where:{
        questionId: questionId,
        UserinformationId: id
      }
    });

    checker = false
    for (const submission of submittedTagStatus) {

      if(submission.status == "Accepted"){
        checker = true
        break
      }
    }

     if (checker == false &&( overallStatus == "Accepted" || overallStatus == "Wrong Answer")) {
       console.log("-----------------------------");
       easyCount = 0;
       mediumCount = 0;
       hardCount = 0;
       totalCount = 0;

       const questions = await Question.findOne({
         where: {
           id: questionId,
         },
       });
       tag = questions.dataValues.difficulty;

       const difficultyRecord = await Difficulty.findOne(); // Assuming there's only one record
       if (difficultyRecord) {
        await Difficulty.update(
          { userId: id },
          { where: { id: difficultyRecord.id } }
        );
         // Update the counts based on the difficulty level of the new submission
         if (tag === "easy") {
           await Difficulty.update(
             { easyCount: difficultyRecord.easyCount + 1 },
             { where: { id: difficultyRecord.id } }
           );
         } else if (tag === "medium") {
           await Difficulty.update(
             { mediumCount: difficultyRecord.mediumCount + 1 },
             { where: { id: difficultyRecord.id } }
           );
         } else if (tag === "hard") {
           await Difficulty.update(
             { hardCount: difficultyRecord.hardCount + 1 },
             { where: { id: difficultyRecord.id } }
           );
         }
         // Update the total count
         await Difficulty.update(
           {
             totalCount:
               difficultyRecord.easyCount +
               difficultyRecord.mediumCount +
               difficultyRecord.hardCount,
           },
           { where: { id: difficultyRecord.id } }
         );
       }
     }

    const newer = await Status.create({
      status: overallStatus,
      questionId: questionId,
      UserinformationId: id,
      submittedCodeId: codes.id,
      userCode: pythonCode,
    });
    
  
    res.json({ allTestResults, codes, status: overallStatus});
  }
    else{
      res.status(500).json({ error: "question Id is not Found" });
    }
  } catch (error) {

    console.error("Error:", error);
    const statuses = await Status.create({
      status :errorType,
      questionId: questionId,
      UserinformationId: id,
      submittedCodeId: codes.id,
      userCode: pythonCode,
    });
    
    const errorMessagePattern = /File "[^"]+", line \d+.*$/s;
    let matches = error.message.match(errorMessagePattern);
    
    let refinedMessage = "Unknown error";
    if (matches) {
      
      let parts = matches[0].split(/\.py"/);
      if (parts.length > 1) {
        
        refinedMessage = `File ${parts[1]}`;
      } else {
       
        refinedMessage = matches[0];
      }
    }
  
    res.status(500).json({ error: refinedMessage });
  }
};

module.exports = { submitCode };
