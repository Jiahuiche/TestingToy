'use client';

import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isNewYear, setIsNewYear] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsNewYear(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isNewYear) {
    return (
      <div className="text-center py-4 animate-pulse">
        <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
          🎉 ¡FELIZ 2026! 🎉
        </div>
      </div>
    );
  }

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center mx-1 md:mx-2">
      <div className="bg-gradient-to-b from-yellow-500/30 to-yellow-600/20 backdrop-blur-sm rounded-lg p-2 md:p-3 min-w-[50px] md:min-w-[70px] border border-yellow-400/30 shadow-lg shadow-yellow-500/20">
        <span className="text-2xl md:text-4xl font-bold text-yellow-100 tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs md:text-sm text-yellow-300/80 mt-1 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex justify-center items-center py-4">
      <TimeBlock value={timeLeft.days} label="Días" />
      <span className="text-2xl md:text-4xl text-yellow-400 animate-pulse mx-1">:</span>
      <TimeBlock value={timeLeft.hours} label="Horas" />
      <span className="text-2xl md:text-4xl text-yellow-400 animate-pulse mx-1">:</span>
      <TimeBlock value={timeLeft.minutes} label="Min" />
      <span className="text-2xl md:text-4xl text-yellow-400 animate-pulse mx-1">:</span>
      <TimeBlock value={timeLeft.seconds} label="Seg" />
    </div>
  );
}
