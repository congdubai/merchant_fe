export const ALL_PERMISSIONS = {
    MERCHANT: {
        GET_MERCHANT: { method: "GET", apiPath: '/api/v1/merchants', module: "MERCHANT" },
        CREATE: { method: "POST", apiPath: '/api/v1/companies', module: "MERCHANT" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/merchant/update', module: "MERCHANT" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/companies/{id}', module: "MERCHANT" }
    },
    MERCHANT_EXPORT: {
        GET_SUMMARY_TRANSACTION_BY_MERCHANT: { method: "GET", apiPath: '/api/v1/merchants/summary-transaction-by-merchant', module: "merchant-controller" },
        SEARCH: { method: "GET", apiPath: '/api/v1/merchants/search', module: "merchant-controller" },
        REPORT_BY_STATUS: { method: "GET", apiPath: '/api/v1/merchants/report-by-status', module: "merchant-controller" },
        FETCH_TRANSACTION: { method: "GET", apiPath: '/api/v1/merchants/fetch-transaction/{merchantId}', module: "merchant-controller" },
        EXPORT_TRANSACTION_SUMMARY: { method: "GET", apiPath: '/api/v1/merchants/export-transactionSummary', module: "merchant-controller" },
        EXPORT_TRANSACTION_DETAIL: { method: "GET", apiPath: '/api/v1/merchants/export-transactionDetail/{merchantId}', module: "merchant-controller" },
        EXPORT_MERCHANT_YEAR: { method: "GET", apiPath: '/api/v1/merchants/export-merchant-year', module: "merchant-controller" },
        COUNT_MERCHANT_BY_YEAR: { method: "GET", apiPath: '/api/v1/merchants/count-merchant-by-year', module: "merchant-controller" },
    },
    MERCHANT_HISTORY: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/merchant-histories', module: "MERCHANT_HISTORY" }
    },
    PERMISSIONS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        CREATE: { method: "POST", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/permissions/{id}', module: "PERMISSIONS" },
    },

    ROLES: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/roles', module: "ROLES" },
        CREATE: { method: "POST", apiPath: '/api/v1/roles', module: "ROLES" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/roles', module: "ROLES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/roles/{id}', module: "ROLES" },
    },
    USERS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/users', module: "USERS" },
        CREATE: { method: "POST", apiPath: '/api/v1/users', module: "USERS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/users', module: "USERS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/users/{id}', module: "USERS" },
    },
}

export const ALL_MODULES = {
    MERCHANT: 'MERCHANT',
    FILES: 'FILES',
    MERCHANT_HISTORY: 'MERCHANT_HISTORY',
    PERMISSIONS: 'PERMISSIONS',
    ROLES: 'ROLES',
    USERS: 'USERS',
    SUBSCRIBERS: 'SUBSCRIBERS'
}