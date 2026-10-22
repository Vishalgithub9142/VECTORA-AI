const express = require("express")
const authMiddleware = require('../middlewares/auth.middleware')
const interviewController = require('../controllers/interview.controller')
const upload = require('../middlewares/file.middleware')
const rateLimit = require('express-rate-limit')

const reportGenerationRateLimit = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false
})
const pdfGenerationRateLimit = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false
})

const interviewRouter = express.Router()

/**
 * @route POST /api/interview/generate-report
 * @description generate interview report 
 * @access private
 */

interviewRouter.post("/", authMiddleware.authUser, reportGenerationRateLimit, upload.single("resume"), interviewController.generateInterviewReportController)

/**
 * @routes GET /api/interview/report/interviewId
 * @description get interview report by interviewId
 * @access private
 */

interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, pdfGenerationRateLimit, interviewController.generateResumePdfController)


module.exports = interviewRouter