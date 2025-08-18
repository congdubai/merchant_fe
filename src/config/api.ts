import axios from 'config/axios-customize';
import type { IAccount, IBackendRes, IGetAccount, IMcc, IMerchant, IMerchantByYear, IModelPaginate, IString, ITransaction, ITransactionSummary, IUser } from "../types/backend"
import dayjs from 'dayjs';

const getDefaultParams = () => ({
    requestId: `MC-${crypto.randomUUID()}`,
    requestTime: dayjs().format("YYYY-MM-DD HH:mm:ss"), // GMT+7
});

/**
 *
Module auth
 */

export const sendOTP = (email: string) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/auth/register', { email })
}
export const registerAPI = (fullName: string, email: string, password: string, otp: string, confirmPassword: string) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/auth/otp/register', { fullName, email, password, otp, confirmPassword })
}

export const loginAPI = (username: string, password: string) => {
    console.log("đã chạy vô đây chơi api", username, password);
    return axios.post<IBackendRes<IUser>>('/api/v1/auth/login', { username, password })
}


export const callRegister = (name: string, email: string, password: string, age: number, gender: string, address: string) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/auth/register', { name, email, password, age, gender, address })
}

export const callLogin = (username: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', { username, password })
}

export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>('/api/v1/auth/account')
}

export const callRefreshToken = () => {
    return axios.get<IBackendRes<IAccount>>('/api/v1/auth/refresh')
}

export const callLogout = () => {
    return axios.post<IBackendRes<string>>('/api/v1/auth/logout')
}

/**
 *
Module Merchant
 */
export const callFetchMerchants = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IMerchant>>>(`/api/v1/merchants?${query}`)
}

export const callSearchMerchants = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IMerchant>>>(`/api/v1/merchants/search?${query}`, {
        params: {
            ...getDefaultParams()
        }
    });
}

export const callReportMerchantByYear = (year: string) => {
    return axios.get<IBackendRes<IMerchantByYear[]>>("/api/v1/merchants/count-merchant-by-year", {
        responseType: "blob",
        params: {
            ...getDefaultParams(),
            year
        }
    });
}

export const callExportMerchantByYear = (year: string) => {
    return axios.get("/api/v1/merchants/export-merchant-year", {
        responseType: "blob",
        params: {
            ...getDefaultParams(),
            year
        }
    });
};

export const callTransactionSummary = (fromDate: string, toDate: string) => {
    return axios.get<IBackendRes<ITransactionSummary[]>>("/api/v1/merchants/summary-transaction-by-merchant", {
        params: {
            ...getDefaultParams(),
            fromDate,
            toDate,
        }
    })
}

export const callCreateMerchant = (data: IMerchant) => {
    return axios.post<IBackendRes<IMerchant>>(`/api/v1/merchant/create`, data)
}

export const callImportMerchants = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post<IBackendRes<IString>>('/api/v1/merchant/import/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const getSampleFileUrl = (): string => {
    return 'http://localhost:8080/api/v1/merchant/export/sample';
}

/**
 *
Module Transaction
 */
export const callExportTransactionSummary = (fromDate: string, toDate: string) => {
    return axios.get("/api/v1/merchants/export-transactionSummary", {
        responseType: "blob",
        params: {
            ...getDefaultParams(),
            fromDate,
            toDate,
        }
    });
};

export const callTransactionByMerchant = (merchantId: string, fromDate: string, toDate: string) => {
    return axios.get<IBackendRes<ITransaction[]>>(`/api/v1/merchants/fetch-transaction/${merchantId}`, {
        params: {
            fromDate,
            toDate,
            ...getDefaultParams(),
        }
    });
}

export const callExportTransactionByMerchant = (merchantId: string, fromDate: string, toDate: string) => {
    return axios.get(`/api/v1/merchants/export-transactionDetail/${merchantId}`, {
        responseType: "blob",
        params: {
            fromDate,
            toDate,
            ...getDefaultParams(),
        }
    });
};
/**
 *
Module Mcc
 */
export const callFetchMccs = (query: string) => {
    return axios.get(`/api/v1/mcc/getAllMcc?${query}`);
};

export const callCreateMcc = (data: IMcc) => {
    return axios.post<IBackendRes<IMcc>>('/api/v1/mcc/createMcc', data);
}

export const callUpdateMcc = (data: Omit<IMcc, 'code'>, code: string) => {
    return axios.put<IBackendRes<IMcc>>(`/api/v1/mcc/updateMcc/${code}`, data);
}

export const callDeleteMcc = (code: string) => {
    return axios.delete<IBackendRes<IMcc>>(`/api/v1/mcc/removeMcc/${code}`);
};

