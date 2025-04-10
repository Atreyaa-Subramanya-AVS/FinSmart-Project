import React from "react";
import clsx from "clsx";

const CircleProgressBar = ({
  percentage = 0,
  circleWidth = 80, // Smaller size
  className = "",
  strokeColor = "#12c2e9",
}) => {
  const radius = 30;
  const strokeWidth = 8;
  const normalizedRadius = radius + strokeWidth / 2;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * percentage) / 100;

  const strokeClass =
    {
      blue: "stroke-blue-500",
      red: "stroke-red-500",
      green: "stroke-green-500",
    }[strokeColor] || undefined;

  return (
    <div
      className={clsx(
        "relative aspect-square w-full h-auto max-w-[100px]", // Reduced max width
        className
      )}
      style={{ width: `${circleWidth}px` }}
    >
      <svg
        viewBox={`0 0 ${normalizedRadius * 2} ${normalizedRadius * 2}`}
        className="w-full h-full"
      >
        <circle
          cx={normalizedRadius}
          cy={normalizedRadius}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-[#D3D3D4]"
        />
        <circle
          cx={normalizedRadius}
          cy={normalizedRadius}
          r={radius}
          strokeWidth={strokeWidth}
          className={clsx(
            "fill-none [stroke-linecap:round] [stroke-linejoin:round]",
            strokeClass
          )}
          style={{
            stroke: strokeClass ? undefined : strokeColor,
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
          }}
          transform={`rotate(-90 ${normalizedRadius} ${normalizedRadius})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-semibold text-white">
        {percentage}%
      </div>
    </div>
  );
};

export default CircleProgressBar;