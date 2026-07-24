/**
 * Mock for ../services/ai.service.js
 * Replaces Gemini API calls with deterministic dummy responses.
 * Used in tests via Jest moduleNameMapper.
 */

const generateInterviewReport = jest.fn().mockResolvedValue({
    title: 'Senior Frontend Engineer at TechCorp',
    matchScore: 85,
    technicalQuestion: [
        {
            question: 'Explain the React reconciliation algorithm.',
            intention: 'Test deep React knowledge',
            answer: 'React uses a virtual DOM diffing algorithm to minimize real DOM updates.'
        },
        {
            question: 'What is useCallback and when should you use it?',
            intention: 'Assess React optimization knowledge',
            answer: 'useCallback memoizes a function reference, preventing unnecessary re-renders of child components.'
        }
    ],
    behaviouralQuestion: [
        {
            question: 'Describe a time you improved team collaboration.',
            intention: 'Assess soft skills',
            answer: 'Use the STAR method: Set context, describe your Task, the Action you took, and the Result achieved.'
        }
    ],
    skillGap: [
        { skill: 'GraphQL', severity: 'medium' },
        { skill: 'WebSockets', severity: 'low' }
    ],
    preparationPlan: [
        {
            day: 1,
            focus: 'React internals',
            task: ['Study React Fiber', 'Practice useMemo & useCallback', 'Review React 18 concurrent features']
        },
        {
            day: 2,
            focus: 'System design',
            task: ['Design a real-time chat app', 'Study CDN & caching strategies']
        }
    ]
})

const generateResumePdf = jest.fn().mockResolvedValue(
    Buffer.from('<html><body><h1>Mock Resume PDF</h1></body></html>')
)

module.exports = { generateInterviewReport, generateResumePdf }
