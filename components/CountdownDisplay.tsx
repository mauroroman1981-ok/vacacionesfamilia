import React from 'react';
import { Countdown } from '../types';

interface Props {
  countdown: Countdown;
}

const CountdownDisplay: React.FC<Props> = ({ countdown }) => {
  const units = [
    { label: 'Días', value: countdown.days },
    { label: 'Hs', value: countdown.hours },
    { label: 'Min', value: countdown.minutes },
    { label: 'Seg', value: countdown.seconds }
  ];

  return (
    <div className="flex flex-row justify-center gap-2 sm:gap-4 md:gap-8 my-4 md:my-8 w-full px-2">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center flex-1 max-w-[80px] sm:max-w-none">
          <div className="glass aspect-square w-full flex items-center justify-center rounded-2xl sm:rounded-[2rem] shadow-xl border-t border-white/30">
            <span className="text-2xl sm:text-4xl md:text-5xl font-black text-white text-shadow-vibrant tabular-nums">
              {String(unit.value).padStart(2, '0')}
            </span>
          </div>
          <span className="mt-2 text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider text-white/80">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownDisplay;
