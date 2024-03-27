const CreatExam = require('../../../models/exam/createExam'); // Adjust the path as necessary
const sequelize = require('../../../database/sequelize'); // Adjust the path as necessary
const SelectedQuestionForExam = require('../../../models/exam/SelectedQuestionForExam'); // Adjust the path as necessary
const SelectedSectionsForExam = require('../../../models/exam/SelectedSectionsForExam'); // Adjust the path as necessary
const User = require('../../../models/auth/user.model');

const createExam = async (req, res) => {
  const { title, date_and_time, instruction, duration, sections, questions, teacherId } = req.body;

  try {
    const foundUser = await User.findOne({
      where: {
        id: teacherId
      }
    });

    if (!foundUser) {
      return res.status(400).json({ message: "The user is not found" });
    }

    if (foundUser.status !== "active") {
      return res.status(403).json({ message: "The user is not active" });
    }

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
      // Create the exam within the transaction
      const exam = await CreatExam.create({
        title,
        date_and_time,
        instruction,
        duration,
        status: 'upcoming',
        teacherId
      }, { transaction });

      // Create selected sections for the exam within the transaction
      if (sections && sections.length > 0) {
        await Promise.all(sections.map(async (section) => {
          await SelectedSectionsForExam.create({
            sections: section,
            examId: exam.id,
          }, { transaction });
        }));
      }

      // Create selected questions for the exam within the transaction
      if (questions && questions.length > 0) {
        await Promise.all(questions.map(async (questionId) => {
          await SelectedQuestionForExam.create({
            question_ids: questionId,
            examId: exam.id,
          }, { transaction });
        }));
      }

      // Commit the transaction
      await transaction.commit();

      return res.status(201).json(exam);
    } catch (error) {
      // Rollback the transaction if an error occurs
      await transaction.rollback();
      return res.status(400).json({ error: error.message });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


// In your exam controller file


// Update an exam
const updateCreatedExam = async (req, res) => {
  try {
    const { teacherId, examId } = req.params;
    const { title, date_and_time, instruction, duration, status, sections, questions } = req.body;

    const exam = await CreatExam.findOne({
      where: {
        id: examId,
        teacherId: teacherId
      }
    });

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {

      exam.title = title;
      exam.date_and_time = date_and_time;
      exam.instruction = instruction;
      exam.duration = duration;
      exam.status = status;
      await exam.save({ transaction });

      // update section
      if (sections && sections.length > 0) {
        await Promise.all(sections.map(async (section) => {
          await SelectedSectionsForExam.update(
            { sections: section.sections },
            { where: { examId: examId, id: section.id }, transaction }
          );
        }));
      }
      // update question
      if (questions && questions.length > 0) {
        await Promise.all(questions.map(async (question) => {
          await SelectedQuestionForExam.update(
            { question_ids: question.question_ids },
            { where: { examId: examId, id: question.id }, transaction }
          );
        }));
      }

      // Commit the transaction
      await transaction.commit();

      // Fetch updated data
      const updatedExam = await CreatExam.findByPk(examId);
      const updatedSections = await SelectedSectionsForExam.findAll({ where: { examId: examId } });
      const updatedQuestions = await SelectedQuestionForExam.findAll({ where: { examId: examId } });

      return res.status(200).json({ updatedExam, updatedSections, updatedQuestions });
    } catch (error) {
      // Rollback the transaction if an error occurs
      await transaction.rollback();
      console.error(error);
      return res.status(500).json({ error: 'Failed to update exam' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};





// Delete an exam
const deleteCreatedExam = async (req, res) => {
  const { teacherId, examId } = req.params;

  try {
    const exam = await CreatExam.findOne({
      where: {
        id: examId,
        teacherId: teacherId
      }
    });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const transaction = await sequelize.transaction();
    try {
      await SelectedSectionsForExam.destroy({ where: { examId: examId }, transaction });
      await SelectedQuestionForExam.destroy({ where: { examId: examId }, transaction });
      await CreatExam.destroy({ where: {id: examId }, transaction });
      await transaction.commit();
      return res.status(200).json({ message: 'Exam deleted successfully' });

    }
    catch (error) {
      await transaction.rollback();
      console.error(error);
      return res.status(500).json({ error: 'Failed to delete exam' });
    }
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: "internal server error" });
  }
}


// Function to start an exam
const startCreatedExam = async (req, res) => {
  const { id } = req.params; // Get exam ID from the request parameters

  try {
    const exam = await CreatExam.findByPk(id);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Update the exam status to "running"
    await exam.update({ status: 'running' });

    // Schedule to update the status to "ended" after the exam's duration
    const durationInMilliseconds = exam.duration * 60000; // Convert duration from minutes to milliseconds
    setTimeout(async () => {
      await exam.update({ status: 'end' });
    }, durationInMilliseconds);

    return res.status(200).json({ message: 'Exam started successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



module.exports = {

  deleteCreatedExam,
  updateCreatedExam,
  startCreatedExam,
  createExam

}
