import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/authService';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  // Add other project properties as needed
}

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjectDetails() {
      if (!projectId) {
        setError('Project ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/projects/${projectId}`);
        setProject(response.data.project);
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError('Failed to load project details. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchProjectDetails();
  }, [projectId]);

  if (loading) return <div className="loading-indicator">Loading project details...</div>;
  
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/projects')} className="back-button">
          Back to Projects
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="not-found-container">
        <p>Project not found</p>
        <button onClick={() => navigate('/projects')} className="back-button">
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="project-detail-container">
      <div className="project-header">
        <h1>{project.name}</h1>
        <div className="project-actions">
          <button className="edit-button">Edit</button>
          <button className="delete-button">Delete</button>
        </div>
      </div>
      
      <div className="project-meta">
        <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
        <p>Last updated: {new Date(project.updatedAt).toLocaleDateString()}</p>
      </div>
      
      <div className="project-description">
        <h2>Description</h2>
        <p>{project.description || 'No description provided'}</p>
      </div>
      
      {/* Add more project details, tasks, etc. here */}
      
      <button onClick={() => navigate('/projects')} className="back-button">
        Back to Projects
      </button>
    </div>
  );
}