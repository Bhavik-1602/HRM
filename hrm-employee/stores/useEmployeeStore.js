import { create } from 'zustand';
import { GET_EMPLOYEE_DETAILS } from '@/helper/url_helper';
import { toast } from 'react-toastify';
import { GET } from '@/helper/api_helper'

const useEmployeeStore = create((set) => ({
    employee : {},

    getEmployee: async () => {
        try{
          const response = await GET(GET_EMPLOYEE_DETAILS);
          set({ employee: response.data });
        }
        catch(err){
          const errorMessage = err.response?.data?.meta?.message || "Server Error";
          toast.error(errorMessage);
        }
    }

}));

module.exports = { useEmployeeStore };
