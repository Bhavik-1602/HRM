import { create } from 'zustand';
import { GET_LEAVE_TYPES_URL } from '@/helper/url_helper';
import { toast } from 'react-toastify';
import { GET } from '@/helper/api_helper'

const useLeaveTypeStore = create((set) => ({
    leave_types : {},

    getLeaveType: async () => {
        try{
          const response = await GET(GET_LEAVE_TYPES_URL);
          set({ leave_types: response.data });
        }
        catch(err){
          const errorMessage = err.response?.data?.meta?.message || "Server Error";
          toast.error(errorMessage);
        }
    }

}));

module.exports = { useLeaveTypeStore };
