import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface EducationFormProps {
  data: any[];
  onUpdate: (data: any[]) => void;
  onNext: () => void;
  onBack: () => void;
}

function getEmptyEducation() {
  return {
    school: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  };
}

export default function EducationForm({ data, onUpdate, onNext, onBack }: EducationFormProps) {
  const [educations, setEducations] = useState(data.length > 0 ? data : [getEmptyEducation()]);

  const addEducation = () => {
    setEducations([...educations, getEmptyEducation()]);
  };

  const removeEducation = (index: number) => {
    const updated = educations.filter((_, i) => i !== index);
    setEducations(updated);
    onUpdate(updated);
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = educations.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    );
    setEducations(updated);
    onUpdate(updated);
  };

  const handleNext = () => {
    const validEducations = educations.filter(edu =>
      edu.school.trim() !== '' && edu.degree.trim() !== ''
    );
    onUpdate(validEducations);
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {educations.map((education, eduIndex) => (
            <div key={eduIndex} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">Education {eduIndex + 1}</h3>
                {educations.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(eduIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`school-${eduIndex}`}>School *</Label>
                  <Input
                    id={`school-${eduIndex}`}
                    value={education.school}
                    onChange={e => updateEducation(eduIndex, 'school', e.target.value)}
                    placeholder="School Name"
                  />
                </div>
                <div>
                  <Label htmlFor={`degree-${eduIndex}`}>Degree *</Label>
                  <Input
                    id={`degree-${eduIndex}`}
                    value={education.degree}
                    onChange={e => updateEducation(eduIndex, 'degree', e.target.value)}
                    placeholder="Degree (e.g., B.Sc, M.A., etc.)"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`fieldOfStudy-${eduIndex}`}>Field of Study</Label>
                  <Input
                    id={`fieldOfStudy-${eduIndex}`}
                    value={education.fieldOfStudy}
                    onChange={e => updateEducation(eduIndex, 'fieldOfStudy', e.target.value)}
                    placeholder="Field of Study"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor={`startDate-${eduIndex}`}>Start Date</Label>
                    <Input
                      id={`startDate-${eduIndex}`}
                      type="date"
                      value={education.startDate}
                      onChange={e => updateEducation(eduIndex, 'startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`endDate-${eduIndex}`}>End Date</Label>
                    <Input
                      id={`endDate-${eduIndex}`}
                      type="date"
                      value={education.endDate}
                      onChange={e => updateEducation(eduIndex, 'endDate', e.target.value)}
                      disabled={education.current}
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id={`current-${eduIndex}`}
                        checked={education.current}
                        onCheckedChange={checked => {
                          updateEducation(eduIndex, 'current', checked);
                          if (checked) {
                            updateEducation(eduIndex, 'endDate', '');
                          }
                        }}
                      />
                      <Label htmlFor={`current-${eduIndex}`} className="text-sm">
                        Currently studying here
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor={`description-${eduIndex}`}>Description</Label>
                <Textarea
                  id={`description-${eduIndex}`}
                  value={education.description}
                  onChange={e => updateEducation(eduIndex, 'description', e.target.value)}
                  placeholder="Describe your studies, honors, or activities..."
                  rows={3}
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addEducation}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
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