'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  trend?: number;
  color?: 'primary' | 'accent' | 'success';
}

export function StatsCard({ 
  label, 
  value, 
  prefix = '', 
  suffix = '',
  icon: Icon, 
  trend,
  color = 'primary'
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
  };

  return (
    <div className="card stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-secondary text-sm font-medium mb-1">{label}</p>
          <p className="font-display text-3xl font-bold text-gray-900">
            {prefix}{displayValue.toLocaleString('fr-FR')}{suffix}
          </p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${
              trend >= 0 ? 'text-success' : 'text-error'
            }`}>
              {trend >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{trend >= 0 ? '+' : ''}{trend}% ce mois</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
