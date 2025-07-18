'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface PersonalInfoFormProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onGenerateSummary: () => void;
  isGenerating: boolean;
}

export default function PersonalInfoForm({ 
  data, 
  onUpdate, 
  onNext, 
  onGenerateSummary, 
  isGenerating 
}: PersonalInfoFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: data
  });

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  const onSubmit = (formData: any) => {
    onUpdate(formData);
    onNext();
  };

  const handleChange = (field: string, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                {...register('firstName', { required: 'First name is required' })}
                onChange={(e) => handleChange('firstName', e.target.value)}
              />
              {typeof errors.firstName?.message === 'string' && (
                <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                {...register('lastName', { required: 'Last name is required' })}
                onChange={(e) => handleChange('lastName', e.target.value)}
              />
              {typeof errors.lastName?.message === 'string' && (
                <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              {typeof errors.email?.message === 'string' && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone')}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, State"
              {...register('location')}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                placeholder="linkedin.com/in/yourprofile"
                {...register('linkedin')}
                onChange={(e) => handleChange('linkedin', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                placeholder="github.com/yourusername"
                {...register('github')}
                onChange={(e) => handleChange('github', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              placeholder="yourwebsite.com"
              {...register('website')}
              onChange={(e) => handleChange('website', e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="summary">Professional Summary</Label>
              {/* AI Generate button removed for end-of-flow only */}
            </div>
            <Textarea
              id="summary"
              rows={4}
              placeholder="Write a brief summary of your professional background and key achievements..."
              {...register('summary')}
              onChange={(e) => handleChange('summary', e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Next Step</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}