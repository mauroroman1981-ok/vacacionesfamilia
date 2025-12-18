
import React, { useState, useEffect, useCallback } from 'react';
import { Palmtree, MapPin, Compass, Camera, Sparkles, Share2 } from 'lucide-react';
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
          alt="Aruba" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-slate-900"></div>
      </div>

      {/* Header Mobile */}
      <nav className="relative z-10 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Palmtree className="text-cyan-400" size={24} />
          <span className="text-white font-vacation text-lg">Rubilar 2026</span>
        </div>
        <button onClick={handleShare} className="p-3 glass rounded-full text-white active:scale-90">
          <Share2 size={20} />
        </button>
      </nav>

      {/* Contenido Principal */}
      <main className="relative z-10 px-4 pt-4 pb-24 flex flex-col items-center max-w-lg mx-auto">
        
        {/* Título Principal de Vacaciones */}
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1 glass rounded-full text-[10px] font-black uppercase tracking-widest text-cyan-300 mb-4 animate-pulse">
            Cuenta Regresiva
          </span>
          <h1 className="text-5xl font-vacation text-white text-shadow-vibrant leading-none mb-2">
            Vacaciones
          </h1>
          <h2 className="text-4xl font-handwritten font-bold text-cyan-300 -rotate-2">
            Familia Rubilar
          </h2>
          <div className="flex justify-center items-center gap-2 mt-4 text-white/60 text-xs">
            <MapPin size={12} className="text-red-400" /> Aruba • 11 de Enero 2026
          </div>
        </div>

        {/* Contador Central */}
        <CountdownDisplay countdown={countdown} />

        {/* Widgets Adaptados a Mobile */}
        <div className="w-full space-y-6 mt-8">
          <WeatherWidget data={arubaData} loading={isLoadingWeather} />
          
          <CalendarView targetDate={TARGET_DATE} />

          <div className="glass p-6 rounded-[2rem] text-white">
            <h3 className="font-vacation text-xl mb-4 flex items-center gap-2 text-pink-400">
              <Camera size={18} /> Diario de Viaje
            </h3>
            <div className="space-y-3 font-handwritten text-xl">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <div className="w-6 h-6 rounded-full border-2 border-cyan-400 bg-cyan-500/20 flex items-center justify-center">✓</div>
                <span>¡Pasaportes listos! 🛂</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <div className="w-6 h-6 rounded-full border-2 border-white/20"></div>
                <span>Comprar bloqueador 🧴</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Estilo App */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 p-4 flex justify-center pb-safe">
        <div className="glass px-8 py-3 rounded-full border border-cyan-400/20 shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 flex items-center gap-2">
            One Happy Island <Sparkles size={10} className="text-yellow-400" />
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
