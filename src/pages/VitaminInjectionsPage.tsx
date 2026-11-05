import { useState } from "react"
import { ImageReveal } from "../components/Motion"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
} from "lucide-react"

const vitaminImage =
  "https://images.unsplash.com/photo-1752842936201-44291aee473f?auto=format&fit=crop&w=1600&q=88"

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
}

type Props = {
  openBooking: () => void
  onBack: () => void
}

function ServiceSectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string
  title: string
  text?: string
}) {
  return (
    <motion.div className="section-title" {...reveal}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </motion.div>
  )
}

function ServiceConsultationBand({ openBooking }: { openBooking: () => void }) {
  return (
    <section className="consultation-band">
      <span className="eyebrow">Getting started is easy</span>
      <h2>Let’s talk about your goals.</h2>
      <p>Meet with the Avail team and receive a personalized treatment plan.</p>
      <button className="btn btn-light" onClick={openBooking}>
        Book your consultation <ArrowRight size={16} />
      </button>
    </section>
  )
}

export default function VitaminInjectionsPage({ openBooking, onBack }: Props) {
  const [faq, setFaq] = useState(0)
  const faqs = [
    [
      "How often can I receive vitamin injections?",
      "There is no single schedule appropriate for every vitamin or every patient. Frequency depends on the specific ingredient, dose, reason for treatment, nutritional status, laboratory results when relevant, concurrent supplements, and individual response.",
    ],
    [
      "Do I need laboratory testing?",
      "Not every wellness injection requires laboratory testing, but testing can be helpful or medically appropriate for selected nutrients and clinical situations.",
    ],
    [
      "Are vitamin injections safe?",
      "Vitamin and wellness injections are medical treatments and are not completely risk-free. Appropriate screening, product selection, dosing, sterile technique, and administration are important.",
    ],
    [
      "Who may not be a candidate?",
      "Whether an injection is appropriate depends heavily on its ingredients. Additional evaluation may be necessary for patients with certain kidney, liver, cardiovascular, or metabolic conditions, medication interactions, pregnancy or breastfeeding considerations, nutritional abnormalities, or previous injection reactions.",
    ],
  ]

  return (
    <main className="vitamin-service-page">
      <section className="vitamin-service-hero">
        <motion.div
          className="vitamin-service-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <button className="back-link" onClick={onBack}>
            <ArrowLeft /> Aesthetics
          </button>
          <span className="eyebrow">Vitamin &amp; wellness</span>
          <h1>
            Targeted IM
            <br />
            <em>Vitamin Injections</em>
          </h1>
          <p>for Personalized Wellness Support</p>
          <p className="vitamin-service-lead">
            Replenish essential nutrients and boost your energy.
          </p>
          <button className="btn btn-light" onClick={openBooking}>
            Book Your Consultation <ArrowRight size={16} />
          </button>
        </motion.div>
        <motion.div
          className="vitamin-service-image"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <img
            src={vitaminImage}
            alt="Prepared wellness syringes in a clinical tray"
          />
        </motion.div>
      </section>

      <section className="vitamin-service-intro section">
        <div className="vitamin-service-intro-copy">
          <span className="eyebrow">Vitamin and wellness</span>
          <h2>Physician-directed wellness, personalized to you.</h2>
          <p>
            Vitamin and wellness injections provide selected vitamins, amino
            acids, antioxidants, and other nutrients through intramuscular (IM)
            injection. For patients who do not need a full IV infusion, IM
            injections offer a convenient way to incorporate selected nutrients
            into a physician-directed wellness plan.
          </p>
          <p>
            At Avail Aesthetics MD, vitamin injections are not treated as
            one-size-fits-all “energy shots.” Your health history, medications,
            allergies, nutritional needs, goals, and potential contraindications
            are considered before treatment.
          </p>
        </div>
        <motion.aside className="vitamin-consult-card" {...reveal}>
          <span>Service consultation</span>
          <h3>Vitamin &amp; Wellness Injections</h3>
          <div>
            <small>Treatment planning</small>
            <b>Personalized by the clinic</b>
          </div>
          <div>
            <small>Pricing</small>
            <b>Confirmed during consultation</b>
          </div>
          <button onClick={openBooking}>
            Book Your Consultation <ArrowRight size={16} />
          </button>
        </motion.aside>
      </section>

      <section className="vit-opts section">
        <motion.div className="vit-opts-head" {...reveal}>
          <span className="eyebrow">Our injection options</span>
          <h2>
            Selected around <em>your</em> individual needs.
          </h2>
          <p>
            Depending on your individual needs and the products available, our
            wellness injection options may include:
          </p>
          <span className="vit-opts-total">
            11 <small>options, chosen with you at consultation</small>
          </span>
        </motion.div>
        <ul className="vit-opts-list">
          {[
            ["Vitamin B12", "Vitamin"],
            ["B-Complex", "Vitamin blend"],
            ["L-Carnitine", "Amino acid derivative"],
            ["Glutathione", "Antioxidant"],
            ["Tri-Immune", "Blend"],
            ["Vitamin D3", "Vitamin"],
            ["Amino Blend", "Amino acids"],
            ["NAD+", "Coenzyme"],
            ["Biotin", "Vitamin B7"],
            ["Vitamin C", "Vitamin"],
            ["Lipotropic / Lipoplex", "Blend"],
          ].map(([name, kind], i) => (
            <motion.li
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.04, ease: [0.23, 1, 0.32, 1] }}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h3>{name}</h3>
              <small>{kind}</small>
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="vit-def section">
        <div className="vit-def-body">
          <motion.figure className="vit-def-figure" {...reveal}>
            <ImageReveal
              className="vit-def-img"
              src={vitaminImage}
              alt="Vitamin and wellness injection preparation"
            />
            <figcaption>
              Each injection is prepared for you after a medical review.
            </figcaption>
          </motion.figure>

          <motion.div className="vit-def-copy" {...reveal}>
            <div className="vit-def-head">
              <span className="eyebrow">Treatment overview</span>
              <h2>
                What are IM <em>vitamin injections?</em>
              </h2>
            </div>
            <p className="vit-def-lead">
              An intramuscular injection delivers a selected ingredient directly
              into muscle tissue, where it is gradually absorbed into the
              circulation.
            </p>
            <p>
              IM injections are typically administered into an appropriate
              muscle based on the medication or nutrient, volume being
              administered, and individual patient considerations.
            </p>
            <p className="vit-def-note">
              <sup>*</sup>The fact that a nutrient can be administered by
              injection does not automatically mean that injectable
              administration is necessary or superior for every patient.
            </p>
          </motion.div>
        </div>

        <ol className="vit-def-points">
          {[
            ["Quick", "to administer"],
            ["Convenient", "fits into a short visit"],
            ["No IV", "no catheter placement needed"],
            ["Selective", "suited to chosen vitamins and ingredients"],
            ["Flexible", "easy to build into a wellness plan"],
          ].map(([title, text], i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.23, 1, 0.32, 1] }}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              <b>{title}</b>
              <p>{text}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="vitamin-service-process section">
        <ServiceSectionTitle
          eyebrow="Your appointment"
          title="What Happens During Your Appointment?"
        />
        <div className="vitamin-service-steps">
          {[
            [
              "01",
              "Medical Screening",
              "Before receiving an injection, we review relevant information such as medical history, medications and supplements, allergies, previous reactions, current symptoms, and wellness goals.",
            ],
            [
              "02",
              "Injection Selection",
              "The appropriate injection is selected based on your individual needs and the available treatment protocols.",
            ],
            [
              "03",
              "Intramuscular Injection",
              "The treatment area is cleaned and the injection is administered into an appropriate muscle. The injection itself generally takes only a few moments.",
            ],
            [
              "04",
              "Aftercare",
              "Most patients can immediately return to normal daily activities.",
            ],
          ].map(([number, title, text]) => (
            <motion.article key={number} {...reveal}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="vitamin-service-safety section">
        <div>
          <ShieldCheck />
          <span className="eyebrow">Safety &amp; screening</span>
          <h2>Medical treatments are not completely risk-free.</h2>
        </div>
        <div>
          <p>
            Potential side effects can include injection-site discomfort,
            redness, swelling, bruising, bleeding, temporary soreness,
            infection, dizziness or fainting, allergic or hypersensitivity
            reactions, and ingredient-specific adverse effects.
          </p>
          <p>
            Excessive or inappropriate dosing of certain vitamins and nutrients
            can also cause complications. Appropriate screening, product
            selection, dosing, sterile technique, and administration are
            important.
          </p>
        </div>
      </section>

      <section className="treatment-faq section vitamin-service-faq">
        <ServiceSectionTitle
          eyebrow="Questions, answered"
          title="Plan your consultation with clarity."
        />
        <div className="accordion">
          {faqs.map(([question, answer], index) => (
            <div
              className={`faq-item ${faq === index ? "open" : ""}`}
              key={question}
            >
              <button onClick={() => setFaq(faq === index ? -1 : index)}>
                <span>0{index + 1}</span>
                {question}
                <ChevronDown />
              </button>
              <AnimatePresence initial={false}>
                {faq === index && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    {answer}
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
          The content on this page is from Avail Aesthetics MD’s current Vitamin
          &amp; Wellness Injections service page. Suitability, product
          availability, dose, frequency, testing, risks, and aftercare are
          determined by the clinic’s medical team.
        </p>
      </aside>
      <ServiceConsultationBand openBooking={openBooking} />
    </main>
  )
}
