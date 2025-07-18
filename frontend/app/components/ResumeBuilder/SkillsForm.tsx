'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface SkillsFormProps {
  data: any[];
  onUpdate: (data: any[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SkillsForm({ data, onUpdate, onNext, onBack }: SkillsFormProps) {
  const [skillCategories, setSkillCategories] = useState(
    data.length > 0 ? data : [{ category: 'Technical Skills', items: [''] }]
  );

  const addCategory = () => {
    setSkillCategories([...skillCategories, { category: '', items: [''] }]);
  };

  const removeCategory = (index: number) => {
    const updated = skillCategories.filter((_, i) => i !== index);
    setSkillCategories(updated);
    onUpdate(updated);
  };

  const updateCategory = (index: number, field: string, value: string) => {
    const updated = skillCategories.map((cat, i) => 
      i === index ? { ...cat, [field]: value } : cat
    );
    setSkillCategories(updated);
    onUpdate(updated);
  };

  const addSkill = (categoryIndex: number) => {
    const updated = skillCategories.map((cat, i) => 
      i === categoryIndex ? { ...cat, items: [...cat.items, ''] } : cat
    );
    setSkillCategories(updated);
    onUpdate(updated);
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const updated = skillCategories.map((cat, i) => 
      i === categoryIndex ? { 
        ...cat, 
        items: cat.items.filter((_: any, j: number) => j !== skillIndex) 
      } : cat
    );
    setSkillCategories(updated);
    onUpdate(updated);
  };

  const updateSkill = (categoryIndex: number, skillIndex: number, value: string) => {
    const updated = skillCategories.map((cat, i) => 
      i === categoryIndex ? { 
        ...cat, 
        items: cat.items.map((skill: any, j: number) => j === skillIndex ? value : skill)
      } : cat
    );
    setSkillCategories(updated);
    onUpdate(updated);
  };

  const handleNext = () => {
    const validCategories = skillCategories.filter(cat => 
      cat.category.trim() !== '' && cat.items.some((item: any) => item.trim() !== '')
    ).map(cat => ({
      ...cat,
      items: cat.items.filter((item: any) => item.trim() !== '')
    }));
    
    onUpdate(validCategories);
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {skillCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Label htmlFor={`category-${categoryIndex}`}>Category</Label>
                  <Input
                    id={`category-${categoryIndex}`}
                    value={category.category}
                    onChange={(e) => updateCategory(categoryIndex, 'category', e.target.value)}
                    placeholder="e.g., Technical Skills, Languages, etc."
                  />
                </div>
                {skillCategories.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCategory(categoryIndex)}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div>
                <Label>Skills</Label>
                <div className="space-y-2">
                  {category.items.map((skill: any, skillIndex: number) => (
                    <div key={skillIndex} className="flex items-center gap-2">
                      <Input
                        value={skill}
                        onChange={(e) => updateSkill(categoryIndex, skillIndex, e.target.value)}
                        placeholder="Enter a skill"
                        className="flex-1"
                      />
                      {category.items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(categoryIndex, skillIndex)}
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
                    onClick={() => addSkill(categoryIndex)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addCategory}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
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