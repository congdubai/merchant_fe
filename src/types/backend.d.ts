export interface IBackendRes<T> {
    message: errorDesc;
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
}

export interface IMerchant {
    merchantId: string;
    accountNo: string;
    fullName: string;
    short_name: string;
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