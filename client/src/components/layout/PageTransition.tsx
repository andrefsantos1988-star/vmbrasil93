import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [location] = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (location !== displayLocation) {
      setDirection(location === '/' ? -1 : 1);
      setDisplayLocation(location);
    }
  }, [location, displayLocation]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={displayLocation}
        initial={{ opacity: 0, y: direction > 0 ? 150 : -150 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: direction > 0 ? -150 : 150 }}
        transition={{
          duration: 0.6,
          ease: [0.32, 0, 0.67, 0],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
