const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mechtech-backend.vercel.app/api/v1';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('alumniconnect_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('alumniconnect_token', token);
    } else {
      localStorage.removeItem('alumniconnect_token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('alumniconnect_token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data.data;
    } catch (error) {
      console.warn(`API Error [${endpoint}]:`, error.message);
      throw error;
    }
  }

  // Auth Endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Profile & Skills
  async getProfile(userId = 'me') {
    return this.request(`/profiles/${userId}`);
  }

  async updateStudentProfile(data) {
    return this.request('/profiles/student', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateAlumniProfile(data) {
    return this.request('/profiles/alumni', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async addSkill(name, proficiency) {
    return this.request('/profiles/skills', {
      method: 'POST',
      body: JSON.stringify({ name, proficiency }),
    });
  }

  async removeSkill(skillId) {
    return this.request(`/profiles/skills/${skillId}`, {
      method: 'DELETE',
    });
  }

  // Alumni Directory
  async getAlumniDirectory(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/users/alumni-directory${query ? `?${query}` : ''}`);
  }

  // Forum (Posts, Comments, Likes)
  async getPosts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/forum/posts${query ? `?${query}` : ''}`);
  }

  async createPost(postData) {
    return this.request('/forum/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async getPostById(postId) {
    return this.request(`/forum/posts/${postId}`);
  }

  async deletePost(postId) {
    return this.request(`/forum/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  async addComment(postId, content) {
    return this.request(`/forum/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async toggleLike(postId) {
    return this.request(`/forum/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  // Mentorship
  async requestMentorship(alumniId, message) {
    return this.request('/mentorships', {
      method: 'POST',
      body: JSON.stringify({ alumniId, message }),
    });
  }

  async getMyMentorships() {
    return this.request('/mentorships');
  }

  async respondToMentorship(mentorshipId, status) {
    return this.request(`/mentorships/${mentorshipId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Messages & Notifications
  async getConversations() {
    return this.request('/messages/conversations');
  }

  async getMessages(conversationId) {
    return this.request(`/messages/conversations/${conversationId}/messages`);
  }

  async sendMessage(conversationId, content) {
    return this.request(`/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async getNotifications(unreadOnly = false) {
    return this.request(`/messages/notifications?unreadOnly=${unreadOnly}`);
  }

  async markNotificationsRead() {
    return this.request('/messages/notifications/read-all', {
      method: 'PATCH',
    });
  }

  // Opportunities & Applications
  async getOpportunities(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/opportunities${query ? `?${query}` : ''}`);
  }

  async createOpportunity(data) {
    return this.request('/opportunities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async applyForOpportunity(opportunityId, resumeUrl) {
    return this.request(`/opportunities/${opportunityId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ resumeUrl }),
    });
  }

  async getMyApplications() {
    return this.request('/opportunities/my-applications');
  }

  async getOpportunityApplications(opportunityId) {
    return this.request(`/opportunities/${opportunityId}/applications`);
  }

  async updateApplicationStatus(applicationId, status) {
    return this.request(`/opportunities/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Events
  async getEvents(upcomingOnly = false) {
    return this.request(`/events?upcomingOnly=${upcomingOnly}`);
  }

  async createEvent(eventData) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async registerEvent(eventId) {
    return this.request(`/events/${eventId}/register`, {
      method: 'POST',
    });
  }

  async unregisterEvent(eventId) {
    return this.request(`/events/${eventId}/register`, {
      method: 'DELETE',
    });
  }

  async getMyEventRegistrations() {
    return this.request('/events/my-registrations');
  }

  // Admin
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getColleges() {
    return this.request('/admin/colleges');
  }

  async createCollege(data) {
    return this.request('/admin/colleges', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDepartments(collegeId) {
    return this.request(`/admin/departments?collegeId=${collegeId}`);
  }

  async createDepartment(data) {
    return this.request('/admin/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAdminUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/users${query ? `?${query}` : ''}`);
  }

  async toggleUserActive(userId, isActive) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }
}

export const api = new ApiService();
export default api;
