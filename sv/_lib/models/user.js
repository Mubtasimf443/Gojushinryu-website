/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import mongoose, { Mongoose } from "mongoose";


const PrimaryDetails = {
    name: {
        type: String,      
    },
    date_of_birth: String,
    age: Number,
    gender: {
        type:
            String,

        default: 'male'
    },
    first_name: {
        type: String,
        
    },
    last_name: {
        type: String,
        
    },
    email: {
        type: String,

        unique: true
    },
    phone: {
        type: Number,

        unique: true
    },
    country: {

        type: String
    },
    district: String,
    city: String,
    street: String,
    postCode: Number,
}
const additionalDetails = {
    thumb: { type: String, default: 'https://gojushinryu.com/img/avatar.png' },
    bio: {
        type: String,

        default: 'I dream to become black belt in karate and Master Martial Arts'
    },
    isMember: {

        type: Boolean,
        default: false
    },
    isGojushinryuMember: Boolean,
    memberShipArray: [{
        _id: {
            // ref: 'Membership',
            type: mongoose.SchemaTypes.ObjectId
        },
        id: Number,
        membership: String,
        Organization: String,
        name: String,
    }],
    enrolled_course: [{
        id: {
            type: Number// type :mongoose.SchemaTypes.ObjectId,
            // ref :"Course",
        },
        paid: {
            type: Boolean,
        },
        courseEnrollMentID: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'CourseEnrollments',
        }
    }],
}
const notificationsAndMsg = {
    notification: [{
        id: {
            type: Number,
            default: Date.now
        },
        title: String,
        massage: String,
        viewed: {
            type: Boolean,
            default: false
        }
    }],
    not_seen_massage: [{
        name: {
            type: String,
            default: 'Sensei Varun Jettly'
        },
        massage: String,
        data_as_number: {
            type: Number,
            default: Date.now
        }
    }],
    seen_massage: [{
        name: {
            type: String,
            default: 'Sensei Varun Jettly'
        },
        massage: String,
        data_as_number: {
            type: Number,
            default: Date.now
        }
    }]
}
const auth = {
    password: {
        type: String,
    },
    joining_date: {
        default: Date.now,
        type: Number,
    },
    isRegistered: Boolean,

    pin: Number,

    //For reseting the password
    resetingThePassword: {
        type: Boolean,

        default: false
    },
    resetingThePasswordOTP: {
        type: Number,

        default: 0
    },
    banned: {
        type: Boolean,
        default: false,

    },

}
const social_media_details = {
    facebook: {
        hasDetails: {
            type: Boolean,
            default: false
        },
        account: String,
    },
    linkedin: {
        hasDetails: {
            type: Boolean,
            default: false
        },
        account: String,
    },
    twitter: {
        hasDetails: {
            type: Boolean,
            default: false
        },
        account: String,
    },
    instagram: {
        hasDetails: {
            type: Boolean,
            default: false
        },
        account: String,
    }
}

let schema = new mongoose.Schema({
    id: {
        type: Number,
        default: Date.now
    },
    ...additionalDetails,
    ...PrimaryDetails,
    ...auth,
    ...notificationsAndMsg,
    social_media_details,
})



export const User = mongoose.model('User', schema);
export default User;