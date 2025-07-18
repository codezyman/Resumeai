import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface ProjectsFormProps {
  data: any[];
  onUpdate: (data: any[]) => void;
  onNext: () => void;
  onBack: () => void;
}

function getEmptyProject() {
  return {
    name: '',
    role: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    link: ''
  };
}

export default function ProjectsForm({ data, onUpdate, onNext, onBack }: ProjectsFormProps) {
  const [projects, setProjects] = useState(data.length > 0 ? data : [getEmptyProject()]);

  const addProject = () => {
    setProjects([...projects, getEmptyProject()]);
  };

  const removeProject = (index: number) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    onUpdate(updated);
  };

  const updateProject = (index: number, field: string, value: any) => {
    const updated = projects.map((proj, i) =>
      i === index ? { ...proj, [field]: value } : proj
    );
    setProjects(updated);
    onUpdate(updated);
  };

  const handleNext = () => {
    const validProjects = projects.filter(proj =>
      proj.name.trim() !== '' && proj.role.trim() !== ''
    );
    onUpdate(validProjects);
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.map((project, projIndex) => (
            <div key={projIndex} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">Project {projIndex + 1}</h3>
                {projects.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProject(projIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`name-${projIndex}`}>Project Name *</Label>
                  <Input
                    id={`name-${projIndex}`}
                    value={project.name}
                    onChange={e => updateProject(projIndex, 'name', e.target.value)}
                    placeholder="Project Name"
                  />
                </div>
                <div>
                  <Label htmlFor={`role-${projIndex}`}>Role *</Label>
                  <Input
                    id={`role-${projIndex}`}
                    value={project.role}
                    onChange={e => updateProject(projIndex, 'role', e.target.value)}
                    placeholder="Your Role"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor={`startDate-${projIndex}`}>Start Date</Label>
                    <Input
                      id={`startDate-${projIndex}`}
                      type="date"
                      value={project.startDate}
                      onChange={e => updateProject(projIndex, 'startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`endDate-${projIndex}`}>End Date</Label>
                    <Input
                      id={`endDate-${projIndex}`}
                      type="date"
                      value={project.endDate}
                      onChange={e => updateProject(projIndex, 'endDate', e.target.value)}
                      disabled={project.current}
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id={`current-${projIndex}`}
                        checked={project.current}
                        onCheckedChange={checked => {
                          updateProject(projIndex, 'current', checked);
                          if (checked) {
                            updateProject(projIndex, 'endDate', '');
                          }
                        }}
                      />
                      <Label htmlFor={`current-${projIndex}`} className="text-sm">
                        Currently working on this
                      </Label>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor={`link-${projIndex}`}>Project Link</Label>
                  <Input
                    id={`link-${projIndex}`}
                    value={project.link}
                    onChange={e => updateProject(projIndex, 'link', e.target.value)}
                    placeholder="https://github.com/yourproject"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`description-${projIndex}`}>Description</Label>
                <Textarea
                  id={`description-${projIndex}`}
                  value={project.description}
                  onChange={e => updateProject(projIndex, 'description', e.target.value)}
                  placeholder="Describe the project, your contributions, technologies used..."
                  rows={3}
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addProject}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
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