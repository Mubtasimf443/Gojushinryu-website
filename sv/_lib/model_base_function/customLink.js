/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import CustomLink from "../models/customLink.js";
import crypto from 'crypto';
import { mailer } from "../utils/mailer.js";
import { BASE_URL, FROM_EMAIL } from "../utils/env.js"; 
import { log } from "console";
import { User } from "../models/user.js";




export async function createCustomLink(req, res) {
    log(req.body)
    try {
        let membershipName = ['Goju Shin Ryu International Metial Arts', "School of Traditional Martial Arts International"];
        let courseNames = [
            "Our Regular classes",
            "Our Online classes",
            "Our Seminar's",
            "Our Women Defence classes",
            "Bhangra Fitness Class for all ages" 
        ];

        let { type, emails, expiringDate } = req.body;
        log('stage 1')
        if ((emails instanceof Array) === false) return res.sendStatus(400)
        if (typeof expiringDate !== 'number') return res.sendStatus(400)
        if (type !== 'membership' && type !== 'course') return res.sendStatus(400)
        log('stage 2')
        if (type === 'membership') {
            log('stage 3')
            let { membership } = req.body;
            if (typeof membership !== 'object') return res.sendStatus(400)
            let { name, price } = membership;
            log('stage 4')
            if (typeof name !== 'string' || typeof membership.type !== 'string' ) return res.sendStatus(400)
            if (membership.type !== 'Annual' && membership.type !== 'LifeTime') return res.sendStatus(400);
            if (name !== membershipName[0] && name !== membershipName[1]) return res.sendStatus(400);
            if (price.toString() === 'NaN') return res.sendStatus(400);
            log('stage 5');
            let link = await createMembershipLink({
                name,
                type: membership.type,
                price,
                expiringDate
            });
            if (!link) return res.sendStatus(500);
            await customLinkEmail({
                emails,
                type: req.body.type,
                expiringDate,
                name,
                price,
                link
            });
            return res.status(201).json({
                link: BASE_URL + link
            })
        }
        if (type === 'course') {
            log('stage 2')
            let { course } = req.body;
            if (typeof course !== 'object') return res.sendStatus(400)
            let { name, price } = course;
            if (typeof name !== 'string') return res.sendStatus(400)
            // if (typeof price !== 'number') return res.sendStatus(400)
            log('stage 3')
            if (price.toString() === 'NaN') return res.sendStatus(400);
            let cousreIndex=courseNames.findIndex(el => el === name)
            if ( cousreIndex === -1) return res.sendStatus(400)
            let link = await createCourseLink({ name, price, expiringDate,cousreIndex })
            if (!link) return res.sendStatus(500);
            await customLinkEmail({
                emails,
                type: req.body.type,
                expiringDate,
                name,
                price,
                link
            });
            log('stage 4')
            return res.status(201).json({
                link: BASE_URL + link
            })
        }

    } catch (error) {
        console.log({ error });
        return res.sendStatus(500)
    }
}
async function createMembershipLink(options) {
    try {
        let { name, price, type, expiringDate } = options;
        let customLink = new CustomLink({
            custom_link_type: 'membership',
            membership: {
                membership_name: name,
                membership_type: type,
                membership_price: price
            },
            linkActivated: true,
            expiringDate: expiringDate,
        });
        let link = await customLink.save().then(
            function (data) {
                return '/custom-links/memberships/' + data.unique_id
            }
        );
        return link;
    } catch (error) {
        console.error(error);
        return false
    }
}
async function createCourseLink(options, response) {
    try {
        let { name, price, expiringDate,cousreIndex } = options;
        let customLink = new CustomLink({
            custom_link_type: 'course',
            course: {
                name: name,
                price: price,
                cousre_id :cousreIndex+1
            },
            linkActivated: true,
            expiringDate: expiringDate,
        });
        let link = await customLink.save()
            .then(
                function (data) {
                    return '/custom-links/courses/' + data.unique_id
                }
            );


        
        return link;
    } catch (error) {
        console.error(error);
        return false
    }
}
async function customLinkEmail(options) {
    log('email sending started')
    try {
        let {
            emails,
            type,
            link,
            expiringDate,
            name,
            price
        } = options;
        let rejectedEmails=[];
        emails = emails.filter(
            function (element) {
                if (element != false && typeof element === 'string') {
                    if (element.includes('@')) {
                        if (element.includes('.')) {
                            if (element.split('.')[1].length < 6) {
                                return element
                            } else if (element.split('.')[1].length >= 6) {
                                rejectedEmails.push(element)
                            }
                        } else if (!element.includes('.')) {
                            rejectedEmails.push(element)
                        }
                    } else if (!element.includes('@')) {
                        rejectedEmails.push(element)
                    }
                } else if (element == false || typeof element !== 'string') {
                    rejectedEmails.push(element)
                }
            }
        );

        // log({rejectedEmails})
        if (emails.length === 0) return
        for (let index = 0; index < emails.length; index++) {
            let to = emails[index]
            await mailer.sendMail({
                from: FROM_EMAIL,
                to: to,
                subject: type === 'membership' ? 'Special offer of Memberships' : 'Special offer of Course',
                html: `
                <p style="font-size: 21px;font-weight: 500;">
                You have Special offer of ${type === 'membership' ? ' Memberships' : 'Course'} what will be available for ${new Date(expiringDate).toDateString()} and the new price of ${name} is ${price}.00$ ,
                <br>
                Please Enroll ${type === 'membership' ? ' Memberships' : 'Course'} before ${new Date(expiringDate).toDateString()},
                </p> ,
                <a href="${BASE_URL + link}">${BASE_URL + link}</a>
                `
            })
                .catch(
                    function (error) {
                        log(error)
                    }
                );
        }
    } catch (error) {
        log({ error })
    }
}



export async function findCustomLinks(req,res){
    try {
        let links =await CustomLink.find({});
        return res.status(200).json({links});
    } catch (error) {
        console.error(error);
        return res.sendStatus(400)
    }
}


export async function deleteCustomLink(req,res) {
    try {
        if (typeof req.body.unique_id !=='number') return res.sendStatus(400)
        if (req.body.unique_id.toString()==='NaN') return res.sendStatus(400)
        CustomLink.findOneAndDelete({unique_id:req.body.unique_id})
        .then(
            function() {
                res.sendStatus(200)
            }
        )
        .catch(
            function() {
                return res.sendStatus(400)
            }
        )
    } catch (error) {
        console.error({error});
        return res.sendStatus(400)
    }
}



export async function enableCustomLink(req,res) {
    try {
        if (typeof req.body.unique_id !=='number') return res.sendStatus(400)
        if (req.body.unique_id.toString()==='NaN') return res.sendStatus(400);
        let link=await CustomLink.findOne({unique_id :req.body.unique_id});
        if (link) {
            if (link.linkActivated===true) return res.sendStatus(200);
            if (link.linkActivated !== true) {
                link.linkActivated = true;
                await link.save();
                return res.sendStatus(200);
            }
        }
        if (!link) return res.sendStatus(304)
    } catch (error) {
        console.error({error});
        return res.sendStatus(400)
    }
}
export async function disableCustomLink(req,res) {
    try {
        if (typeof req.body.unique_id !=='number') return res.sendStatus(400)
        if (req.body.unique_id.toString()==='NaN') return res.sendStatus(400);
        let link=await CustomLink.findOne({unique_id :req.body.unique_id});
        if (link) {
            if (link.linkActivated===false) return res.sendStatus(200);
            if (link.linkActivated === true) {
                link.linkActivated = false;
                await link.save();
                return res.sendStatus(200);
            }
        }
        if (!link) return res.sendStatus(304)
    } catch (error) {
        console.error({error});
        return res.sendStatus(400)
    }
}







export default async function customLinkPage(req,res) {
    try {
        let {type ,unique_id }=req.params;
        // log(req.params)
        if(!type || !unique_id) {
            log('!type || !unique_id')
            return res.status(500).send('Server Error');
        }
        if (type !== 'memberships' && type !== 'courses') {
            log(`type !=='memberships' && type !== 'courses'`)
            return res.redirect('/404');
        }
        if (Number(unique_id).toString()==='NaN') {
            log(`Number(unique_id).toString()==='NaN'`)
            return res.redirect('/404');
        }
        let customLink=await CustomLink.findOne({unique_id});
        if (!customLink) {
            log('!customLink')
            return res.redirect('/404');
        }
        if (customLink.linkActivated===false) {
            log('!customLink.linkActivated')
            return res.redirect('/404');
        }
        if (type === 'memberships') {
            if (typeof customLink.membership!=='object') {
                log(`typeof customLink.membership!=='object'`)
                return res.redirect('/404');
            }
            let {
                membership_name,
                membership_type ,
                membership_price 
            }=customLink.membership;
            return res.render('customLinkMemberhsip', {
                membership_name,
                membership_type ,
                membership_price ,
                expiringDate :new Date(customLink.expiringDate).toDateString(),
                CustomMembershipId :customLink.unique_id
            })
        }
        if (type === 'courses') {
            if (typeof customLink.course!=='object') return res.redirect('/404');
            let courseData=[
                {
                    img :"/img/2821.jpg",
                    name :'Our Martial Art Regular Classes',
                    description :'Our flagship Regular Classes are the cornerstone of our academy, meticulously designed to cater to individuals of all skill levels—from beginners to advanced practitioners. Our expert instructors bring years of experience and deep-rooted knowledge to teach traditional martial arts forms, practical self-defense techniques, and advanced sparring methods.',
                    id :1
                }, 
                {
                    img :"/img/img1.webp",
                    name :'Our Martial Art Online Classes',
                    description :"Embracing the digital age, our Online Classes allow students worldwide to access world-class martial arts training from the comfort of their homes. Whether you’re a beginner or a seasoned martial artist, our virtual sessions are carefully crafted to provide an authentic experience.",
                    id :2
                },
                {
                    img :"/img/abs-slide/slide32.jpg",
                    name :"Our Seminar's",
                    description :"Our Seminars are exclusive, one-of-a-kind learning opportunities that go beyond traditional classroom settings. Conducted by our senior instructors and special guest martial arts masters, these seminars are designed to deepen your knowledge and refine your skills.",
                    id :3
                },
                {
                    img :"/img/12334.jpg",
                    name :'Our Women Defence Martial classes',
                    description :"Empowerment lies at the heart of our Women’s Defense Martial Classes, a specialized program tailored to address the unique challenges women face in today’s world. These classes emphasize practical self-defense techniques and situational awareness to build confidence and personal safety.",
                    id :4
                },
                {
                    img :"/img/3101.jpg",
                    name :'Bhangra Fitness Class for all ages',
                    description :"For those seeking a fun, high-energy workout, our Bhangra Fitness Classes combine traditional Punjabi dance with modern fitness routines. Suitable for all ages and fitness levels, this program blends culture, cardio, and rhythm into an exhilarating experience.",
                    id :5,
                },
            ];

            let usableCourseData=courseData.find(
                function(element) {
                    if (element.id ===customLink.course.cousre_id ) return element
                }
            ) 


            return res.render('custom-course', {
                name :customLink.course.name,
                img:usableCourseData.img,
                price :customLink.course.price,
                description :usableCourseData.description,
                customCourseId :customLink.unique_id
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            hasError :true,
            error 
        })
    }
}