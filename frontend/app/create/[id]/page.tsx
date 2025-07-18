"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import apiClient from '../../lib/api';
import CreateResumePage from '../page';

export default function EditResumePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const resumeId = Array.isArray(id) ? id[0] : id;
        const { resume } = await apiClient.getResume(resumeId);
        setResumeData(resume);
      } catch (err) {
        setError('Resume not found.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchResume();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!resumeData) return null;

  // Just render CreateResumePage, since it does not accept initialResumeData or editingId props
  return <CreateResumePage />;
} 