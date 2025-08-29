import { useEffect, useRef } from "react";
import "../styles/preloader.css";

export default function Preloader({ onFinish }) {
  const counterRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    let currentValue = 0;
    const counterElem = counterRef.current;
    const circle = circleRef.current;
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    function setProgress(percent) {
      const offset = circumference - (percent / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    }

    function updateCounter() {
      if (currentValue >= 100) return;
      currentValue += Math.floor(Math.random() * 5) + 1;
      if (currentValue > 100) currentValue = 100;
      if (counterElem) counterElem.textContent = `${currentValue}%`;
      setProgress(currentValue);
      const delay = Math.floor(Math.random() * 100) + 50;
      setTimeout(updateCounter, delay);
    }

    updateCounter();

    // Hide preloader after 4s
    const timer = setTimeout(() => {
      const loader = document.getElementById("pre-loader");
      const mainContent = document.getElementById("main");
      loader.style.transition = "opacity 0.7s ease, transform 0.7s ease";
      loader.style.opacity = "0";
      loader.style.transform = "scale(0)";
      setTimeout(() => {
        loader.style.display = "none";
        if (mainContent) mainContent.style.opacity = 1;
        if (onFinish) onFinish();
      }, 700);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div id="pre-loader">
      <svg className="circle-loader" width="120" height="110">
        <circle
          ref={circleRef}
          stroke="#27ae60"
          strokeWidth="8"
          fill="transparent"
          r="50"
          cx="55"
          cy="55"
        />
      </svg>
      <div className="counter" ref={counterRef}>0%</div>
    </div>
  );
}
