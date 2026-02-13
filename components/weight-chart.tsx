'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate, formatWeight } from '@/lib/utils';

interface WeightChartProps {
  data: Array<{
    date: string;
    weight: number;
  }>;
  theme?: 'light' | 'dark';
}

export function WeightChart({ data, theme = 'light' }: WeightChartProps) {
  const chartData = [...data].reverse();
  const isDark = theme === 'dark';

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(203, 213, 225, 0.5)'} 
        />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => formatDate(value)}
          stroke={isDark ? '#64748b' : '#94a3b8'}
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          domain={['dataMin - 2', 'dataMax + 2']}
          tickFormatter={(value) => `${value.toFixed(1)}`}
          stroke={isDark ? '#64748b' : '#94a3b8'}
          fontSize={12}
          tickLine={false}
        />
        <Tooltip
          formatter={(value: number) => [formatWeight(value), 'Weight']}
          labelFormatter={(label) => formatDate(label)}
          contentStyle={{
            backgroundColor: isDark ? 'rgba(24, 24, 27, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            border: isDark ? '1px solid rgba(63, 63, 70, 0.5)' : '1px solid rgba(226, 232, 240, 0.8)',
            borderRadius: '0.75rem',
            color: isDark ? '#f8fafc' : '#0f172a',
            backdropFilter: 'blur(12px)',
            padding: '12px',
          }}
          labelStyle={{
            color: isDark ? '#94a3b8' : '#64748b',
            marginBottom: '4px',
          }}
          itemStyle={{
            color: '#3b82f6',
            fontWeight: 600,
          }}
        />
        <Area
          type="monotone"
          dataKey="weight"
          stroke="#3b82f6"
          strokeWidth={3}
          fill="url(#colorWeight)"
          dot={{ 
            fill: '#3b82f6', 
            strokeWidth: 2, 
            r: 5, 
            stroke: isDark ? '#18181b' : '#ffffff'
          }}
          activeDot={{ 
            r: 7, 
            fill: '#3b82f6',
            stroke: isDark ? '#18181b' : '#ffffff',
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
