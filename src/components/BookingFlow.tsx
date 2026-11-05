import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
} from "lucide-react"

type Props = {
  service: string
  price: number
  close: () => void
}

const SLOTS = [
  "10:00", "10:30", "11:00", "11:30", "12:00",
  "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00",
]
const DAYS_AHEAD = 30
const PER_VIEW = 3

const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
const fmtMonth = (d: Date) =>
  d.toLocaleDateString("en-GB", { month: "long", year: "numeric" })
const fmtTime = (t: string) => {
  const [h, m] = t.split(":").map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`
}
const fmtPrice = (n: number) => `Rs ${n.toLocaleString("en-IN")} /-`

export default function BookingFlow({ service, price, close }: Props) {
  const days = useMemo(() => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    return Array.from({ length: DAYS_AHEAD }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i + 1)
      // Placeholder availability until a real booking system is connected.
      const free = 8 + ((d.getDate() * 7 + d.getMonth() * 3) % 13)
      return { date: d, free }
    })
  }, [])

  const [step, setStep] = useState<1 | 2>(1)
  const [offset, setOffset] = useState(0)
  const [dayIndex, setDayIndex] = useState(0)
  const [time, setTime] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const visible = days.slice(offset, offset + PER_VIEW)
  const day = days[dayIndex]

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <motion.div
        className="bf"
        role="dialog"
        aria-modal="true"
        aria-label={`Book ${service}`}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
      >
        <button className="bf-close" onClick={close} aria-label="Close">
          <X size={20} />
        </button>

        {done ? (
          <div className="bf-done">
            <div className="bf-done-icon"><Check /></div>
            <h2>Booking requested</h2>
            <p>
              {service} on {fmtDate(day.date)} at {time && fmtTime(time)}. The
              clinic will confirm your appointment by email.
            </p>
            <small>
              Prototype only: no data is sent. Connect this to the clinic’s
              secure booking system before launch.
            </small>
            <button className="bf-primary" onClick={close}>Close</button>
          </div>
        ) : (
          <>
            <ol className="bf-steps" aria-label="Booking steps">
              {[1, 2].map((n) => (
                <li
                  key={n}
                  className={step === n ? "is-current" : step > n ? "is-done" : ""}
                  aria-current={step === n ? "step" : undefined}
                >
                  {step > n ? <Check size={16} /> : n}
                </li>
              ))}
            </ol>

            <div className="bf-body">
              <AnimatePresence mode="wait" initial={false}>
                {step === 1 ? (
                  <motion.section
                    key="s1"
                    className="bf-panel bf-card"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h3 className="bf-title">{service}</h3>
                    <p className="bf-sub">Select Date &amp; Time</p>

                    <div className="bf-month">
                      <button
                        onClick={() => setOffset(Math.max(0, offset - PER_VIEW))}
                        disabled={offset === 0}
                        aria-label="Earlier dates"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <span>{fmtMonth(visible[0].date)}</span>
                      <button
                        onClick={() =>
                          setOffset(Math.min(days.length - PER_VIEW, offset + PER_VIEW))
                        }
                        disabled={offset + PER_VIEW >= days.length}
                        aria-label="Later dates"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    <div className="bf-dates">
                      {visible.map((d, i) => {
                        const idx = offset + i
                        return (
                          <button
                            key={idx}
                            className={idx === dayIndex ? "is-active" : ""}
                            aria-pressed={idx === dayIndex}
                            onClick={() => {
                              setDayIndex(idx)
                              setTime(null)
                            }}
                          >
                            <b>{fmtDate(d.date)}</b>
                            <small className={d.free >= 18 ? "is-high" : ""}>
                              {d.free} Free
                            </small>
                          </button>
                        )
                      })}
                    </div>

                    <h4 className="bf-slot-title">Available times</h4>
                    <p className="bf-sub bf-sub-muted">{fmtDate(day.date)}</p>
                    <div className="bf-slots">
                      {SLOTS.map((s) => (
                        <button
                          key={s}
                          className={s === time ? "is-active" : ""}
                          aria-pressed={s === time}
                          onClick={() => setTime(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </motion.section>
                ) : (
                  <motion.form
                    key="s2"
                    id="bf-details"
                    className="bf-panel bf-form"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={(e) => {
                      e.preventDefault()
                      setDone(true)
                    }}
                  >
                    <button type="button" className="bf-back" onClick={() => setStep(1)}>
                      <ArrowLeft size={14} /> Change date &amp; time
                    </button>
                    <h3 className="bf-title">Almost There</h3>
                    <p className="bf-sub">Patient Details</p>
                    <div className="bf-fields">
                      <label>First Name<input required autoComplete="given-name" /></label>
                      <label>Last Name<input required autoComplete="family-name" /></label>
                      <label>Email<input required type="email" autoComplete="email" /></label>
                      <label>Phone Number<input required type="tel" autoComplete="tel" /></label>
                      <label className="bf-wide">
                        Additional Notes (Optional)
                        <textarea rows={4} />
                      </label>
                    </div>
                    <small className="bf-note">
                      Please don’t include confidential medical information here.
                    </small>
                  </motion.form>
                )}
              </AnimatePresence>

              <aside className="bf-summary">
                <header>
                  <span>Booking Summary</span>
                  <small>Services</small>
                  <h3>{service}</h3>
                </header>
                <div className="bf-summary-body">
                  <div className="bf-line">
                    <span className="bf-line-name">{service}</span>
                    <b>{fmtPrice(price)}</b>
                  </div>
                  <div className="bf-when">
                    <div>
                      <span><ShieldCheck size={18} /> Appointment date</span>
                      <b>{fmtDate(day.date)}</b>
                    </div>
                    <div>
                      <span><ShieldCheck size={18} /> Appointment time</span>
                      <b>{time ? fmtTime(time) : "Select a time"}</b>
                    </div>
                  </div>
                  <div className="bf-total">
                    <b>Total</b>
                    <div>
                      <span>Includes 1 service</span>
                      <b>{fmtPrice(price)}</b>
                    </div>
                  </div>
                  {step === 1 ? (
                    <button
                      className="bf-primary"
                      disabled={!time}
                      onClick={() => setStep(2)}
                    >
                      {time ? "Continue" : "Select a time to continue"}
                    </button>
                  ) : (
                    <button className="bf-primary" type="submit" form="bf-details">
                      Confirm Booking
                    </button>
                  )}
                </div>
              </aside>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
