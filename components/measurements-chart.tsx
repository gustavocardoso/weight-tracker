'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatDate } from '@/lib/utils';

interface Measurement {
  id: number;
  date: string;
  chest?: number;
  waist?: number;
  hips?: number;
  thigh?: number;
  arm?: number;
}

interface MeasurementsChartProps {
  data: Measurement[];
  theme: 'light' | 'dark';
}

export function MeasurementsChart({ data, theme }: MeasurementsChartProps) {
  const [hiddenLines, setHiddenLines] = useState<Set<string>>(new Set());

  const chartData = [...data].reverse().map((entry) => ({
    date: formatDate(entry.date),
    chest: entry.chest || null,
    waist: entry.waist || null,
    hips: entry.hips || null,
    thigh: entry.thigh || null,
    arm: entry.arm || null,
  }));

  const isDark = theme === 'dark';

  const handleLegendClick = (dataKey: string) => {
    setHiddenLines((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dataKey)) {
        newSet.delete(dataKey);
      } else {
        newSet.add(dataKey);
      }
      return newSet;
    });
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => {
          const isHidden = hiddenLines.has(entry.dataKey);
          return (
            <button
              key={`item-${index}`}
              onClick={() => handleLegendClick(entry.dataKey)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                isHidden
                  ? 'opacity-40 bg-gray-100 dark:bg-zinc-800/30'
                  : 'bg-gray-100 dark:bg-zinc-800/50 hover:bg-gray-200 dark:hover:bg-zinc-700/50'
              }`}
            >
              <div
                className="w-4 h-0.5 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {entry.value}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
        <XAxis
          dataKey="date"
          stroke={isDark ? '#9ca3af' : '#6b7280'}
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke={isDark ? '#9ca3af' : '#6b7280'}
          style={{ fontSize: '12px' }}
          label={{ value: 'cm', angle: -90, position: 'insideLeft', fill: isDark ? '#9ca3af' : '#6b7280' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            borderRadius: '8px',
            color: isDark ? '#f3f4f6' : '#111827',
          }}
        />
        <Legend content={renderLegend} />
        <Line
          type="monotone"
          dataKey="chest"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ fill: '#8b5cf6', r: 4 }}
          name="Chest"
          connectNulls
          hide={hiddenLines.has('chest')}
        />
        <Line
          type="monotone"
          dataKey="waist"
          stroke="#ec4899"
          strokeWidth={2}
          dot={{ fill: '#ec4899', r: 4 }}
          name="Waist"
          connectNulls
          hide={hiddenLines.has('waist')}
        />
        <Line
          type="monotone"
          dataKey="hips"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ fill: '#f59e0b', r: 4 }}
          name="Hips"
          connectNulls
          hide={hiddenLines.has('hips')}
        />
        <Line
          type="monotone"
          dataKey="thigh"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981', r: 4 }}
          name="Thigh"
          connectNulls
          hide={hiddenLines.has('thigh')}
        />
        <Line
          type="monotone"
          dataKey="arm"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          name="Arm"
          connectNulls
          hide={hiddenLines.has('arm')}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
