import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

interface CountUpNumberProps {
  value: number;
  className?: string;
}

const CountUpNumber = ({ value, className }: CountUpNumberProps) => {
  const count = useMotionValue(0);
  const displayValue = useTransform(count, (latest) =>
    Math.round(latest).toString().padStart(2, "0"),
  );

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.2,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [count, value]);

  return <motion.span className={className}>{displayValue}</motion.span>;
};

export default CountUpNumber;
