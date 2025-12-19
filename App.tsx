import React, { useState, useEffect, useCallback } from 'react';
import { Palmtree, MapPin, Camera, Sparkles, Share2, CloudSun } from 'lucide-react';
import { ArubaData, Countdown } from './types';
import { fetchArubaInsights } from './services/geminiService';
import WeatherWidget from './components/WeatherWidget';
import CountdownDisplay from './components/CountdownDisplay';
import CalendarView from './components/CalendarView';

const TARGET_DATE = new Date('2026-01-11T00:00:00');

function App() {
  const [arubaData, setArubaData] = useState<ArubaData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const calculateCountdown = useCallback(() => {
    const now = new Date();
    const difference = TARGET_DATE.getTime() - now.getTime();

    if (difference > 0) {
      setCountdown({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(calculateCountdown, 1000);
    calculateCountdown();
    fetchArubaInsights().then(data => {
      setArubaData(data);
      setIsLoadingWeather(false);
    });
    return () => clearInterval(timer);
  }, [calculateCountdown]);

  return (
    <div className="min-h-screen w-full relative bg-slate-900 text-white selection:bg-cyan-500">
      {/* Fondo de Aruba optimizado para Mobile */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=2073&auto=format&fit=crop" 
          alt="Aruba Beach" 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-slate-900"></div>
      </div>

      {/* Navegación Superior */}
      <nav className="relative z-10 p-5 flex justify-between items-center bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
            <Palmtree size={20} className="text-white" />
          </div>
          <span className="font-vacation text-xl tracking-wide">Aruba 2026</span>
        </div>
        <button 
          onClick={() => navigator.share?.({ title: 'Rubilar a Aruba', url: window.location.href })}
          className="p-2.5 glass rounded-full active:scale-90 transition-transform"
        >
          <Share2 size={18} />
        </button>
      </nav>

      <main className="relative z-10 px-4 py-8 max-w-md mx-auto flex flex-col items-center">
        
        {/* LEYENDA SOLICITADA */}
        <div className="text-center space-y-2 mb-10">
          <p className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4 drop-shadow-lg">
            Prepárense las maletas
          </p>
          <h1 className="text-4xl font-vacation leading-tight text-white drop-shadow-2xl">
            cuenta regresiva para vacaciones
          </h1>
          <h2 className="text-5xl font-handwritten font-bold text-cyan-300 drop-shadow-lg transform -rotate-1">
            familia Rubilar
          </h2>
        </div>

        {/* CONTADOR */}
        <CountdownDisplay countdown={countdown} />

        {/* WIDGETS */}
        <div className="w-full space-y-6 mt-10">
          
          {/* Clima Actual en Aruba */}
          <div className="relative overflow-hidden">
            <WeatherWidget data={arubaData} loading={isLoadingWeather} />
            {!isLoadingWeather && (
              <div className="absolute top-2 right-2">
                <CloudSun size={16} className="text-white/20 animate-pulse" />
              </div>
            )}
          </div>
          
          {/* Calendario de Enero */}
          <CalendarView targetDate={TARGET_DATE} />

          {/* Checklist Estilizado */}
          <div className="glass p-8 rounded-[2.5rem] shadow-2xl border-t border-white/20">
            <h3 className="font-vacation text-2xl mb-6 text-pink-400 flex items-center gap-3">
              <Camera className="animate-bounce" /> Checklist Rubi
            </h3>
            <div className="space-y-4 font-handwritten text-2xl">
              {[
                { text: 'Pasaportes listos', check: true },
                { text: 'Reservar excursiones', check: false },
                { text: 'Comprar protector solar', check: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${item.check ? 'bg-cyan-500 border-cyan-400' : 'border-white/30 group-hover:border-cyan-400'}`}>
                    {item.check && <span className="text-xs">✓</span>}
                  </div>
                  <span className={item.check ? 'line-through opacity-50' : ''}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Espacio para el footer */}
        <div className="h-24"></div>
      </main>

      {/* BOTÓN FLOTANTE ESTILO APP */}
      <div className="fixed bottom-8 left-0 right-0 z-30 flex justify-center px-6">
        <div className="glass px-10 py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-cyan-400/30 flex items-center gap-3">
          <Sparkles size={16} className="text-yellow-400 animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
            One Happy Island
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
