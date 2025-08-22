export interface IBackendRes<T> {
    errorDesc: errorDesc;
    errorCode: number | string;
    data?: T;
}

export interface IRequestBody<T> {
    requestId: string;
    requestTime: string;
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
            permissions: {
                id: string;
                name: string;
                apiPath: string;
                method: string;
                module: string;
            }[]
        }
    }
}

export interface IGetAccount extends Omit<IAccount, "access_token"> { }


export interface IUser {
    id?: string;
    name: string;
    email: string;
    password?: string;
    //avatar: string;
    age?: number;
    gender: string;
    phone?: number;
    address?: string;
    role?: {
        id: string;
        name?: string;
    }
    createdBy?: string;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
    access_token?: string;

}
export interface IRole {
    id?: string;
    name: string;
    description: string;
    active: boolean;
    permissions: IPermission[] | string[];

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
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
            permissions: {
                id: string;
                name: string;
                apiPath: string;
                method: string;
                module: string;
            }[]
        }
    }
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
    reason: string;
}
export interface IMerchantHistory {

    id: number;

    merchantId: string;

    accountNo: string;

    changedAt: string;

    changedBy: string;

    changeContent: string;

    reason: string;
}

export interface IMcc {
    code: string;
    description: string;
    descriptionEn?: string;
    active: boolean;
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

export interface ITransactionSummary {
    accountNo: string;
    merchantId: string;
    shortName: string;
    successCount: number;
    failedCount: number;
    timeoutCount: number;
    totalCount: number;
}

export interface ITransaction {
    coreRef: sting;
    transactionRef: string;
    traceNo: string;
    transactionDate: string;
    status: string;
    senderAccount: string;
    senderBank: string;
    receiverAccount: string;
}

export interface IString {
    data: string;
}
export interface IPermission {
    id?: string;
    name?: string;
    apiPath?: string;
    method?: string;
    module?: string;

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;

}

export interface IPermission {
    id?: string;
    name?: string;
    apiPath?: string;
    method?: string;
    module?: string;

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;

}