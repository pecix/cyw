export interface EmployeeHistoryEntry {
    date: string;
    field: string;
    oldValue?: string;
    newValue?: string;
}

export interface Employee {
    firstName: string;
    lastName: string;
    pesel: string;
    birthDate: string;
    street: string;
    houseNumber: string;
    apartmentNumber?: string;
    zipCode: string;
    city: string;
    bankAccount?: string;
    history?: EmployeeHistoryEntry[];
    createdAt: string;
}
