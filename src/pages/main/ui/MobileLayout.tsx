import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MobileLayout = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [direction, setDirection] = useState(1);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (navigationType === "POP") {
      setDirection(-1);
    } else {
      setDirection(1);
    }
    prevPath.current = location.pathname;
  }, [location, navigationType]);

  const variants = {
    enter: (direction: number) => {
      console.log(direction);
      return {
        x: direction > 0 ? "100%" : "-100%",
      };
    },
    center: { x: 0 },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      display: "none",
    }),
  };
  return (
    <div className="relative w-full h-full overflow-hidden   bg-gray-400">
      <AnimatePresence custom={direction}>
        <motion.div
          key={location.pathname}
          custom={direction}
          className=" absolute w-full h-full bg-gray-400 z-10"
          initial={false}
          animate="center"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MobileLayout;
