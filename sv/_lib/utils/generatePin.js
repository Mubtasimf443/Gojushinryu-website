/*

بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ 
InshaAllah 

*/ 

export const generatePin =async (val) => {
  if (typeof val!== 'number') return generatePin(
    Math.floor(Math.random()* 999999)
    )
  if ( val > 99999 &&  val < 1000000) return val
  return generatePin(
    Math.floor(Math.random() * 999999)
  )
}






