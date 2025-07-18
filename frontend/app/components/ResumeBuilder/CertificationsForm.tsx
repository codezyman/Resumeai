import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface CertificationsFormProps {
  data: any[];
  onUpdate: (data: any[]) => void;
  onNext: () => void;
  onBack: () => void;
}

function getEmptyCertification() {
  return {
    name: '',
    issuer: '',
    date: '',
    expiration: '',
    description: ''
  };
}

export default function CertificationsForm({ data, onUpdate, onNext, onBack }: CertificationsFormProps) {
  const [certifications, setCertifications] = useState(data.length > 0 ? data : [getEmptyCertification()]);

  const addCertification = () => {
    setCertifications([...certifications, getEmptyCertification()]);
  };

  const removeCertification = (index: number) => {
    const updated = certifications.filter((_, i) => i !== index);
    setCertifications(updated);
    onUpdate(updated);
  };

  const updateCertification = (index: number, field: string, value: any) => {
    const updated = certifications.map((cert, i) =>
      i === index ? { ...cert, [field]: value } : cert
    );
    setCertifications(updated);
    onUpdate(updated);
  };

  const handleNext = () => {
    const validCertifications = certifications.filter(cert =>
      cert.name.trim() !== '' && cert.issuer.trim() !== ''
    );
    onUpdate(validCertifications);
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {certifications.map((certification, certIndex) => (
            <div key={certIndex} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">Certification {certIndex + 1}</h3>
                {certifications.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCertification(certIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`name-${certIndex}`}>Certification Name *</Label>
                  <Input
                    id={`name-${certIndex}`}
                    value={certification.name}
                    onChange={e => updateCertification(certIndex, 'name', e.target.value)}
                    placeholder="Certification Name"
                  />
                </div>
                <div>
                  <Label htmlFor={`issuer-${certIndex}`}>Issuer *</Label>
                  <Input
                    id={`issuer-${certIndex}`}
                    value={certification.issuer}
                    onChange={e => updateCertification(certIndex, 'issuer', e.target.value)}
                    placeholder="Issuing Organization"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`date-${certIndex}`}>Date</Label>
                  <Input
                    id={`date-${certIndex}`}
                    type="date"
                    value={certification.date}
                    onChange={e => updateCertification(certIndex, 'date', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`expiration-${certIndex}`}>Expiration Date</Label>
                  <Input
                    id={`expiration-${certIndex}`}
                    type="date"
                    value={certification.expiration}
                    onChange={e => updateCertification(certIndex, 'expiration', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`description-${certIndex}`}>Description</Label>
                <Textarea
                  id={`description-${certIndex}`}
                  value={certification.description}
                  onChange={e => updateCertification(certIndex, 'description', e.target.value)}
                  placeholder="Describe the certification, skills gained, etc."
                  rows={3}
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addCertification}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
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