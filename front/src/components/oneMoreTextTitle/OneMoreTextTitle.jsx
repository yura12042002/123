import React, { useEffect, useState, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coyWithoutShadows } from "react-syntax-highlighter/dist/esm/styles/prism";

const OneMoreTextTitle = ({ codeTitleBase }) => {
  const [renderedTitle, setRenderedTitle] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [formattedTitle, setFormattedTitle] = useState(codeTitleBase);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      let newTitle = codeTitleBase;

      if (screenWidth < 600) {
        newTitle = codeTitleBase
          .split(" ")
          .map((word, idx) => (idx % 4 === 0 && idx !== 0 ? word + "\n" : word))
          .join(" ");
      } else if (screenWidth < 400) {
        newTitle = codeTitleBase
          .split(" ")
          .map((word, idx) =>
            idx % 3 === 0 && idx % 3 !== 0 ? word + "\n" : word
          )

          .join(" ");
      }

      setFormattedTitle(newTitle);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (charIndex < formattedTitle.length) {
      const timer = setTimeout(() => {
        setRenderedTitle((prev) => prev + formattedTitle[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [charIndex, formattedTitle]);
  return (
    <SyntaxHighlighter
      language="javascript"
      style={coyWithoutShadows}
      customStyle={{
        background: "transparent",
        color: "#282C34",
        fontFamily: "Fira Code, Consolas, Monaco, monospace",
        fontSize: "1.3rem",
        textAlign: "center",
        padding: "10px",
        maxWidth: "95vw",
        margin: "0 auto",
        overflowWrap: "break-word",
        marginBottom: "30px",
        marginTop: "50px"
      }}
    >
      {renderedTitle || "// Загружается..."}
    </SyntaxHighlighter>
  );
};

export default OneMoreTextTitle;
