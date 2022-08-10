import { AcceptanceStatus } from "../enums/contract.enum";

export class ContractModel  {
    id: String;
    student: String;
    advisor: String;
    project: {
        name: String,
        description: String
    };
    studentOne: {
        name: String,
        ID: String,
    };
    studentTwo: {
        name: String,
        ID: String,
    };
    acceptance: AcceptanceStatus;
    isClosed: Boolean;
}