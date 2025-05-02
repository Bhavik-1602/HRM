import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUser = create(
  persist(
    (set, get) => ({
      user: { userId: "", name: "", work_email: "", profile_image: ""}, // Default empty user

      setUser: (userData) => {
        if (!userData) {
          return;
        }

        const updatedUser = {
          userId: userData.employee_id || "",
          name: userData.name || "",
          work_email: userData.work_email || "",
          profile_image: userData.profile_image || "",
        };

        set({ user: updatedUser });
      },

      logout: () => {
        set({ user: { userId: "", name: "", work_email: "", profile_image: ""} });
      },
    }),
    {
      name: "user-storage", 
      getStorage: () => sessionStorage, 
    }
  )
);
