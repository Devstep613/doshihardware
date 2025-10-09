import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDate: string;
  className?: string;
}

const CountdownTimer = ({ endDate, className = '' }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const difference = end - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const { days, hours, minutes, seconds } = timeLeft;

  if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
    return <span className={`text-red-500 font-bold ${className}`}>Offer Expired</span>;
  }

  return (
    <div className={`flex gap-2 text-sm font-mono ${className}`}>
      <div className="bg-red-500 text-white px-2 py-1 rounded">
        {days}d
      </div>
      <div className="bg-red-500 text-white px-2 py-1 rounded">
        {hours}h
      </div>
      <div className="bg-red-500 text-white px-2 py-1 rounded">
        {minutes}m
      </div>
      <div className="bg-red-500 text-white px-2 py-1 rounded">
        {seconds}s
      </div>
    </div>
  );
};

export default CountdownTimer;
