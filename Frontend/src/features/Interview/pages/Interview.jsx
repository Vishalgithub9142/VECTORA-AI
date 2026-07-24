import React, { useState , useEffect} from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────

const ChevronIcon = ({ open }) => (
  <svg
    className="w-4 h-4 shrink-0 transition-transform duration-300"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: '#6b7fa3' }}
    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)

const BrainIcon = () => (
  <svg className="w-5 h-5" style={{ color: '#e0407b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
)

const PersonIcon = () => (
  <svg className="w-5 h-5" style={{ color: '#e0407b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const MapIcon = () => (
  <svg className="w-5 h-5" style={{ color: '#e0407b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
)

const AlertIcon = () => (
  <svg className="w-4 h-4 shrink-0" style={{ color: '#f59e0b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#22c55e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

// ─────────────────────────────────────────────
// Severity styles
// ─────────────────────────────────────────────

const severityStyle = {
  high: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)', color: '#f87171', label: 'HIGH' },
  medium: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', color: '#fbbf24', label: 'MED' },
  low: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.35)', color: '#4ade80', label: 'LOW' },
}

// ─────────────────────────────────────────────
// Q&A Accordion Card
// ─────────────────────────────────────────────

const QuestionCard = ({ index, question, intention, answer }) => {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{ backgroundColor: '#1a2035', border: `1px solid ${open ? 'rgba(224,64,123,0.4)' : '#2a3450'}` }}
    >
      <button
        id={`question-card-${index}`}
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start gap-3 p-4 text-left cursor-pointer"
      >
        <span
          className="text-xs font-bold px-2 py-0.5 rounded shrink-0 mt-0.5"
          style={{ backgroundColor: 'rgba(224,64,123,0.15)', color: '#e0407b', border: '1px solid rgba(224,64,123,0.35)' }}
        >
          Q{index + 1}
        </span>
        <p className="text-sm font-medium leading-relaxed flex-1" style={{ color: '#c9d1e0' }}>
          {question}
        </p>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          <div
            className="rounded-lg p-3 flex items-start gap-2.5"
            style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
          >
            <AlertIcon />
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: '#fbbf24' }}>INTENT</p>
              <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>{intention}</p>
            </div>
          </div>

          <div
            className="rounded-lg p-3 flex items-start gap-2.5"
            style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            <CheckIcon />
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: '#4ade80' }}>MODEL ANSWER</p>
              <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>{answer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Preparation Day Card
// ─────────────────────────────────────────────

const DayCard = ({ day, focus, tasks }) => (
  <div className="rounded-xl p-5" style={{ backgroundColor: '#1a2035', border: '1px solid #2a3450' }}>
    <div className="flex items-center gap-3 mb-4">
      <span
        className="text-xs font-bold px-2.5 py-1 rounded-lg shrink-0"
        style={{ background: 'linear-gradient(135deg, #e0407b 0%, #c02060 100%)', color: '#fff' }}
      >
        DAY {day}
      </span>
      <h3 className="text-sm font-semibold" style={{ color: '#c9d1e0' }}>{focus}</h3>
    </div>
    <ul className="flex flex-col gap-2.5">
      {tasks.map((task, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5"
            style={{ backgroundColor: 'rgba(224,64,123,0.15)', color: '#e0407b', border: '1px solid rgba(224,64,123,0.3)' }}
          >
            {i + 1}
          </span>
          <p className="text-xs leading-relaxed" style={{ color: '#8b9fc5' }}>{task}</p>
        </li>
      ))}
    </ul>
  </div>
)

// ─────────────────────────────────────────────
// Match Score Ring
// ─────────────────────────────────────────────

const MatchScoreRing = ({ score }) => {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (score / 100) * circumference
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
      <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="36" cy="36" r={radius} fill="none" stroke="#1e2840" strokeWidth="5" />
        <circle
          cx="36" cy="36" r={radius} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <span className="absolute text-sm font-bold" style={{ color }}>{score}%</span>
    </div>
  )
}

// ─────────────────────────────────────────────
// Placeholder data — replace with API response
// ─────────────────────────────────────────────



const TABS = [
  { id: 'technical',   label: 'Technical Questions',  icon: BrainIcon },
  { id: 'behavioural', label: 'Behavioral Questions', icon: PersonIcon },
  { id: 'roadmap',     label: 'Road Map',              icon: MapIcon },
]

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

const Interview = () => {
  const [activeTab, setActiveTab] = useState('technical')
  const { report, loading, getReportById, getResumePdf } = useInterview()
  const { interviewId } = useParams()

  useEffect(() => {
    getReportById(interviewId)
  }, [interviewId])

  

  if (loading || !report) {
    return (
      <main
        className="min-h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: '#0d1117', fontFamily: "'Inter', sans-serif" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: 'rgba(224,64,123,0.3)', borderTopColor: '#e0407b' }}
          />
          <p className="text-sm" style={{ color: '#6b7fa3' }}>Loading your interview strategy…</p>
        </div>
      </main>
    )
  }

  return (
    <main
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: '#0d1117', fontFamily: "'Inter', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ── Header ── */}
      <section className="text-center pt-10 pb-6 px-4">
        <div className="flex items-center justify-center gap-4 mb-1">
          <MatchScoreRing score={report.matchScore} />
          <div className="text-left">
            <p className="text-white font-semibold text-lg">Interview Strategy</p>
            <p className="text-sm" style={{ color: '#6b7fa3' }}>
              AI-generated plan based on your profile &amp; job description
            </p>
          </div>
        </div>
      </section>

      {/* ── 3-column layout ── */}
      <div className="flex-1 flex items-start justify-center px-4 pb-10">
        <div
          className="w-full max-w-7xl rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#161b27', border: '1px solid #1e2840' }}
        >
          <div className="flex" style={{ minHeight: '600px' }}>

            {/* ════ LEFT — Navigation ════ */}
            <div
              className="flex flex-col p-5 gap-1.5 shrink-0"
              style={{ width: '220px', borderRight: '1px solid #1e2840' }}
            >
              <p
                className="text-xs font-bold mb-3"
                style={{ color: '#455070', letterSpacing: '0.1em' }}
              >
                SECTIONS
              </p>


              {TABS.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id
                return (
                  <button
                    key={id}
                    id={`tab-${id}`}
                    onClick={() => setActiveTab(id)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-200 cursor-pointer"
                    style={
                      isActive
                        ? { background: 'rgba(224,64,123,0.12)', border: '1px solid rgba(224,64,123,0.35)', color: '#e0407b' }
                        : { background: 'transparent', border: '1px solid transparent', color: '#6b7fa3' }
                    }
                  >
                    <Icon />
                    {label}
                  </button>
                )
              })}

              <div className="flex-1" />

              {/* Download Resume button */}
              <button
                id="download-resume-btn"
                onClick={() => getResumePdf(interviewId)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold text-sm text-white transition-all duration-200 active:scale-95 cursor-pointer mb-2"
                style={{ background: 'linear-gradient(135deg, #e0407b 0%, #c02060 100%)', boxShadow: '0 4px 16px rgba(224,64,123,0.35)' }}
              >
                <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z" />
                </svg>
                Download Resume
              </button>

              {/* Status pill */}
              <div
                className="rounded-xl p-3 flex items-center gap-2"
                style={{ backgroundColor: '#1a2035', border: '1px solid #2a3450' }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: '#22c55e', boxShadow: '0 0 6px #22c55e' }}
                />
                <span className="text-xs" style={{ color: '#6b7fa3' }}>AI Strategy Ready</span>
              </div>
            </div>

            {/* ════ CENTER — Content ════ */}
            <div
              className="flex-1 p-7 overflow-y-auto"
              style={{ maxHeight: '80vh' }}
            >
              {activeTab === 'technical' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BrainIcon />
                    <h2 className="text-white font-semibold text-base">Technical Questions</h2>
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded ml-1"
                      style={{ backgroundColor: 'rgba(224,64,123,0.15)', color: '#e0407b', border: '1px solid rgba(224,64,123,0.35)' }}
                    >
                      {report.technicalQuestion.length}
                    </span>
                  </div>
                  {report.technicalQuestion.map((q, i) => (
                    <QuestionCard key={i} index={i} question={q.question} intention={q.intention} answer={q.answer} />
                  ))}
                </div>
              )}

              {activeTab === 'behavioural' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-2">
                    <PersonIcon />
                    <h2 className="text-white font-semibold text-base">Behavioral Questions</h2>
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded ml-1"
                      style={{ backgroundColor: 'rgba(224,64,123,0.15)', color: '#e0407b', border: '1px solid rgba(224,64,123,0.35)' }}
                    >
                      {report.behaviouralQuestion.length}
                    </span>
                  </div>
                  {report.behaviouralQuestion.map((q, i) => (
                    <QuestionCard key={i} index={i} question={q.question} intention={q.intention} answer={q.answer} />
                  ))}
                </div>
              )}

              {activeTab === 'roadmap' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapIcon />
                    <h2 className="text-white font-semibold text-base">Preparation Road Map</h2>
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded ml-1"
                      style={{ backgroundColor: 'rgba(224,64,123,0.15)', color: '#e0407b', border: '1px solid rgba(224,64,123,0.35)' }}
                    >
                      {report.preparationPlan.length} DAYS
                    </span>
                  </div>
                  {report.preparationPlan.map((d) => (
                    <DayCard key={d.day} day={d.day} focus={d.focus} tasks={d.task} />
                  ))}
                </div>
              )}
            </div>

            {/* ════ RIGHT — Skill Gaps ════ */}
            <div
              className="flex flex-col p-5 shrink-0"
              style={{ width: '240px', borderLeft: '1px solid #1e2840' }}
            >
              <p
                className="text-xs font-bold mb-4"
                style={{ color: '#455070', letterSpacing: '0.1em' }}
              >
                SKILL GAPS
              </p>

              <div className="flex flex-col gap-2">
                {report.skillGap.map((gap) => {
                  const s = severityStyle[gap.severity] || severityStyle.low
                  return (
                    <div
                      key={gap.skill}
                      className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5"
                      style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}
                    >
                      <span className="text-xs font-medium leading-snug" style={{ color: '#c9d1e0' }}>
                        {gap.skill}
                      </span>
                      <span
                        className="text-xs font-bold shrink-0 px-1.5 py-0.5 rounded"
                        style={{ color: s.color, backgroundColor: 'rgba(0,0,0,0.25)' }}
                      >
                        {s.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Severity legend */}
              <div className="flex-1" />
              <div
                className="rounded-xl p-3 flex flex-col gap-1.5"
                style={{ backgroundColor: '#1a2035', border: '1px solid #2a3450' }}
              >
                <p className="text-xs font-semibold mb-1" style={{ color: '#6b7fa3' }}>SEVERITY</p>
                {[
                  { label: 'High', color: '#f87171' },
                  { label: 'Medium', color: '#fbbf24' },
                  { label: 'Low', color: '#4ade80' },
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-xs" style={{ color: '#6b7fa3' }}>{label} priority</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="pb-6 flex justify-center gap-8">
        {['Privacy Policy', 'Terms of Service', 'Help Center'].map((link) => (
          <a key={link} href="#" className="text-xs transition-colors" style={{ color: '#455070' }}>
            {link}
          </a>
        ))}
      </footer>
    </main>
  )
}

export default Interview