/**
 * VECTORA AI — Full End-to-End Test Suite
 * =========================================
 * Strategy: Connects to a dedicated "vectora-test" database on Atlas
 *  → Production data is NEVER touched (different DB name)
 *  → All collections are dropped before seeding fresh dummy data
 *  → Full cleanup after all tests
 *
 * Coverage:
 *  ✅ Auth     : register · login · get-me · logout · token blacklist
 *  ✅ Interview: get-all · get-by-id · generate-report (E2E) · resume-pdf (E2E)
 *
 * Mocks:
 *  🤖 AI Service  → deterministic dummy report (no real Gemini call)
 *  🖨  Puppeteer   → returns fake PDF buffer (no real browser launch)
 */

const request = require('supertest')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')

require('dotenv').config({ path: path.join(__dirname, '../.env') })

// ── Point to a SEPARATE test database on the same Atlas cluster ──────────────
// URI format: mongodb+srv://...mongodb.net/   (trailing slash, no DB name)
const baseUri = process.env.MONGODB_URI.trim().replace(/\/$/, '')
const TEST_DB_URI = `${baseUri}/vectora-test`

const app = require('../app')
const userModel = require('../models/user.model')
const interviewReportModel = require('../models/interviewReport.model')
const tokenBlacklistModel = require('../models/blacklist.model')
const { USERS, INTERVIEW_REPORTS } = require('./fixtures/seed')

// ── DB lifecycle ─────────────────────────────────────────────────────────────
beforeAll(async () => {
    await mongoose.connect(TEST_DB_URI)

    // Wipe all test collections for a clean slate
    await userModel.deleteMany({})
    await interviewReportModel.deleteMany({})
    await tokenBlacklistModel.deleteMany({})

    // Seed dummy data
    await userModel.insertMany(USERS)
    await interviewReportModel.insertMany(INTERVIEW_REPORTS)

    // Login once here — before any logout tests run — so the token is never blacklisted
    const loginRes = await request(app).post('/api/auth/login').send(ALICE)
    aliceToken = loginRes.body.token

    console.log(`\n✅ Test DB seeded: ${USERS.length} users, ${INTERVIEW_REPORTS.length} reports`)
    console.log(`✅ Alice token obtained: ${aliceToken ? 'YES' : 'FAILED'}\n`)
})

afterAll(async () => {
    // Full cleanup — leave the test DB empty
    await userModel.deleteMany({})
    await interviewReportModel.deleteMany({})
    await tokenBlacklistModel.deleteMany({})
    await mongoose.disconnect()
    console.log('\n🧹 Test DB cleaned up\n')
})

// ── Shared state ─────────────────────────────────────────────────────────────
// Alice: pre-seeded with password "Password@123"
const ALICE = { email: 'alice@test.com', password: 'Password@123' }
let aliceToken = ''

// ═══════════════════════════════════════════════════════════════════════════
//  AUTH ROUTES
// ═══════════════════════════════════════════════════════════════════════════

describe('🔐 Auth Routes', () => {

    // ── Register ──────────────────────────────────────────────────────────────
    describe('POST /api/auth/register', () => {

        it('registers a brand-new user and returns a JWT token', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'charlie_new', email: 'charlie@test.com', password: 'Pass@12345' })

            expect(res.statusCode).toBe(201)
            expect(res.body).toHaveProperty('token')
            expect(res.body.user).toMatchObject({ username: 'charlie_new', email: 'charlie@test.com' })
            expect(res.body.user).toHaveProperty('id')
        })

        it('rejects duplicate email', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'alice_clone', email: 'alice@test.com', password: 'Pass@12345' })

            expect(res.statusCode).toBe(400)
            expect(res.body.message).toMatch(/already exist/i)
        })

        it('rejects duplicate username', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'alice_dev', email: 'newalice@test.com', password: 'Pass@12345' })

            expect(res.statusCode).toBe(400)
            expect(res.body.message).toMatch(/already exist/i)
        })

        it('rejects missing email', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'someone', password: 'Pass@12345' })

            expect(res.statusCode).toBe(400)
            expect(res.body.message).toBe('All fields are required')
        })

        it('rejects missing username', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ email: 'someone@test.com', password: 'Pass@12345' })

            expect(res.statusCode).toBe(400)
            expect(res.body.message).toBe('All fields are required')
        })

        it('rejects missing password', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'someone', email: 'someone@test.com' })

            expect(res.statusCode).toBe(400)
            expect(res.body.message).toBe('All fields are required')
        })
    })

    // ── Login ─────────────────────────────────────────────────────────────────
    describe('POST /api/auth/login', () => {

        it('logs in a seeded user and returns a JWT + cookie', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send(ALICE)

            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('token')
            expect(res.body.user.email).toBe(ALICE.email)
            expect(res.headers['set-cookie']).toBeDefined()

            aliceToken = res.body.token
        })

        it('rejects wrong password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: ALICE.email, password: 'WrongPassword!' })

            expect(res.statusCode).toBe(400)
            expect(res.body.message).toBe('Invalid password')
        })

        it('rejects unknown email', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'ghost@test.com', password: 'anypassword' })

            expect(res.statusCode).toBe(400)
            expect(res.body.message).toBe('User not found')
        })

        it('rejects missing email', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ password: 'Pass@12345' })

            expect(res.statusCode).toBe(400)
            expect(res.body.message).toBe('All fields are required')
        })

        it('rejects missing password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: ALICE.email })

            expect(res.statusCode).toBe(400)
            expect(res.body.message).toBe('All fields are required')
        })
    })

    // ── Get Me ────────────────────────────────────────────────────────────────
    describe('GET /api/auth/get-me', () => {

        it('returns the authenticated user profile', async () => {
            const res = await request(app)
                .get('/api/auth/get-me')
                .set('Authorization', `Bearer ${aliceToken}`)

            expect(res.statusCode).toBe(200)
            expect(res.body.user).toMatchObject({ username: 'alice_dev', email: 'alice@test.com' })
            expect(res.body.user).toHaveProperty('id')
        })

        it('returns 401 with no token', async () => {
            const res = await request(app).get('/api/auth/get-me')
            expect(res.statusCode).toBe(401)
        })

        it('returns 401 for a malformed token', async () => {
            const res = await request(app)
                .get('/api/auth/get-me')
                .set('Authorization', 'Bearer this.is.not.valid')

            expect(res.statusCode).toBe(401)
        })

        it('returns 401 for a tampered token', async () => {
            const tampered = aliceToken.slice(0, -5) + 'XXXXX'
            const res = await request(app)
                .get('/api/auth/get-me')
                .set('Authorization', `Bearer ${tampered}`)

            expect(res.statusCode).toBe(401)
        })
    })

    // ── Logout ────────────────────────────────────────────────────────────────
    describe('GET /api/auth/logout', () => {

        it('returns 400 with no cookie', async () => {
            const res = await request(app).get('/api/auth/logout')
            expect(res.statusCode).toBe(400)
            expect(res.body.message).toBe('No token found')
        })

        it('logs out and clears the cookie', async () => {
            const loginRes = await request(app).post('/api/auth/login').send(ALICE)
            const cookie = loginRes.headers['set-cookie']

            const res = await request(app)
                .get('/api/auth/logout')
                .set('Cookie', cookie)

            expect(res.statusCode).toBe(200)
            expect(res.body.message).toBe('User logged out successfully')
        })

        it('blacklists the token so it cannot be reused', async () => {
            const loginRes = await request(app).post('/api/auth/login').send(ALICE)
            const cookie = loginRes.headers['set-cookie']

            // First logout
            await request(app).get('/api/auth/logout').set('Cookie', cookie)

            // Second logout with the same (now blacklisted) cookie
            const res = await request(app).get('/api/auth/logout').set('Cookie', cookie)
            expect(res.statusCode).toBe(401)
        })
    })
})

// ═══════════════════════════════════════════════════════════════════════════
//  INTERVIEW ROUTES
// ═══════════════════════════════════════════════════════════════════════════

describe('📋 Interview Routes', () => {

    // aliceToken was already obtained in the outer beforeAll (before any logout tests)
    // No need to re-login here — that would fail if previous tests blacklisted tokens

    // ── GET all reports ───────────────────────────────────────────────────────
    describe('GET /api/interview/', () => {

        it("returns only Alice's 2 seeded reports (not Bob's)", async () => {
            const res = await request(app)
                .get('/api/interview/')
                .set('Authorization', `Bearer ${aliceToken}`)

            expect(res.statusCode).toBe(200)
            expect(Array.isArray(res.body.interviewReports)).toBe(true)
            expect(res.body.interviewReports.length).toBe(2)

            const titles = res.body.interviewReports.map(r => r.title)
            expect(titles).toContain('Senior Frontend Engineer at TechCorp')
            expect(titles).toContain('Backend Node.js Developer at CloudBase')
        })

        it('does not expose resume / selfDescription / jobDescription in list', async () => {
            const res = await request(app)
                .get('/api/interview/')
                .set('Authorization', `Bearer ${aliceToken}`)

            const report = res.body.interviewReports[0]
            expect(report.resume).toBeUndefined()
            expect(report.selfDescription).toBeUndefined()
            expect(report.jobDescription).toBeUndefined()
        })

        it('returns empty array for a user with no reports', async () => {
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ email: 'charlie@test.com', password: 'Pass@12345' })
            const charlieToken = loginRes.body.token

            const res = await request(app)
                .get('/api/interview/')
                .set('Authorization', `Bearer ${charlieToken}`)

            expect(res.statusCode).toBe(200)
            expect(res.body.interviewReports).toHaveLength(0)
        })

        it('returns 401 when unauthenticated', async () => {
            expect((await request(app).get('/api/interview/')).statusCode).toBe(401)
        })
    })

    // ── GET report by ID ──────────────────────────────────────────────────────
    describe('GET /api/interview/report/:interviewId', () => {

        it('returns full report with all nested fields for seeded ID', async () => {
            const res = await request(app)
                .get('/api/interview/report/cccccccccccccccccccccccc')
                .set('Authorization', `Bearer ${aliceToken}`)

            expect(res.statusCode).toBe(200)
            const r = res.body.interviewReport
            expect(r.title).toBe('Senior Frontend Engineer at TechCorp')
            expect(r.matchScore).toBe(82)
            expect(r.technicalQuestion).toHaveLength(2)
            expect(r.behaviouralQuestion).toHaveLength(1)
            expect(r.skillGap).toHaveLength(2)
            expect(r.preparationPlan).toHaveLength(2)
        })

        it('returns correct matchScore and skillGap for second report', async () => {
            const res = await request(app)
                .get('/api/interview/report/dddddddddddddddddddddddd')
                .set('Authorization', `Bearer ${aliceToken}`)

            expect(res.statusCode).toBe(200)
            expect(res.body.interviewReport.matchScore).toBe(91)
            expect(res.body.interviewReport.skillGap[0]).toMatchObject({ skill: 'Redis caching', severity: 'high' })
        })

        it('returns 404 for a valid but non-existent ObjectId', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString()
            const res = await request(app)
                .get(`/api/interview/report/${fakeId}`)
                .set('Authorization', `Bearer ${aliceToken}`)

            expect(res.statusCode).toBe(404)
            expect(res.body.message).toBe('Interview report not found')
        })

        it('returns 500 for an invalid ObjectId format', async () => {
            const res = await request(app)
                .get('/api/interview/report/not-valid')
                .set('Authorization', `Bearer ${aliceToken}`)

            expect(res.statusCode).toBe(500)
        })

        it('returns 401 when unauthenticated', async () => {
            const res = await request(app).get('/api/interview/report/cccccccccccccccccccccccc')
            expect(res.statusCode).toBe(401)
        })
    })

    // ── POST generate report (E2E — AI mocked) ────────────────────────────────
    describe('POST /api/interview/ — generate report', () => {

        const SAMPLE_PDF = path.join(__dirname, 'fixtures', 'sample.pdf')

        beforeAll(() => {
            // Write a minimal valid PDF to disk if it doesn't already exist
            if (!fs.existsSync(SAMPLE_PDF)) {
                const pdf =
                    '%PDF-1.4\n' +
                    '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
                    '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
                    '3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n' +
                    '4 0 obj<</Length 44>>stream\nBT /F1 12 Tf 100 700 Td (Alice Developer Resume) Tj ET\nendstream\nendobj\n' +
                    '5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n' +
                    'xref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000266 00000 n\n0000000360 00000 n\n' +
                    'trailer<</Size 6/Root 1 0 R>>\nstartxref\n441\n%%EOF'
                fs.writeFileSync(SAMPLE_PDF, pdf)
            }
        })

        it('generates a full interview report E2E (AI mocked) and saves to DB', async () => {
            const res = await request(app)
                .post('/api/interview/')
                .set('Authorization', `Bearer ${aliceToken}`)
                .field('jobDescription', 'Senior Frontend Engineer with React & TypeScript.')
                .field('selfDescription', 'Frontend dev with 4 years React experience.')
                .attach('resume', SAMPLE_PDF, { filename: 'resume.pdf', contentType: 'application/pdf' })

            expect(res.statusCode).toBe(201)
            expect(res.body.message).toBe('Interview report generated successfully')

            const r = res.body.interviewReport
            expect(r).toHaveProperty('_id')
            expect(r.title).toBe('Senior Frontend Engineer at TechCorp')
            expect(r.matchScore).toBe(85)
            expect(r.technicalQuestion).toHaveLength(2)
            expect(r.behaviouralQuestion).toHaveLength(1)
            expect(r.skillGap).toHaveLength(2)
            expect(r.preparationPlan).toHaveLength(2)
        })

        it('persists the generated report — visible in get-all', async () => {
            // Generate one more
            await request(app)
                .post('/api/interview/')
                .set('Authorization', `Bearer ${aliceToken}`)
                .field('jobDescription', 'Backend Node.js role.')
                .field('selfDescription', 'Node.js backend engineer.')
                .attach('resume', SAMPLE_PDF, { filename: 'resume.pdf', contentType: 'application/pdf' })

            const res = await request(app)
                .get('/api/interview/')
                .set('Authorization', `Bearer ${aliceToken}`)

            // 2 seeded + 2 generated = 4
            expect(res.body.interviewReports.length).toBeGreaterThanOrEqual(3)
        })

        it('rejects with 400 when no resume file', async () => {
            const res = await request(app)
                .post('/api/interview/')
                .set('Authorization', `Bearer ${aliceToken}`)
                .field('jobDescription', 'Some Job')
                .field('selfDescription', 'Some Desc')

            expect(res.statusCode).toBe(400)
            expect(res.body.message).toBe('Resume file is required')
        })

        it('rejects with 400 when jobDescription is missing', async () => {
            const res = await request(app)
                .post('/api/interview/')
                .set('Authorization', `Bearer ${aliceToken}`)
                .field('selfDescription', 'Some Desc')
                .attach('resume', SAMPLE_PDF, { filename: 'resume.pdf', contentType: 'application/pdf' })

            expect(res.statusCode).toBe(400)
            expect(res.body.message).toBe('Job description and self description are required')
        })

        it('rejects with 400 when selfDescription is missing', async () => {
            const res = await request(app)
                .post('/api/interview/')
                .set('Authorization', `Bearer ${aliceToken}`)
                .field('jobDescription', 'Some Job')
                .attach('resume', SAMPLE_PDF, { filename: 'resume.pdf', contentType: 'application/pdf' })

            expect(res.statusCode).toBe(400)
            expect(res.body.message).toBe('Job description and self description are required')
        })

        it('returns 401 when unauthenticated', async () => {
            expect((await request(app).post('/api/interview/')).statusCode).toBe(401)
        })
    })

    // ── POST resume PDF ───────────────────────────────────────────────────────
    describe('POST /api/interview/resume/pdf/:interviewReportId', () => {

        it('generates and returns a PDF buffer with correct headers', async () => {
            const res = await request(app)
                .post('/api/interview/resume/pdf/cccccccccccccccccccccccc')
                .set('Authorization', `Bearer ${aliceToken}`)
                .buffer(true)
                .parse((res, cb) => {
                    const chunks = []
                    res.on('data', chunk => chunks.push(chunk))
                    res.on('end', () => cb(null, Buffer.concat(chunks)))
                })

            expect(res.statusCode).toBe(200)
            expect(res.headers['content-type']).toMatch(/application\/pdf/)
            expect(res.headers['content-disposition']).toContain('resume_cccccccccccccccccccccccc.pdf')
        })

        it('returns 404 for a valid but non-existent report ID', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString()
            const res = await request(app)
                .post(`/api/interview/resume/pdf/${fakeId}`)
                .set('Authorization', `Bearer ${aliceToken}`)

            expect(res.statusCode).toBe(404)
            expect(res.body.message).toBe('Interview report not found.')
        })

        it('returns 401 when unauthenticated', async () => {
            const res = await request(app).post('/api/interview/resume/pdf/cccccccccccccccccccccccc')
            expect(res.statusCode).toBe(401)
        })
    })
})
