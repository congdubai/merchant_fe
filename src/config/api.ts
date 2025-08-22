import axios from 'config/axios-customize';
import type { IAccount, IBackendRes, IGetAccount, IMerchant, IMerchantByYear, IMerchantHistory, IModelPaginate, IPermission, IRole, ITransaction, ITransactionSummary, IUser } from "../types/backend"


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
    return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', { username, password })
}


// export const callRegister = (name: string, email: string, password: string, age: number, gender: string, address: string) => {
//     return axios.post<IBackendRes<IUser>>('/api/v1/auth/register', { name, email, password, age, gender, address })
// }

// export const callLogin = (username: string, password: string) => {
//     return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', { username, password })
// }

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
    return axios.get<IBackendRes<IModelPaginate<IMerchant>>>(`/api/v1/merchants/search?${query}`)
}

export const callReportMerchantByYear = (year: string) => {
    return axios.get<IBackendRes<IMerchantByYear[]>>(`/api/v1/merchants/count-merchant-by-year?year=${year}`)
}

export const callExportMerchantByYear = (year: string) => {
    return axios.get(`/api/v1/merchants/export-merchant-year?year=${year}`, {
        responseType: "blob",
    });
};

export const callTransactionSummary = (fromDate: string, toDate: string) => {
    return axios.get<IBackendRes<IModelPaginate<ITransactionSummary>>>(`/api/v1/merchants/summary-transaction-by-merchant?fromDate=${fromDate}&toDate=${toDate}`)
}
export const callUpdateMerchant = (value: any) => {
    return axios.put<IBackendRes<IMerchant>>(`/api/v1/merchant/update`, {
        accountNo: value.accountNo,
        fullName: value.fullName,
        shortName: value.shortName,
        mcc: value.mcc,
        city: value.city,
        location: value.location,
        phoneNo: value.phoneNo,
        email: value.email,
        status: value.status,
        openDate: value.openDate,
        closeDate: value.closeDate,
        reason: value.reason
    })
}


/**
 *
Module merchantHistory
 */
export const callFetchMerchantsHistory = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IMerchantHistory>>>(`/api/v1/merchant/history?${query}`)
}


/**
 *
Module Transaction
 */
export const callExportTransactionSummary = (fromDate: string, toDate: string) => {
    return axios.get(`/api/v1/merchants/export-transactionSummary?fromDate=${fromDate}&toDate=${toDate}`, {
        responseType: "blob",
    });
};

export const callTransactionByMerchant = (merchantId: string, fromDate: string, toDate: string) => {
    return axios.get<IBackendRes<ITransaction[]>>(`/api/v1/merchants/fetch-transaction/${merchantId}?fromDate=${fromDate}&toDate=${toDate}`)

}

export const callExportTransactionByMerchant = (merchantId: string, fromDate: string, toDate: string) => {
    return axios.get(`/api/v1/merchants/export-transactionDetail/${merchantId}?fromDate=${fromDate}&toDate=${toDate}`, {
        responseType: "blob",
    });
};



/**
 * 
Module User
 */

export const callCreateUser = (user: IUser) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/users', {
        email: user.email,
        name: user.name,
        password: user.password,
        address: user.address,
        age: user.age,
        gender: user.gender,
        role: user.role
    })
}

export const callUpdateUser = (user: IUser) => {
    return axios.put<IBackendRes<IUser>>(`/api/v1/users`, { ...user })
}

export const callDeleteUser = (id: string) => {
    return axios.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`);
}

export const callFetchUser = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`);
}

/**
 * 
Module Permission
 */
export const callCreatePermission = (permission: IPermission) => {
    return axios.post<IBackendRes<IPermission>>('/api/v1/permissions', { ...permission })
}

export const callUpdatePermission = (permission: IPermission, id: string) => {
    return axios.put<IBackendRes<IPermission>>(`/api/v1/permissions`, { id, ...permission })
}

export const callDeletePermission = (id: string) => {
    return axios.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

export const callFetchPermission = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPermission>>>(`/api/v1/permissions?${query}`);
}

export const callFetchPermissionById = (id: string) => {
    return axios.get<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

/**
 * 
Module Role
 */
export const callCreateRole = (role: IRole) => {
    return axios.post<IBackendRes<IRole>>('/api/v1/roles', { ...role })
}

export const callUpdateRole = (role: IRole, id: string) => {
    return axios.put<IBackendRes<IRole>>(`/api/v1/roles`, { id, ...role })
}

export const callDeleteRole = (id: string) => {
    return axios.delete<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

export const callFetchRole = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${query}`);
}

export const callFetchRoleById = (id: string) => {
    return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}