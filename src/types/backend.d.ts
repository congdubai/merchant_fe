export interface IBackendRes<T> {
    errorDesc: errorDesc;
    errorCode: number | string;
    data?: T;
}
export interface IModelPaginate<T> {
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: T[]
}

export interface IAccount {
    access_token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: {
            id: string;
            name: string;
        }
        age?: number;
        address?: string;
        avatar?: string;
        phone?: number;
        gender?: string;
    }
}
export interface IGetAccount extends Omit<IAccount, "access_token"> { }


export interface IUser {
    id?: string;
    name: string;
    email: string;
    password?: string;
    avatar: string;
    age?: number;
    gender: string;
    phone?: number;
    address?: string;
    role?: {
        id: string;
        name: string;
    }
    createdBy?: string;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
    access_token?: string;
}

export interface IMerchant {
    merchantId: string;
    accountNo: string;
    fullName: string;
    shortName: string;
    mcc: string;
    city: string;
    location: string;
    phoneNo: number;
    email: string;
    status: string;
    openDate?: string;
    closeDate?: string;
    branchCode: string;
    updatedAt?: string;
    createdBy: string;
    updatedBy?: string;
}

export interface IMerchantByYear {
    status: string;
    thang01: number;
    thang02: number;
    thang03: number;
    thang04: number;
    thang05: number;
    thang06: number;
    thang07: number;
    thang08: number;
    thang09: number;
    thang10: number;
    thang11: number;
    thang12: number;
}