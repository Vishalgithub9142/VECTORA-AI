import React, { useState, useRef } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

// ─────────────────────────────────────────────
// UI Layer — no state, no hooks, no API calls
// ─────────────────────────────────────────────

const Home = () => {

  const { loading, generateReport, reports } = useInterview()
  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const resumeInputRef = useRef()


  const navigate = useNavigate()

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0]
    const data = await generateReport({ jobDescription, selfDescription, resumeFile })
    navigate(`/interview/${data._id}`)
  }

  if (loading) {
    return (
      <main className='loading-screen'>
        <h1>Loading your interview plan...</h1>
      </main>
    )
  }

  return (
    <main
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: '#0d1117', fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Google Font ── */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ── Page header ── */}
      <section className="text-center pt-10 pb-6 px-4">
        <p className="text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
          Let our AI analyze the job requirements and your unique profile to build a{' '}
          <span className="text-white font-medium">winning strategy.</span>
        </p>
      </section>

      {/* ── Main card ── */}
      <div className="flex-1 flex items-start justify-center px-4 pb-10">
        <div
          className="w-full max-w-4xl rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#161b27', border: '1px solid #1e2840' }}
        >
          <div className="flex flex-col md:flex-row min-h-115">

            {/* ════════ LEFT — Target Job Description ════════ */}
            <div
              className="flex-1 flex flex-col p-7"
              style={{ borderRight: '1px solid #1e2840' }}
            >
              {/* Section header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  {/* briefcase icon */}
                  <svg
                    className="w-5 h-5"
                    style={{ color: '#e0407b' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
                    />
                  </svg>
                  <h2 className="text-white font-semibold text-base">
                    Target Job Description
                  </h2>
                </div>

                <span
                  className="text-xs font-bold px-2.5 py-1 rounded"
                  style={{
                    backgroundColor: 'rgba(224,64,123,0.15)',
                    color: '#e0407b',
                    border: '1px solid rgba(224,64,123,0.35)',
                    letterSpacing: '0.07em',
                  }}
                >
                  REQUIRED
                </span>
              </div>

              {/* Textarea */}
              <textarea
                onChange={(e) => { setJobDescription(e.target.value) }}
                id="jobDescription"
                name="jobDescription"
                placeholder="Paste the full job description here... e.g., 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                className="flex-1 w-full resize-none text-sm leading-relaxed outline-none placeholder-slate-600 rounded-lg p-4"
                style={{
                  backgroundColor: '#1a2035',
                  color: '#c9d1e0',
                  border: '1px solid #2a3450',
                  minHeight: '280px',
                }}
              />

              {/* Char counter */}
              <p className="text-right text-xs mt-2" style={{ color: '#455070' }}>
                0 / 5000 chars
              </p>
            </div>

            {/* ════════ RIGHT — Your Profile ════════ */}
            <div className="flex-1 flex flex-col p-7 gap-5">
              {/* Section header */}
              <div className="flex items-center gap-2">
                {/* person icon */}
                <svg
                  className="w-5 h-5"
                  style={{ color: '#e0407b' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A9 9 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h2 className="text-white font-semibold text-base">Your Profile</h2>
              </div>

              {/* ── Resume upload ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-slate-300 text-sm font-medium">Upload Resume</span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: 'rgba(224,64,123,0.15)',
                      color: '#e0407b',
                      border: '1px solid rgba(224,64,123,0.35)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    BEST RESULTS
                  </span>
                </div>

                {/* Drop zone */}
                <button
                  type="button"
                  id="resumeDropzone"
                  onClick={() => resumeInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-2 rounded-xl py-8 transition-colors cursor-pointer"
                  style={{
                    backgroundColor: '#1a2035',
                    border: '1.5px dashed #2a3a5c',
                  }}
                >
                  {/* Upload cloud icon */}
                  <svg
                    className="w-10 h-10"
                    style={{ color: '#e0407b' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16V4m0 0L8 8m4-4l4 4M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1"
                    />
                  </svg>
                  <p className="text-slate-300 text-sm font-medium">
                    Click to upload or drag &amp; drop
                  </p>
                  <p className="text-xs" style={{ color: '#455070' }}>
                    PDF or DOCX (Max 5MB)
                  </p>
                </button>

                {/* Hidden file input */}
                <input
                  ref={resumeInputRef}
                  hidden
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.docx"
                />
              </div>

              {/* ── OR divider ── */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ backgroundColor: '#1e2840' }} />
                <span className="text-xs font-medium" style={{ color: '#455070' }}>
                  OR
                </span>
                <div className="flex-1 h-px" style={{ backgroundColor: '#1e2840' }} />
              </div>

              {/* ── Quick Self-Description ── */}
              <div className="flex flex-col gap-2 flex-1">
                <label
                  htmlFor="selfDescription"
                  className="text-slate-300 text-sm font-medium"
                >
                  Quick Self-Description
                </label>
                <textarea
                  onChange={(e) => { setSelfDescription(e.target.value) }}
                  id="selfDescription"
                  name="selfDescription"
                  placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                  className="flex-1 w-full resize-none text-sm leading-relaxed outline-none placeholder-slate-600 rounded-lg p-4"
                  style={{
                    backgroundColor: '#1a2035',
                    color: '#c9d1e0',
                    border: '1px solid #2a3450',
                    minHeight: '110px',
                  }}
                />
              </div>

              {/* ── Info banner ── */}
              <div
                className="flex items-start gap-2.5 rounded-xl p-4 text-sm"
                style={{
                  backgroundColor: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.2)',
                }}
              >
                {/* Info icon */}
                <svg
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: '#60a5fa' }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 001-1v-4a1 1 0 10-2 0v4a1 1 0 001 1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p style={{ color: '#94a3b8' }}>
                  Either a{' '}
                  <span className="font-semibold" style={{ color: '#e0407b' }}>
                    Resume
                  </span>{' '}
                  or a{' '}
                  <span className="font-semibold" style={{ color: '#e0407b' }}>
                    Self Description
                  </span>{' '}
                  is required to generate a personalized plan.
                </p>
              </div>
            </div>
          </div>

          {/* ════════ FOOTER — Generate bar ════════ */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 px-7 py-5"
            style={{ borderTop: '1px solid #1e2840', backgroundColor: '#131929' }}
          >
            {/* AI status pill */}
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: '#22c55e', boxShadow: '0 0 6px #22c55e' }}
              />
              <span className="text-sm" style={{ color: '#6b7fa3' }}>
                AI-Powered Strategy Generation •{' '}
                <span style={{ color: '#8b9fc5' }}>Approx 30s</span>
              </span>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerateReport}
              id="generateStrategyBtn"
              type="button"
              className="flex items-center gap-2.5 px-7 py-3 rounded-xl font-semibold text-sm text-white transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #e0407b 0%, #c02060 100%)',
                boxShadow: '0 4px 20px rgba(224,64,123,0.4)',
              }}
            >
              Generate My Interview Strategy
            </button>
          </div>
        </div>
      </div>

      {/* ── Recent Reports ── */}
      {reports && reports.length > 0 && (
        <section className="px-4 pb-10 w-full max-w-4xl mx-auto">
          {/* Section heading */}
          <h2 className="text-white font-bold text-xl mb-5">My Recent Interview Plans</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((r) => {
              const score = r.matchScore ?? 0
              const date = r.createdAt
                ? new Date(r.createdAt).toLocaleDateString('en-US')
                : ''

              return (
                <button
                  key={r._id}
                  id={`report-card-${r._id}`}
                  onClick={() => navigate(`/interview/${r._id}`)}
                  className="w-full text-left rounded-2xl p-5 flex flex-col gap-2 transition-all duration-200 cursor-pointer"
                  style={{ backgroundColor: '#161b27', border: '1px solid #1e2840' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(224,64,123,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#1e2840'}
                >
                  <p className="font-bold text-base leading-snug" style={{ color: '#ffffff' }}>
                    {r.title || 'Interview Report'}
                  </p>
                  <p className="text-sm" style={{ color: '#6b7fa3' }}>
                    Generated on {date}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: '#e0407b' }}>
                    Match Score: {score}%
                  </p>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Page footer ── */}
      <footer className="pb-6 flex justify-center gap-8">
        {['Privacy Policy', 'Terms of Service', 'Help Center'].map((link) => (
          <a
            key={link}
            href="#"
            className="text-xs transition-colors"
            style={{ color: '#455070' }}
          >
            {link}
          </a>
        ))}
      </footer>
    </main>
  )
}

export default Home