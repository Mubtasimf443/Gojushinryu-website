/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */

export const log = (value) => console.log(value)
export  function Alert(params,res) {
    return res.json({error :params})
}
export function Success(res) {
     return res.json({success :true})
    
}














