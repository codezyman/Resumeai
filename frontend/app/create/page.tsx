'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import PersonalInfoForm from '../components/ResumeBuilder/PersonalInfoForm';
import ExperienceForm from '../components/ResumeBuilder/ExperienceForm';
import SkillsForm from '../components/ResumeBuilder/SkillsForm';
import EducationForm from '../components/ResumeBuilder/EducationForm';
import ProjectsForm from '../components/ResumeBuilder/ProjectsForm';
import CertificationsForm from '../components/ResumeBuilder/CertificationsForm';
import { 
  User, 
  Briefcase, 
  Code, 
  GraduationCap, 
  Save, 
  Download,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const steps = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'experience', title: 'Experience', icon: Briefcase },
  { id: 'skills', title: 'Skills', icon: Code },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'projects', title: 'Projects', icon: Code },
  { id: 'certifications', title: 'Certifications', icon: GraduationCap },
  { id: 'review', title: 'Review', icon: Save }, // Add review step
];

export default function CreateResumePage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template') || '';
  
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [resumeData, setResumeData] = useState<any>({
    title: 'My Resume',
    templateId: templateId || '',
    personalInfo: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: '',
      summary: ''
    },
    experience: [],
    skills: [],
    education: [],
    projects: [],
    certifications: []
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [template, setTemplate] = useState<any>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (templateId) {
      fetchTemplate();
    }
  }, [user, templateId, router]);

  const fetchTemplate = async () => {
    try {
      const { template } = await apiClient.getTemplate(templateId);
      setTemplate(template);
      setResumeData((prev: any) => ({ ...prev, templateId: templateId }));
    } catch (error) {
      console.error('Failed to fetch template:', error);
    }
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setSummaryError(null);
    try {
      const { summary, success, message } = await apiClient.generateSummary({
        personalInfo: resumeData.personalInfo,
        experience: resumeData.experience,
        skills: resumeData.skills
      });
      if (!success) throw new Error(message || 'AI generation failed');
      setResumeData((prev: any) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, summary }
      }));
    } catch (error: any) {
      setSummaryError(error.message || 'Failed to generate summary');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhanceAchievements = async (achievements: string[], jobTitle: string) => {
    setIsEnhancing(true);
    try {
      const { achievements: enhanced } = await apiClient.enhanceAchievements({
        achievements,
        jobTitle
      });
      
      // Update the current experience item with enhanced achievements
      // This would need to be implemented based on which experience is being enhanced
      console.log('Enhanced achievements:', enhanced);
    } catch (error) {
      console.error('Failed to enhance achievements:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSaveResume = async () => {
    setIsSaving(true);
    try {
      const dataToSave = { ...resumeData };
      if (!dataToSave.templateId) {
        delete dataToSave.templateId;
      }
      await apiClient.createResume(dataToSave);
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save resume:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    // This would need a resume ID, so we'd need to save first
    console.log('Export PDF functionality would be implemented here');
  };

  const updateResumeData = (field: string, data: any) => {
    setResumeData((prev: any) => ({ ...prev, [field]: data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderCurrentStep = () => {
    switch (steps[currentStep].id) {
      case 'personal':
        return (
          <>
            <PersonalInfoForm
              data={resumeData.personalInfo}
              onUpdate={(data) => updateResumeData('personalInfo', data)}
              onNext={nextStep}
              onGenerateSummary={handleGenerateSummary}
              isGenerating={isGenerating}
            />
            {summaryError && (
              <div className="text-red-600 text-sm mt-2">{summaryError}</div>
            )}
          </>
        );
      case 'experience':
        return (
          <ExperienceForm
            data={resumeData.experience}
            onUpdate={(data) => updateResumeData('experience', data)}
            onNext={nextStep}
            onBack={prevStep}
            onEnhanceAchievements={handleEnhanceAchievements}
            isEnhancing={isEnhancing}
          />
        );
      case 'skills':
        return (
          <SkillsForm
            data={resumeData.skills}
            onUpdate={(data) => updateResumeData('skills', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 'education':
        return (
          <EducationForm
            data={resumeData.education}
            onUpdate={(data) => updateResumeData('education', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 'projects':
        return (
          <ProjectsForm
            data={resumeData.projects}
            onUpdate={(data) => updateResumeData('projects', data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 'certifications':
        return (
          <CertificationsForm
            data={resumeData.certifications}
            onUpdate={(data) => updateResumeData('certifications', data)}
            onNext={nextStep} // Changed to nextStep for review step
            onBack={prevStep}
          />
        );
      case 'review':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review & Generate Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <strong>Personal Info:</strong> {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}, {resumeData.personalInfo.email}
                </div>
                <div className="mb-4">
                  <strong>Experience:</strong> {resumeData.experience.map((exp: any) => `${exp.position} at ${exp.company}`).join(', ')}
                </div>
                <div className="mb-4">
                  <strong>Skills:</strong> {resumeData.skills.map((cat: any) => cat.items.join(', ')).join(', ')}
                </div>
                <div className="mb-4">
                  <strong>Professional Summary:</strong>
                  <Textarea
                    value={resumeData.personalInfo.summary}
                    onChange={e => setResumeData((prev: any) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, summary: e.target.value }
                    }))}
                    rows={4}
                    placeholder="Your AI-generated or custom summary will appear here..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateSummary}
                    disabled={isGenerating}
                    className="flex items-center gap-2 mt-2"
                  >
                    <span>AI Generate</span>
                    {isGenerating && <span className="ml-2">...</span>}
                  </Button>
                  {summaryError && (
                    <div className="text-red-600 text-sm mt-2">{summaryError}</div>
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={prevStep}>Back</Button>
                  <Button onClick={handleSaveResume}>Save Resume</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Progress */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Resume Builder
                </CardTitle>
                {template && (
                  <Badge variant="secondary">{template.name}</Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    {steps.map((step, index) => {
                      const Icon = step.icon;
                      const isActive = index === currentStep;
                      const isCompleted = index < currentStep;
                      
                      return (
                        <div
                          key={step.id}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-700'
                              : isCompleted
                              ? 'bg-green-50 text-green-700'
                              : 'text-gray-500'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{step.title}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="pt-4 border-t space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleSaveResume}
                      disabled={isSaving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Draft'}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleExportPDF}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {steps[currentStep].title}
              </h1>
              <p className="text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
}