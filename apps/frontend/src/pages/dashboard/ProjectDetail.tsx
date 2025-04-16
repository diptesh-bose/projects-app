import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/authService';

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

  useEffect(() => {
    async function fetchProjectDetails() {
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
    }

    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="button primary"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="not-found-container">
        <h2>Project Not Found</h2>
        <p>The requested project could not be found.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="button primary"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="project-detail-container">
      <header className="project-header">
        <div className="header-content">
          <h1>{project.name}</h1>
          <span className={`status-badge ${project.status?.toLowerCase() || 'active'}`}>
            {project.status || 'Active'}
          </span>
        </div>
        <div className="actions">
          <button className="button primary">Edit Project</button>
          <button className="button danger">Delete Project</button>
        </div>
      </header>

      <section className="project-info">
        <div className="info-card">
          <h2>Description</h2>
          <p>{project.description || 'No description provided.'}</p>
        </div>
        
        <div className="info-card">
          <h2>Details</h2>
          <div className="detail-row">
            <span className="label">Created:</span>
            <span className="value">{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="detail-row">
            <span className="label">Last Updated:</span>
            <span className="value">{new Date(project.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </section>

      <section className="tasks-section">
        <div className="section-header">
          <h2>Tasks</h2>
          <button className="button primary">Add Task</button>
        </div>
        
        <div className="tasks-list">
          {project.tasks && project.tasks.length > 0 ? (
            project.tasks.map((task) => (
              <div key={task.id} className="task-item">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className="task-meta">
                  <span className={`status ${task.status?.toLowerCase() || 'pending'}`}>
                    {task.status || 'Pending'}
                  </span>
                  <span className="due-date">
                    {task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No tasks have been added to this project.</p>
              <button className="button secondary">Add Your First Task</button>
            </div>
          )}
        </div>
      </section>

      <button 
        onClick={() => navigate('/dashboard')}
        className="button secondary back-button"
      >
        Back to Dashboard
      </button>
    </div>
  );
}