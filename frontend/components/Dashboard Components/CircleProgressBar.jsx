import React from "react";
import clsx from "clsx";

const CircleProgressBar = ({
  percentage = 0,
  circleWidth = 200,
  className = "",
  strokeColor = "#12c2e9",
}) => {
  const radius = 60;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * percentage) / 100;
  const center = circleWidth / 2;

  const strokeClass =
    {
      blue: "stroke-blue-500",
      red: "stroke-red-500",
      green: "stroke-green-500",
    }[strokeColor] || undefined;

  return (
    <div className={`${className} relative bg-gray-200 h-min`}>
      <svg
        width={circleWidth}
        height={circleWidth}
        viewBox={`0 0 ${circleWidth + 200} ${circleWidth}`}
      >
        <circle
          cx={center}
          cy={center}
          strokeWidth="15px"
          r={radius}
          className="fill-none stroke-[#ddd]"
        />

        <circle
          cx={center}
          cy={center}
          strokeWidth="15px"
          r={radius}
          className={clsx(
            "fill-none [stroke-linecap:round] [stroke-linejoin:round]",
            strokeClass // only use this if it's a known Tailwind class
          )}
          style={{
            stroke: strokeClass ? undefined : strokeColor, // fallback for hex colors
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
          }}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg">
        <h1>{percentage}%</h1>
      </div>
    </div>
  );
};

export default CircleProgressBar;
