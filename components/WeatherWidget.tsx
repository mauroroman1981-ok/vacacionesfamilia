import React from 'react';
import { Sun, Wind, Droplets, ExternalLink, Waves, ThermometerSun, CloudRain } from 'lucide-react';
import { ArubaData } from '../types';

interface Props {
  data: ArubaData | null;
  loading: boolean;
}

const WeatherWidget: React.FC<Props> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="glass p-6 rounded-3xl animate-pulse flex flex-col items-center justify-center min-h-[300px] w-full max-w-sm">
        <div className="h-12 w-12 bg-white/20 rounded-full mb-4"></div>
        <div className="h-4 w-24 bg-white/20 rounded mb-2"></div>
        <div className="h-3 w-32 bg-white/20 rounded"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="glass p-6 rounded-3xl w-full max-w-sm text-white shadow-2xl transition-all hover:scale-[1.02] flex flex-col gap-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sun className="text-yellow-300 fill-yellow-300" />
            Aruba Hoy
          </h3>
          <span className="text-3xl font-black">{data.weather.temp}°C</span>
        </div>
        <p className="text-sm opacity-90 mb-4 font-medium capitalize">
          {data.weather.description}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Droplets size={16} className="text-blue-300" />
            <span className="text-xs font-semibold">{data.weather.humidity}% Hum</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind size={16} className="text-emerald-300" />
            <span className="text-xs font-semibold">{data.weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>

      <div className="bg-white/10 rounded-2xl p-4">
        <h4 className="text-[10px] uppercase tracking-widest font-black text-cyan-300 mb-3 flex items-center gap-2">
          <ThermometerSun size={12} /> Qué esperar en Enero
        </h4>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="opacity-60 flex items-center gap-1"><ThermometerSun size={14} /> Temp. Media</span>
            <span className="font-bold">{data.januaryClimate.avgTemp}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="opacity-60 flex items-center gap-1"><Waves size={14} /> Agua</span>
            <span className="font-bold">{data.januaryClimate.waterTemp}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="opacity-60 flex items-center gap-1"><CloudRain size={14} /> Lluvias</span>
            <span className="font-bold">{data.januaryClimate.rainDays}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4">
        <p className="text-[10px] uppercase tracking-wider mb-2 opacity-60 font-bold">Tips de viaje:</p>
        <ul className="space-y-2">
          {data.tips.slice(0, 2).map((tip, i) => (
            <li key={i} className="text-xs leading-relaxed flex gap-2">
              <span className="text-cyan-300">•</span> {tip}
            </li>
          ))}
        </ul>
      </div>

      {data.groundingSources.length > 0 && (
        <div className="mt-2 text-right">
          <a 
            href={data.groundingSources[0].uri} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[9px] inline-flex items-center gap-1 opacity-40 hover:opacity-100 transition-opacity"
          >
            Datos reales de Aruba <ExternalLink size={8} />
          </a>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
