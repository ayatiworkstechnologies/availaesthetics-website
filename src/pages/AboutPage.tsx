import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { ArrowRight, MapPin } from "lucide-react"
import { ImageReveal } from "../components/Motion"

const uploads = "https://availaestheticsmd.com/wp-content/uploads/2026/06/"
const storyImage = `${uploads}doctor-her-patient-choosing-mammary-prosthesis-office-1-2.png`
const missionImage = `${uploads}portrait-business-man-with-arms-crossed-career-startup-success-with-confidence-ceo-employee-face-mature-male-person-happy-entrepreneur-suit-professional-boss-with-skills-1.png`

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
}

const principles = [
  ["Real relationships", "Every person is treated as an individual, not a checklist of concerns."],
  ["Real expertise", "Evidence-based treatments, with every plan physician-developed and tailored to you."],
  ["Real care", "Honest guidance and genuine, unhurried attention behind every treatment."],
]

export default function AboutPage({
  openBooking,
  band,
}: {
  openBooking: () => void
  band: ReactNode
}) {
  return (
    <main className="about-page">
      <section className="about-hero">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="eyebrow">About us</span>
          <h1>
            The art of scientific medicine, <em>combined with cosmetic health &amp; wellness.</em>
          </h1>
          <button className="btn btn-dark" onClick={openBooking}>
            Book a consultation <ArrowRight size={16} />
          </button>
        </motion.div>
      </section>

      <section className="about-split section">
        <ImageReveal className="about-img" src={storyImage} alt="Cosmetic treatment in progress" />
        <motion.div className="about-copy" {...reveal}>
          <span className="eyebrow">Our story</span>
          <h2>
            Aesthetic medicine should be as much about <em>listening</em> as technique.
          </h2>
          <p>
            Avail Aesthetics MD was founded on a simple belief: that aesthetic medicine should be as
            much about listening as it is about technique. Too often, patients feel rushed through
            cookie-cutter treatments that overlook what makes them unique. We wanted to build
            something different, a practice rooted in Katy that treats every person as an
            individual, not a checklist of concerns.
          </p>
          <p>
            What started as a commitment to combining medical precision with genuine, unhurried care
            has grown into a practice trusted by patients across the greater Houston area. Along the
            way, our focus has never wavered: to offer honest guidance, evidence-based treatments,
            and results that look like you, only more confident, more refreshed, more at ease in
            your own skin.
          </p>
        </motion.div>
      </section>

      <section className="about-principles">
        <motion.div {...reveal}>
          <span className="eyebrow">What shaped us</span>
          <h2>The philosophy that remains the same.</h2>
        </motion.div>
        <ol>
          {principles.map(([title, text], i) => (
            <motion.li key={title} {...reveal}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="about-split about-split-reverse section">
        <motion.div className="about-copy" {...reveal}>
          <span className="eyebrow">Our mission</span>
          <h2>
            To redefine what it means to <em>age well.</em>
          </h2>
          <p>
            We combine evidence-based medical aesthetics with a deep understanding of each
            patient's unique anatomy and goals, delivering results that are subtle, natural, and
            undeniably effective.
          </p>
          <p>
            Every treatment plan is physician-developed and tailored to the individual because we
            believe great care starts with really knowing our patients, not just treating a concern.
            Serving Katy and the greater Houston area, we're proud to be a trusted partner in our
            patients' long-term health and confidence.
          </p>
        </motion.div>
        <ImageReveal className="about-img" src={missionImage} alt="Doctor in suit with arms crossed" />
      </section>

      <section className="about-belief section">
        <motion.blockquote {...reveal}>
          We believe aesthetic medicine should enhance your natural beauty, not change who you are.
        </motion.blockquote>
        <motion.div {...reveal}>
          <p>
            Our practice combines advanced medical aesthetics, evidence-based treatments, and
            personalized care to help you achieve healthy, radiant, and naturally refreshed results
            that reflect your individual goals.
          </p>
          <address>
            <MapPin size={16} /> 23659 Katy Fwy, Suite 400, Katy, TX 77494
          </address>
        </motion.div>
      </section>

      {band}
    </main>
  )
}
