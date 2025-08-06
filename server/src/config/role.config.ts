export const ROLE_HIERARCHY = {
    'SUPER ADMIN': ['ADMIN', 'EMPLOYEE', 'CUSTOMER'],
    'ADMIN': ['EMPLOYEE', 'CUSTOMER'],
    'EMPLOYEE': ['CUSTOMER'],
    'CUSTOMER': [],
};

export const ROLES = ['SUPER ADMIN', 'ADMIN', 'EMPLOYEE', 'CUSTOMER'] as const; 