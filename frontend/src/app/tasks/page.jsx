"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { PageWraper } from "../hoc";
import { SelectInput, TextInput, TextArea } from "../components/inputs";
import { tasksAPI, plotsAPI, cropsAPI, isAuthenticated, getUser } from "../../services/api";

const TASK_TYPES = [
  { value: 'IRRIGATION', label: 'Irrigation' },
  { value: 'FERTILIZATION', label: 'Fertilization' },
  { value: 'PEST_CONTROL', label: 'Pest Control' },
  { value: 'HARVESTING', label: 'Harvesting' },
  { value: 'PLANTING', label: 'Planting' },
  { value: 'WEEDING', label: 'Weeding' },
  { value: 'SOIL_PREPARATION', label: 'Soil Preparation' },
  { value: 'OTHER', label: 'Other' },
];

const PRIORITY_LEVELS = [
  { value: 'LOW', label: 'Low', color: 'bg-gray-100 text-gray-700' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-700' },
];

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-green-100 text-green-700' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-gray-100 text-gray-500' },
];

const TaskCard = ({ task, onStatusChange, onDelete }) => {
  const priorityStyle = PRIORITY_LEVELS.find(p => p.value === task.priority)?.color || 'bg-gray-100';
  const statusStyle = STATUS_OPTIONS.find(s => s.value === task.status)?.color || 'bg-gray-100';
  
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
          <span className="text-sm text-gray-500">{task.task_type?.replace('_', ' ')}</span>
        </div>
        <div className="flex gap-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityStyle}`}>
            {task.priority}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle}`}>
            {task.status?.replace('_', ' ')}
          </span>
        </div>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      )}
      
      <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-3">
        {task.plot_name && <span>📍 {task.plot_name}</span>}
        {task.crop_name && <span>🌾 {task.crop_name}</span>}
        {task.due_date && <span>📅 Due: {task.due_date}</span>}
        {task.estimated_hours > 0 && <span>⏱️ {task.estimated_hours}h</span>}
        {task.cost > 0 && <span>💰 ₹{task.cost}</span>}
      </div>
      
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-green-500 outline-none"
        >
          {STATUS_OPTIONS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const TaskManagement = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tasks, setTasks] = useState([]);
  const [plots, setPlots] = useState([]);
  const [crops, setCrops] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    task_type: 'OTHER',
    priority: 'MEDIUM',
    status: 'PENDING',
    plot: '',
    crop: '',
    due_date: '',
    estimated_hours: '',
    cost: '',
    notes: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, plotsRes, cropsRes] = await Promise.all([
        tasksAPI.getAll(),
        plotsAPI.getAll(),
        cropsAPI.getAll(),
      ]);
      setTasks(tasksRes.rows || []);
      setPlots(plotsRes.rows || []);
      setCrops(cropsRes.rows || []);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (!formData.title) {
        setError('Task title is required');
        setSaving(false);
        return;
      }

      const user = getUser();
      const taskData = {
        ...formData,
        estimated_hours: parseFloat(formData.estimated_hours) || 0,
        cost: parseFloat(formData.cost) || 0,
        farmer: user?.user_id,
        plot: formData.plot || null,
        crop: formData.crop || null,
      };

      await tasksAPI.create(taskData);
      setSuccess('Task created successfully!');
      setFormData({
        title: '', description: '', task_type: 'OTHER', priority: 'MEDIUM',
        status: 'PENDING', plot: '', crop: '', due_date: '',
        estimated_hours: '', cost: '', notes: '',
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to create task');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await tasksAPI.update(id, { status: newStatus });
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
      setSuccess('Task status updated!');
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await tasksAPI.delete(id);
      setTasks(tasks.filter(t => t.id !== id));
      setSuccess('Task deleted successfully!');
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const filteredTasks = filterStatus === 'ALL' 
    ? tasks 
    : tasks.filter(t => t.status === filterStatus);

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'PENDING').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
  };

  return (
    <main className="form-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Task Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {showForm ? '✕ Close' : '+ New Task'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm font-medium mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg text-sm font-medium mb-4">
          {success}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
          <p className="text-3xl font-bold text-gray-800">{taskStats.total}</p>
          <p className="text-sm text-gray-500">Total Tasks</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 shadow-sm text-center">
          <p className="text-3xl font-bold text-yellow-700">{taskStats.pending}</p>
          <p className="text-sm text-yellow-600">Pending</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm text-center">
          <p className="text-3xl font-bold text-blue-700">{taskStats.inProgress}</p>
          <p className="text-sm text-blue-600">In Progress</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm text-center">
          <p className="text-3xl font-bold text-green-700">{taskStats.completed}</p>
          <p className="text-sm text-green-600">Completed</p>
        </div>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Create New Task</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Task Title *"
              value={formData.title}
              onChange={handleInputChange('title')}
              placeholder="e.g., Irrigate field A"
            />
            <SelectInput
              label="Task Type"
              options={TASK_TYPES.map(t => t.value)}
              onChange={handleInputChange('task_type')}
            />
            <SelectInput
              label="Priority"
              options={PRIORITY_LEVELS.map(p => p.value)}
              onChange={handleInputChange('priority')}
            />
            <SelectInput
              label="Status"
              options={STATUS_OPTIONS.map(s => s.value)}
              onChange={handleInputChange('status')}
            />
            <SelectInput
              label="Plot (Optional)"
              options={['', ...plots.map(p => p.id)]}
              onChange={handleInputChange('plot')}
            />
            <SelectInput
              label="Crop (Optional)"
              options={['', ...crops.map(c => c.id)]}
              onChange={handleInputChange('crop')}
            />
            <TextInput
              label="Due Date"
              value={formData.due_date}
              onChange={handleInputChange('due_date')}
              type="date"
            />
            <TextInput
              label="Estimated Hours"
              value={formData.estimated_hours}
              onChange={handleInputChange('estimated_hours')}
              type="number"
              placeholder="0"
            />
            <TextInput
              label="Cost (₹)"
              value={formData.cost}
              onChange={handleInputChange('cost')}
              type="number"
              placeholder="0"
            />
            <div className="md:col-span-2">
              <TextArea
                label="Description"
                value={formData.description}
                onChange={handleInputChange('description')}
                placeholder="Describe the task..."
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowForm(false)}
              className="form-btn bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="form-btn bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {['ALL', ...STATUS_OPTIONS.map(s => s.value)].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              filterStatus === status
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'ALL' ? 'All Tasks' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Tasks Found</h3>
          <p className="text-gray-600">
            {filterStatus === 'ALL' 
              ? 'Create your first task to get started!'
              : `No ${filterStatus.replace('_', ' ').toLowerCase()} tasks.`}
          </p>
        </div>
      )}
    </main>
  );
};

export default PageWraper(TaskManagement);
