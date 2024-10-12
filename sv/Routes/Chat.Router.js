/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */

import { Router } from "express";
import { 
    checkUserHasSendMassageOrNotTotheAdmin,
    getAdminMassageStatusAndNewMassaseForUser,
     getAdminMassageWhatIsSeen,
     getUserMassageListForAdmin,
     sendMassageToAdminFromUser, 
     sendMassageToUserFromAdmin 
    } from "../_lib/api/chat.api.js";
import userCheck from "../_lib/midlewares/User.check.js";
import morgan from "morgan";





let chateRouter = Router();
// chateRouter.use(morgan('dev'))


//POST REQUEST
chateRouter.post('/send-massage-to-admin-from-student',userCheck,sendMassageToAdminFromUser);
chateRouter.post('/send-massage-to-student-from-admin',sendMassageToUserFromAdmin);
chateRouter.post('/check-user-has-send-massage-or-not',checkUserHasSendMassageOrNotTotheAdmin);

//GET REQUEST
chateRouter.get('/get-admin-massage-status-and-massage',userCheck,getAdminMassageStatusAndNewMassaseForUser);
chateRouter.get('/get-user-massage-list',getUserMassageListForAdmin)
chateRouter.get('/get-admin-massage-what-is-seen',userCheck,getAdminMassageWhatIsSeen)


export default chateRouter