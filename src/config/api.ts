import axios from 'config/axios-customize';
import type { IAccount, IBackendRes, IGetAccount, IMcc, IMerchant, IModelPaginate, IUser } from "../types/backend"

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
    return axios.patch<IBackendRes<IMcc>>(`/api/v1/mcc/updateMcc/${code}`, data);
}

export const callDeleteMcc = (code: string) => {
    return axios.delete<IBackendRes<IMcc>>(`/api/v1/mcc/removeMcc/${code}`);
};