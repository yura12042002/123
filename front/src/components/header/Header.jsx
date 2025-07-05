import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactFlow, { Background } from "reactflow";
import { roadmapNodes } from "../../data/roadmapData";
import "reactflow/dist/style.css";
import style from "./header.module.css";
import { Link, useNavigate } from "react-router-dom";

const tabs = [
  "№ ГЛАВНАЯ",
  "№ ПРОФИЛЬ",
  "№ МЕНТОРСТВО",
  "№ ТУРИЗМ",
  "№ ПОДПИСКИ",
  "№ ФИНАНСЫ",
  "№ РОУДМАП",
];

const tabVariants = {
  hidden: { opacity: 0, x: -50, scale: 0.95 },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { delay: index * 0.15, duration: 0.6, ease: "easeInOut" },
  }),
  exit: { opacity: 0, x: -50, transition: { duration: 0.4 } },
};

const roadmapEdges = roadmapNodes.slice(0, -1).map((node, index) => ({
  id: `e${node.id}-${roadmapNodes[index + 1].id}`,
  source: node.id,
  target: roadmapNodes[index + 1].id,
  animated: true,
}));

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [student, setStudent] = useState(null);
  const [showRoadmap, setShowRoadmap] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    setShowRoadmap(false);
    setEdges([]);
  };

  const memoizedNodes = useMemo(() => nodes, [nodes]);
  const memoizedEdges = useMemo(() => edges, [edges]);

  useEffect(() => {
    if (isOpen) {
      setNodes([]);

      const nodeTimeouts = [];
      roadmapNodes.forEach((node, index) => {
        const timeout = setTimeout(() => {
          setNodes((prev) => [...prev, node]);
        }, index * 100);
        nodeTimeouts.push(timeout);
      });

      const edgeTimeouts = [];

      return () => {
        nodeTimeouts.forEach(clearTimeout);
      };
    }
  }, [isOpen]);

  const memoizedReactFlow = useMemo(
    () => (
      <ReactFlow
        nodes={memoizedNodes}
        edges={memoizedEdges}
        fitView
        suppressHydrationWarning
      >
        <Background gap={30} />
      </ReactFlow>
    ),
    [memoizedNodes, memoizedEdges]
  );

  useEffect(() => {
    window.addEventListener("error", (e) => {
      if (
        e.message ===
        "ResizeObserver loop completed with undelivered notifications"
      ) {
        e.stopPropagation();
        e.preventDefault();
      }
    });

    return () => {
      window.removeEventListener("error", () => {});
    };
  }, []);

  const navigate = useNavigate();

  const handleClickSignIn = () => {
    navigate("/auth");
  };

  const handleTabClick = (tab) => {
    if (tab === "№ ПРОФИЛЬ") {
      if (!student) {
        navigate("/auth");
      } else {
        navigate("/profile");
      }
      return;
    }
    if (tab === "№ ТУРИЗМ") navigate("/travel");
    if (tab === "№ ФИНАНСЫ") navigate("/finance");
    if (tab === "№ ГЛАВНАЯ") navigate("/");
    if (tab === "№ МЕНТОРСТВО") navigate("/mentor");
  };

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      try {
        setStudent(JSON.parse(storedStudent));
      } catch (e) {
        console.error("Ошибка при парсинге профиля:", e);
        setStudent(null);
      }
    }
  }, []);
  console.log(student);
  return (
    <header className={style.header}>
      <div className={style.headerContent}>
        <div className={style.logoWrapper}>
          <Link className={style.headerImgLink} to="/">
            <img src="images/main_pictures/logo.svg" alt="logo" />
          </Link>
        </div>
        {!isOpen && (
          <motion.button
            className={style.headerBurger}
            onClick={toggleMenu}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
          >
            <motion.img src="images/main_pictures/burger.svg" alt="burger" />
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={style.menuContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className={style.topButtons}>
              {student ? (
                <button
                  className={style.headerBtn}
                  onClick={() => navigate("/profile")}
                >
                  👤 {student.telegram || "Профиль"}
                </button>
              ) : (
                <button className={style.headerBtn} onClick={handleClickSignIn}>
                  Вход / Регистрация
                </button>
              )}
            </div>

            <nav className={style.tabMenu}>
              {tabs.map((tab, index) => (
                <motion.div
                  key={index}
                  className={style.tab}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={tabVariants}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    top: `${index * 40}px`,
                    zIndex: tabs.length + index,
                    width: `${50 + index * 8}%`,
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    height: "60vh",
                  }}
                  onClick={() => handleTabClick(tab)}
                >
                  <h2>{tab}</h2>
                  {tab === "№ РОУДМАП" && (
                    <div
                      className={style.roadmapContainer}
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      {!showRoadmap ? (
                        <button
                          onClick={() => {
                            setShowRoadmap(true);
                            setEdges(roadmapEdges); // только тут вставляем edges
                          }}
                      style={{
  padding: "14px 32px",
  fontSize: "1rem",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  color: "#000",
  cursor: "pointer",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  transition: "all 0.3s ease",
  boxShadow: "inset 0 0 0 rgba(255, 255, 255, 0), 0 4px 10px rgba(0, 0, 0, 0.3)",
  fontWeight: "500",
  letterSpacing: "0.5px",
  textShadow: "0 1px 2px rgba(0, 0, 0, 0.4)",
}}
onMouseEnter={(e) => {
  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.18)";
  e.target.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.3)";
  e.target.style.transform = "translateY(-2px)";
}}
onMouseLeave={(e) => {
  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  e.target.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.3)";
  e.target.style.transform = "translateY(0)";
}}

                        >
                          Показать роудмап
                        </button>
                      ) : (
                        memoizedReactFlow
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </nav>
            <motion.button
              className={style.closeMenu}
              onClick={toggleMenu}
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: "easeOut" },
              }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            >
              <img src="./images/main_pictures/close.svg" alt="Закрыть" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
