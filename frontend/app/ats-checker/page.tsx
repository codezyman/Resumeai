'use client';

import { useState } from 'react';
import { Button } from '../components/ui/button';

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export default function ATSCheckerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setResult(null);
    setError(null);
    setSuccess(false);
    if (selected) {
      if (!ALLOWED_TYPES.includes(selected.type)) {
        setError('Only PDF and DOCX files are supported.');
        setFile(null);
      } else if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`File size must be less than ${MAX_FILE_SIZE_MB}MB.`);
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await fetch('/api/ats/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to process resume');
      setResult(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to process resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">ATS Resume Checker</h1>
      <div className="mb-4">
        <input
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
        />
      </div>
      <Button onClick={handleUpload} disabled={!file || loading}>
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            Checking...
          </span>
        ) : 'Check ATS Score'}
      </Button>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {success && <div className="text-green-600 mt-4">Resume processed successfully!</div>}
      {result && (
        <div className="mt-8 p-4 border rounded-lg bg-gray-50">
          <div className="mb-4 text-lg font-bold text-blue-700">ATS Score: <span className="text-2xl">{result.score} / 100</span></div>
          <div className="mb-4">
            <h2 className="font-semibold mb-1">Basic Suggestions</h2>
            <ul className="list-disc ml-6">
              {result.suggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="mb-2">
            <h2 className="font-semibold mb-1">AI Suggestions</h2>
            <div className="whitespace-pre-line text-gray-700 mt-1">{result.aiSuggestions}</div>
          </div>
        </div>
      )}
    </div>
  );
} 