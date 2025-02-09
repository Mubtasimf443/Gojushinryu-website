/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { log } from "string-player";
import { ADMIN_EMAIL, FROM_EMAIL, ORGANIZATION_NAME, WEBSITE_ORIGIN as BASE_URL } from "../../env.js";
import Settings from "../settings.js";
import { mailer } from "../utils/mailer.js";



async function notifyFacebookNotConnected() {
  try {
    async function mail() {
      const info = await mailer.sendMail({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: "Action Required: Connect Your Facebook Account",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #ffaa1c; text-align: center;">Facebook Connection Required</h2>
                <p>Dear Admin,</p>
                <p>You attempted to access a feature that requires a connected <strong>Facebook</strong> account.</p>
                <p>To use this feature, please connect your Facebook account in the <strong>Control Panel</strong>.</p>
                <p><a href="${BASE_URL}/control-panal" style="color: #ffaa1c;">Click here to connect your Facebook account</a></p>
                <p>Best regards,<br><strong>${ORGANIZATION_NAME} Team</strong></p>
              </div>
            </div>
          `
      });
      console.log("Facebook connection email sent:", info.messageId);
    }
    let date = (await Settings.findOne({}))?.noticeData?.social_media?.not_connected?.mails?.facebook?.dateNum;
    if (date === undefined) {
      // console.log('Date is Undefined');
      let settings = await Settings.findOne({});
      if (settings) {
        settings.noticeData.social_media.not_connected.mails.facebook.date = new Date();
        settings.noticeData.social_media.not_connected.mails.facebook.dateNum = Date.now();
        await settings.save()
      }
      return;
    }
    let isDateMatch = new Date().getDate() === new Date(date).getDate();
    if (isDateMatch) {
      // console.log('Date Match');
      let isHourBigEnough = ((new Date().getHours() || 24) - (new Date(date).getHours() || 24)) >= 8;
      if (isHourBigEnough) {
        // console.log('Hour Match');
        let settings = await Settings.findOne({});
        if (settings) {
          settings.noticeData.social_media.not_connected.mails.facebook.date = new Date();
          settings.noticeData.social_media.not_connected.mails.facebook.dateNum = Date.now();
          await settings.save();
        }
        await mail();
      }
      return;
    }
    let settings = await Settings.findOne({});
    if (settings) {
      settings.noticeData.social_media.not_connected.mails.facebook.date = new Date();
      settings.noticeData.social_media.not_connected.mails.facebook.dateNum = Date.now();
      await settings.save()
    }
    console.log('Mailing');
    
    await mail()
  } catch (error) {
    console.error("Error sending Facebook connection email:", error);
  }
}
async function notifyYouTubeNotConnected() {
  try {
    async function mail() {
      const info = await mailer.sendMail({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: "Action Required: Connect Your YouTube Account",
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #ffaa1c; text-align: center;">YouTube Connection Required</h2>
            <p>Dear Admin,</p>
            <p>You attempted to access a feature that requires a connected <strong>YouTube</strong> account.</p>
            <p>To use this feature, please connect your YouTube account in the <strong>Control Panel</strong>.</p>
            <p><a href="${BASE_URL}/control-panal" style="color: #ffaa1c;">Click here to connect your YouTube account</a></p>
            <p>Best regards,<br><strong>${ORGANIZATION_NAME} Team</strong></p>
          </div>
        </div>
      `
     });
     console.log("YouTube connection email sent:", info.messageId);
    }
    let date = (await Settings.findOne({}))?.noticeData?.social_media?.not_connected?.mails?.youtube?.dateNum;
    if (date === undefined) {
      // console.log('Date is Undefined');
      let settings = await Settings.findOne({});
      if (settings) {
        settings.noticeData.social_media.not_connected.mails.youtube.date = new Date();
        settings.noticeData.social_media.not_connected.mails.youtube.dateNum = Date.now();
        await settings.save()
      }
      return;
    }
    let isDateMatch = new Date().getDate() === new Date(date).getDate();
    if (isDateMatch) {
      // console.log('Date Match');
      let isHourBigEnough = ((new Date().getHours() || 24) - (new Date(date).getHours() || 24)) >= 8;
      if (isHourBigEnough) {
        // console.log('Hour Match');
        let settings = await Settings.findOne({});
        if (settings) {
          settings.noticeData.social_media.not_connected.mails.youtube.date = new Date();
          settings.noticeData.social_media.not_connected.mails.youtube.dateNum = Date.now();
          await settings.save();
        }
        await mail();
      }
      return;
    }
    let settings = await Settings.findOne({});
    if (settings) {
      settings.noticeData.social_media.not_connected.mails.youtube.date = new Date();
      settings.noticeData.social_media.not_connected.mails.youtube.dateNum = Date.now();
      await settings.save()
    }
    console.log('Mailing');
    
    await mail()
  } catch (error) {
    console.error("Error sending YouTube connection email:", error);
  }
}
async function notifyInstagramNotConnected() {
  try {
    async function mail(params) {
      const info = await mailer.sendMail({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: "Action Required: Connect Your Instagram Account",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #ffaa1c; text-align: center;">Instagram Connection Required</h2>
                <p>Dear Admin,</p>
                <p>You attempted to access a feature that requires a connected <strong>Instagram</strong> account.</p>
                <p>To use this feature, please connect your Instagram account in the <strong>Control Panel</strong>.</p>
                <p><a href="${BASE_URL}/control-panal" style="color: #ffaa1c;">Click here to connect your Instagram account</a></p>
                <p>Best regards,<br><strong>${ORGANIZATION_NAME} Team</strong></p>
              </div>
            </div>
          `
      });
      console.log("Instagram connection email sent:", info.messageId);
    }
    let date = (await Settings.findOne({}))?.noticeData?.social_media?.not_connected?.mails?.instagram?.dateNum;
    if (date === undefined) {
      // console.log('Date is Undefined');
      let settings = await Settings.findOne({});
      if (settings) {
        settings.noticeData.social_media.not_connected.mails.instagram.date = new Date();
        settings.noticeData.social_media.not_connected.mails.instagram.dateNum = Date.now();
        await settings.save()
      }
      return;
    }
    let isDateMatch = new Date().getDate() === new Date(date).getDate();
    if (isDateMatch) {
      // console.log('Date Match');
      let isHourBigEnough = ((new Date().getHours() || 24) - (new Date(date).getHours() || 24)) >= 8;
      if (isHourBigEnough) {
        // console.log('Hour Match');
        let settings = await Settings.findOne({});
        if (settings) {
          settings.noticeData.social_media.not_connected.mails.instagram.date = new Date();
          settings.noticeData.social_media.not_connected.mails.instagram.dateNum = Date.now();
          await settings.save();
        }
        await mail();
      }
      return;
    }
    let settings = await Settings.findOne({});
    if (settings) {
      settings.noticeData.social_media.not_connected.mails.facebook.date = new Date();
      settings.noticeData.social_media.not_connected.mails.facebook.dateNum = Date.now();
      await settings.save()
    }
    console.log('Mailing');
    
    await mail()
  } catch (error) {
    console.error("Error sending Instagram connection email:", error);
  }
}
async function notifyXNotConnected() {
  try {
    async function mail(params) {
      const info = await mailer.sendMail({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: "Action Required: Connect Your X (Twitter) Account",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #ffaa1c; text-align: center;">X (Twitter) Connection Required</h2>
                <p>Dear Admin,</p>
                <p>You attempted to access a feature that requires a connected <strong>X (Twitter)</strong> account.</p>
                <p>To use this feature, please connect your X (Twitter) account in the <strong>Control Panel</strong>.</p>
                <p><a href="${BASE_URL}/control-panal" style="color: #ffaa1c;">Click here to connect your X (Twitter) account</a></p>
                <p>Best regards,<br><strong>${ORGANIZATION_NAME} Team</strong></p>
              </div>
            </div>
          `
      });
      console.log("X (Twitter) connection email sent:", info.messageId);
    }
    let date = (await Settings.findOne({}))?.noticeData?.social_media?.not_connected?.mails?.x_twitter?.dateNum;
    if (date === undefined) {
      // console.log('Date is Undefined');
      let settings = await Settings.findOne({});
      if (settings) {
        settings.noticeData.social_media.not_connected.mails.x_twitter.date = new Date();
        settings.noticeData.social_media.not_connected.mails.x_twitter.dateNum = Date.now();
        await settings.save()
      }
      return;
    }
    let isDateMatch = new Date().getDate() === new Date(date).getDate();
    if (isDateMatch) {
      // console.log('Date Match');
      let isHourBigEnough = ((new Date().getHours() || 24) - (new Date(date).getHours() || 24)) >= 8;
      if (isHourBigEnough) {
        // console.log('Hour Match');
        let settings = await Settings.findOne({});
        if (settings) {
          settings.noticeData.social_media.not_connected.mails.x_twitter.date = new Date();
          settings.noticeData.social_media.not_connected.mails.x_twitter.dateNum = Date.now();
          await settings.save();
        }
        await mail();
      }
      return;
    }
    let settings = await Settings.findOne({});
    if (settings) {
      settings.noticeData.social_media.not_connected.mails.x_twitter.date = new Date();
      settings.noticeData.social_media.not_connected.mails.x_twitter.dateNum = Date.now();
      await settings.save()
    }
    console.log('Mailing');
    
    await mail();
  } catch (error) {
    console.error("Error sending X (Twitter) connection email:", error);
  }
}
async function notifyLinkedInNotConnected() {
  try {
    async function mail(params) {
      const info = await mailer.sendMail({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: "Action Required: Connect Your LinkedIn Account",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #ffaa1c; text-align: center;">LinkedIn Connection Required</h2>
                <p>Dear Admin,</p>
                <p>You attempted to access a feature that requires a connected <strong>LinkedIn</strong> account.</p>
                <p>To use this feature, please connect your LinkedIn account in the <strong>Control Panel</strong>.</p>
                <p><a href="${BASE_URL}/control-panal" style="color: #ffaa1c;">Click here to connect your LinkedIn account</a></p>
                <p>Best regards,<br><strong>${ORGANIZATION_NAME} Team</strong></p>
              </div>
            </div>
          `
      });
      console.log("LinkedIn connection email sent:", info.messageId);
    }
    let date = (await Settings.findOne({}))?.noticeData?.social_media?.not_connected?.mails?.linkedin?.dateNum;
    if (date === undefined) {
      // console.log('Date is Undefined');
      let settings = await Settings.findOne({});
      if (settings) {
        settings.noticeData.social_media.not_connected.mails.linkedin.date = new Date();
        settings.noticeData.social_media.not_connected.mails.linkedin.dateNum = Date.now();
        await settings.save()
      }
      return;
    }
    let isDateMatch = new Date().getDate() === new Date(date).getDate();
    if (isDateMatch) {
      // console.log('Date Match');
      let isHourBigEnough = ((new Date().getHours() || 24) - (new Date(date).getHours() || 24)) >= 8;
      if (isHourBigEnough) {
        // console.log('Hour Match');
        let settings = await Settings.findOne({});
        if (settings) {
          settings.noticeData.social_media.not_connected.mails.linkedin.date = new Date();
          settings.noticeData.social_media.not_connected.mails.linkedin.dateNum = Date.now();
          await settings.save();
        }
        await mail();
      }
      return;
    }
    let settings = await Settings.findOne({});
    if (settings) {
      settings.noticeData.social_media.not_connected.mails.linkedin.date = new Date();
      settings.noticeData.social_media.not_connected.mails.linkedin.dateNum = Date.now();
      await settings.save()
    }
    console.log('Mailing');
    
    await mail();
  } catch (error) {
    console.error("Error sending LinkedIn connection email:", error);
  }
}
async function notifyTikTokNotConnected() {
  try {
    async function mail(params) {
      const info = await mailer.sendMail({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: "Action Required: Connect Your TikTok Account",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #ffaa1c; text-align: center;">TikTok Connection Required</h2>
                <p>Dear Admin,</p>
                <p>You attempted to access a feature that requires a connected <strong>TikTok</strong> account.</p>
                <p>To use this feature, please connect your TikTok account in the <strong>Control Panel</strong>.</p>
                <p><a href="${BASE_URL}/control-panal" style="color: #ffaa1c;">Click here to connect your TikTok account</a></p>
                <p>Best regards,<br><strong>${ORGANIZATION_NAME} Team</strong></p>
              </div>
            </div>
          `
      });
      console.log("TikTok connection email sent:", info.messageId);
    }
    let date = (await Settings.findOne({}))?.noticeData?.social_media?.not_connected?.mails?.tiktok?.dateNum;
    if (date === undefined) {
      // console.log('Date is Undefined');
      let settings = await Settings.findOne({});
      if (settings) {
        settings.noticeData.social_media.not_connected.mails.tiktok.date = new Date();
        settings.noticeData.social_media.not_connected.mails.tiktok.dateNum = Date.now();
        await settings.save()
      }
      return;
    }
    let isDateMatch = new Date().getDate() === new Date(date).getDate();
    if (isDateMatch) {
      // console.log('Date Match');
      let isHourBigEnough = ((new Date().getHours() || 24) - (new Date(date).getHours() || 24)) >= 8;
      if (isHourBigEnough) {
        // console.log('Hour Match');
        let settings = await Settings.findOne({});
        if (settings) {
          settings.noticeData.social_media.not_connected.mails.tiktok.date = new Date();
          settings.noticeData.social_media.not_connected.mails.tiktok.dateNum = Date.now();
          await settings.save();
        }
        await mail();
      }
      return;
    }
    let settings = await Settings.findOne({});
    if (settings) {
      settings.noticeData.social_media.not_connected.mails.tiktok.date = new Date();
      settings.noticeData.social_media.not_connected.mails.tiktok.dateNum = Date.now();
      await settings.save()
    }
    console.log('Mailing');
    
    await mail();
  } catch (error) {
    console.error("Error sending TikTok connection email:", error);
  }
}

const SocialMediaMail = {
  notConnected: {
    youtube: notifyYouTubeNotConnected,
    facebook: notifyFacebookNotConnected,
    Instagram: notifyInstagramNotConnected,
    X_Twitter: notifyXNotConnected,
    LinkedIn: notifyLinkedInNotConnected,
    titkok: notifyTikTokNotConnected
  }
}
export default SocialMediaMail;