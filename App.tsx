import React, { useState } from 'react';
import { Project, GeneratedScript } from './types';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import { generateInterviewPitch } from './services/geminiService';
import { Briefcase, Sparkles, Loader2, Quote, CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddProject = (newProject: Omit<Project, 'id' | 'timestamp'>) => {
    const project: Project = {
      ...newProject,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setProjects(prev => [project, ...prev]);
    // Clear previous generation if data changes
    if (generatedScript) setGeneratedScript(null);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (generatedScript) setGeneratedScript(null);
  };

  const handleGenerate = async () => {
    if (projects.length === 0) {
      setError("Please add at least one project before generating a pitch.");
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateInterviewPitch(projects);
      setGeneratedScript(result);
    } catch (err) {
      setError("Failed to generate the script. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-200">
              <Briefcase size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">CareerStory AI</h1>
              <p className="text-xs text-slate-500 font-medium">Interview Pitch Generator</p>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || projects.length === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all shadow-md ${
              isGenerating || projects.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-95'
            }`}
          >
            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {isGenerating ? 'Analyzing...' : 'Generate Pitch'}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Intro */}
        <section className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Turn your experience into a story</h2>
          <p className="text-slate-600">
            Document your wins and learning moments. We'll use Gemini AI to craft the perfect "Why hire me?" narrative for your next interview.
          </p>
        </section>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {/* Generated Result Section */}
        {generatedScript && (
          <section className="mb-12 animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
              <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles size={20} className="text-indigo-200" />
                  Your Custom Interview Script
                </h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                {/* Script Column */}
                <div className="md:col-span-2 p-8">
                  <div className="mb-4 flex items-center gap-2 text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                    <Quote size={16} />
                    Suggested Answer
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-lg leading-relaxed whitespace-pre-line text-slate-700">
                      {generatedScript.pitch}
                    </p>
                  </div>
                </div>

                {/* Key Strengths Column */}
                <div className="md:col-span-1 p-8 bg-slate-50">
                  <div className="mb-4 flex items-center gap-2 text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                    <CheckCircle size={16} />
                    Key Strengths Identified
                  </div>
                  <ul className="space-y-3">
                    {generatedScript.keyStrengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                        <div className="min-w-[6px] h-[6px] rounded-full bg-indigo-500 mt-1.5" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Project Input Columns */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Successful Projects */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-3 h-8 bg-green-500 rounded-full inline-block"></span>
                Successful Projects
              </h2>
              <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                {projects.filter(p => p.type === 'success').length} Items
              </span>
            </div>
            
            <ProjectForm type="success" onAdd={handleAddProject} />
            <ProjectList 
              projects={projects} 
              type="success" 
              onDelete={handleDeleteProject} 
            />
          </section>

          {/* Failed Projects */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-3 h-8 bg-amber-500 rounded-full inline-block"></span>
                Learning Experiences
              </h2>
              <span className="text-sm font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                {projects.filter(p => p.type === 'failure').length} Items
              </span>
            </div>

            <ProjectForm type="failure" onAdd={handleAddProject} />
            <ProjectList 
              projects={projects} 
              type="failure" 
              onDelete={handleDeleteProject} 
            />
          </section>

        </div>
      </main>
    </div>
  );
};

export default App;
