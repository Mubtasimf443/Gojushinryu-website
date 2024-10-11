/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */

import { Router } from "express";
import { 
    getAdminMassageStatusAndNewMassaseForUser,
     getStudentMassageStatusAndNewMassaseForAdmin,
     sendMassageToAdminFromUser, 
     sendMassageToUserFromAdmin 
    } from "../_lib/api/chat.api";

let chateRouter = Router();

chateRouter.post('/send-massage-to-admin-from-student',sendMassageToAdminFromUser);
chateRouter.post('/send-massage-to-student-from-admin',sendMassageToUserFromAdmin);


//get
chateRouter.get('/get-admin-massage-status-and-massage',getAdminMassageStatusAndNewMassaseForUser);
chateRouter.get('/get-student-massage-status-and-massage',getStudentMassageStatusAndNewMassaseForAdmin);




export default chateRouter