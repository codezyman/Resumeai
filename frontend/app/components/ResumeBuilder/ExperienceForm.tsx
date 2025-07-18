'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface ExperienceFormProps {
  data: any[];
  onUpdate: (data: any[]) => void;
  onNext: () => void;
  onBack: () => void;
  onEnhanceAchievements: (achievements: string[], jobTitle: string) => void;
  isEnhancing: boolean;
}

export default function ExperienceForm({ 
  data, 
  onUpdate, 
  onNext, 
  onBack, 
  onEnhanceAchievements, 
  isEnhancing 
}: ExperienceFormProps) {
  const [experiences, setExperiences] = useState(data.length > 0 ? data : [getEmptyExperience()]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function getEmptyExperience() {
    return {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: ['']
    };
  }

  const addExperience = () => {
    setExperiences([...experiences, getEmptyExperience()]);
  };

  const removeExperience = (index: number) => {
    const updated = experiences.filter((_, i) => i !== index);
    setExperiences(updated);
    onUpdate(updated);
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = experiences.map((exp: any, i: number) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    setExperiences(updated);
    onUpdate(updated);
  };

  const addAchievement = (expIndex: number) => {
    const updated = experiences.map((exp: any, i: number) => 
      i === expIndex ? { ...exp, achievements: [...exp.achievements, ''] } : exp
    );
    setExperiences(updated);
    onUpdate(updated);
  };

  const removeAchievement = (expIndex: number, achIndex: number) => {
    const updated = experiences.map((exp: any, i: number) => 
      i === expIndex ? { 
        ...exp, 
        achievements: exp.achievements.filter((_: string, j: number) => j !== achIndex) 
      } : exp
    );
    setExperiences(updated);
    onUpdate(updated);
  };

  const updateAchievement = (expIndex: number, achIndex: number, value: string) => {
    const updated = experiences.map((exp: any, i: number) => 
      i === expIndex ? { 
        ...exp, 
        achievements: exp.achievements.map((ach: string, j: number) => j === achIndex ? value : ach)
      } : exp
    );
    setExperiences(updated);
    onUpdate(updated);
  };

  const handleEnhanceAchievements = (expIndex: number) => {
    const experience = experiences[expIndex];
    const validAchievements = experience.achievements.filter((ach: string) => ach.trim() !== '');
    
    if (validAchievements.length > 0) {
      onEnhanceAchievements(validAchievements, experience.position);
      setEditingIndex(expIndex);
    }
  };

  const handleNext = () => {
    const validExperiences = experiences.filter(exp => 
      exp.company.trim() !== '' && exp.position.trim() !== ''
    );
    onUpdate(validExperiences);
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {experiences.map((experience: any, expIndex: number) => (
            <div key={expIndex} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">Experience {expIndex + 1}</h3>
                {experiences.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(expIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`company-${expIndex}`}>Company *</Label>
                  <Input
                    id={`company-${expIndex}`}
                    value={experience.company}
                    onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`position-${expIndex}`}>Position *</Label>
                  <Input
                    id={`position-${expIndex}`}
                    value={experience.position}
                    onChange={(e) => updateExperience(expIndex, 'position', e.target.value)}
                    placeholder="Job Title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`location-${expIndex}`}>Location</Label>
                  <Input
                    id={`location-${expIndex}`}
                    value={experience.location}
                    onChange={(e) => updateExperience(expIndex, 'location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`startDate-${expIndex}`}>Start Date</Label>
                  <Input
                    id={`startDate-${expIndex}`}
                    type="date"
                    value={experience.startDate}
                    onChange={(e) => updateExperience(expIndex, 'startDate', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`endDate-${expIndex}`}>End Date</Label>
                  <Input
                    id={`endDate-${expIndex}`}
                    type="date"
                    value={experience.endDate}
                    onChange={(e) => updateExperience(expIndex, 'endDate', e.target.value)}
                    disabled={experience.current}
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id={`current-${expIndex}`}
                      checked={experience.current}
                      onCheckedChange={(checked) => {
                        updateExperience(expIndex, 'current', checked);
                        if (checked) {
                          updateExperience(expIndex, 'endDate', '');
                        }
                      }}
                    />
                    <Label htmlFor={`current-${expIndex}`} className="text-sm">
                      Currently working here
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor={`description-${expIndex}`}>Description</Label>
                <Textarea
                  id={`description-${expIndex}`}
                  value={experience.description}
                  onChange={(e) => updateExperience(expIndex, 'description', e.target.value)}
                  placeholder="Describe your role and responsibilities..."
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Key Achievements</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEnhanceAchievements(expIndex)}
                    disabled={isEnhancing}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isEnhancing && editingIndex === expIndex ? 'Enhancing...' : 'AI Enhance'}
                  </Button>
                </div>
                
                {experience.achievements.map((achievement: string, achIndex: number) => (
                  <div key={achIndex} className="flex items-center gap-2 mb-2">
                    <Input
                      value={achievement}
                      onChange={(e) => updateAchievement(expIndex, achIndex, e.target.value)}
                      placeholder="Describe a key achievement..."
                      className="flex-1"
                    />
                    {experience.achievements.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAchievement(expIndex, achIndex)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addAchievement(expIndex)}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Achievement
                </Button>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addExperience}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={handleNext}>
              Next Step
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}