import { model, Schema, Types } from "mongoose";
import { AcceptanceStatus } from "../enums/contract.enum";

const contractSchema = new Schema({
    _id: {
        type: Types.ObjectId,
    },
    student: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    advisor: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            min: 1,
            max: 512
        }
    },
    studentOne: {
        name: {
            type: String,
            required: true
        },
        ID: {
            type: String,
            required: true
        }
    },
    studentTwo: {
        name: {
            type: String,
            required: true
        },
        ID: {
            type: String,
            required: true
        }
    },
    acceptance: {
        type: Number,
        default: AcceptanceStatus.NOT_RESPONDED
    },
    isClosed: {
        type: Boolean,
        default: false
    },
    advisorForm: {
        _id: {
            type: Types.ObjectId,
        },
        advisorName: String,
        designation: String,
        department: String,
        qualification: String,
        specialization: String,
        contact: String,
        email: { 
            type: String, 
            unique: true,
            match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        },
        semester: Number,
        year: Number,
        program: String,
        creditHours: Number,
        compensation: Number,
        cost: Number,
        project: {
            name: {
                type: String,
            },
            description: {
                type: String,
                min: 1,
                max: 512
            }
        },
        tools: {
            hardware: String,
            software: String
        },
        studentOne: {
            name: {
                type: String,
            },
            ID: {
                type: String,
            }
        },
        studentTwo: {
            name: {
                type: String,
            },
            ID: {
                type: String,
            }
        },
        referenceNo: String
    },
    panel: {
        type: Types.ObjectId,
        ref: 'Panel',
    },
})

const Contract = model('Contract', contractSchema);

export default Contract;