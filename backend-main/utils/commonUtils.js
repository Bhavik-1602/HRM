import mongoose from "mongoose";


 // Validate if userId is a valid MongoDB ObjectId
 
 export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
};

 // Get today's date in UTC (00:00:00)
 
export const getTodayDate = () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
}


export const getDateFilter = (start_date, end_date, month, year) => {
  let filter = {};
  if (start_date && end_date) {
    filter.date = {
      $gte: new Date(start_date),
      $lte: new Date(new Date(end_date).setUTCHours(23, 59, 59, 999)),
    };
  } else if (start_date) {
    filter.date = {
      $gte: new Date(start_date),
      $lte: new Date(new Date().setUTCHours(23, 59, 59, 999)),
    };
  } else {
    const now = new Date();
    const selected_month = month ? parseInt(month) - 1 : now.getUTCMonth();
    const selected_year = year ? parseInt(year) : now.getUTCFullYear();
    
    const first_day = new Date(Date.UTC(selected_year, selected_month, 1));
    const last_day = new Date(Date.UTC(selected_year, selected_month + 1, 0, 23, 59, 59));

    filter.date = { $gte: first_day, $lte: last_day };
  }
  return filter;
};


export const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("-");
  return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
};