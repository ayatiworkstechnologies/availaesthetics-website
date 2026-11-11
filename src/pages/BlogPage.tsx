import { useState, type ReactNode } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ArrowUpRight } from "lucide-react"

const SITE = "https://availaestheticsmd.com/"
const UPLOADS = `${SITE}wp-content/uploads/2026/`
const PAGE_SIZE = 9

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
}

// Newest first, in the live blog's order. [title, category, live post path, image path]
const posts = [
  ["How to Improve Skin Texture, Large Pores and Uneven Skin Tone", "Skincare", "skincare/rf-microneedling-treatment/", "11/How-to-Improve-Skin-Texture-Large-Pores-and-Uneven-Skin-Tone-1024x576.webp"],
  ["How Many Laser Hair Removal Sessions Do You Need to See Results?", "Laser Treatments", "laser-treatments/how-many-treatments-laser-hair-removal/", "10/How-Many-Laser-Hair-Removal-Sessions-Do-You-1-1024x576.webp"],
  ["Best Treatments for Uneven Skin Texture: Which Option Is Right for You?", "Skincare", "skincare/best-treatments-for-uneven-skin-texture/", "10/Best-Treatments-for-Uneven-Skin-Texture-1024x576.webp"],
  ["What Does RF Microneedling Feel Like? Pain, Recovery & Aftercare", "Skincare", "skincare/what-does-rf-microneedling-feel-like/", "10/What-Does-RF-Microneedling-Feel-Like_--1024x576.webp"],
  ["The science of chemical peels: What happens beneath the surface.", "Facials & Peels", "facials-and-peels/chemical-peel-skin-renewal/", "09/Chemical-Peel-1024x576.webp"],
  ["The New Age XERF Non-Invasive Skin Tightening: How It Works, Benefits, and What to Expect", "Skin Tightening", "non-invasive-skin-tightening/new-age-xerf-skin-tightening/", "09/XERF-1024x576.webp"],
  ["Botox vs Dysport vs Xeomin: Which Neuromodulator is Best", "Botox", "botox/botox-dysport-xeomin/", "08/botox-vs-dysport-vs-xeomin-1024x576.jpg"],
  ["Vampire Facial: The Bloody Truth About This Anti-Aging Treatment", "Skincare", "skincare/vampire-facial-katy-tx/", "08/Vampire-Facial-1024x576.jpg"],
  ["Skin Rejuvenation Without Surgery: Advanced Cosmetic Treatments for Radiant, Youthful Skin", "Skincare", "skincare/nonsurgical-skin-rejuvenation-katy-tx/", "08/Nonsurgical-skin-rejuvenation-1024x576.webp"],
  ["Scalp Revival: Complete Guide to Hydro Scalp Treatment for Hair Health", "Hair", "hair/hydro-scalp-treatment-katy-tx/", "08/HFK1-1024x576.jpg"],
  ["Botox Aftercare 7 Critical Do's & Don'ts [Complete Recovery Guide]", "Botox", "botox/botox-aftercare-dos-and-donts/", "08/images-14.jpeg"],
  ["Best HydraFacial Treatment Near You: Results, Cost & What to Expect", "Botox", "botox/hydrafacial-treatment-katy-in-tx/", "08/HydraFacial-treatment-in-Katy-1024x683.webp"],
  ["5 Surprising Botox Uses: From Migraines to Excessive Sweating", "Botox", "botox/5-surprising-botox-uses-from-migraines-to-excessive-sweating/", "07/injectables-fillers-11-1024x559.jpg"],
  ["Best treatment for sun-damaged skin: Laser vs Peels vs Topicals", "Skincare", "skincare/sun-damage-treatment/", "07/360_F_472485086_W38isCYb9G7Icfn2D7uOwcf1Fhk8THYA.jpg"],
  ["How to Get Rid of Dark Spots: Melasma vs. Sun Spots Explained", "Sunscreen", "sunscreen/how-to-get-rid-of-dark-spots/", "07/images-9.jpeg"],
  ["How long do non-cosmetic Botox results last", "Botox", "botox/how-long-does-botox-last/", "07/masseter-botox-reviews-1024x683-1.webp"],
  ["Botox for jaw slimming/TMJ: Does it work?", "Skincare", "skincare/botox-for-jaw-slimming/", "07/i_Stock_1189207356_abf3794599-1-1024x683.avif"],
  ["Your Ultimate Guide to Treating Sun-Damaged Skin", "Skincare", "skincare/sun-damaged-skin-treatment/", "07/Lady-with-pigmentation-1024x819.avif"],
  ["Under-Eye Dark Circles and Hollows: New Treatments That Actually Work in 2026", "Under-Eye", "under-eye-treatments/under-eye-dark-circles-hollows-treatment/", "06/images-7.jpeg"],
  ["Your Pre- and Post-Laser Care Guide: What to Do (and Avoid) for the Best Results", "Skincare", "skincare/laser-treatment-aftercare-guide/", "06/istockphoto-1408317231-640x640-1.jpg"],
  ["Adult Acne in your 30s and 40s: Causes, Triggers, and what Dermatologists Recommend", "Skincare", "skincare/adult-acne-treatment/", "10/acne-1024x635.png"],
].map(([title, category, path, image]) => ({
  title,
  category,
  url: SITE + path,
  image: UPLOADS + image,
}))

const categories = ["All", ...new Set(posts.map((post) => post.category))]

export default function BlogPage({ band }: { band: ReactNode }) {
  const [category, setCategory] = useState("All")
  const [visible, setVisible] = useState(PAGE_SIZE)
  const filtered = posts.filter((post) => category === "All" || post.category === category)
  const [featured, ...rest] = filtered
  const shown = rest.slice(0, visible)

  return (
    <main className="about-page blog-page">
      <section className="about-hero contact-hero">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="eyebrow">Blog</span>
          <h1>
            Aesthetics &amp; skincare, <br /><em>tips &amp; treatments.</em>
          </h1>
        </motion.div>
      </section>

      <section className="blog-list section">
        <div className="blog-filters" role="group" aria-label="Filter posts by category">
          {categories.map((name) => (
            <button
              key={name}
              aria-pressed={name === category}
              onClick={() => {
                setCategory(name)
                setVisible(PAGE_SIZE)
              }}
            >
              {name}
            </button>
          ))}
        </div>

        <a key={featured.url} className="blog-featured" href={featured.url} target="_blank" rel="noreferrer">
          <div className="blog-img">
            <img src={featured.image} alt="" />
          </div>
          <div>
            <span className="eyebrow">Latest · {featured.category}</span>
            <h2>{featured.title}</h2>
            <span className="blog-read">
              Read article <ArrowUpRight size={15} />
            </span>
          </div>
        </a>

        {shown.length > 0 && (
          <ul className="blog-grid">
            {shown.map((post) => (
              <motion.li key={post.url} {...reveal}>
                <a href={post.url} target="_blank" rel="noreferrer">
                  <div className="blog-img">
                    <img src={post.image} alt="" loading="lazy" />
                  </div>
                  <span className="eyebrow">{post.category}</span>
                  <h3>{post.title}</h3>
                </a>
              </motion.li>
            ))}
          </ul>
        )}

        {rest.length > visible && (
          <button className="btn btn-dark blog-more" onClick={() => setVisible(visible + PAGE_SIZE)}>
            Show more articles <ArrowRight size={16} />
          </button>
        )}
      </section>

      {band}
    </main>
  )
}
