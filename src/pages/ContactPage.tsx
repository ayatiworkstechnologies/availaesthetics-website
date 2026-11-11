import type { FormEvent, ReactNode } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ArrowUpRight } from "lucide-react"

const EMAIL = "info@availaestheticsmd.com"

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
}

const hours = [
  ["Monday to Friday", "7am to 7pm"],
  ["Saturday", "7:30am to 5pm"],
  ["Sunday", "Closed"],
]

const field = (label: string, name: string, type = "text", required = true) => (
  <label className="bf-field">
    <input name={name} type={type} placeholder=" " required={required} />
    <span>{label}</span>
  </label>
)

/** No form backend exists yet, so sending hands a prefilled draft to the visitor's email app. */
function sendMessage(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  const data = new FormData(event.currentTarget)
  const value = (key: string) => String(data.get(key) ?? "")
  const subject = `Website enquiry from ${value("name")}`
  const body = [
    value("message"),
    "",
    `Name: ${value("name")}`,
    `Email: ${value("email")}`,
    `Phone: ${value("phone") || "Not provided"}`,
  ].join("\n")
  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function ContactPage({
  locations,
  band,
}: {
  locations: { name: string; area: string; address: string; phone: string; phoneHref: string }[]
  band: ReactNode
}) {
  return (
    <main className="about-page contact-page">
      <section className="about-hero contact-hero">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="eyebrow">Contact us</span>
          <h1>
            Every question is <em>worth asking.</em>
          </h1>
        </motion.div>
      </section>

      <section className="contact-main section">
        <motion.div className="contact-details" {...reveal}>
          <p className="contact-intro">
            We believe that every question is worthy of asking. You can contact our clinic about our
            cosmetic treatments, preventative health programs, financing options, or anything else
            that you need. We're here to help you.
          </p>
          <p className="contact-sub">
            Avail Aesthetics MD is #1 Aesthetic clinic with a wide range of services from laser
            treatments to injectables. With 20+ years in practice, we have the expertise and
            experience to meet our patient's needs. Drop us a line or call us for any questions or
            concerns. We are always happy to help.
          </p>
          <dl>
            <div>
              <dt>Call us</dt>
              <dd>
                <a href="tel:+17133642938">+1 713-364-2938</a>
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>
                <address>23659 Katy Fwy, Suite 400, Katy, TX 77494</address>
              </dd>
            </div>
            <div>
              <dt>Hours of operation</dt>
              <dd>
                <ul className="contact-hours">
                  {hours.map(([day, time]) => (
                    <li key={day}>
                      <span>{day}</span>
                      <span>{time}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>Follow</dt>
              <dd className="contact-social">
                <a href="https://www.instagram.com/avail_aesthetics_md/" target="_blank" rel="noreferrer">
                  Instagram
                </a>
                <a href="https://www.facebook.com/profile.php?id=61567200982769" target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </dd>
            </div>
          </dl>
        </motion.div>

        <motion.form className="contact-form" onSubmit={sendMessage} {...reveal}>
          <h2>Get in touch</h2>
          <div className="bf-fields">
            {field("Full name", "name")}
            {field("Email", "email", "email")}
            {field("Phone (optional)", "phone", "tel", false)}
          </div>
          <label className="bf-field contact-message">
            <textarea name="message" rows={4} placeholder=" " required />
            <span>How can we help?</span>
          </label>
          <div className="contact-submit">
            <button className="btn btn-dark" type="submit">
              Send message <ArrowRight size={16} />
            </button>
            <p>This opens a draft in your email app. Please leave out private medical details.</p>
          </div>
        </motion.form>
      </section>

      <section className="contact-locations section">
        <motion.h2 {...reveal}>Visit a clinic</motion.h2>
        <ul>
          {locations.map((clinic) => (
            <motion.li key={clinic.name} {...reveal}>
              <div>
                <h3>{clinic.name}</h3>
                <small>{clinic.area}</small>
              </div>
              <address>{clinic.address}</address>
              <a href={clinic.phoneHref}>{clinic.phone}</a>
              <a
                className="contact-directions"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address)}`}
                target="_blank"
                rel="noreferrer"
              >
                Get directions <ArrowUpRight size={15} />
              </a>
            </motion.li>
          ))}
        </ul>
        <motion.div className="contact-map" {...reveal}>
          <iframe
            title="Map of Avail Aesthetics MD, Katy"
            src="https://www.google.com/maps?q=23659+Katy+Fwy+%23400,+Katy,+TX+77494,+USA&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </section>

      {band}
    </main>
  )
}
