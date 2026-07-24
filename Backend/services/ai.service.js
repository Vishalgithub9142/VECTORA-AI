const { GoogleGenAI, Type } = require("@google/genai");
const puppeteer = require("puppeteer")

function getAiClient() {
    return new GoogleGenAI({
        apiKey: process.env.GOOGLE_GENAI_API_KEY
    })
}

const interviewReportSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: {
            type: Type.NUMBER,
            description: "Match score (0 to 100) between resume and job description"
        },
        title: {
            type: Type.STRING,
            description: "The job title for which the interview report is generated"
        },
        technicalQuestion: {
            type: Type.ARRAY,
            description: "Technical questions that can be asked in interview based on resume and job description",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "Technical question" },
                    intention: { type: Type.STRING, description: "Intention of the interviewer behind asking this question" },
                    answer: { type: Type.STRING, description: "How to answer this question" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behaviouralQuestion: {
            type: Type.ARRAY,
            description: "Behavioural questions that can be asked in interview",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "Behavioural question" },
                    intention: { type: Type.STRING, description: "Intention of the interviewer" },
                    answer: { type: Type.STRING, description: "How to answer this question" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGap: {
            type: Type.ARRAY,
            description: "List of skill gaps in candidate based on resume and job description",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "The skill candidate is lacking" },
                    severity: { type: Type.STRING, enum: ["low", "medium", "high"], description: "Severity of lacking skill" }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            description: "Preparation plan for the interview",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.NUMBER, description: "The day of preparation" },
                    focus: { type: Type.STRING, description: "The focus of preparation" },
                    task: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Tasks to be done on that day"
                    }
                },
                required: ["day", "focus", "task"]
            }
        }
    },
    required: ["matchScore", "title", "technicalQuestion", "behaviouralQuestion", "skillGap", "preparationPlan"]
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const ai = getAiClient()

    const prompt = `Generate the interview Report according to the information provided by user. 
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: interviewReportSchema
        }
    })

    return JSON.parse(response.text)
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const ai = getAiClient()

    const resumePdfSchema = {
        type: Type.OBJECT,
        properties: {
            html: {
                type: Type.STRING,
                description: "The HTML content of the resume which can be converted to PDF using puppeteer"
            }
        },
        required: ["html"]
    }

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: resumePdfSchema,
        }
    })

    const jsonContent = JSON.parse(response.text)
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }