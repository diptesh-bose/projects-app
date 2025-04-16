import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { config } from '../../config';

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  status: string;
  _count: { tasks: number };
}

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(config.projectEndpoints.list, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setProjects(response.data);
        setError(null);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
        setLoading(false);
      }
    };

    if (token) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleCreateProject = () => {
    navigate('/projects/new');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900">
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

            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <p className="text-blue-200">
                  Welcome, <span className="text-white">{user?.name}</span>
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md border border-white/10 transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">My Projects</h2>
          <button
            onClick={handleCreateProject}
            className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            New Project
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-white">
            {error}
          </div>
        ) : projects.length === 0 ? (
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
            <p className="text-blue-200 mb-6">Create your first project to get started</p>
            <button
              onClick={handleCreateProject}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">{project.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'active'
                        ? 'bg-green-500/20 text-green-300'
                        : project.status === 'completed'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                <p className="mt-2 text-blue-200 line-clamp-2">{project.description}</p>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <div className="text-sm text-blue-300">
                    <span>{project._count?.tasks || 0} tasks</span>
                  </div>
                  <div className="text-sm text-blue-300">
                    {new Date(project.startDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}