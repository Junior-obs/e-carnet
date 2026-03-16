import axios from "axios";

const API_URL = "http://192.168.1.16:5000/api/medecins";

const MedecinService = {
  getProfile: () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/me/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

export default MedecinService;