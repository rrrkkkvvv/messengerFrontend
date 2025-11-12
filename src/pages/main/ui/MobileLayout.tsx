import { Route, Routes, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import SideBar from "./SideBar";
import Conversation from "../../../widgets/conversation/ui/Conversation";

const MobileLayout = () => {
  const location = useLocation();
  // const navigationType = useNavigationType();
  // const [direction, setDirection] = useState(1);
  // const prevPath = useRef(location.pathname);

  // useEffect(() => {
  //   if (navigationType === "POP") {
  //     setDirection(-1);
  //   } else {
  //     setDirection(1);
  //   }
  //   prevPath.current = location.pathname;
  // }, [location, navigationType]);

  // const variants = {
  //   enter: (direction: number) => {
  //     return {
  //       x: direction > 0 ? "100%" : "-100%",
  //     };
  //   },
  //   center: { x: 0 },
  //   exit: (direction: number) => ({
  //     x: direction > 0 ? "-100%" : "100%",
  //     display: "none",
  //   }),
  // };
  return (
    <div className="relative w-full h-full overflow-hidden   bg-gray-400">
      {/* <AnimatePresence custom={direction}> */}
      {/* <motion.div
          key={location.pathname}
          custom={direction}
          className=" absolute w-full h-full bg-gray-400 z-10"
          initial={false}
          animate="center"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.4 }}
        > */}
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <SideBar />
            </PageWrapper>
          }
        />
        <Route
          path="/conversation/:type/:contactId"
          element={
            <PageWrapper>
              <Conversation />
            </PageWrapper>
          }
        />
      </Routes>
      {/* </motion.div> */}
      {/* </AnimatePresence> */}
    </div>
  );
};

const PageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default MobileLayout;
