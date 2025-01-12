/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/



export function shortCatch15(req,res,next) {
    res.set('Cache-Control', 'public, max-age=15');
    next()
}
export function shortCatch30(req,res,next) {
    res.set('Cache-Control', 'public, max-age=30');
    next()
}

export function shortCatch100(req,res,next) {
    res.set('Cache-Control', 'public, max-age=30');
    next()
}
export function hourlyCatch(req,res,next) {
    res.set('Cache-Control', 'public, max-age=3600');
    next()
}

export function longCatch(req,res,next) {
    res.set('Cache-Control', 'public, max-age=28800');//for 8 hourse
    next()
}


export function longCatch24(req,res,next) {
    res.set('Cache-Control', 'public, max-age=86400');
    next()
}

export function dayCatch7(req,res,next) {
    res.set('Cache-Control', 'public, max-age=604800');
    next()
}

export async function noCache(req,res,next) {
   res.set('Cache-Control', 'no-cache');
   next();
}