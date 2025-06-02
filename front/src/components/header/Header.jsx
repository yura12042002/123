import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactFlow, { Background } from "reactflow";
import { roadmapNodes } from "../../data/roadmapData";
import "reactflow/dist/style.css";
import style from "./header.module.css";
import { Link, useNavigate } from "react-router-dom";

const tabs = [
  "№ ГЛАВНАЯ",
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

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const memoizedNodes = useMemo(() => nodes, [nodes]);
  const memoizedEdges = useMemo(() => edges, [edges]);

  useEffect(() => {
    if (isOpen) {
      setNodes([]);
      setEdges([]);

      const nodeTimeouts = [];
      roadmapNodes.forEach((node, index) => {
        const timeout = setTimeout(() => {
          setNodes((prev) => [...prev, node]);
        }, index * 100);
        nodeTimeouts.push(timeout);
      });

      const edgeTimeouts = [];
      roadmapEdges.forEach((edge, index) => {
        const timeout = setTimeout(() => {
          setEdges((prev) => [...prev, edge]);
        }, roadmapNodes.length * 100 + index * 50);
        edgeTimeouts.push(timeout);
      });

      return () => {
        nodeTimeouts.forEach(clearTimeout);
        edgeTimeouts.forEach(clearTimeout);
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
    navigate("/auth")
  }

  const handleTabClick = (tab) => {
    if (tab === "№ ТУРИЗМ") {
      navigate("/travel");
    }
    if (tab === "№ ФИНАНСЫ") {
      navigate("/finance");
    }
    if (tab === "№ ГЛАВНАЯ") {
      navigate("/");
    }
    if (tab === "№ МЕНТОРСТВО") {
      navigate("/mentor");
    }
  };

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
              <button className={style.headerBtn} onClick={() => handleClickSignIn()}>Вход / Регистрация</button>
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
                      style={{ width: "100%", height: "100%" }}
                    >
                      {memoizedReactFlow}
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
