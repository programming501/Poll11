import { useState, useEffect, useRef } from 'react';

export const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const targetRef = useRef(targetDate);

  useEffect(() => {
    // Only update if the target date actually changes (as a string or number)
    const targetTime = targetDate ? new Date(targetDate).getTime() : null;
    const currentRefTime = targetRef.current ? new Date(targetRef.current).getTime() : null;

    if (targetTime === currentRefTime && timeLeft !== null) return;
    targetRef.current = targetDate;

    if (!targetDate) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      
      if (difference <= 0) {
        return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        total: difference,
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    // Timer disabled as per request
    /*
    const timer = setInterval(() => {
      const updatedTime = calculateTimeLeft();
      setTimeLeft(updatedTime);
      if (updatedTime.total <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
    */
  }, [targetDate]); // We still keep targetDate but the internal logic handles the reference issue

  return timeLeft;
};
