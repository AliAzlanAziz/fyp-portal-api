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
    }
})

const Contract = model('Contract', contractSchema);

export default Contract;