// API base URL - change this in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Storage keys
const TOKEN_KEY = 'fems_token';
const USER_KEY = 'fems_user';

/**
 * Get stored authentication token
 */
export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
};

/**
 * Set authentication token
 */
export const setToken = (token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
    }
};

/**
 * Remove authentication token
 */
export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
};

/**
 * Get stored user data
 */
export const getUser = () => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    }
    return null;
};

/**
 * Set user data
 */
export const setUser = (user) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    return !!getToken();
};

/**
 * Default fetch options with authentication
 */
const getDefaultOptions = () => ({
    headers: {
        'Content-Type': 'application/json',
        ...(getToken() && { 'Authorization': getToken() }),
    },
});

/**
 * Handle API response
 */
const handleResponse = async (response) => {
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            // Token expired or invalid - clear auth
            removeToken();
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/signin';
            }
        }
        throw { status: response.status, message: data.message || data.msg || 'An error occurred', data };
    }
    
    return data;
};

/**
 * Generic API request function
 */
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = getDefaultOptions();
    
    const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    });
    
    return handleResponse(response);
};

// ============================================
// AUTH API
// ============================================

export const authAPI = {
    /**
     * Login user
     */
    login: async (email, password) => {
        const data = await apiRequest('/accounts/login/', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        
        if (data.token) {
            setToken(data.token);
            setUser(data);
        }
        
        return data;
    },
    
    /**
     * Register new user
     */
    register: async (userData) => {
        const data = await apiRequest('/accounts/register/', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        
        if (data.token) {
            setToken(data.token);
            setUser(data);
        }
        
        return data;
    },
    
    // OTP verification methods - commented out for development
    // /**
    //  * Verify OTP
    //  */
    // verifyOTP: async (username, phone, otp) => {
    //     return apiRequest('/accounts/verify-otp/', {
    //         method: 'POST',
    //         body: JSON.stringify({ username, phone, otp }),
    //     });
    // },
    // 
    // /**
    //  * Resend OTP
    //  */
    // resendOTP: async (phone) => {
    //     return apiRequest('/accounts/verify-otp/', {
    //         method: 'POST',
    //         body: JSON.stringify({ phone, resend_otp: 'resend_otp' }),
    //     });
    // },
    
    /**
     * Logout user
     */
    logout: () => {
        removeToken();
        if (typeof window !== 'undefined') {
            window.location.href = '/auth/signin';
        }
    },
    
    /**
     * Get current user profile
     */
    getProfile: async () => {
        return apiRequest('/accounts/profile/', { method: 'GET' });
    },
    
    /**
     * Update user profile
     */
    updateProfile: async (profileData) => {
        return apiRequest('/accounts/profile/', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    },
};

// ============================================
// CROPS API
// ============================================

export const cropsAPI = {
    /**
     * Get all crops
     */
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/crop/${queryString ? '?' + queryString : ''}`);
    },
    
    /**
     * Get single crop by ID
     */
    getById: async (id) => {
        return apiRequest(`/crop/${id}/`);
    },
    
    /**
     * Create new crop
     */
    create: async (cropData) => {
        return apiRequest('/crop/', {
            method: 'POST',
            body: JSON.stringify(cropData),
        });
    },
    
    /**
     * Update crop
     */
    update: async (id, cropData) => {
        return apiRequest(`/crop/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(cropData),
        });
    },
    
    /**
     * Delete crop
     */
    delete: async (id) => {
        return apiRequest(`/crop/${id}/`, { method: 'DELETE' });
    },
};

// ============================================
// PLOTS API
// ============================================

export const plotsAPI = {
    /**
     * Get all plots
     */
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/plot/plots/${queryString ? '?' + queryString : ''}`);
    },
    
    /**
     * Get single plot by ID
     */
    getById: async (id) => {
        return apiRequest(`/plot/plots/${id}/`);
    },
    
    /**
     * Create new plot
     */
    create: async (plotData) => {
        return apiRequest('/plot/plots/', {
            method: 'POST',
            body: JSON.stringify(plotData),
        });
    },
    
    /**
     * Update plot
     */
    update: async (id, plotData) => {
        return apiRequest(`/plot/plots/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(plotData),
        });
    },
    
    /**
     * Delete plot
     */
    delete: async (id) => {
        return apiRequest(`/plot/plots/${id}/`, { method: 'DELETE' });
    },
};

// ============================================
// WATER RESOURCES API
// ============================================

export const waterResourcesAPI = {
    /**
     * Get all water resources
     */
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/plot/water-resources/${queryString ? '?' + queryString : ''}`);
    },
    
    /**
     * Get single water resource by ID
     */
    getById: async (id) => {
        return apiRequest(`/plot/water-resources/${id}/`);
    },
    
    /**
     * Create new water resource
     */
    create: async (resourceData) => {
        return apiRequest('/plot/water-resources/', {
            method: 'POST',
            body: JSON.stringify(resourceData),
        });
    },
    
    /**
     * Update water resource
     */
    update: async (id, resourceData) => {
        return apiRequest(`/plot/water-resources/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(resourceData),
        });
    },
    
    /**
     * Delete water resource
     */
    delete: async (id) => {
        return apiRequest(`/plot/water-resources/${id}/`, { method: 'DELETE' });
    },
};

// ============================================
// CROP PLANNING API
// ============================================

export const cropPlanningAPI = {
    /**
     * Get all crop plans (crop-plots)
     */
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/crop/crop-plots/${queryString ? '?' + queryString : ''}`);
    },
    
    /**
     * Get single crop plan by ID
     */
    getById: async (id) => {
        return apiRequest(`/crop/crop-plots/${id}/`);
    },
    
    /**
     * Create new crop plan
     */
    create: async (planData) => {
        return apiRequest('/crop/crop-plots/', {
            method: 'POST',
            body: JSON.stringify(planData),
        });
    },
    
    /**
     * Update crop plan
     */
    update: async (id, planData) => {
        return apiRequest(`/crop/crop-plots/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(planData),
        });
    },
    
    /**
     * Delete crop plan
     */
    delete: async (id) => {
        return apiRequest(`/crop/crop-plots/${id}/`, { method: 'DELETE' });
    },
};

// ============================================
// CROP STOCKS API
// ============================================

export const cropStocksAPI = {
    /**
     * Get all crop stocks
     */
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/crop/stocks/${queryString ? '?' + queryString : ''}`);
    },
    
    /**
     * Get single crop stock by ID
     */
    getById: async (id) => {
        return apiRequest(`/crop/stocks/${id}/`);
    },
    
    /**
     * Create new crop stock
     */
    create: async (stockData) => {
        return apiRequest('/crop/stocks/', {
            method: 'POST',
            body: JSON.stringify(stockData),
        });
    },
    
    /**
     * Update crop stock
     */
    update: async (id, stockData) => {
        return apiRequest(`/crop/stocks/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(stockData),
        });
    },
    
    /**
     * Delete crop stock
     */
    delete: async (id) => {
        return apiRequest(`/crop/stocks/${id}/`, { method: 'DELETE' });
    },
};

// ============================================
// MACHINERY API
// ============================================

export const machineryAPI = {
    /**
     * Get all machinery
     */
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/crop/machinery/${queryString ? '?' + queryString : ''}`);
    },
    
    /**
     * Get single machinery by ID
     */
    getById: async (id) => {
        return apiRequest(`/crop/machinery/${id}/`);
    },
    
    /**
     * Create new machinery
     */
    create: async (machineryData) => {
        return apiRequest('/crop/machinery/', {
            method: 'POST',
            body: JSON.stringify(machineryData),
        });
    },
    
    /**
     * Update machinery
     */
    update: async (id, machineryData) => {
        return apiRequest(`/crop/machinery/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(machineryData),
        });
    },
    
    /**
     * Delete machinery
     */
    delete: async (id) => {
        return apiRequest(`/crop/machinery/${id}/`, { method: 'DELETE' });
    },
};

// ============================================
// MANPOWER API
// ============================================

export const manpowerAPI = {
    /**
     * Get all manpower
     */
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/crop/manpower/${queryString ? '?' + queryString : ''}`);
    },
    
    /**
     * Get single manpower by ID
     */
    getById: async (id) => {
        return apiRequest(`/crop/manpower/${id}/`);
    },
    
    /**
     * Create new manpower
     */
    create: async (manpowerData) => {
        return apiRequest('/crop/manpower/', {
            method: 'POST',
            body: JSON.stringify(manpowerData),
        });
    },
    
    /**
     * Update manpower
     */
    update: async (id, manpowerData) => {
        return apiRequest(`/crop/manpower/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(manpowerData),
        });
    },
    
    /**
     * Delete manpower
     */
    delete: async (id) => {
        return apiRequest(`/crop/manpower/${id}/`, { method: 'DELETE' });
    },
};

// ============================================
// FERTILIZERS API
// ============================================

export const fertilizersAPI = {
    /**
     * Get all fertilizers
     */
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/crop/fertilizers/${queryString ? '?' + queryString : ''}`);
    },
    
    /**
     * Get single fertilizer by ID
     */
    getById: async (id) => {
        return apiRequest(`/crop/fertilizers/${id}/`);
    },
    
    /**
     * Create new fertilizer
     */
    create: async (fertilizerData) => {
        return apiRequest('/crop/fertilizers/', {
            method: 'POST',
            body: JSON.stringify(fertilizerData),
        });
    },
    
    /**
     * Update fertilizer
     */
    update: async (id, fertilizerData) => {
        return apiRequest(`/crop/fertilizers/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(fertilizerData),
        });
    },
    
    /**
     * Delete fertilizer
     */
    delete: async (id) => {
        return apiRequest(`/crop/fertilizers/${id}/`, { method: 'DELETE' });
    },
};

// ============================================
// WHOLESALER API
// ============================================

export const wholesalerAPI = {
    /**
     * Get all wholesalers
     */
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/wholeseller/wholesalers/${queryString ? '?' + queryString : ''}`);
    },
    
    /**
     * Get single wholesaler by ID
     */
    getById: async (id) => {
        return apiRequest(`/wholeseller/wholesalers/${id}/`);
    },
    
    /**
     * Create transaction
     */
    createTransaction: async (transactionData) => {
        return apiRequest('/wholeseller/transactions/', {
            method: 'POST',
            body: JSON.stringify(transactionData),
        });
    },
    
    /**
     * Get transactions
     */
    getTransactions: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/wholeseller/transactions/${queryString ? '?' + queryString : ''}`);
    },
    
    /**
     * Get wholesaler crops/offers
     */
    getCrops: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/wholeseller/wholesaler-crops/${queryString ? '?' + queryString : ''}`);
    },
    
    /**
     * Get supply requests
     */
    getSupplyRequests: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/wholeseller/supply-requests/${queryString ? '?' + queryString : ''}`);
    },
    
    /**
     * Create supply request
     */
    createSupplyRequest: async (requestData) => {
        return apiRequest('/wholeseller/supply-requests/', {
            method: 'POST',
            body: JSON.stringify(requestData),
        });
    },
};

// ============================================
// FARM TASKS API
// ============================================

export const tasksAPI = {
    /**
     * Get all tasks
     */
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/crop/tasks/${queryString ? '?' + queryString : ''}`);
    },
    
    /**
     * Get single task by ID
     */
    getById: async (id) => {
        return apiRequest(`/crop/tasks/${id}/`);
    },
    
    /**
     * Create new task
     */
    create: async (taskData) => {
        return apiRequest('/crop/tasks/', {
            method: 'POST',
            body: JSON.stringify(taskData),
        });
    },
    
    /**
     * Update task
     */
    update: async (id, taskData) => {
        return apiRequest(`/crop/tasks/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(taskData),
        });
    },
    
    /**
     * Delete task
     */
    delete: async (id) => {
        return apiRequest(`/crop/tasks/${id}/`, { method: 'DELETE' });
    },
};

// ============================================
// RESOURCES API (Library)
// ============================================

export const resourcesAPI = {
    /**
     * Get all resources
     */
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/crop/resources/${queryString ? '?' + queryString : ''}`);
    },
    
    /**
     * Get single resource by ID
     */
    getById: async (id) => {
        return apiRequest(`/crop/resources/${id}/`);
    },
    
    /**
     * Create new resource
     */
    create: async (resourceData) => {
        return apiRequest('/crop/resources/', {
            method: 'POST',
            body: JSON.stringify(resourceData),
        });
    },
    
    /**
     * Update resource
     */
    update: async (id, resourceData) => {
        return apiRequest(`/crop/resources/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(resourceData),
        });
    },
    
    /**
     * Delete resource
     */
    delete: async (id) => {
        return apiRequest(`/crop/resources/${id}/`, { method: 'DELETE' });
    },
};

// ============================================
// MARKET PRICES API
// ============================================

export const marketPricesAPI = {
    /**
     * Get all market prices
     */
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/crop/market-prices/${queryString ? '?' + queryString : ''}`);
    },
    
    /**
     * Get single market price by ID
     */
    getById: async (id) => {
        return apiRequest(`/crop/market-prices/${id}/`);
    },
    
    /**
     * Create new market price
     */
    create: async (priceData) => {
        return apiRequest('/crop/market-prices/', {
            method: 'POST',
            body: JSON.stringify(priceData),
        });
    },
    
    /**
     * Update market price
     */
    update: async (id, priceData) => {
        return apiRequest(`/crop/market-prices/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(priceData),
        });
    },
    
    /**
     * Delete market price
     */
    delete: async (id) => {
        return apiRequest(`/crop/market-prices/${id}/`, { method: 'DELETE' });
    },
};

export default {
    authAPI,
    cropsAPI,
    plotsAPI,
    waterResourcesAPI,
    cropPlanningAPI,
    cropStocksAPI,
    machineryAPI,
    manpowerAPI,
    fertilizersAPI,
    wholesalerAPI,
    tasksAPI,
    resourcesAPI,
    marketPricesAPI,
    getToken,
    setToken,
    removeToken,
    getUser,
    setUser,
    isAuthenticated,
};
