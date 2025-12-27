import axiosInstance from "../lib/axios";

const adminStore = {
  async fetchStats() {
    const res = await axiosInstance.get("/admin/stats");
    return res.data;
  },

  async fetchUsers(params = {}) {
    const res = await axiosInstance.get("/admin/users", { params });
    return res.data;
  },

  async deleteUser(id) {
    const res = await axiosInstance.delete(`/admin/users/${id}`);
    return res.data;
  },

  async fetchJobs(params = {}) {
    const res = await axiosInstance.get("/admin/jobs", { params });
    return res.data;
  },

  async updateJobStatus(id, status) {
    const res = await axiosInstance.put(
      `/admin/jobs/${id}/status`,
      { status }
    );
    return res.data;
  },

  async deleteJob(id) {
    const res = await axiosInstance.delete(`/admin/jobs/${id}`);
    return res.data;
  },

  async fetchProposals(params = {}) {
    const res = await axiosInstance.get("/admin/proposals", { params });
    return res.data;
  },

  async deleteProposal(id) {
    const res = await axiosInstance.delete(`/admin/proposals/${id}`);
    return res.data;
  },

  async fetchContent(key) {
    const res = await axiosInstance.get(`/admin/content/${key}`);
    return res.data;
  },

  async saveContent(key, payload) {
    const res = await axiosInstance.put(`/admin/content/${key}`, payload);
    return res.data;
  },

  
  async fetchJob(id) {
    const res = await axiosInstance.get(`/admin/jobs/${id}`);
    return res.data;
  },
};

export default adminStore;
