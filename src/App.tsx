import { useEffect, useRef, useState } from "react"
import VitaminInjectionsPage from "./pages/VitaminInjectionsPage"
import BookingFlow from "./components/BookingFlow"
import { EASE_OUT, ImageReveal, Stagger, staggerItem } from "./components/Motion"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Leaf,
  Mail,
  Menu,
  Quote,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react"

const images = {
  hero: "https://images.unsplash.com/photo-1634149136549-47350a401065?auto=format&fit=crop&w=1800&q=88",
  portrait:
    "https://images.unsplash.com/photo-1611451444023-7fe9d86fe1d0?auto=format&fit=crop&w=1200&q=85",
  face: "https://images.unsplash.com/photo-1581182830442-e8bc7babbf15?auto=format&fit=crop&w=1200&q=85",
  interior:
    "https://images.unsplash.com/photo-1693578538512-fc66f318c833?auto=format&fit=crop&w=1600&q=85",
  towels:
    "https://images.unsplash.com/photo-1706795033855-eee02f726868?auto=format&fit=crop&w=1200&q=85",
}

const nav = [
  "About",
  "Aesthetics",
  "Wellness",
  "Concerns",
  "Membership",
  "Locations",
  "Blog",
]
const categories = [
  {
    title: "Facial Balancing",
    text: "Subtle, proportion-led refinement that respects your natural features.",
    image: images.face,
  },
  {
    title: "Skin Consultations",
    text: "A dedicated conversation about your skin and priorities.",
    image: images.towels,
  },
  {
    title: "Vampire Facial",
    text: "Regenerative treatment using your own platelet-rich plasma.",
    image: images.portrait,
  },
]

const SIG_SPEED = 38 // px per second

const treatments: {
  title: string
  text: string
  image: string
  page?: Page
}[] = [
  {
    title: "Vitamin Injections",
    text: "Vitamin injections provide essential nutrients directly into the body to support overall health and wellness. They may help address specific vitamin deficiencies, support normal energy metabolism, and maintain immune function.",
    image: "/images/vitamin-Injections.png",
    page: "vitamin",
  },
  {
    title: "Hair Rejuvenation",
    text: "Consultation-led hair rejuvenation options designed to support thicker, healthier-looking hair, planned around your scalp, history and goals.",
    image: "/images/hair-rejuvenation.png",
  },
  {
    title: "Medical Weight Loss",
    text: "Physician-guided weight management support with a personalized plan, regular check-ins and a focus on sustainable, long-term results.",
    image: "/images/medical-weight-loss.png",
  },
  {
    title: "Laser Hair Removal",
    text: "Laser services that reduce unwanted hair over a course of sessions, with settings selected for your skin and hair type.",
    image: "/images/laser-hair-removal.png",
  },
]

const journeySteps = [
  {
    title: "Request your consultation",
    text: "Choose your preferred location and share basic contact and scheduling details with the Avail team.",
    image: images.interior,
  },
  {
    title: "Discuss your goals",
    text: "Meet with the team to talk through your priorities, questions, and the areas of care you would like to explore.",
    image: images.portrait,
  },
  {
    title: "Review your options",
    text: "Your provider will discuss suitable services, current pricing, and important considerations before you decide how to proceed.",
    image: images.face,
  },
  {
    title: "Receive your personalized plan",
    text: "Leave with clear next steps, scheduling guidance, and a plan shaped around your consultation.",
    image: images.towels,
  },
]

const clinicLocations = [
  {
    name: "Katy",
    area: "West Houston · I-10 corridor",
    address: "23659 Katy Fwy, Suite 400, Katy, TX 77494",
    phone: "(713) 590-0680",
    phoneHref: "tel:+17135900680",
  },
  {
    name: "Cypress",
    area: "Northwest Houston · US-290",
    address: "9740 Barker Cypress Rd., Suite 111, Cypress, TX 77433",
    phone: "(713) 590-0681",
    phoneHref: "tel:+17135900681",
  },
]

const storySlides = [
  {
    eyebrow: "Verified patient stories",
    quote:
      "We never publish invented patient testimonials. This space is reserved for genuine, clinic-approved feedback.",
    note: "Content pending review by the Avail Aesthetics MD team.",
  },
  {
    eyebrow: "Consultation experiences",
    quote:
      "First-hand consultation feedback will appear here after the clinic confirms permission and accuracy.",
    note: "Verified consultation story pending clinic approval.",
  },
  {
    eyebrow: "Aesthetic treatment journeys",
    quote:
      "Patient treatment stories will be published only after the experience and wording have been approved for use.",
    note: "Approved aesthetic-care story to be supplied by Avail.",
  },
  {
    eyebrow: "Wellness experiences",
    quote:
      "Clinic-approved wellness experiences will appear here without unverified outcomes or invented patient details.",
    note: "Verified wellness story pending clinic approval.",
  },
]

const faqs = [
  [
    "What treatments does Avail Aesthetics MD offer?",
    "Avail offers medical aesthetics, laser treatments, wellness therapies, weight management, IV therapy, peptide therapy, and intimate wellness services for both men and women.",
  ],
  [
    "Do I need a consultation before treatment?",
    "Yes. Treatments begin with a personalized consultation to discuss your goals and determine an appropriate plan.",
  ],
  [
    "Do you offer financing options?",
    "Avail states that flexible financing may be available through Cherry Payment Plans. Program availability and eligibility should be confirmed with the clinic.",
  ],
  [
    "How do I book an appointment?",
    "Request a consultation online or contact the Katy or Cypress clinic by phone, and the team can help schedule a convenient appointment.",
  ],
]

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    restDelta: 0.001,
  })

  return <motion.div className="scroll-progress" style={{ scaleX }} />
}

function Brand({
  light = false,
  imageClassName = "",
}: {
  light?: boolean
  imageClassName?: string
}) {
  return (
    <button
      className={`brand ${light ? "brand-light" : ""}`}
      onClick={() => go("home")}
      aria-label="Avail Aesthetics MD home"
    >
      <img
        className={imageClassName}
        src="/avail-logo.png"
        alt="Avail Aesthetics MD"
      />
    </button>
  )
}

type Page = "home" | "treatment" | "vitamin"
const pageHash: Record<Page, string> = {
  home: "",
  treatment: "#vampire-facial",
  vitamin: "#vitamin-injections",
}
const pageFromHash = (): Page =>
  (Object.keys(pageHash) as Page[]).find(
    (k) => k !== "home" && pageHash[k] === window.location.hash,
  ) ?? "home"
const aestheticsMenu: { label: string; page: Page }[] = [
  { label: "Vitamin Injections", page: "vitamin" },
  { label: "Vampire Facial", page: "treatment" },
]

function go(page: Page, anchor?: string) {
  if (page !== "home") {
    window.location.hash = pageHash[page]
    window.scrollTo({ top: 0, behavior: "smooth" })
    return
  }
  window.location.hash = ""
  if (anchor)
    setTimeout(
      () =>
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" }),
      30,
    )
  else window.scrollTo({ top: 0, behavior: "smooth" })
}

function Header({ openBooking }: { openBooking: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <header className="header">
        <div className="nav-shell">
          <Brand imageClassName="header-logo-image" />
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map((item) =>
              item === "Aesthetics" ? (
                <div className="nav-dropdown" key={item}>
                  <button
                    aria-haspopup="true"
                    onClick={() => go("home", item.toLowerCase())}
                  >
                    {item} <ChevronDown size={12} />
                  </button>
                  <div className="nav-dropdown-menu" role="menu">
                    {aestheticsMenu.map((m) => (
                      <button
                        key={m.label}
                        role="menuitem"
                        onClick={(e) => {
                          e.currentTarget.blur()
                          go(m.page)
                        }}
                      >
                        {m.label}
                        <ArrowRight size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button key={item} onClick={() => go("home", item.toLowerCase())}>
                  {item}
                </button>
              ),
            )}
          </nav>
          <button className="btn btn-dark header-cta" onClick={openBooking}>
            Book a consultation
          </button>
          <button
            className="menu-button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4 }}
          >
            <div className="mobile-menu-top">
              <Brand light />
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X />
              </button>
            </div>
            <nav>
              {nav.map((item, index) => (
                <button
                  key={item}
                  onClick={() => {
                    setOpen(false)
                    go("home", item.toLowerCase())
                  }}
                >
                  <small>0{index + 1}</small>
                  {item}
                  <ArrowRight />
                </button>
              ))}
              {aestheticsMenu.map((m) => (
                <button
                  key={m.label}
                  className="mobile-sublink"
                  onClick={() => {
                    setOpen(false)
                    go(m.page)
                  }}
                >
                  <small>—</small>
                  {m.label}
                  <ArrowRight />
                </button>
              ))}
            </nav>
            <button
              className="btn btn-light"
              onClick={() => {
                setOpen(false)
                openBooking()
              }}
            >
              Book a consultation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function SectionTitle({
  eyebrow,
  title,
  text,
  light = false,
  className = "",
}: {
  eyebrow: string
  title: string
  text?: string
  light?: boolean
  className?: string
}) {
  return (
    <motion.div
      className={`section-title ${light ? "light" : ""} ${className}`}
      {...reveal}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </motion.div>
  )
}

const CATEGORY_INTERVAL = 5000

function CategoryExplorer() {
  // `step` only counts up; card keys are absolute steps so the outgoing card
  // slides away while a fresh copy enters on the right (infinite loop).
  const [step, setStep] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const n = categories.length
  const active = step % n
  const item = categories[active]
  const auto = !reduceMotion && !paused && inView
  const goTo = (i: number) => setStep((s) => s + ((i - (s % n) + n) % n))
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.2,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (!auto) return
    const id = setTimeout(() => setStep((s) => s + 1), CATEGORY_INTERVAL)
    return () => clearTimeout(id)
  }, [auto, step])
  const ease = [0.65, 0, 0.35, 1] as const
  return (
    <motion.div
      className="cat-explorer"
      ref={rootRef}
      onFocus={(e) => {
        if (e.target.matches(":focus-visible")) setPaused(true)
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false)
      }}
      {...reveal}
    >
      <div className="cat-list" role="tablist" aria-orientation="vertical">
        <motion.span
          className="cat-rail-fill"
          animate={{ y: `${active * 100}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease }}
        />
        {categories.map((c, i) => (
          <button
            key={c.title}
            role="tab"
            aria-selected={i === active}
            className={i === active ? "is-active" : ""}
            onClick={() => goTo(i)}
          >
            {c.title}
          </button>
        ))}
      </div>
      <div className="cat-stage">
        <div className="cat-row">
          <AnimatePresence mode="popLayout" initial={false}>
            {[0, 1, 2, 3].map((p) => {
              const abs = step + p
              const i = abs % n
              const c = categories[i]
              return (
                <motion.button
                  key={abs}
                  layout={!reduceMotion}
                  className={`cat-card ${p === 0 ? "is-active" : ""}`}
                  aria-label={`Show ${c.title}`}
                  tabIndex={p === 0 || p > 2 ? -1 : 0}
                  onClick={() => goTo(i)}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -120 }}
                  transition={{ duration: 1, ease }}
                >
                  <img src={c.image} alt="" />
                  <span className="cat-badge">0{i + 1}</span>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
        <div className="cat-caption">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={item.title}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {item.text}
            </motion.p>
          </AnimatePresence>
          <button
            className="cat-next"
            onClick={() => setStep((s) => s + 1)}
            aria-label="Next category"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function Home({ openBooking }: { openBooking: () => void }) {
  const [faq, setFaq] = useState(0)
  const [journeyStep, setJourneyStep] = useState(3)
  const [activeLocation, setActiveLocation] = useState(0)
  const [storySlide, setStorySlide] = useState(0)
  const reduceMotion = useReducedMotion()
  // Continuous carousel: the strip glides left at SIG_SPEED px/s and wraps
  // after one full set of cards (the list is rendered three times).
  const sigViewport = useRef<HTMLDivElement>(null)
  const sigTrack = useRef<HTMLDivElement>(null)
  const sigBar = useRef<HTMLElement>(null)
  const sigOffset = useRef(0)
  const sigTarget = useRef<number | null>(null)
  const sigCardStep = useRef(0)
  const [activeTreatment, setActive] = useState(0)
  const [sigPaused, setSigPaused] = useState(false)
  const [sigInView, setSigInView] = useState(false)
  const sigRef = useRef<HTMLDivElement>(null)
  const sigAuto = !reduceMotion && !sigPaused && sigInView
  const sigAutoRef = useRef(sigAuto)
  sigAutoRef.current = sigAuto

  // Glide to card i (taking the shortest way forward), then keep cruising.
  const setActiveTreatment = (i: number) => {
    const step = sigCardStep.current
    const loop = step * treatments.length
    if (!step) return
    const current = sigOffset.current
    let target = i * step
    while (target < current - step / 2) target += loop
    sigTarget.current = target
    setActive(i)
  }
  const stepTreatment = (dir: 1 | -1) => {
    const step = sigCardStep.current
    if (!step) return
    const base = sigTarget.current ?? sigOffset.current
    const target = (Math.round(base / step) + dir) * step
    sigTarget.current = target
    setActive(
      (((Math.round(target / step) % treatments.length) + treatments.length) %
        treatments.length),
    )
  }

  useEffect(() => {
    const el = sigViewport.current
    if (!el) return
    const measure = () => {
      const card = el.querySelector<HTMLElement>(".sig-card")
      const gap =
        parseFloat(getComputedStyle(el.firstElementChild as Element).columnGap) || 0
      if (card) sigCardStep.current = card.offsetWidth + gap
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = sigRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setSigInView(e.isIntersecting), {
      threshold: 0.2,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    let shown = -1
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const step = sigCardStep.current
      const loop = step * treatments.length
      if (step) {
        if (sigTarget.current !== null) {
          const diff = sigTarget.current - sigOffset.current
          sigOffset.current += diff * Math.min(1, dt * 7)
          if (Math.abs(diff) < 0.5) {
            sigOffset.current = sigTarget.current
            sigTarget.current = null
          }
        } else if (sigAutoRef.current) {
          sigOffset.current += SIG_SPEED * dt
        }
        // Wrap by one full set so the motion never visibly jumps.
        if (sigOffset.current >= loop) {
          sigOffset.current -= loop
          if (sigTarget.current !== null) sigTarget.current -= loop
        } else if (sigOffset.current < 0) {
          sigOffset.current += loop
          if (sigTarget.current !== null) sigTarget.current += loop
        }
        if (sigTrack.current)
          sigTrack.current.style.transform = `translate3d(${-sigOffset.current}px,0,0)`
        if (sigBar.current)
          sigBar.current.style.transform = `scaleX(${sigOffset.current / loop})`
        if (sigTarget.current === null) {
          const idx = Math.floor((sigOffset.current + step * 0.35) / step) % treatments.length
          if (idx !== shown) {
            shown = idx
            setActive(idx)
          }
        } else shown = -1
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <main>
      <section className="hero">
        <div className="hero-wash" />
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="eyebrow">
            Physician-developed aesthetics & wellness
          </span>
          <h1>
            <motion.span
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12 }}
            >
              Confidence,
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.22 }}
            >
              Reimagined
            </motion.span>
          </h1>
          <p>
            Advanced aesthetics and rejuvenating therapies designed to help you
            look effortlessly radiant.
          </p>
          <div className="button-row">
            <button className="btn btn-dark" onClick={openBooking}>
              Free consultation <ArrowRight size={16} />
            </button>
            <button
              className="text-link"
              onClick={() => go("home", "aesthetics")}
            >
              Explore treatments <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
        <div className="scroll-label">
          SCROLL TO DISCOVER <span />
        </div>
      </section>

      <section className="intro section" id="about">
        <motion.div className="intro-number" {...reveal}>
          01
        </motion.div>
        <SectionTitle
          eyebrow="About Avail"
          title="A modern approach to aesthetics and wellness."
          text="Physician-developed concierge aesthetics and wellness with long-term health and vitality in mind."
        />
        <motion.div className="intro-side" {...reveal}>
          <p>
            Personalized aesthetic and wellness services for men and women at
            multiple Texas locations.
          </p>
          <button className="text-link">
            Our philosophy <ArrowRight size={16} />
          </button>
        </motion.div>
      </section>


      <section className="treatments section">
        <SectionTitle
          eyebrow="Signature aesthetics"
          title="Popular treatments at Avail Aesthetics"
        />
        <div
          className="sig"
          ref={sigRef}
          onFocus={(e) => {
            if (e.target.matches(":focus-visible")) setSigPaused(true)
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setSigPaused(false)
          }}
        >
          <div className="sig-detail" aria-live="polite">
            <p className="sig-count">
              {String(activeTreatment + 1).padStart(2, "0")}
              <span>/{String(treatments.length).padStart(2, "0")}</span>
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTreatment}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              >
                <h3>{treatments[activeTreatment].title}</h3>
                <p>{treatments[activeTreatment].text}</p>
                <button
                  className="text-link sig-go"
                  onClick={() => {
                    const t = treatments[activeTreatment]
                    if (t.page) go(t.page)
                    else openBooking()
                  }}
                >
                  <span className="sr-only">
                    {treatments[activeTreatment].page
                      ? "Explore treatment"
                      : "Book a consultation"}
                  </span>
                  <ArrowRight size={20} />
                </button>
              </motion.div>
            </AnimatePresence>
            <div className="sig-progress" aria-hidden="true">
              <b ref={sigBar} />
            </div>
            <div className="sig-controls">
              <button
                aria-label="Previous treatment"
                onClick={() => stepTreatment(-1)}
              >
                <ArrowLeft size={18} />
              </button>
              <span>
                {String(activeTreatment + 1).padStart(2, "0")} /{" "}
                {String(treatments.length).padStart(2, "0")}
              </span>
              <button
                aria-label="Next treatment"
                onClick={() => stepTreatment(1)}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <div className="sig-viewport" ref={sigViewport}>
            <div className="sig-track" ref={sigTrack}>
              {[...treatments, ...treatments, ...treatments].map((item, k) => {
                const i = k % treatments.length
                const isActive = i === activeTreatment
                return (
                  <button
                    key={k}
                    className={`sig-card ${isActive ? "is-active" : ""}`}
                    aria-pressed={isActive}
                    aria-hidden={k >= treatments.length || undefined}
                    tabIndex={k >= treatments.length ? -1 : 0}
                    onClick={() =>
                      isActive && item.page ? go(item.page) : setActiveTreatment(i)
                    }
                  >
                    <span className="sig-img">
                      <span className="sig-photo">
                        <img src={item.image} alt="" />
                      </span>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                    </span>
                    <span className="sig-title">
                      <h4>{item.title}</h4>
                      <span className="sig-arrow" aria-hidden="true">
                        <ArrowRight size={18} />
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="journey section">
        <div className="journey-heading">
          <span className="eyebrow">Your journey at Avail</span>
          <h2>Our process.</h2>
          <p>
            From your first request to a personalized plan, each step is
            designed to give you clear information and time to decide.
          </p>
        </div>
        <div className="journey-shell">
          <div className="journey-index">
            <span className="eyebrow">Stages</span>
            <div>
              {journeySteps.map((step, index) => (
                <button
                  key={step.title}
                  className={journeyStep === index ? "active" : ""}
                  onClick={() => setJourneyStep(index)}
                  aria-pressed={journeyStep === index}
                >
                  <span>Step 0{index + 1}</span>
                  <small>{step.title}</small>
                </button>
              ))}
            </div>
          </div>
          <div className="journey-step-number">
            <span>Step</span> 0{journeyStep + 1}
          </div>
          <AnimatePresence mode="wait">
            <motion.article
              className="journey-detail"
              key={journeyStep}
              initial={{
                opacity: 0,
                x: reduceMotion ? 0 : 18,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: reduceMotion ? 0 : -12,
              }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="journey-detail-meta">
                <span>Process</span>
                <span>0{journeyStep + 1} / 04</span>
              </div>
              <h3>{journeySteps[journeyStep].title}</h3>
              <div className="journey-image">
                <img src={journeySteps[journeyStep].image} alt="" />
              </div>
              <p>{journeySteps[journeyStep].text}</p>
            </motion.article>
          </AnimatePresence>
        </div>
      </section>

      <section className="categories section" id="aesthetics">
        <SectionTitle
          eyebrow="Explore by category"
          title="Explore aesthetics by area of care."
        />
        <CategoryExplorer />
      </section>

      <section className="experience" id="wellness">
        <motion.div className="experience-image" {...reveal}>
          <img src={images.interior} alt="Calm, minimal wellness interior" />
        </motion.div>
        <motion.div className="experience-copy" {...reveal}>
          <span className="eyebrow">Why Avail Aesthetics MD</span>
          <h2>
            Personalized care,
            <br />
            <em>made accessible.</em>
          </h2>
          <p>
            Begin with a complimentary consultation, clear treatment guidance,
            and ongoing support from the Avail team.
          </p>
          <div className="feature-list">
            <div>
              <ShieldCheck />
              <span>
                <b>Complimentary consultation</b>
                <small>Discuss your goals before selecting a treatment.</small>
              </span>
            </div>
            <div>
              <Sparkles />
              <span>
                <b>Transparent pricing</b>
                <small>Review current treatment pricing with the clinic.</small>
              </span>
            </div>
            <div>
              <Leaf />
              <span>
                <b>Aftercare support</b>
                <small>
                  Receive treatment-specific guidance from your team.
                </small>
              </span>
            </div>
          </div>
          <button
            className="btn btn-outline"
            onClick={() => go("home", "about")}
          >
            Discover our approach <ArrowRight size={16} />
          </button>
        </motion.div>
      </section>

      <section className="testimonials section" id="concerns">
        <SectionTitle
          className="real-stories-title"
          eyebrow="Real stories"
          title="Remarkable results begin with trust."
        />
        <motion.div className="quote-card" {...reveal}>
          <Quote strokeWidth={1} />
          <AnimatePresence mode="wait">
            <motion.div
              key={storySlide}
              className="story-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`Story placeholder ${storySlide + 1} of ${storySlides.length}`}
              aria-live="polite"
              initial={{ opacity: 0, x: reduceMotion ? 0 : 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduceMotion ? 0 : -14 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            >
              <span className="eyebrow">{storySlides[storySlide].eyebrow}</span>
              <blockquote className="real-stories-quote">
                {storySlides[storySlide].quote}
              </blockquote>
              <p>{storySlides[storySlide].note}</p>
            </motion.div>
          </AnimatePresence>
          <div className="quote-controls">
            <button
              aria-label="Previous story"
              onClick={() =>
                setStorySlide(
                  (storySlide - 1 + storySlides.length) % storySlides.length,
                )
              }
            >
              <ArrowLeft />
            </button>
            <span>
              0{storySlide + 1} / 0{storySlides.length}
            </span>
            <button
              aria-label="Next story"
              onClick={() =>
                setStorySlide((storySlide + 1) % storySlides.length)
              }
            >
              <ArrowRight />
            </button>
          </div>
        </motion.div>
      </section>

      <section className="locations section" id="locations">
        <div className="locations-heading">
          <SectionTitle
            eyebrow="Our locations"
            title="Two Greater Houston clinics."
            text="Choose the Avail location that is most convenient for your consultation and care."
          />
          <div className="location-switcher" aria-label="Choose a location">
            {clinicLocations.map((location, index) => (
              <button
                key={location.name}
                className={activeLocation === index ? "active" : ""}
                onClick={() => setActiveLocation(index)}
                aria-pressed={activeLocation === index}
              >
                0{index + 1} {location.name}
              </button>
            ))}
          </div>
        </div>
        <motion.div className="location-map-stage" {...reveal}>
          <img
            src="/avail-locations-map.svg"
            alt="Dotted world map with Avail's Greater Houston clinics highlighted"
          />
          {clinicLocations.map((location, index) => (
            <button
              key={location.name}
              className={`map-marker map-marker-${index + 1} ${
                activeLocation === index ? "active" : ""
              }`}
              onClick={() => setActiveLocation(index)}
              aria-label={`Show ${location.name} location`}
            >
              <i />
            </button>
          ))}
          <AnimatePresence mode="wait">
            <motion.div
              className="location-map-card"
              key={clinicLocations[activeLocation].name}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <span>Selected location</span>
              <h3>{clinicLocations[activeLocation].name}</h3>
              <b>{clinicLocations[activeLocation].area}</b>
              <p>{clinicLocations[activeLocation].address}</p>
              <a href={clinicLocations[activeLocation].phoneHref}>
                {clinicLocations[activeLocation].phone}
              </a>
              <button onClick={openBooking}>
                Request consultation <ArrowRight size={14} />
              </button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      <section className="faq section">
        <div>
          <SectionTitle
            eyebrow="Frequently asked questions"
            title="Plan your visit to Avail."
          />
          <p>Have something else in mind?</p>
          <button className="text-link" onClick={openBooking}>
            Ask our team <ArrowRight size={16} />
          </button>
        </div>
        <div className="accordion">
          {faqs.map(([q, a], i) => (
            <div className={`faq-item ${faq === i ? "open" : ""}`} key={q}>
              <button onClick={() => setFaq(faq === i ? -1 : i)}>
                <span>0{i + 1}</span>
                {q}
                <ChevronDown />
              </button>
              <AnimatePresence initial={false}>
                {faq === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    {a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
      <ConsultationBand openBooking={openBooking} />
    </main>
  )
}

function TreatmentPage({ openBooking }: { openBooking: () => void }) {
  const [faq, setFaq] = useState(0)
  const treatmentFaqs = [
    [
      "How long does the procedure take?",
      "The current Avail treatment page lists approximately 30–40 minutes, depending on the treatment area and your personalized plan.",
    ],
    [
      "How many treatments will I need?",
      "Avail currently recommends an initial series of three treatments spaced four to six weeks apart, followed by annual maintenance. Your provider may recommend a different plan after consultation.",
    ],
    [
      "What side effects may occur?",
      "The clinic notes that temporary redness, swelling, bruising, tenderness, or itching may occur. Individual experiences vary, and your provider should review risks and aftercare with you before treatment.",
    ],
    [
      "How much downtime should I expect?",
      "The current clinic page lists a typical recovery window of one to three days. Swelling or bruising can vary by treatment area and individual response.",
    ],
    [
      "When will I see results?",
      "Avail notes that changes may become noticeable after initial swelling subsides and can continue to develop over time. Results vary, and no specific outcome can be guaranteed.",
    ],
    [
      "Who may not be a candidate?",
      "The clinic lists several reasons treatment may need to be postponed or avoided, including active skin infection, pregnancy or breastfeeding, certain blood or clotting disorders, anticoagulant use, active cancer treatment, and serious infection. This is not a complete screening tool; the Avail medical team must determine suitability.",
    ],
  ]
  return (
    <main className="treatment-page">
      <section className="treatment-hero">
        <div className="treatment-hero-image">
          <motion.img
            src={images.face}
            alt="Woman with naturally glowing skin"
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <motion.div
          className="treatment-hero-copy"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <button
            className="back-link"
            onClick={() => go("home", "aesthetics")}
          >
            <ArrowLeft /> All treatments
          </button>
          <span className="eyebrow">
            Facials & peels · PRP skin rejuvenation
          </span>
          <h1>
            Vampire
            <br />
            <em>Facial</em>
          </h1>
          <p>
            Revitalize your skin with a treatment that combines microneedling
            and platelet-rich plasma to support skin renewal from within. Avail
            describes the treatment as an option for refining texture,
            supporting elasticity, and enhancing natural-looking radiance.
          </p>
          <button className="btn btn-dark" onClick={openBooking}>
            Book your consultation <ArrowRight size={16} />
          </button>
          <small className="medical-review">
            Clinical claims require final review by the Avail medical team.
            Individual results vary.
          </small>
        </motion.div>
      </section>

      <section className="treatment-facts">
        <div>
          <span>01</span>
          <b>Treatment type</b>
          <p>PRP-based skin treatment</p>
        </div>
        <div>
          <span>02</span>
          <b>Duration</b>
          <p>Approximately 40 minutes</p>
        </div>
        <div>
          <span>03</span>
          <b>Recovery time</b>
          <p>Typically 1–3 days</p>
        </div>
      </section>

      <section className="treatment-benefits section">
        <SectionTitle
          eyebrow="Treatment benefits"
          title="Designed to support your skin’s natural renewal."
          text="The current Avail page highlights the following potential benefits. Outcomes differ from person to person and should be discussed during consultation."
        />
        <div className="benefit-grid">
          {[
            "Supports the appearance of smoother, more refined skin texture",
            "Uses platelet-rich plasma prepared from a sample of your own blood",
            "May support firmness, elasticity, and natural-looking radiance",
            "Can be incorporated into a personalized skin rejuvenation plan",
          ].map((benefit, index) => (
            <motion.div key={benefit} {...reveal}>
              <span>0{index + 1}</span>
              <Check />
              <p>{benefit}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="treatment-overview section">
        <SectionTitle
          eyebrow="Treatment overview"
          title="Regenerative care, personalized to your skin."
          text="The Vampire Facial pairs microneedling with platelet-rich plasma, or PRP. A small blood sample is processed to isolate the platelet-rich portion, which is then used as part of your provider-directed treatment. Your exact protocol is determined after consultation."
        />
        <motion.div className="overview-note" {...reveal}>
          <Sparkles />
          <p>
            <b>Important to know</b> Avail’s source page uses both “Vampire
            Facial” and “Vampire Facelift” terminology. The clinic should
            confirm the treatment name, application method, and clinical copy
            before this content is published.
          </p>
        </motion.div>
      </section>

      <section className="process section">
        <SectionTitle
          eyebrow="Your experience"
          title="What to expect at Avail."
        />
        <div className="process-grid">
          {[
            [
              "01",
              "Plan your treatment",
              "Discuss your goals, medical history, skincare routine, and proposed treatment plan with your provider.",
            ],
            [
              "02",
              "Prepare your PRP",
              "A small blood sample is collected and processed to isolate platelet-rich plasma for your appointment.",
            ],
            [
              "03",
              "Treat & recover",
              "Your provider completes the personalized treatment and reviews the aftercare instructions specific to you.",
            ],
          ].map(([n, t, p]) => (
            <motion.div key={n} {...reveal}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{p}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="aftercare">
        <ImageReveal
          className="aftercare-image"
          src={images.portrait}
          alt="Woman in a neutral studio portrait"
        />
        <motion.div className="aftercare-copy" {...reveal}>
          <span className="eyebrow">Results & aftercare</span>
          <h2>A plan that continues beyond your visit.</h2>
          <p>
            Avail currently recommends a series of three treatments spaced four
            to six weeks apart, followed by annual maintenance. Your schedule,
            recovery, and results will depend on your skin and treatment plan.
          </p>
          <ul>
            <li>
              <Check /> Avoid touching, rubbing, or massaging treated areas for
              the remainder of the day.
            </li>
            <li>
              <Check /> Resume skincare, makeup, and normal activity only as
              directed by your provider.
            </li>
            <li>
              <Check /> Contact Avail with questions or any unexpected symptoms.
            </li>
          </ul>
          <small>
            Aftercare instructions vary by protocol. Follow the directions
            provided by your treating clinician.
          </small>
        </motion.div>
      </section>

      <section className="pricing section">
        <div>
          <span className="eyebrow">Investment</span>
          <h2>Transparent care, from the start.</h2>
          <p>
            The current Avail website lists the following pricing. Please
            confirm current rates, membership eligibility, and recommended
            treatment frequency before booking.
          </p>
        </div>
        <div className="price-card">
          <span>Vampire Facial</span>
          <strong>$625</strong>
          <div>
            <span>Member price</span>
            <b>$570</b>
          </div>
          <p>Flexible financing may be available for qualifying patients.</p>
          <button className="btn btn-light" onClick={openBooking}>
            Book your consultation <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className="treatment-faq section">
        <SectionTitle
          eyebrow="Questions, answered"
          title="Plan your visit with confidence."
        />
        <div className="accordion">
          {treatmentFaqs.map(([q, a], i) => (
            <div className={`faq-item ${faq === i ? "open" : ""}`} key={q}>
              <button onClick={() => setFaq(faq === i ? -1 : i)}>
                <span>0{i + 1}</span>
                {q}
                <ChevronDown />
              </button>
              <AnimatePresence initial={false}>
                {faq === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    {a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
      <aside className="clinical-disclaimer">
        <ShieldCheck />
        <p>
          <b>Clinical review notice:</b> Treatment information is adapted from
          Avail Aesthetics MD’s current Vampire Facial webpage. Benefits,
          contraindications, procedure details, treatment schedules, pricing,
          and aftercare should be confirmed by the clinic’s medical team before
          publication. Results vary and are not guaranteed.
        </p>
      </aside>
      <ConsultationBand openBooking={openBooking} />
    </main>
  )
}

function ConsultationBand({ openBooking }: { openBooking: () => void }) {
  return (
    <Stagger as="section" className="consultation-band">
      <motion.span className="eyebrow" variants={staggerItem}>
        Getting started is easy
      </motion.span>
      <motion.h2 variants={staggerItem}>Let’s talk about your goals.</motion.h2>
      <motion.p variants={staggerItem}>
        Meet with the Avail team and receive a personalized treatment plan.
      </motion.p>
      <motion.button
        className="btn btn-light"
        onClick={openBooking}
        variants={staggerItem}
      >
        Book your consultation <ArrowRight size={16} />
      </motion.button>
    </Stagger>
  )
}

function Footer() {
  return (
    <footer id="contact">
      <Stagger className="footer-main">
        <motion.div variants={staggerItem}>
          <Brand light />
          <p>
            Physician-developed concierge aesthetics and wellness with long-term
            health and vitality in mind.
          </p>
          <div className="social-links" aria-label="Social media">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4.25" />
                <circle
                  cx="17.4"
                  cy="6.7"
                  r=".8"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M14 8.4V6.7c0-.8.5-1 1-1h2.6V2.2L14.1 2C10.7 2 9.7 4.1 9.7 6.3v2.1H7v4h2.7V22H14v-9.6h3.3l.5-4H14Z"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35m-5.42 7.4a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26A9.89 9.89 0 0 1 12.06 2a9.82 9.82 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.9 6.99 9.9 9.9 0 0 1-9.9 9.89M20.46 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45C18.6 23.8 23.94 18.46 23.94 11.9a11.82 11.82 0 0 0-3.48-8.41Z"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M18.24 2.25h3.31l-7.23 8.26 8.51 11.24h-6.66l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.84L7.08 4.13H5.12l11.96 15.64Z"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M21.6 7.2a2.9 2.9 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.9 2.9 0 0 0-2 2A30 30 0 0 0 2 12a30 30 0 0 0 .4 4.8 2.9 2.9 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.9 2.9 0 0 0 2-2A30 30 0 0 0 22 12a30 30 0 0 0-.4-4.8ZM10 15.2V8.8l5.5 3.2-5.5 3.2Z"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
          </div>
        </motion.div>
        <motion.div variants={staggerItem}>
          <span className="eyebrow">Explore</span>
          {nav.slice(0, 5).map((x) => (
            <button key={x} onClick={() => go("home", x.toLowerCase())}>
              {x}
            </button>
          ))}
        </motion.div>
        <motion.div variants={staggerItem}>
          <span className="eyebrow">Discover</span>
          {["Vampire Facial", "Our approach", "Blog", "FAQs"].map((x) => (
            <button
              key={x}
              onClick={() =>
                x === "Vampire Facial" ? go("treatment") : go("home")
              }
            >
              {x}
            </button>
          ))}
        </motion.div>
        <motion.div variants={staggerItem}>
          <span className="eyebrow">Stay in touch</span>
          <p>
            Join for aesthetic insights, wellness guidance, and clinic news.
          </p>
          <label>
            <input
              type="email"
              placeholder="Email address"
              aria-label="Email address"
            />
            <button aria-label="Subscribe">
              <ArrowRight />
            </button>
          </label>
          <small>By subscribing, you agree to receive occasional emails.</small>
        </motion.div>
      </Stagger>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Avail Aesthetics MD</span>
        <span>Privacy &nbsp; Terms &nbsp; Accessibility</span>
        <span>Designed by ayatiworks</span>
      </div>
    </footer>
  )
}

function BookingModal({ close }: { close: () => void }) {
  const [sent, setSent] = useState(false)
  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <motion.div
        className="modal"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
      >
        <button className="modal-close" onClick={close} aria-label="Close">
          <X />
        </button>
        {!sent ? (
          <>
            <span className="eyebrow">Start a conversation</span>
            <h2>Request a consultation</h2>
            <p>
              Share your preferred contact details and our team can help with
              next steps.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
            >
              <label>
                Full name
                <input required placeholder="Your name" />
              </label>
              <label>
                Email address
                <input required type="email" placeholder="you@example.com" />
              </label>
              <label>
                I'm interested in
                <select defaultValue="">
                  <option value="" disabled>
                    Select an area
                  </option>
                  <option>Aesthetic care</option>
                  <option>Wellness</option>
                  <option>Vampire Facial consultation</option>
                  <option>Not sure yet</option>
                </select>
              </label>
              <label>
                Preferred contact method
                <select>
                  <option>Email</option>
                  <option>Phone</option>
                </select>
              </label>
              <small>
                Please do not include confidential medical information. This
                form is a design demonstration and does not transmit data.
              </small>
              <button className="btn btn-dark" type="submit">
                Send request <ArrowRight size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="success">
            <div>
              <Check />
            </div>
            <span className="eyebrow">Request noted</span>
            <h2>Thank you.</h2>
            <p>
              This prototype does not transmit data. Connect the form to the
              clinic’s approved secure booking system before launch.
            </p>
            <button className="btn btn-dark" onClick={close}>
              Close
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function App() {
  const [page, setPage] = useState<Page>(pageFromHash)
  const [booking, setBooking] = useState(false)
  const reduceMotion = useReducedMotion()
  useEffect(() => {
    const change = () => setPage(pageFromHash())
    window.addEventListener("hashchange", change)
    return () => window.removeEventListener("hashchange", change)
  }, [])
  useEffect(() => {
    document.body.style.overflow = booking ? "hidden" : ""
  }, [booking])
  return (
    <>
      <ScrollProgress />
      <Header openBooking={() => setBooking(true)} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={page}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
        >
          {page === "treatment" ? (
            <TreatmentPage openBooking={() => setBooking(true)} />
          ) : page === "vitamin" ? (
            <VitaminInjectionsPage
              openBooking={() => setBooking(true)}
              onBack={() => go("home", "aesthetics")}
            />
          ) : (
            <Home openBooking={() => setBooking(true)} />
          )}
        </motion.div>
      </AnimatePresence>
      <Footer />
      <AnimatePresence>
        {booking &&
          (page === "vitamin" ? (
            <BookingFlow
              service="Vitamin Injections"
              price={5000}
              close={() => setBooking(false)}
            />
          ) : (
            <BookingModal close={() => setBooking(false)} />
          ))}
      </AnimatePresence>
    </>
  )
}
