'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Zap, 
  Users, 
  Star,
  ChevronRight,
  Play
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';

export default function HomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    resumes: 15420,
    users: 3240,
    downloads: 45320
  });

  useEffect(() => {
    // Animate numbers on mount
    const interval = setInterval(() => {
      setStats(prev => ({
        resumes: prev.resumes + Math.floor(Math.random() * 5),
        users: prev.users + Math.floor(Math.random() * 3),
        downloads: prev.downloads + Math.floor(Math.random() * 10)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Content',
      description: 'Generate professional summaries and enhance your achievements with AI assistance.'
    },
    {
      icon: FileText,
      title: 'Professional Templates',
      description: 'Choose from dozens of ATS-friendly templates designed by professionals.'
    },
    {
      icon: Download,
      title: 'Export to PDF',
      description: 'Download your resume as a high-quality PDF ready for job applications.'
    },
    {
      icon: Zap,
      title: 'Real-time Preview',
      description: 'See your changes instantly as you build your resume.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      content: 'ResumeAI helped me land my dream job at a FAANG company. The AI suggestions were spot-on!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Manager',
      content: 'The templates are beautiful and professional. I got 3x more interview calls after using ResumeAI.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Data Scientist',
      content: 'The AI content generation saved me hours of work. My resume now tells a compelling story.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Create Your Perfect Resume with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                AI Power
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Build professional, ATS-friendly resumes in minutes. Our AI helps you write compelling content 
              while our beautiful templates make you stand out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={user ? '/create' : '/register'}>
                <Button
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Get Started Free
                  <ChevronRight className="ml-1 h-5 w-5 text-white" />
                </Button>
              </Link>
              <Button
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-all"
              >
                <Play className="mr-1 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.resumes.toLocaleString()}+
              </div>
              <div className="text-gray-600">Resumes Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {stats.users.toLocaleString()}+
              </div>
              <div className="text-gray-600">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {stats.downloads.toLocaleString()}+
              </div>
              <div className="text-gray-600">Downloads</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ResumeAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine the power of AI with beautiful design to help you create 
              resumes that get noticed by employers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="text-center">
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of professionals who've transformed their careers with ResumeAI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Create your professional resume today and start getting more interviews tomorrow.
          </p>
          <div className="flex justify-center mt-8">
            <Link href="/create">
              <button
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 transition-all text-lg"
              >
                Start Building Your Resume
                <ChevronRight className="ml-1 h-5 w-5 text-white" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}