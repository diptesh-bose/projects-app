// Example frontend component fix (adjust based on your actual frontend code)
// filepath: e:\projects-app\apps\frontend\src\components\ProjectsList.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/authService';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const response = await api.get('/projects');
        setProjects(response.data.projects);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) return <div>Loading projects...</div>;
  
  if (error) return (
    <div className="error-container">
      <p className="error-message">{error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  if (projects.length === 0) {
    return <div>No projects found. Create your first project!</div>;
  }

  return (
    <div className="projects-list">
      {projects.map(project => (
        <Link to={`/projects/${project.id}`} key={project.id} className="project-card">
          <h3>{project.name}</h3>
          <p>{project.description || 'No description'}</p>
          <span className="last-updated">
            Updated: {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </Link>
      ))}
    </div>
  );
}