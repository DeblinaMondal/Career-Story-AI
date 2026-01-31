import React, { useState } from 'react';
import { Project, ProjectType } from '../types';
import { PlusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ProjectFormProps {
  type: ProjectType;
  onAdd: (project: Omit<Project, 'id' | 'timestamp'>) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ type, onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [learnings, setLearnings] = useState('');
  const [fixPlan, setFixPlan] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !learnings.trim()) return;
    if (type === 'failure' && !fixPlan.trim()) return;

    onAdd({
      name,
      description,
      learnings,
      type,
      fixPlan: type === 'failure' ? fixPlan : undefined,
    });

    // Reset form
    setName('');
    setDescription('');
    setLearnings('');
    setFixPlan('');
    setIsExpanded(false);
  };

  const isSuccess = type === 'success';
  const themeColor = isSuccess ? 'green' : 'amber';
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;

  return (
    <div className={`mb-6 rounded-xl border border-${themeColor}-200 bg-white shadow-sm overflow-hidden transition-all duration-300`}>
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className={`w-full p-4 flex items-center justify-between hover:bg-${themeColor}-50 transition-colors text-left`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-${themeColor}-100 text-${themeColor}-600`}>
              <Icon size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Add {isSuccess ? 'Successful Project' : 'Learning Experience'}
              </h3>
              <p className="text-sm text-gray-500">
                {isSuccess 
                  ? 'Share a win and what made it work.' 
                  : 'Share a hurdle and how you overcame it.'}
              </p>
            </div>
          </div>
          <PlusCircle className={`text-${themeColor}-400`} />
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className={`font-semibold text-${themeColor}-700`}>
              New {isSuccess ? 'Success Story' : 'Challenge'}
            </h3>
            <button 
              type="button" 
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g. E-commerce Platform Migration"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              rows={3}
              placeholder="Briefly describe what the project was about..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isSuccess ? 'What did you learn? / Key Achievement' : 'What went wrong? / What did you learn?'}
            </label>
            <textarea
              value={learnings}
              onChange={(e) => setLearnings(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              rows={3}
              placeholder={isSuccess ? "e.g. Learned how to optimize React rendering..." : "e.g. Underestimated the complexity of database schema..."}
              required
            />
          </div>

          {!isSuccess && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How do you plan to fix it / How did you improve?
              </label>
              <textarea
                value={fixPlan}
                onChange={(e) => setFixPlan(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                rows={3}
                placeholder="e.g. Implemented strict type checking and automated tests..."
                required
              />
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-2.5 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 ${
                isSuccess 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              Add Project
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProjectForm;
