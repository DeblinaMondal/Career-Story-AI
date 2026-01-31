import React from 'react';
import { Project, ProjectType } from '../types';
import { Trash2, TrendingUp, AlertTriangle } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  type: ProjectType;
  onDelete: (id: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, type, onDelete }) => {
  const filteredProjects = projects.filter(p => p.type === type);
  const isSuccess = type === 'success';

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-10 px-4 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <p>No {isSuccess ? 'successful' : 'unsuccessful'} projects added yet.</p>
        <p className="text-xs mt-1">Use the form above to add one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredProjects.map((project) => (
        <div 
          key={project.id} 
          className="group relative bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-md ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {isSuccess ? <TrendingUp size={16} /> : <AlertTriangle size={16} />}
              </span>
              <h4 className="font-bold text-gray-800 text-lg">{project.name}</h4>
            </div>
            <button
              onClick={() => onDelete(project.id)}
              className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete project"
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <p className="text-gray-600 mb-3 text-sm leading-relaxed">{project.description}</p>
          
          <div className="space-y-2">
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <span className="font-semibold text-gray-700 block text-xs uppercase tracking-wide mb-1">Learnings</span>
              <p className="text-gray-800">{project.learnings}</p>
            </div>
            
            {!isSuccess && project.fixPlan && (
               <div className="bg-amber-50 p-3 rounded-lg text-sm">
               <span className="font-semibold text-amber-800 block text-xs uppercase tracking-wide mb-1">Growth Plan</span>
               <p className="text-gray-800">{project.fixPlan}</p>
             </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
