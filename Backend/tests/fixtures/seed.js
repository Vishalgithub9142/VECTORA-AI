/**
 * Dummy seed data for the VECTORA AI test suite.
 * Used to pre-populate the in-memory MongoDB with realistic fixtures.
 */

const mongoose = require('mongoose')

// ── Users ────────────────────────────────────────────────────────────────────
const USERS = [
    {
        _id: new mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'),
        username: 'alice_dev',
        email: 'alice@test.com',
        // bcrypt hash of "Password@123"  (rounds=10) — verified correct
        password: '$2b$10$U8VBK3WgJuGLhBEhBB6S/OF/5nWooipyfF6fYcmzB9kTPUtNHybj.'
    },
    {
        _id: new mongoose.Types.ObjectId('bbbbbbbbbbbbbbbbbbbbbbbb'),
        username: 'bob_engineer',
        email: 'bob@test.com',
        // bcrypt hash of "Password@123"  (rounds=10) — verified correct
        password: '$2b$10$U8VBK3WgJuGLhBEhBB6S/OF/5nWooipyfF6fYcmzB9kTPUtNHybj.'
    }
]

// ── Interview Reports ────────────────────────────────────────────────────────
const INTERVIEW_REPORTS = [
    {
        _id: new mongoose.Types.ObjectId('cccccccccccccccccccccccc'),
        user: new mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'),
        title: 'Senior Frontend Engineer at TechCorp',
        jobDescription: 'We are looking for a Senior Frontend Engineer with 5+ years of React experience.',
        selfDescription: 'I am a frontend developer with 4 years of React, Redux, and TypeScript experience.',
        resume: 'Alice Developer\nEmail: alice@test.com\nSkills: React, TypeScript, Node.js\nExperience: 4 years at StartupXYZ',
        matchScore: 82,
        technicalQuestion: [
            {
                question: 'Explain the React reconciliation algorithm.',
                intention: 'Check deep React knowledge',
                answer: 'React uses a diffing algorithm to compare virtual DOM trees and update only changed nodes efficiently.'
            },
            {
                question: 'What are React hooks and why were they introduced?',
                intention: 'Assess modern React patterns',
                answer: 'Hooks allow function components to use state and lifecycle features without class components.'
            }
        ],
        behaviouralQuestion: [
            {
                question: 'Tell me about a time you improved app performance.',
                intention: 'Assess problem-solving ability',
                answer: 'Use the STAR method: Situation, Task, Action (code splitting, memoization), Result (metrics).'
            }
        ],
        skillGap: [
            { skill: 'GraphQL', severity: 'medium' },
            { skill: 'Next.js SSR', severity: 'low' }
        ],
        preparationPlan: [
            {
                day: 1,
                focus: 'React internals & performance',
                task: ['Study React Fiber architecture', 'Practice useMemo and useCallback']
            },
            {
                day: 2,
                focus: 'TypeScript advanced patterns',
                task: ['Generics', 'Conditional types', 'Build a typed utility library']
            }
        ]
    },
    {
        _id: new mongoose.Types.ObjectId('dddddddddddddddddddddddd'),
        user: new mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'),
        title: 'Backend Node.js Developer at CloudBase',
        jobDescription: 'Backend developer role with Node.js, Express, and MongoDB expertise required.',
        selfDescription: 'Backend developer experienced in Node.js, Express, MongoDB, and REST APIs.',
        resume: 'Alice Developer\nEmail: alice@test.com\nSkills: Node.js, Express, MongoDB\nExperience: 4 years',
        matchScore: 91,
        technicalQuestion: [
            {
                question: 'How does the Node.js event loop work?',
                intention: 'Assess Node.js fundamentals',
                answer: 'Node.js uses a single-threaded event loop with phases: timers, I/O callbacks, idle, poll, check, close.'
            }
        ],
        behaviouralQuestion: [
            {
                question: 'Describe a challenging API design decision.',
                intention: 'Gauge architectural thinking',
                answer: 'Discuss REST vs GraphQL tradeoffs, versioning strategy, and backward compatibility.'
            }
        ],
        skillGap: [
            { skill: 'Redis caching', severity: 'high' }
        ],
        preparationPlan: [
            {
                day: 1,
                focus: 'Node.js internals',
                task: ['Event loop deep dive', 'Streams and Buffers', 'Cluster module']
            }
        ]
    },
    {
        _id: new mongoose.Types.ObjectId('eeeeeeeeeeeeeeeeeeeeeeee'),
        user: new mongoose.Types.ObjectId('bbbbbbbbbbbbbbbbbbbbbbbb'),
        title: 'Full Stack Developer at InnovateLab',
        jobDescription: 'Full-stack developer needed with React and Node.js skills.',
        selfDescription: 'Full-stack developer with React on frontend and Node.js on backend.',
        resume: 'Bob Engineer\nEmail: bob@test.com\nSkills: React, Node.js, PostgreSQL\nExperience: 3 years',
        matchScore: 75,
        technicalQuestion: [
            {
                question: 'Explain how JWT authentication works.',
                intention: 'Test security knowledge',
                answer: 'JWT is a stateless token with header.payload.signature. Server signs it; client stores and sends it on each request.'
            }
        ],
        behaviouralQuestion: [
            {
                question: 'How do you handle tight deadlines?',
                intention: 'Evaluate time management',
                answer: 'Prioritize tasks by impact, communicate blockers early, and deliver an MVP first.'
            }
        ],
        skillGap: [
            { skill: 'Docker', severity: 'medium' },
            { skill: 'AWS', severity: 'high' }
        ],
        preparationPlan: [
            {
                day: 1,
                focus: 'System design basics',
                task: ['Read about load balancing', 'Practice designing a URL shortener']
            }
        ]
    }
]

module.exports = { USERS, INTERVIEW_REPORTS }
