'use client'

import React from 'react';
import { motion } from 'framer-motion';

interface KnobProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  color?: string;
  icon?: React.ReactNode;
  tooltip?: string;
}

export const Knob: React.FC<KnobProps> = ({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  color = 'text-purple-400',
  icon,
  tooltip
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const rotation = (percentage / 100) * 270 - 135;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        {icon && <div className={color}>{icon}</div>}
        <span className="text-sm font-semibold text-white">{label}</span>
        <span className="text-xs text-gray-400 ml-auto">{value}/{max}</span>
      </div>
      
      <div className="relative w-full h-20 flex items-center justify-center">
        <div className="relative w-16 h-16">
          {/* Knob Circle */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-gray-600 shadow-lg">
            <div 
              className="absolute top-2 left-1/2 w-1 h-6 bg-white rounded-full transform -translate-x-1/2 origin-bottom transition-transform duration-200"
              style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
            />
          </div>
          
          {/* Value Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{value}</span>
          </div>
        </div>
      </div>
      
      {/* Slider for precise control */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer mt-2"
        style={{
          background: `linear-gradient(to right, ${color.replace('text-', '')} 0%, ${color.replace('text-', '')} ${percentage}%, rgba(255,255,255,0.2) ${percentage}%, rgba(255,255,255,0.2) 100%)`
        }}
      />
      
      {tooltip && (
        <p className="text-xs text-gray-400 mt-2">{tooltip}</p>
      )}
    </div>
  );
};
