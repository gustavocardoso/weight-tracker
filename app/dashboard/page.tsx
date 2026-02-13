'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { WeightChart } from '@/components/weight-chart';
import { formatDate, formatWeight } from '@/lib/utils';
import { TrendingDown, TrendingUp, Weight, LogOut, Plus, Trash2, Calendar, Scale, StickyNote, Target, Activity, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

interface WeightEntry {
  id: number;
  date: string;
  weight: number;
  notes?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    notes: '',
  });

  useEffect(() => {
    fetchWeights();
  }, []);

  const fetchWeights = async () => {
    try {
      const response = await fetch('/api/weights');
      if (response.ok) {
        const data = await response.json();
        setWeights(data.weights);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching weights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/weights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.date,
          weight: parseFloat(formData.weight),
          notes: formData.notes,
        }),
      });

      if (response.ok) {
        setFormData({
          date: new Date().toISOString().split('T')[0],
          weight: '',
          notes: '',
        });
        setShowAddForm(false);
        fetchWeights();
      }
    } catch (error) {
      console.error('Error adding weight:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const response = await fetch(`/api/weights?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchWeights();
      }
    } catch (error) {
      console.error('Error deleting weight:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const currentWeight = weights[0]?.weight;
  const previousWeight = weights[1]?.weight;
  const weightDiff = currentWeight && previousWeight ? currentWeight - previousWeight : null;
  const minWeight = weights.length > 0 ? Math.min(...weights.map(w => w.weight)) : 0;
  const maxWeight = weights.length > 0 ? Math.max(...weights.map(w => w.weight)) : 0;
  const avgWeight = weights.length > 0 ? weights.reduce((sum, w) => sum + w.weight, 0) / weights.length : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="text-gray-600 dark:text-gray-300 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Weight Dashboard</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 ml-14">Track your progress and reach your goals</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700/50 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="bg-gray-100 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass border-gray-200 dark:border-zinc-700/50 shadow-lg hover:shadow-blue-500/10 transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Current Weight</CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Weight className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {currentWeight ? formatWeight(currentWeight) : 'N/A'}
              </div>
              {weightDiff !== null && (
                <p className={`text-xs flex items-center mt-2 ${weightDiff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {weightDiff > 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(weightDiff).toFixed(1)} kg vs. previous
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="glass border-gray-200 dark:border-zinc-700/50 shadow-lg hover:shadow-green-500/10 transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Minimum</CardTitle>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingDown className="h-4 w-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {minWeight ? formatWeight(minWeight) : 'N/A'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Lowest recorded</p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-200 dark:border-zinc-700/50 shadow-lg hover:shadow-orange-500/10 transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Maximum</CardTitle>
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {maxWeight ? formatWeight(maxWeight) : 'N/A'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Highest recorded</p>
            </CardContent>
          </Card>

          <Card className="glass border-gray-200 dark:border-zinc-700/50 shadow-lg hover:shadow-cyan-500/10 transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Average</CardTitle>
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Target className="h-4 w-4 text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {avgWeight ? formatWeight(avgWeight) : 'N/A'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Overall average</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <Card className="glass border-gray-200 dark:border-zinc-700/50 shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Weight History
              </CardTitle>
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/25"
              >
                {showAddForm ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Weight
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showAddForm && (
              <form onSubmit={handleAddWeight} className="mb-6 p-6 bg-gray-100 dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-zinc-700 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      Date
                    </label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      Weight (kg)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      placeholder="75.5"
                      className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <StickyNote className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      Notes (optional)
                    </label>
                    <Input
                      type="text"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Add a note..."
                      className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-gray-900 dark:text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Save Entry
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-100 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-slate-700/50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {weights.length > 0 ? (
              <div className="mt-4">
                <WeightChart data={weights} theme={theme} />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-zinc-800/50 rounded-full mb-4">
                  <Weight className="w-8 h-8 text-gray-400 dark:text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">No weight records yet. Add your first entry!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Records List */}
        {weights.length > 0 && (
          <Card className="glass border-gray-200 dark:border-zinc-700/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Recent Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weights.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 bg-gray-100 dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-zinc-700/50 hover:bg-gray-200 dark:hover:bg-zinc-700/50 hover:border-blue-500/30 transition-all duration-200 group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                          <span className="font-medium">{formatDate(entry.date)}</span>
                        </div>
                        {index === 0 && (
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30">
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <Scale className="w-5 h-5 text-cyan-400" />
                          {formatWeight(entry.weight)}
                        </div>
                        {entry.notes && (
                          <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <StickyNote className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{entry.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
