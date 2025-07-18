const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class APIClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = sessionStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('token', token);
    }
  }

  removeToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  // Resume endpoints
  async getResumes() {
    return this.request<{ resumes: any[] }>('/resumes');
  }

  async getResume(id: string) {
    return this.request<{ resume: any }>(`/resumes/${id}`);
  }

  async createResume(data: any) {
    return this.request<{ resume: any }>('/resumes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateResume(id: string, data: any) {
    return this.request<{ resume: any }>(`/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteResume(id: string) {
    return this.request<{ message: string }>(`/resumes/${id}`, {
      method: 'DELETE',
    });
  }

  // Template endpoints
  async getTemplates() {
    return this.request<{ templates: any[] }>('/templates');
  }

  async getTemplate(id: string) {
    return this.request<{ template: any }>(`/templates/${id}`);
  }

  // AI endpoints
  async generateSummary({ personalInfo, experience, skills }: { personalInfo: any, experience: any, skills: any }) {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/ai/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ personalInfo, experience, skills })
    });
    if (!res.ok) throw new Error('Failed to generate summary');
    return await res.json();
  }

  async enhanceAchievements(data: any) {
    return this.request<{ achievements: string[] }>('/ai/achievements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAIStatus() {
    return this.request<{ configured: boolean; providers: any }>('/ai/status');
  }

  // Export endpoints
  async exportToPDF(resumeId: string) {
    const url = `${API_BASE_URL}/export/pdf/${resumeId}`;
    
    const response = await fetch(url, {
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export PDF');
    }

    return response.blob();
  }
}

export const apiClient = new APIClient();
export default apiClient;