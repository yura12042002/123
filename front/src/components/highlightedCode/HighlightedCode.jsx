import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coyWithoutShadows } from "react-syntax-highlighter/dist/esm/styles/prism";

const customStyle = {
  'code[class*="language-"]': {
    background: "transparent",
    color: "#282C34",
    fontFamily: "Fira Code, Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    fontSize: "clamp(1rem, 1.5vw, 1.4rem)", 
    lineHeight: "1.6",
    width: "100%",
    maxWidth: "90vw",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    borderRadius: "8px",
    padding: "20px",
  },
  'pre[class*="language-"]': {
    background: "white",
    padding: "15px",
    borderRadius: "8px",
    overflowX: "auto",
    maxWidth: "95vw",
    maxHeight: "calc(100vh - 150px)",
    border: "1px solid #E5E5E5",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)", 
  },
  ".token.keyword": { color: "#D73A49", fontWeight: "bold" }, 
  ".token.punctuation": { color: "#282C34" }, 
  ".token.operator": { color: "#D73A49", fontWeight: "bold" }, 
  ".token.string": { color: "#22863A", fontWeight: "bold" },
  ".token.comment": { color: "#6A737D", fontStyle: "italic" },
  ".token.parameter": { color: "#005CC5", fontWeight: "bold" }, 
  "span.line-number": {
    display: "inline-block",
    width: "40px",
    textAlign: "right",
    marginRight: "8px",
    color: "#B3B3B3",
    fontSize: "clamp(0.8rem, 1vw, 1.2rem)", 
    userSelect: "none",
  },
};

const codeLines = [
  "IF (интересна frontend-разработка) {",
  "  // подробнее об обучении можешь узнать",
  '  в разделе "НАСТАВНИЧЕСТВО";',
  "} ELSE IF (больше информации обо мне) {",
  '  в разделе "О НАСТАВНИКЕ";',
  "} ELSE IF (оплатить подписку) {",
  '  в разделе "ПОДПИСКИ";',
  "}",
];

const HighlightedCode = () => {
  const [renderedCode, setRenderedCode] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const fullCode = codeLines.join("\n");

  useEffect(() => {
    if (charIndex < fullCode.length) {
      const timer = setTimeout(() => {
        setRenderedCode((prev) => prev + fullCode[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 50); 
      return () => clearTimeout(timer);
    }
  }, [charIndex]);

  return (
    <div style={{ width: "100%", maxWidth: "95vw", overflowX: "auto", margin: '0 auto' }}>
      <SyntaxHighlighter
        language="javascript"
        style={{ ...coyWithoutShadows, ...customStyle }}
        showLineNumbers
        lineNumberStyle={{
          color: "#B3B3B3",
          fontSize: "clamp(0.8rem, 1vw, 1.2rem)", 
          paddingRight: "12px",
        }}
      >
        {renderedCode || "// Код загружается..."}
      </SyntaxHighlighter>
    </div>
  );
};

export default HighlightedCode;
