import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

const variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
}

export default function PageTransition({ children }) {
  const location = useLocation()

  // اسکرول به بالا با تغییر مسیر
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <motion.div
      key={location.pathname}
      variants={variants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}