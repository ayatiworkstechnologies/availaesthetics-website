import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const

/** Image that wipes in from the bottom with a slight settle as it enters the viewport. */
export function ImageReveal({
  src,
  alt = "",
  className,
  delay = 0,
}: {
  src: string
  alt?: string
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      style={{ overflow: "hidden" }}
      initial={{ clipPath: reduce ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: EASE_IN_OUT }}
    >
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: reduce ? 1 : 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.3, delay, ease: EASE_OUT }}
      />
    </motion.div>
  )
}

/** Children fade up one after another when the group enters the viewport. */
export function Stagger({
  children,
  className,
  as = "div",
  gap = 0.08,
}: {
  children: ReactNode
  className?: string
  as?: "div" | "section" | "footer"
  gap?: number
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </Tag>
  )
}

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
}
