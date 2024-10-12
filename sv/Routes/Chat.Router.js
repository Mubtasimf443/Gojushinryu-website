/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */

import { Router } from "express";
import { 
    getAdminMassageStatusAndNewMassaseForUser,
     getStudentMassageStatusAndNewMassaseForAdmin,
     getUserMassageListForAdmin,
     sendMassageToAdminFromUser, 
     sendMassageToUserFromAdmin 
    } from "../_lib/api/chat.api.js";
import userCheck from "../_lib/midlewares/User.check.js";
import morgan from "morgan";





let chateRouter = Router();
chateRouter.use(morgan('dev'))


//POST REQUEST
chateRouter.post('/send-massage-to-admin-from-student',userCheck,sendMassageToAdminFromUser);
chateRouter.post('/send-massage-to-student-from-admin',sendMassageToUserFromAdmin);

//GET REQUEST
chateRouter.get('/get-admin-massage-status-and-massage',userCheck,getAdminMassageStatusAndNewMassaseForUser);
chateRouter.get('/get-student-massage-status-and-massage',getStudentMassageStatusAndNewMassaseForAdmin);
chateRouter.get('/get-user-massage-list',getUserMassageListForAdmin)



export default chateRouter