const { PDFParse } = require('pdf-parse');
const mongoose = require('mongoose');
const {generateInterviewReport, generateResumePdf} = require('../services/ai.service')
const interviewReportModel = require('../models/interviewReport.model')

async function generateInterviewReportController(req, res){
    try {
        console.log('\n🚀 [INTERVIEW CONTROLLER] Starting interview report generation...')
        
        if (!req.file) {
            console.log('❌ [INTERVIEW CONTROLLER] No file received')
            return res.status(400).json({ message: "Resume file is required" })
        }

        if (req.file.buffer.subarray(0, 5).toString() !== '%PDF-') {
            return res.status(400).json({ message: 'Uploaded file is not a valid PDF' })
        }

        const { jobDescription, selfDescription } = req.body
        if (typeof jobDescription !== 'string' || typeof selfDescription !== 'string' ||
            jobDescription.length > 20000 || selfDescription.length > 10000) {
            return res.status(400).json({ message: 'Descriptions are missing or exceed the allowed length' })
        }
        
        console.log('✅ [INTERVIEW CONTROLLER] File received:', {
            originalName: req.file.originalname,
            size: req.file.size,
            encoding: req.file.encoding
        })

        console.log('📄 [INTERVIEW CONTROLLER] Parsing PDF...')
        const parser = new PDFParse({ data: req.file.buffer })
        const data = await parser.getText()
        if (data.text.length > 50000) {
            return res.status(400).json({ message: 'Resume text exceeds the allowed length' })
        }
        console.log('✅ [INTERVIEW CONTROLLER] PDF parsed successfully. Text length:', data.text.length)
        
        console.log('✅ [INTERVIEW CONTROLLER] All required fields present')
        console.log('📝 [INTERVIEW CONTROLLER] Content lengths:', {
            resumeLength: data.text.length,
            jobDescriptionLength: jobDescription.length,
            selfDescriptionLength: selfDescription.length
        })

        console.log('🤖 [INTERVIEW CONTROLLER] Calling AI service to generate report...')
        const interviewReportByAi = await generateInterviewReport({
            resume: data.text,
            jobDescription,
            selfDescription
        })
        console.log('✅ [INTERVIEW CONTROLLER] AI report generated successfully')
        console.log('📊 [INTERVIEW CONTROLLER] AI Response:', {
            matchScore: interviewReportByAi.matchScore,
            technicalQuestions: interviewReportByAi.technicalQuestion?.length || 0,
            behavioralQuestions: interviewReportByAi.behaviouralQuestion?.length || 0,
            skillGaps: interviewReportByAi.skillGap?.length || 0,
            preparationDays: interviewReportByAi.preparationPlan?.length || 0
        })

        console.log('💾 [INTERVIEW CONTROLLER] Saving to database...')
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: data.text,
            jobDescription,
            selfDescription,
            ...interviewReportByAi
        })
        console.log('✅ [INTERVIEW CONTROLLER] Saved to database. Report ID:', interviewReport._id)

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        })
        console.log('✅ [INTERVIEW CONTROLLER] Response sent successfully\n')
    } catch (error) {
        console.error('❌ [INTERVIEW CONTROLLER] Error:', {
            message: error.message,
            stack: error.stack
        })
        res.status(500).json({ message: "Failed to generate interview report" })
    }
}


async function getInterviewReportByIdController(req, res){
    try {
        const {interviewId} = req.params
        if (!mongoose.Types.ObjectId.isValid(interviewId)) {
            return res.status(400).json({ message: 'Invalid report ID' })
        }
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })
        
        if(!interviewReport){
            return res.status(404).json({
                message: "Interview report not found"
            })
        }

        res.status(200).json({
            message: "Interview report fetched successfully",
            interviewReport
        })
    } catch (error) {
        console.error("Error in getInterviewReportByIdController:", error)
        res.status(500).json({ message: "Failed to fetch interview report" })
    }
}

/**
 * @route GET /api/interview/all/:userId
 * @description get interview report by interviewId
 * @access private
 */

async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })
    } catch (error) {
        console.error("Error in getAllInterviewReportsController:", error)
        res.status(500).json({ message: "Failed to fetch interview reports" })
    }
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params
        if (!mongoose.Types.ObjectId.isValid(interviewReportId)) {
            return res.status(400).json({ message: 'Invalid report ID' })
        }

        const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)
    } catch (error) {
        console.error("Error in generateResumePdfController:", error)
        res.status(500).json({ message: "Failed to generate resume PDF" })
    }
}



module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }