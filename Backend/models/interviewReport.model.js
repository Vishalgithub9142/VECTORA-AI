const mongoose =  require('mongoose')


const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type:String,
        required: [true, "Answer is required"]
    }
},{
    _id: false
})


const behaviouralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type:String,
        required: [true, "Answer is required"]
    }
},{
    _id: false
})


const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill name is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"]
    }
},{
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    task: [{
        type: String,
        required: [true, "Task is required"]
    }]
},{
    _id: false
})

const interviewReportSchema = new mongoose.Schema({

    jobDescription: {
        type: String,
        require: [true, "Job description is required"]
    },
    resume: {
        type: String
    },
    selfDescription: {
        type: String
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestion: [technicalQuestionSchema],
    behaviouralQuestion: [behaviouralQuestionSchema],
    skillGap: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    }
},{
    timestamps: true
})

const interviewReportModel = mongoose.model('interviewReport', interviewReportSchema)

module.exports = interviewReportModel