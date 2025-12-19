import React, { useState, useEffect, useCallback } from 'react';
import { Palmtree, MapPin, Camera, Sparkles, Share2 } from 'lucide-react';
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vacaciones Familia Rubilar',
          text: `¡Faltan ${countdown.days} días para Aruba! 🌊🌴`,
          url: window.location.href
        });
      } catch (err) {}
    }
  };

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
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-900">
      {/* Fondo de Aruba Dinámico */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1544431731-b41f39b6d1f3?q=80&w=2070&auto=format&fit=crop" 
          alt="Aruba Beach" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-slate-900"></div>
      </div>

      {/* Header Mobile */}
      <nav className="relative z-10 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Palmtree className="text-cyan-400" size={24} />
          <span className="text-white font-vacation text-lg">Aruba 2026</span>
        </div>
        <button onClick={handleShare} className="p-3 glass rounded-full text-white active:scale-90">
          <Share2 size={20} />
        </button>
      </nav>

      {/* Contenido Principal */}
      <main className="relative z-10 px-4 pt-4 pb-24 flex flex-col items-center max-w-lg mx-auto">
        
        {/* Título Principal solicitado */}
        <div className="text-center mb-8 px-2">
          <h1 className="text-4xl md:text-5xl font-vacation text-white text-shadow-vibrant leading-tight mb-2">
            cuenta regresiva para vacaciones
          </h1>
          <h2 className="text-4xl md:text-5xl font-handwritten font-bold text-cyan-300 -rotate-1">
            familia Rubilar
          </h2>
          <div className="flex justify-center items-center gap-2 mt-4 text-white/70 text-sm font-medium">
            <MapPin size={14} className="text-red-400 animate-bounce" /> Oranjestad, Aruba
          </div>
        </div>

        {/* Contador Central */}
        <CountdownDisplay countdown={countdown} />

        {/* Widgets */}
        <div className="w-full space-y-6 mt-8">
          <WeatherWidget data={arubaData} loading={isLoadingWeather} />
          
          <CalendarView targetDate={TARGET_DATE} />

          <div className="glass p-6 rounded-[2.5rem] text-white border-t border-white/20">
            <h3 className="font-vacation text-2xl mb-4 flex items-center gap-2 text-pink-400">
              <Camera size={20} /> Lista de Viaje
            </h3>
            <div className="space-y-3 font-handwritten text-2xl">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-7 h-7 rounded-full border-2 border-cyan-400 bg-cyan-500/20 flex items-center justify-center text-cyan-300 text-xs">✓</div>
                <span>Pasaportes al día</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-7 h-7 rounded-full border-2 border-white/20"></div>
                <span>Trajes de baño listos</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Estilo App */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 p-6 flex justify-center pb-safe">
        <div className="glass px-10 py-3 rounded-full border border-cyan-400/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white flex items-center gap-2">
            One Happy Island <Sparkles size={12} className="text-yellow-400 animate-pulse" />
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
