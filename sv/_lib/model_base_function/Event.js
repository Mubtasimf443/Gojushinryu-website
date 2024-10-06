/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  InshaAllah 
*/
import { Events } from "../models/Event.js";


export async function UploadEventApi(req, res) {
    try {
    function alert(value, status =400) {
      res.status(status).json({error :value })
    }
    let {name,description,thumb,event_date,images} = req.body;
    let EmtyTestArray = [name, description,thumb,event_date,images];
    let EmtyTestArrayScore = EmtyTestArray.findIndex(el => !el )
    if (EmtyTestArrayScore !== -1)  return alert('Please Fill the Form');
    if (images.length) return alert('Need To Upload Only One Image Must'); 
    if (name.trim().length < 15  ) return alert('Name is very Small ');
    if (description.trim().length <50) return alert('description is very Small ');
    if (date.trim().length <3) return alert('date is not valid');
    Event.create({
      name,description,date, thumb, images
    }).then(e => res.status(201)
    .json({
      success : true
    }))
    } catch (e) {
        log(e);
        alert('failed To create Event')
    }
  }
  