/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/


import mongoose from 'mongoose';

const seminarSchema = new mongoose.Schema({
    id: { 
        type: Number, 
        default: Date.now(),
    },
    title: { type: String,
        required: true, 
        trim: true,
        set : (title ='') => {
            title = title.trim();
            (title.length > 67) && (title = title.slice(0, 67) + ' ...');
            return title;
        }
    },
    description: {
        type: String,
        required: true,
        trim: true,
        set: (data = '') => {
            data = data.trim();
            (data.length > 1000) && (data = data.slice(0, 1000) + ' ...');
            return data;
        }
    },
    location: { type: String, required: true, trim: true, default :'Edmonton,Canada' },
    instructor: {
        name: { 
            type: String, 
            required: true ,
            default :'Sensei Varun Jettly',
            trim: true
        },
    },
    date: { type: String, required: true, default: E => (Date.now() + 3600 * 24 * 30 * 1000) },
    time : { 
        type: String, 
        trim: true,
        set: (time = '') => {
            time =time.trim();
            if (time.length !== 5 &&  time.length !== 7) throw 'time is not correct';
            if (time.length === 5) {
                if (time.slice(0, 2) == 0) {
                    time = '12' + time.slice(2) + 'AM';
                    return time;
                }
                if (time.slice(0, 2) < 12) {
                    time = time+'AM';
                    return time;
                }
                if (time.slice(0, 2) >= 12) {
                    time = (time.slice(0, 2) - 12) +   time.slice(2) + 'PM';
                    return time;
                }
            }
            else return time;
            
        } 
    },
    imageUrl: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
});

export const Saminars = mongoose.model('Seminar', seminarSchema);
export default Saminars;