import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
export const useAuthStore = create((set) => ({
  userLoggedIn: false,
  check: async () => {
    try {
      const res = await axiosInstance.get("/auth/check")
      if (res.data.userLoggedIn) {
        set({userLoggedIn: true});
      }
    } catch (error) {
      console.log("error in checkUserLoggedIn", error);
      
    }
  },
  logout: async () => {
    try {
      await axiosInstance.get("/auth/logout")
      set({userLoggedIn: false});    
    } catch (error) {
      console.log("error in handleLogout", error);
      set({userLoggedIn: false});    
    }
  }

}));
