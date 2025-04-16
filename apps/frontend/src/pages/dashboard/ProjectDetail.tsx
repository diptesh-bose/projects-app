import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/authService';
import TaskForm from '../../components/TaskForm';

interface Project {
  id: string;
  name: string;
  description?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  tasks?: any[];
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${id}`);
      
      if (response.data.project) {
        setProject(response.data.project);
      } else {
        setError('Project data is missing');
      }
    } catch (err: any) {
      console.error('Error fetching project details:', err);
      setError(err.response?.data?.error || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const handleTaskSuccess = () => {
    setShowTaskForm(false);
    fetchProjectDetails(); // Refresh project data to show new task
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/20 shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-[1.02]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/20 shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Project Not Found</h2>
          <p className="text-blue-300 mb-6">The requested project could not be found.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-[1.02]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <h1 className="text-2xl font-bold text-white">ProjectFlow</h1>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-300 hover:text-white transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project header */}
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/20 shadow-xl mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                (project.status || 'active') === 'active'
                  ? 'bg-green-500/20 text-green-300'
                  : (project.status || 'active') === 'completed'
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-amber-500/20 text-amber-300'
              }`}>
                {((project.status || 'active').charAt(0).toUpperCase() + (project.status || 'active').slice(1))}
              </span>
            </div>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">
                Edit Project
              </button>
              <button className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">
                Delete Project
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
              <p className="text-blue-200">
                {project.description || 'No description provided.'}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Details</h2>
              <div className="space-y-2">
                <div className="flex items-center text-blue-200">
                  <span className="w-32">Created:</span>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-blue-200">
                  <span className="w-32">Last Updated:</span>
                  <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks section */}
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/20 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Tasks</h2>
            <button 
              onClick={() => setShowTaskForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-[1.02]"
            >
              Add Task
            </button>
          </div>

          {showTaskForm ? (
            <div className="mb-8">
              <TaskForm
                projectId={project.id}
                onSuccess={handleTaskSuccess}
                onCancel={() => setShowTaskForm(false)}
              />
            </div>
          ) : null}

          {project.tasks && project.tasks.length > 0 ? (
            <div className="space-y-4">
              {project.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-white">{task.title}</h3>
                      <p className="text-blue-200 mt-1">{task.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      task.status === 'completed'
                        ? 'bg-green-500/20 text-green-300'
                        : task.status === 'in_progress'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {task.status?.charAt(0).toUpperCase() + task.status?.slice(1) || 'Pending'}
                    </span>
                  </div>
                  {task.dueDate && (
                    <div className="mt-2 text-sm text-blue-300">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : !showTaskForm && (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-blue-400 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-xl font-bold text-white mb-2">No tasks yet</h3>
              <p className="text-blue-200 mb-6">Create your first task to get started</p>
              <button 
                onClick={() => setShowTaskForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-[1.02]"
              >
                Add Your First Task
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}