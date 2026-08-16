import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL
// || 'http://localhost:8080/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for Render
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      console.warn('Resource not found');
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.response?.data);
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - backend might be cold starting on Render free tier');
    }
    return Promise.reject(error);
  }
);

export interface ResumeData {
  name: string;
  email: string;
  phone?: string;
  summary?: string;
  location?: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration?: string;
    description?: string;
    technologies?: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    graduation_year?: string;
    field_of_study?: string;
    gpa?: string;
  }>;
  projects: Array<{
    name: string;
    description?: string;
    technologies?: string[];
    link?: string;
    github?: string;
  }>;
  certifications?: string[];
  social_links?: Record<string, string>;
}

export interface AIGeneratedContent {
  professional_summary: string;
  headline: string;
  bio: string;
  skills_description: string;
  career_highlights: string[];
  project_descriptions: Array<{
    project_name: string;
    enhanced_description: string;
    impact: string;
    technologies_used: string[];
  }>;
  portfolio_sections: Array<{
    title: string;
    content: string;
    order: number;
  }>;
}

export interface PortfolioResponse {
  id?: string;
  username: string;
  user_info: {
    name: string;
    email: string;
    phone?: string;
    summary?: string;
    location?: string;
    profile_image_url?: string;
  };
  ai_generated_content: AIGeneratedContent;
  resume_data: ResumeData;
  pdf_url?: string;
  created_at?: string;
  updated_at?: string;
  is_public?: boolean;
}

export interface GeneratedResumeData extends ResumeData {
  bio: string | null;
}

export const resumeAPI = {

  parse: async (file: File): Promise<ResumeData> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/resume/parse', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  health: async (): Promise<string> => {
    const response = await apiClient.get('/resume/health');
    return response.data;
  },
};

/**
 * Portfolio API endpoints
 */
export const portfolioAPI = {
  generate: async (file: File, username: string): Promise<GeneratedResumeData> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', username);

    const response = await apiClient.post('/portfolio/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
  /**
    TODO
   */
  getByUsername: async (username: string): Promise<PortfolioResponse> => {
    const response = await apiClient.get(`/portfolio/${username}`);
    return response.data;
  },

  updateVisibility: async (username: string, isPublic: boolean): Promise<any> => {
    const response = await apiClient.put(`/portfolio/${username}/visibility`, null, {
      params: { public: isPublic },
    });
    return response.data;
  },

  regenerateAIContent: async (username: string): Promise<PortfolioResponse> => {
    const response = await apiClient.post(`/portfolio/${username}/regenerate`);
    return response.data;
  },


  health: async (): Promise<string> => {
    const response = await apiClient.get('/portfolio/health');
    return response.data;
  },
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    await Promise.race([
      apiClient.get('/portfolio/health'),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
      ),
    ]);
    return true;
  } catch (error) {
    console.warn('Backend health check failed:', error);
    return false;
  }
};

export default apiClient;
