import React, { useEffect, useState, useRef } from "react";
import styles from "./newLevel.module.css";
import BlockTextLayout from "../layouts/blockTextLayout/BlockTextLayout";
import Draggable from "react-draggable";
import * as d3 from "d3";
import { animated, useSpring } from "@react-spring/web";
import OneMoreTextTitle from "../oneMoreTextTitle/OneMoreTextTitle";

const arr = [
  {
    title: "1 шаг",
    text: "</ Начнем с простого: разберем твой уровень знаний, определим цели и выберем подходящий план занятий. > ",
  },
  {
    title: "2 шаг",
    text: "</ Теоретическая часть: здесь мы не только погружаемся в ключевые концепции фронтенда, но и разбираем их с примерами реального кода. >",
  },
  {
    title: "3 шаг",
    text: "</ Практика на максимум: ты будешь писать код, решать задачи, участвовать в мини-проектах и учиться на собственных ошибках >",
  },
  {
    title: "4 шаг",
    text: "</ Создаем проекты: воплощаем теорию в жизнь. С каждым новым проектом ты будешь становиться всё увереннее. >",
  },
  {
    title: "5 шаг",
    text: "</ Рефакторинг и разбор: анализируем твой код, улучшаем его, учимся писать чисто и эффективно >",
  },
];

const NewLevel = () => {
  const [showHint, setShowHint] = useState(true);

  const containerRef = useRef(null);
  const nodeRefs = useRef(arr.map(() => React.createRef()));
  const svgRef = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const handleResize = () => requestAnimationFrame(drawLines);
    window.addEventListener("resize", handleResize);
    setTimeout(drawLines, 100);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setTimeout(drawLines, 100);
  }, []);

  const drawLines = () => {
    if (isDragging.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const positions = nodeRefs.current.map((ref) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const parentRect = containerRef.current.getBoundingClientRect();

        return {
          x: rect.left - parentRect.left + rect.width / 2,
          y: rect.top - parentRect.top + rect.height / 2,
        };
      }
      return null;
    });

    positions.forEach((pos, index) => {
      if (index > 0 && pos && positions[index - 1]) {
        const prevPos = positions[index - 1];

        const pathData = `
          M${prevPos.x},${prevPos.y}
          C${prevPos.x},${prevPos.y + 50} ${pos.x},${pos.y - 50} ${pos.x},${
          pos.y
        }
        `;

        svg
          .append("path")
          .attr("d", pathData)
          .attr("stroke", "black")
          .attr("stroke-width", 3)
          .attr("fill", "none")
          .attr("stroke-dasharray", "8,5")
          .attr("stroke-dashoffset", "1000")
          .transition()
          .duration(800)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", "0");
      }
    });
  };

  const DraggableBlock = ({ layoutText, index }) => {
    const nodeRef = nodeRefs.current[index];

    return (
      <Draggable
        nodeRef={nodeRef}
        onStart={() => (isDragging.current = true)}
        onStop={() => {
          isDragging.current = false;
          setTimeout(drawLines, 50);
        }}
        className={styles.containerDrag}
      >
        <animated.div
          ref={nodeRef}
          className={styles.containerBlock}
          style={{
            zIndex: `${5 - index}`,
            width: `${80 + 5 * index}%`,
            height: `${50 + 5 * index}%`,
          }}
        >
          <BlockTextLayout layoutText={layoutText} />
        </animated.div>
      </Draggable>
    );
  };

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <svg ref={svgRef} className={styles.svg}></svg>

      <OneMoreTextTitle
        codeTitleBase={"LET MHE = ВЫВЕСТИ ТЕБЯ НА НОВЫЙ УРОВЕНЬ!"}
      />
      <div className={styles.container}>
        {showHint && (
          <div className={styles.hint}>
            ✨ Попробуй перетянуть шаги они двигаются!
          </div>
        )}
        {arr.map((el, index) => (
          <DraggableBlock key={index} layoutText={el} index={index} />
        ))}
      </div>
    </div>
  );
};

export default NewLevel;
