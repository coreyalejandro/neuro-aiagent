'use client';

import React, { useState, FormEvent } from 'react';
import { templates, Template } from '../lib/templates';

export default function HomePage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'configure' | 'result'>('select');
  const [prompt, setPrompt] = useState('');
  const [tools, setTools] = useState('');
  const [memory, setMemory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedTemplateId(id);
    setStep('configure');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateId || !prompt || !tools || !memory) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('templateId', selectedTemplateId);
      formData.append('prompt', prompt);
      formData.append('tools', tools);
      formData.append('memory', memory);
      if (file) {
        formData.append('file', file, file.name);
      }

      const res = await fetch('/api/agent', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setGeneratedCode(data.code);
      setStep('result');
    } catch (err) {
      console.error(err);
      alert('Error generating code. Check console.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'select') {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6">Select an Agent Template</h1>
        <ul className="space-y-4">
          {templates.map((tpl: Template) => (
            <li
              key={tpl.id}
              onClick={() => handleSelect(tpl.id)}
              className="border p-4 rounded-lg hover:shadow cursor-pointer"
            >
              <h2 className="text-xl font-semibold">{tpl.name}</h2>
              <p className="mt-1 text-gray-700">{tpl.description}</p>
            </li>
          ))}
        </ul>
      </main>
    );
  }

  if (step === 'configure') {
    const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6">Configure Agent: {selectedTemplate?.name}</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          <div>
            <label htmlFor="prompt" className="block font-medium mb-1">
              Prompt Design <span className="text-red-500">*</span>
            </label>
            <textarea
              id="prompt"
              rows={4}
              className="w-full border p-2 rounded"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter the instructions and personality for your agent"
              required
            />
          </div>
          <div>
            <label htmlFor="tools" className="block font-medium mb-1">
              Tool Integrations <span className="text-red-500">*</span>
            </label>
            <input
              id="tools"
              type="text"
              className="w-full border p-2 rounded"
              value={tools}
              onChange={(e) => setTools(e.target.value)}
              placeholder="Comma-separated API or function names"
              required
            />
          </div>
          <div>
            <label htmlFor="memory" className="block font-medium mb-1">
              Memory Settings <span className="text-red-500">*</span>
            </label>
            <select
              id="memory"
              className="w-full border p-2 rounded"
              value={memory}
              onChange={(e) => setMemory(e.target.value)}
              required
            >
              <option value="">Select memory option</option>
              <option value="none">None</option>
              <option value="session">Session memory</option>
              <option value="persistent">Persistent memory</option>
            </select>
          </div>
          <div>
            <label htmlFor="file" className="block font-medium mb-1">
              Upload PRD PDF (optional)
            </label>
            <input
              id="file"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Generating…' : 'Generate Agent Code'}
          </button>
        </form>
      </main>
    );
  }

  // step === 'result'
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Generated Agent Code</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto">{generatedCode}</pre>
      <p className="mt-4">
        Copy this code into your project’s <code>lib/agent.ts</code> or an API route.
      </p>
    </main>
  );
}