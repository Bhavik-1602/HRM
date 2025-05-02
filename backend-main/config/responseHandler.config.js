export const sendSuccessResponse = (status, data = null, message, token = "", pagination = null) => {
    if (token) {
      return {
        data,
        meta: {
          code: 1,
          status,
          message: message.trim(),
          token,
          ...(pagination && { 
            pagination: {
                limit: pagination.limit || 10,
                totalItems: pagination.totalItems || 0,
                totalPages: pagination.totalPages || 1
            }
        }),
        },
      };
    } else {
      return {
        data,
        meta: {
          code: 1,
          status,
          message: message.trim(),
          ...(pagination && { 
            pagination: {
                limit: pagination.limit || 10,
                totalItems: pagination.totalItems || 0,
                totalPages: pagination.totalPages || 1
            }
        }),
        },
      };
    }
  };
  
export const sendErrorResponse = (status, data = null, message) => {
    return {
      data,
      meta: {
        code: 0,
        status,
        message: message.trim(),
      },
    };
  };
  
  