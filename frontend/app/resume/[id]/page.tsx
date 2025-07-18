'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Types for resume structure
interface Resume {
  title: string;
  updatedAt: string;
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    summary?: string;
  };
  experience?: Array<{
    position?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    location?: string;
    description?: string;
    achievements?: string[];
  }>;
  skills?: Array<{
    category?: string;
    items?: string[];
  }>;
  education?: Array<{
    degree?: string;
    fieldOfStudy?: string;
    school?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }>;
  projects?: Array<{
    name?: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    link?: string;
    description?: string;
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string;
    expiration?: string;
    description?: string;
  }>;
}

interface ResumeViewPageProps {
  params: { id: string };
}

export default function ResumeViewPage({ params }: ResumeViewPageProps) {
  const { id } = params;
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResume = async () => {
      setLoading(true);
      setError('');
      try {
        const token = sessionStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/resumes/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          throw new Error('Resume not found');
        }
        const data = await res.json();
        setResume(data.resume);
      } catch (err: any) {
        setError(err.message || 'Failed to load resume');
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id]);

  if (loading) {
    return <div className="max-w-3xl mx-auto py-8">Loading...</div>;
  }
  if (error || !resume) {
    return <div className="max-w-3xl mx-auto py-8 text-red-600">Page Not Found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{resume.title}</CardTitle>
          <div className="text-sm text-gray-500">Last updated: {new Date(resume.updatedAt).toLocaleString()}</div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Info */}
          <section>
            <h2 className="font-semibold text-lg mb-2">Personal Information</h2>
            <div>Name: {resume.personalInfo?.firstName} {resume.personalInfo?.lastName}</div>
            <div>Email: {resume.personalInfo?.email}</div>
            <div>Phone: {resume.personalInfo?.phone}</div>
            <div>Location: {resume.personalInfo?.location}</div>
            <div>LinkedIn: {resume.personalInfo?.linkedin}</div>
            <div>GitHub: {resume.personalInfo?.github}</div>
            <div>Website: {resume.personalInfo?.website}</div>
            <div>Summary: {resume.personalInfo?.summary}</div>
          </section>
          {/* Experience */}
          {resume.experience?.length && resume.experience.length > 0 ? (
            <section>
              <h2 className="font-semibold text-lg mb-2">Experience</h2>
              {resume.experience?.map((exp, i: number) => (
                <div key={i} className="mb-2">
                  <div className="font-medium">{exp.position} at {exp.company}</div>
                  <div className="text-sm text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                  <div>{exp.location}</div>
                  <div>{exp.description}</div>
                  {exp.achievements?.length && exp.achievements.length > 0 ? (
                    <ul className="list-disc ml-6">
                      {exp.achievements?.map((ach: string, j: number) => <li key={j}>{ach}</li>)}
                    </ul>
                  ) : null}
                </div>
              ))}
            </section>
          ) : null}
          {/* Skills */}
          {resume.skills?.length && resume.skills.length > 0 ? (
            <section>
              <h2 className="font-semibold text-lg mb-2">Skills</h2>
              {resume.skills?.map((cat, i: number) => (
                <div key={i} className="mb-2">
                  <div className="font-medium">{cat.category}</div>
                  <div>{cat.items?.join(', ')}</div>
                </div>
              ))}
            </section>
          ) : null}
          {/* Education */}
          {resume.education?.length && resume.education.length > 0 ? (
            <section>
              <h2 className="font-semibold text-lg mb-2">Education</h2>
              {resume.education?.map((edu, i: number) => (
                <div key={i} className="mb-2">
                  <div className="font-medium">{edu.degree} in {edu.fieldOfStudy} at {edu.school}</div>
                  <div className="text-sm text-gray-500">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</div>
                  <div>{edu.description}</div>
                </div>
              ))}
            </section>
          ) : null}
          {/* Projects */}
          {resume.projects?.length && resume.projects.length > 0 ? (
            <section>
              <h2 className="font-semibold text-lg mb-2">Projects</h2>
              {resume.projects?.map((proj, i: number) => (
                <div key={i} className="mb-2">
                  <div className="font-medium">{proj.name} ({proj.role})</div>
                  <div className="text-sm text-gray-500">{proj.startDate} - {proj.current ? 'Present' : proj.endDate}</div>
                  <div>Link: {proj.link}</div>
                  <div>{proj.description}</div>
                </div>
              ))}
            </section>
          ) : null}
          {/* Certifications */}
          {resume.certifications?.length && resume.certifications.length > 0 ? (
            <section>
              <h2 className="font-semibold text-lg mb-2">Certifications</h2>
              {resume.certifications?.map((cert, i: number) => (
                <div key={i} className="mb-2">
                  <div className="font-medium">{cert.name} from {cert.issuer}</div>
                  <div className="text-sm text-gray-500">{cert.date} {cert.expiration && `- Expires: ${cert.expiration}`}</div>
                  <div>{cert.description}</div>
                </div>
              ))}
            </section>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
} 