'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { MeasurementsChart } from '@/components/measurements-chart';
import { Logo } from '@/components/logo';
import { Footer } from '@/components/footer';
import { formatDate } from '@/lib/utils';
import { Ruler, Plus, Trash2, Calendar, StickyNote, X, Edit2, Check, Activity, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

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

export default function MeasurementsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    date: '',
    chest: '',
    waist: '',
    hips: '',
    thigh: '',
    arm: '',
    notes: '',
  });
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    chest: '',
    waist: '',
    hips: '',
    thigh: '',
    arm: '',
    notes: '',
  });

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    try {
      const response = await fetch('/api/measurements');
      if (response.ok) {
        const data = await response.json();
        setMeasurements(data.measurements);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching measurements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.date,
          chest: formData.chest ? parseFloat(formData.chest) : null,
          waist: formData.waist ? parseFloat(formData.waist) : null,
          hips: formData.hips ? parseFloat(formData.hips) : null,
          thigh: formData.thigh ? parseFloat(formData.thigh) : null,
          arm: formData.arm ? parseFloat(formData.arm) : null,
          notes: formData.notes,
        }),
      });

      if (response.ok) {
        setFormData({
          date: new Date().toISOString().split('T')[0],
          chest: '',
          waist: '',
          hips: '',
          thigh: '',
          arm: '',
          notes: '',
        });
        setShowAddForm(false);
        fetchMeasurements();
      }
    } catch (error) {
      console.error('Error adding measurement:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const response = await fetch(`/api/measurements?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMeasurements();
      }
    } catch (error) {
      console.error('Error deleting measurement:', error);
    }
  };

  const handleEdit = (entry: Measurement) => {
    setEditingId(entry.id);
    setEditForm({
      date: entry.date,
      chest: entry.chest?.toString() || '',
      waist: entry.waist?.toString() || '',
      hips: entry.hips?.toString() || '',
      thigh: entry.thigh?.toString() || '',
      arm: entry.arm?.toString() || '',
      notes: entry.notes || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ date: '', chest: '', waist: '', hips: '', thigh: '', arm: '', notes: '' });
  };

  const handleUpdateMeasurement = async (id: number) => {
    try {
      const response = await fetch('/api/measurements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          date: editForm.date,
          chest: editForm.chest ? parseFloat(editForm.chest) : null,
          waist: editForm.waist ? parseFloat(editForm.waist) : null,
          hips: editForm.hips ? parseFloat(editForm.hips) : null,
          thigh: editForm.thigh ? parseFloat(editForm.thigh) : null,
          arm: editForm.arm ? parseFloat(editForm.arm) : null,
          notes: editForm.notes,
        }),
      });

      if (response.ok) {
        setEditingId(null);
        setEditForm({ date: '', chest: '', waist: '', hips: '', thigh: '', arm: '', notes: '' });
        fetchMeasurements();
      }
    } catch (error) {
      console.error('Error updating measurement:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

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
        {/* Header */}
        <div className="px-4 md:px-8 py-6 md:py-8 mb-6">
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
                onClick={() => router.push('/dashboard')}
                className="bg-gray-100 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300"
              >
                <Activity className="w-4 h-4 mr-2" />
                Dashboard
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

        {/* Subheader with Page Title and Add Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Body Measurements</h1>
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
                Add Measurement
              </>
            )}
          </Button>
        </div>

        {/* Add Measurement Form */}
        {showAddForm && (
          <form onSubmit={handleAddMeasurement} className="p-6 bg-gray-100 dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-zinc-700 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  Date
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:border-purple-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Chest (cm)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.chest}
                  onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                  placeholder="90.0"
                  className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Waist (cm)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.waist}
                  onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                  placeholder="75.0"
                  className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Hips (cm)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.hips}
                  onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                  placeholder="95.0"
                  className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Thigh (cm)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.thigh}
                  onChange={(e) => setFormData({ ...formData, thigh: e.target.value })}
                  placeholder="55.0"
                  className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                  Arm (cm)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.arm}
                  onChange={(e) => setFormData({ ...formData, arm: e.target.value })}
                  placeholder="30.0"
                  className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:border-purple-500"
                />
              </div>
            </div>
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                Notes (optional)
              </label>
              <Input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add a note..."
                className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white focus:border-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Save Measurement
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-100 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Measurements Chart */}
        {measurements.length > 0 && (
          <Card className="glass border-gray-200 dark:border-zinc-700/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                <Ruler className="w-5 h-5 text-purple-400" />
                Body Measurements Evolution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <MeasurementsChart data={measurements} theme={theme} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Measurements List */}
        {measurements.length > 0 ? (
          <Card className="glass border-gray-200 dark:border-zinc-700/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Measurement History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {measurements.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 bg-gray-100 dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-zinc-700/50 hover:bg-gray-200 dark:hover:bg-zinc-700/50 hover:border-purple-500/30 transition-all duration-200 group"
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
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                              Chest (cm)
                            </label>
                            <Input
                              type="number"
                              step="0.1"
                              value={editForm.chest}
                              onChange={(e) => setEditForm({ ...editForm, chest: e.target.value })}
                              className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                              Waist (cm)
                            </label>
                            <Input
                              type="number"
                              step="0.1"
                              value={editForm.waist}
                              onChange={(e) => setEditForm({ ...editForm, waist: e.target.value })}
                              className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                              Hips (cm)
                            </label>
                            <Input
                              type="number"
                              step="0.1"
                              value={editForm.hips}
                              onChange={(e) => setEditForm({ ...editForm, hips: e.target.value })}
                              className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                              Thigh (cm)
                            </label>
                            <Input
                              type="number"
                              step="0.1"
                              value={editForm.thigh}
                              onChange={(e) => setEditForm({ ...editForm, thigh: e.target.value })}
                              className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300">
                              Arm (cm)
                            </label>
                            <Input
                              type="number"
                              step="0.1"
                              value={editForm.arm}
                              onChange={(e) => setEditForm({ ...editForm, arm: e.target.value })}
                              className="bg-white dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white h-9 text-sm"
                            />
                          </div>
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
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateMeasurement(entry.id)}
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
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                              <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                              <span className="font-medium">{formatDate(entry.date)}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {entry.chest && (
                              <div className="text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Chest:</span>
                                <span className="ml-1 font-medium text-gray-900 dark:text-white">{entry.chest} cm</span>
                              </div>
                            )}
                            {entry.waist && (
                              <div className="text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Waist:</span>
                                <span className="ml-1 font-medium text-gray-900 dark:text-white">{entry.waist} cm</span>
                              </div>
                            )}
                            {entry.hips && (
                              <div className="text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Hips:</span>
                                <span className="ml-1 font-medium text-gray-900 dark:text-white">{entry.hips} cm</span>
                              </div>
                            )}
                            {entry.thigh && (
                              <div className="text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Thigh:</span>
                                <span className="ml-1 font-medium text-gray-900 dark:text-white">{entry.thigh} cm</span>
                              </div>
                            )}
                            {entry.arm && (
                              <div className="text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Arm:</span>
                                <span className="ml-1 font-medium text-gray-900 dark:text-white">{entry.arm} cm</span>
                              </div>
                            )}
                          </div>
                          {entry.notes && (
                            <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <StickyNote className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span>{entry.notes}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(entry)}
                            className="hover:bg-purple-500/10 hover:text-purple-400"
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
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/10 rounded-full mb-4">
              <Ruler className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              No measurements yet. Add your first entry!
            </p>
          </div>
        )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
