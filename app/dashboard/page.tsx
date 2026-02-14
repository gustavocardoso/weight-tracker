'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { WeightChart } from '@/components/weight-chart';
import { MeasurementsChart } from '@/components/measurements-chart';
import { Logo } from '@/components/logo';
import { Footer } from '@/components/footer';
import { formatDate, formatWeight } from '@/lib/utils';
import { TrendingDown, TrendingUp, Weight, LogOut, Plus, Trash2, Calendar, Scale, StickyNote, Target, Activity, X, Sun, Moon, Edit2, Check, Ruler } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

interface WeightEntry {
  id: number;
  date: string;
  weight: number;
  notes?: string;
}

interface Measurement {
  id: number;
  date: string;
  chest?: number;
  waist?: number;
  hips?: number;
  thigh?: number;
  arm?: number;
  notes?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [goalWeight, setGoalWeight] = useState<number | null>(null);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalInput, setGoalInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [periodFilter, setPeriodFilter] = useState<'7' | '30' | '90' | 'all'>('all');
  const [editForm, setEditForm] = useState({
    date: '',
    weight: '',
    notes: '',
  });
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    notes: '',
  });

  useEffect(() => {
    fetchWeights();
    fetchGoal();
    fetchMeasurements();
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

  const fetchGoal = async () => {
    try {
      const response = await fetch('/api/user/goal');
      if (response.ok) {
        const data = await response.json();
        setGoalWeight(data.goalWeight);
        setGoalInput(data.goalWeight || '');
      }
    } catch (error) {
      console.error('Error fetching goal:', error);
    }
  };

  const fetchMeasurements = async () => {
    try {
      const response = await fetch('/api/measurements');
      if (response.ok) {
        const data = await response.json();
        setMeasurements(data.measurements);
      }
    } catch (error) {
      console.error('Error fetching measurements:', error);
    }
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalWeight: goalInput ? parseFloat(goalInput) : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGoalWeight(data.goalWeight);
        setShowGoalForm(false);
      }
    } catch (error) {
      console.error('Error saving goal:', error);
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

  const handleEdit = (entry: WeightEntry) => {
    setEditingId(entry.id);
    setEditForm({
      date: entry.date,
      weight: entry.weight.toString(),
      notes: entry.notes || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ date: '', weight: '', notes: '' });
  };

  const handleUpdateWeight = async (id: number) => {
    try {
      const response = await fetch('/api/weights', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          date: editForm.date,
          weight: parseFloat(editForm.weight),
          notes: editForm.notes,
        }),
      });

      if (response.ok) {
        setEditingId(null);
        setEditForm({ date: '', weight: '', notes: '' });
        fetchWeights();
      }
    } catch (error) {
      console.error('Error updating weight:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const getFilteredWeights = () => {
    if (periodFilter === 'all') return weights;
    
    const now = new Date();
    const days = parseInt(periodFilter);
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return weights.filter(w => new Date(w.date) >= cutoffDate);
  };

  const filteredWeights = getFilteredWeights();

  const currentWeight = weights[0]?.weight;
  const previousWeight = weights[1]?.weight;
  const weightDiff = currentWeight && previousWeight ? currentWeight - previousWeight : null;
  const minWeight = filteredWeights.length > 0 ? Math.min(...filteredWeights.map(w => w.weight)) : 0;
  const maxWeight = filteredWeights.length > 0 ? Math.max(...filteredWeights.map(w => w.weight)) : 0;
  const avgWeight = filteredWeights.length > 0 ? filteredWeights.reduce((sum, w) => sum + w.weight, 0) / filteredWeights.length : 0;

  const goalProgress = currentWeight && goalWeight 
    ? Math.round(((maxWeight - currentWeight) / (maxWeight - goalWeight)) * 100)
    : null;
  const weightToGoal = currentWeight && goalWeight ? currentWeight - goalWeight : null;

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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with background */}
        <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 md:px-8 py-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Logo />
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-lg bg-gray-100 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700/50 transition-all duration-200 cursor-pointer"
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
                onClick={() => router.push('/measurements')}
                className="bg-gray-100 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300"
              >
                <Ruler className="w-4 h-4 mr-2" />
                Measurements
              </Button>
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
        </div>

        {/* Content */}
        <div className="px-4 md:px-8 space-y-6">

        {/* Period Filter & Add Weight Button */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Period:</span>
            <div className="flex gap-2">
              {[
                { value: '7' as const, label: '7 Days' },
                { value: '30' as const, label: '30 Days' },
                { value: '90' as const, label: '90 Days' },
                { value: 'all' as const, label: 'All Time' },
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => setPeriodFilter(period.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    periodFilter === period.value
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-gray-100 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700/50'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className={showAddForm 
              ? "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-md shadow-red-500/20"
              : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md shadow-green-500/20 scale-105 hover:scale-110 transition-transform duration-200"
            }
          >
            {showAddForm ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Add Weight
              </>
            )}
          </Button>
        </div>

        {/* Add Weight Form */}
        {showAddForm && (
          <form onSubmit={handleAddWeight} className="p-6 bg-gray-100 dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-zinc-700 animate-fadeIn">
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

        {/* Goal Weight Card */}
        <Card className="glass border-gray-200 dark:border-zinc-700/50 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Weight Goal
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGoalForm(!showGoalForm)}
                className="bg-gray-100 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300"
              >
                {goalWeight ? 'Edit Goal' : 'Set Goal'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showGoalForm ? (
              <form onSubmit={handleSaveGoal} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                    Target Weight (kg)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    placeholder="75.0"
                    className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Leave empty to remove goal
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    Save Goal
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowGoalForm(false)}
                    className="bg-gray-100 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : goalWeight ? (
              <div className="space-y-4">
                {currentWeight ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-100 dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-zinc-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatWeight(currentWeight)}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-100 dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-zinc-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Goal</div>
                        <div className="text-2xl font-bold text-purple-400">{formatWeight(goalWeight)}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-100 dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-zinc-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Remaining</div>
                        <div className={`text-2xl font-bold ${weightToGoal && weightToGoal > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                          {weightToGoal !== null ? `${Math.abs(weightToGoal).toFixed(1)} kg` : 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    {goalProgress !== null && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Progress</span>
                          <span className="font-medium text-purple-400">{Math.max(0, Math.min(100, goalProgress))}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                            style={{ width: `${Math.max(0, Math.min(100, goalProgress))}%` }}
                          />
                        </div>
                        {goalProgress >= 100 && (
                          <p className="text-sm text-green-400 flex items-center gap-2 mt-2">
                            <Target className="w-4 h-4" />
                            Congratulations! You've reached your goal! 🎉
                          </p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/10 rounded-full mb-4">
                      <Target className="w-8 h-8 text-purple-400" />
                    </div>
                    <div className="space-y-3">
                      <div className="text-center p-4 bg-purple-500/5 rounded-xl border border-purple-500/20 inline-block">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Goal</div>
                        <div className="text-3xl font-bold text-purple-400">{formatWeight(goalWeight)}</div>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Goal set successfully! 🎯<br />
                        Add your first weight entry to start tracking progress
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/10 rounded-full mb-4">
                  <Target className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  {goalWeight ? 'Add a weight entry to see your progress' : 'Set your weight goal to track your progress'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chart Section */}
        <Card className="glass border-gray-200 dark:border-zinc-700/50 shadow-xl">
          <CardHeader>
            <div className="space-y-1">
              <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Weight History
              </CardTitle>
              {periodFilter !== 'all' && filteredWeights.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Showing {filteredWeights.length} {filteredWeights.length === 1 ? 'entry' : 'entries'} from the last {periodFilter} days
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {filteredWeights.length > 0 ? (
              <div className="mt-4">
                <WeightChart data={filteredWeights} theme={theme} />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-zinc-800/50 rounded-full mb-4">
                  <Weight className="w-8 h-8 text-gray-400 dark:text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  {weights.length > 0 ? 'No records in this period.' : 'No weight records yet. Add your first entry!'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Records and Measurements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Records List */}
          {weights.length > 0 && (
            <Card className="glass border-gray-200 dark:border-zinc-700/50 shadow-xl flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Recent Records
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <div className="h-[600px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                  {weights.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="p-4 bg-gray-100 dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-zinc-700/50 hover:bg-gray-200 dark:hover:bg-zinc-700/50 hover:border-blue-500/30 transition-all duration-200 group"
                    >
                      {editingId === entry.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                Date
                              </label>
                              <Input
                                type="date"
                                value={editForm.date}
                                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white h-9 text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                <Scale className="w-3 h-3" />
                                Weight (kg)
                              </label>
                              <Input
                                type="number"
                                step="0.1"
                                value={editForm.weight}
                                onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                                className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white h-9 text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                <StickyNote className="w-3 h-3" />
                                Notes
                              </label>
                              <Input
                                type="text"
                                value={editForm.notes}
                                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white h-9 text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateWeight(entry.id)}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-8 text-xs"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="bg-gray-100 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 h-8 text-xs"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
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
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(entry)}
                              className="hover:bg-blue-500/10 hover:text-blue-400"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(entry.id)}
                              className="hover:bg-red-500/10 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Measurements Chart */}
          <Card className="glass border-gray-200 dark:border-zinc-700/50 shadow-xl flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                <Ruler className="w-5 h-5 text-purple-400" />
                Body Measurements Evolution
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              {measurements.length > 0 ? (
                <div className="h-[600px]">
                  <MeasurementsChart data={measurements} theme={theme} />
                </div>
              ) : (
                <div className="text-center py-12 h-[600px] flex flex-col items-center justify-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/10 rounded-full mb-4">
                    <Ruler className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No measurements yet. Start tracking your body measurements!
                  </p>
                  <Button
                    onClick={() => router.push('/measurements')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Measurement
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
