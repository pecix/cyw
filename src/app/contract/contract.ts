export interface Contract {
    id: string;
    firstName: string;
    lastName: string;
    pesel: string;
    birthDate: string;
    street: string;
    houseNumber: string;
    apartmentNumber?: string;
    zipCode: string;
    city: string;
    contractType: string;
    conclusionDate: string;
    position: string;
    workingTime: string;
    workplace: string;
    rate: number;
    seniorityAllowance: number;
    functionalAllowance: number;
    bankAccount: string;
    startDate: string;
    endDate: string;
    createdAt: string;
}
