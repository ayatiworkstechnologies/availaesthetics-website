import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, X } from "lucide-react"

type Props = {
  /** Preselected service. Leave out to start with the service list. */
  service?: string
  price?: number
  close: () => void
}

// Names and groups from the availaestheticsmd.com navigation.
const SERVICE_GROUPS = [
  { label: "Consultation", items: ["Free Consultation"] },
  {
    label: "Skin Rejuvenation",
    items: ["RF Microneedling", "Skin Rejuvenation", "Aquafacial", "XERF", "Exosome Therapy", "Skin Tightening"],
  },
  { label: "Laser Treatments", items: ["Thulium", "MICROFOCUS-RF", "Laser Hair Removal"] },
  { label: "Body Contouring", items: ["Non Surgical Body Contouring", "Medical Weight Loss"] },
  { label: "Hair Restoration", items: ["Hair Rejuvenation"] },
  {
    label: "Injectables",
    items: ["Botox®", "Dermal Fillers", "Sculptra", "Radiesse", "Kybella Fat Dissolving Injections", "PRP Therapy"],
  },
  {
    label: "Wellness",
    items: [
      "NAD+", "GHK-Cu", "BPC-157", "Wolverine", "Glutathione", "PT-141", "Semax & Selank", "TB-500",
      "IV Infusion", "Vitamin & Wellness Injections", "Sexual Wellness",
    ],
  },
  { label: "Peptide Therapy", items: ["Sermorelin", "Tesamorelin"] },
]

const SLOT_GROUPS = [
  { label: "Morning", slots: ["10:00", "10:30", "11:00", "11:30"] },
  { label: "Afternoon", slots: ["12:00", "12:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"] },
  { label: "Evening", slots: ["17:00", "17:30", "18:00"] },
]
const DAYS_AHEAD = 30
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"]
const EASE = [0.23, 1, 0.32, 1] as const

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const sameDay = (a: Date, b: Date) => a.getTime() === b.getTime()
const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })
const fmtMonth = (d: Date) => d.toLocaleDateString("en-US", { month: "long", year: "numeric" })
const fmtTime = (t: string) => {
  const [h, m] = t.split(":").map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`
}
const fmtPrice = (n?: number) =>
  n === undefined ? "Confirmed at consultation" : n === 0 ? "Complimentary" : `Rs ${n.toLocaleString("en-IN")}`

export default function BookingFlow({ service: preset, price: presetPrice, close }: Props) {
  const hasPicker = !preset
  const [picked, setPicked] = useState<string | null>(null)
  const [group, setGroup] = useState(0)
  const service = preset ?? picked
  const price = preset ? presetPrice : picked === "Free Consultation" ? 0 : undefined
  const totalSteps = hasPicker ? 3 : 2
  const reduce = useReducedMotion()
  const { first, last } = useMemo(() => {
    const t = startOfDay(new Date())
    return {
      first: new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1),
      last: new Date(t.getFullYear(), t.getMonth(), t.getDate() + DAYS_AHEAD),
    }
  }, [])
  const [month, setMonth] = useState(new Date(first.getFullYear(), first.getMonth(), 1))
  const [day, setDay] = useState(first)
  const [time, setTime] = useState<string | null>(null)
  const [step, setStep] = useState<0 | 1 | 2>(hasPicker ? 0 : 1)
  const stepNo = hasPicker ? step + 1 : step
  const [done, setDone] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [close])

  const cells = useMemo(() => {
    const blanks = month.getDay()
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    return [
      ...Array.from({ length: blanks }, () => null),
      ...Array.from(
        { length: count },
        (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1),
      ),
    ]
  }, [month])
  const canPrev = month > new Date(first.getFullYear(), first.getMonth(), 1)
  const canNext = new Date(month.getFullYear(), month.getMonth() + 1, 1) <= last
  const shiftMonth = (n: number) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1))

  const fade = {
    initial: { opacity: 0, x: reduce ? 0 : 12 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: reduce ? 0 : -12 },
    transition: { duration: 0.25, ease: EASE },
  }
  const field = (label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <label className="bf-field">
      <input placeholder=" " {...props} />
      <span>{label}</span>
    </label>
  )

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
        aria-label={service ? `Book ${service}` : "Book a consultation"}
        initial={{ y: reduce ? 0 : 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: reduce ? 0 : 12, opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <aside className="bf-photo">
          <div>
            <span className="eyebrow">Your appointment</span>
            <h2>{service ?? "Select a service"}</h2>
            <dl>
              <div>
                <dt>Date</dt>
                <dd>{fmtDate(day)}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{time ? fmtTime(time) : "Not selected"}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{fmtPrice(price)}</dd>
              </div>
            </dl>
          </div>
        </aside>

        <div className="bf-main">
          <button className="bf-close" onClick={close} aria-label="Close">
            <X size={18} />
          </button>

          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <motion.div key="done" className="bf-done" {...fade}>
                <span className="bf-tick">
                  <Check size={22} />
                </span>
                <span className="eyebrow">Request received</span>
                <h3>
                  Thank you. <em>We'll be in touch.</em>
                </h3>
                <p>
                  {service} on {fmtDate(day)} at {time && fmtTime(time)}. The clinic will confirm
                  your appointment by email.
                </p>
                <small>
                  Prototype only: no data is sent until a secure booking system is connected.
                </small>
                <button className="btn btn-dark" onClick={close}>
                  Close
                </button>
              </motion.div>
            ) : step === 0 ? (
              <motion.section key="s0" className="bf-step" {...fade}>
                <span className="eyebrow">Step {stepNo} of {totalSteps}</span>
                <h3>
                  Choose a <em>service.</em>
                </h3>
                <div className="bf-svc">
                  <div className="bf-cats" role="tablist" aria-orientation="vertical">
                    {SERVICE_GROUPS.map((g, i) => (
                      <button
                        key={g.label}
                        role="tab"
                        aria-selected={i === group}
                        className={i === group ? "is-active" : ""}
                        onClick={() => setGroup(i)}
                      >
                        {g.label}
                        <small>{g.items.length}</small>
                      </button>
                    ))}
                  </div>
                  <div className="bf-svc-pane">
                    <b>{SERVICE_GROUPS[group].label}</b>
                    <div className="bf-services">
                      {SERVICE_GROUPS[group].items.map((name) => (
                        <button
                          key={name}
                          className={name === picked ? "is-active" : ""}
                          aria-pressed={name === picked}
                          onClick={() => setPicked(name)}
                        >
                          {name}
                          {name === picked && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bf-actions">
                  <p>Your provider will review your goals and any questions before treatment.</p>
                  <button className="btn btn-dark" disabled={!picked} onClick={() => setStep(1)}>
                    Continue <ArrowRight size={16} />
                  </button>
                </div>
              </motion.section>
            ) : step === 1 ? (
              <motion.section key="s1" className="bf-step" {...fade}>
                <span className="eyebrow">Step {stepNo} of {totalSteps}</span>
                <h3>
                  Choose a <em>date &amp; time.</em>
                </h3>
                <div className="bf-picker">
                  <div className="bf-cal">
                    <div className="bf-cal-head">
                      <b>{fmtMonth(month)}</b>
                      <div>
                        <button disabled={!canPrev} onClick={() => shiftMonth(-1)} aria-label="Previous month">
                          <ChevronLeft size={16} />
                        </button>
                        <button disabled={!canNext} onClick={() => shiftMonth(1)} aria-label="Next month">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="bf-grid">
                      {WEEKDAYS.map((w, i) => (
                        <span key={i} className="bf-wd">
                          {w}
                        </span>
                      ))}
                      {cells.map((d, i) =>
                        d ? (
                          <button
                            key={i}
                            disabled={d < first || d > last}
                            className={sameDay(d, day) ? "is-active" : ""}
                            aria-pressed={sameDay(d, day)}
                            aria-label={fmtDate(d)}
                            onClick={() => {
                              setDay(d)
                              setTime(null)
                            }}
                          >
                            {d.getDate()}
                          </button>
                        ) : (
                          <span key={i} />
                        ),
                      )}
                    </div>
                  </div>
                  <div className="bf-slots">
                    <b>{fmtDate(day)}</b>
                    {SLOT_GROUPS.map((g) => (
                      <div className="bf-slot-group" key={g.label}>
                        <span>{g.label}</span>
                        <div>
                          {g.slots.map((t) => (
                            <button
                              key={t}
                              className={t === time ? "is-active" : ""}
                              aria-pressed={t === time}
                              onClick={() => setTime(t)}
                            >
                              {fmtTime(t)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bf-actions">
                  {hasPicker ? (
                    <button className="text-link" onClick={() => setStep(0)}>
                      <ArrowLeft size={16} /> Back
                    </button>
                  ) : (
                    <p>Your provider will review your goals and any questions before treatment.</p>
                  )}
                  <button className="btn btn-dark" disabled={!time} onClick={() => setStep(2)}>
                    Continue <ArrowRight size={16} />
                  </button>
                </div>
              </motion.section>
            ) : (
              <motion.form
                key="s2"
                className="bf-step"
                {...fade}
                onSubmit={(e) => {
                  e.preventDefault()
                  setDone(true)
                }}
              >
                <span className="eyebrow">Step {stepNo} of {totalSteps}</span>
                <h3>
                  Almost there. <em>Your details.</em>
                </h3>
                <div className="bf-fields">
                  {field("First name", { required: true, autoComplete: "given-name" })}
                  {field("Last name", { required: true, autoComplete: "family-name" })}
                  {field("Email", { required: true, type: "email", autoComplete: "email" })}
                  {field("Phone number", { required: true, type: "tel", autoComplete: "tel" })}
                  <label className="bf-field bf-wide">
                    <textarea placeholder=" " rows={3} />
                    <span>Additional notes (optional)</span>
                  </label>
                </div>
                <small className="bf-note">
                  Please don't include confidential medical information here.
                </small>
                <div className="bf-actions">
                  <button type="button" className="text-link" onClick={() => setStep(1)}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button className="btn btn-dark" type="submit">
                    Confirm booking <ArrowRight size={16} />
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
