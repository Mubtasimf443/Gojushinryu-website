/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

export default function catchError(res, error) {
    console.error(error);
    if (typeof error === 'string') {
        return res.status(500).json({
            error: {
                massage: error
            }
        })
    }
    return res.status(500).json({
        error: error
    })
}

export function namedErrorCatching(type, error) {
    if (typeof error !== 'object') {
        throw {
            type,
            massage :error
        }
    }
    throw {
        type,
        ...error
    }
} 