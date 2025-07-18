'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Star } from 'lucide-react';

interface TemplateCardProps {
  template: {
    _id: string;
    name: string;
    description: string;
    category: string;
    preview: string;
    premium: boolean;
    rating: {
      average: number;
      count: number;
    };
    usage: number;
  };
  onSelect: (templateId: string) => void;
  onPreview: (templateId: string) => void;
}

export default function TemplateCard({ template, onSelect, onPreview }: TemplateCardProps) {
  const categoryColors = {
    modern: 'bg-blue-100 text-blue-800',
    classic: 'bg-gray-100 text-gray-800',
    creative: 'bg-purple-100 text-purple-800',
    minimal: 'bg-green-100 text-green-800',
    professional: 'bg-indigo-100 text-indigo-800',
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="relative">
          <div className="aspect-[3/4] bg-gray-100 rounded-t-lg overflow-hidden">
            <img
              src={template.preview}
              alt={template.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          
          {template.premium && (
            <Badge className="absolute top-2 right-2 bg-gold text-gold-foreground">
              Premium
            </Badge>
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPreview(template._id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">{template.name}</h3>
            <Badge 
              variant="secondary" 
              className={categoryColors[template.category as keyof typeof categoryColors]}
            >
              {template.category}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {template.description}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{template.rating.average.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({template.rating.count})</span>
            </div>
            <span className="text-sm text-gray-500">
              {template.usage} uses
            </span>
          </div>
          
          <Button 
            onClick={() => onSelect(template._id)}
            className="w-full"
          >
            Use Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}