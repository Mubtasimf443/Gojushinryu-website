/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    id: {
        type: Number,
        default: Date.now
    },
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique :true,
    },
    dateOfBirth: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    thumbUrl: {
        type: String,
        trim: true,
    },
    approved_by_admin: {
        type: Boolean,
        default: false
    },
    last_admin_approved: {
        type: Number,
        validate: {
            validator: function (v) {
                if (this.approved_by_admin === true && v === undefined) return false;
                return true;
            },
            message: function (props) {
                return (`${props.value} is not a valid last_admin_approved time!`);
            }
        },
    },
    payment_data: {
        payment_method: {
            type: String,
            trim: true,
            enum: { 
                values: ['paypal', 'stripe'],
                message: '{VALUE} is not supported' 
            }
        },
        isPaymentCompleted: {
            type: Boolean,
            default: false,
            required: true
        },
        paypal_session: {
            type: String,
            trim: true
        },
        stripe_session: {
            type: String,
            trim: true
        },
        paymentDate: Date,
        paymentDateNum: Number,
        paymentRequestInfo: {
            isPaymentRuquested: {
                type: Boolean,
                default: false,
            },
            paymentRequestedDate: Date,
            paymentRequestedDateNum: Number
        },
        paymentAmount: {
            type: Number,
        },
        paymentGST: {
            type: Number,
        },
        paymentTotal: {
            type: Number,
        },
        payment_id: {
            type: Number,
            unique : true ,
            index :true,
            default: () => Math.round(Number(Date.now() + '' + Math.random() * 100000)), 
        }
    }
})

const CountryRepresentatives = mongoose.model('countryRepresentatives', schema);

export default CountryRepresentatives;