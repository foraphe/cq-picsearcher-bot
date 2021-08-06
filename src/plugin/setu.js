import _, { random } from 'lodash';
import { getProxyURL } from './pximg';
import CQcode from '../CQcode';
import { URL } from 'url';
import NamedRegExp from 'named-regexp-groups';
import '../utils/jimp.plugin';
import Jimp from 'jimp';
import urlShorten from '../urlShorten';
import logger from '../logger';
const Axios = require('../axiosProxy');

const API_URL = 'https://api.lolicon.app/setu/v2';

const PIXIV_404 = Symbol('Pixiv image 404');

async function imgAntiShielding(url) {
  const img = await Jimp.read(url);

  switch (Number(global.config.bot.setu.antiShielding)) {
    case 1:
      const [w, h] = [img.getWidth(), img.getHeight()];
      const pixels = [
        [0, 0],
        [w - 1, 0],
        [0, h - 1],
        [w - 1, h - 1],
      ];
      for (const [x, y] of pixels) {
        img.setPixelColor(Jimp.rgbaToInt(random(255), random(255), random(255), 1), x, y);
      }
      break;

    case 2:
      img.simpleRotate(90);
      break;
  }

  return (await img.getBase64Async(Jimp.AUTO)).split(',')[1];
}

//  酷Q无法以 base64 发送大于 4M 的图片
function checkBase64RealSize(base64) {
  return base64.length && base64.length * 0.75 < 4000000;
}

async function getAntiShieldingBase64(url, fallbackUrl) {
  try {
    const origBase64 = await imgAntiShielding(url);
    if (checkBase64RealSize(origBase64)) return origBase64;
  } catch (error) {
    // 原图过大
  }
  if (!fallbackUrl) return;
  const m1200Base64 = await imgAntiShielding(fallbackUrl);
  if (checkBase64RealSize(m1200Base64)) return m1200Base64;
}

function sendSetu(context, at = true) {
  const setuReg = new NamedRegExp(global.config.bot.regs.setu);
  const setuRegExec = setuReg.exec(CQcode.unescape(context.message));
  if (!setuRegExec) return false;

  const setting = global.config.bot.setu;
  const replys = global.config.bot.replys;
  const proxy = setting.pximgProxy.trim();
  const isGroupMsg = context.message_type === 'group';

  // 普通
  const limit = {
    value: setting.limit,
    cd: setting.cd,
  };
  let delTime = setting.deleteTime;

  const regGroup = setuRegExec.groups || {};
  const r18 = regGroup.r18 && !(isGroupMsg && setting.r18OnlyInWhite && !setting.whiteGroup.includes(context.group_id));
  const keyword = regGroup.keyword ? regGroup.keyword.split('&') : undefined;
  const privateR18 = setting.r18OnlyPrivate && r18 && isGroupMsg;

  // 群聊还是私聊
  if (isGroupMsg) {
    // 群白名单
    if (setting.whiteGroup.includes(context.group_id)) {
      limit.cd = setting.whiteCd;
      delTime = setting.whiteDeleteTime;
    } else if (setting.whiteOnly) {
      global.replyMsg(context, replys.setuReject);
      return true;
    }
  } else {
    if (!setting.allowPM) {
      global.replyMsg(context, replys.setuReject);
      return true;
    }
    limit.cd = 0; // 私聊无cd
  }

  if (!logger.applyQuota(context.user_id, limit, 'setu')) {
    global.replyMsg(context, replys.setuLimit, at);
    return true;
  }

    Axios.get(
      `${zza}?r18=${r18 ? 1 : 0}${keyword || ''}${setting.size1200 ? '&size1200' : ''}${setting.apikey ? '&apikey=' + setting.apikey.trim() : ''
      }`
    )
      .then(ret => ret.data)
      .then(async ret => {
        if (ret.code !== 0) {
          if (ret.code === 429) global.replyMsg(context, replys.setuQuotaExceeded || ret.error, true);
          else global.replyMsg(context, ret.error, true);
          return;
        }

        if (
          !global.extendConfig.error &&
          (global.extendConfig.misc.setu.privateAll ||
            (global.extendConfig.misc.setu.privateR18 && r18))
        ) {
          if (context.message_type !== 'private') global.replyMsg(context, '结果将私聊发送');
          context.message_type = 'private';
        }

        global.replyMsg(context, `${ret.url} (p${ret.p})`, true);

      const getReqUrl = url => (proxy ? getSetuUrlByTemplate(proxy, setu, url) : getProxyURL(url));
      const url = getReqUrl(setuUrl);
      const fallbackUrl = setting.size1200 ? undefined : getReqUrl(setu.urls.regular);

      // 反和谐
      const base64 =
        !privateR18 &&
        isGroupMsg &&
        setting.antiShielding &&
        (await getAntiShieldingBase64(url, fallbackUrl).catch(e => {
          console.error(`${global.getTime()} [error] anti shielding`);
          console.error(setuUrl);
          console.error(e);
          if (String(e).includes('Could not find MIME for Buffer')) return PIXIV_404;
          global.replyMsg(context, '反和谐发生错误，图片将原样发送，详情请查看错误日志');
        }));

      if (base64 === PIXIV_404) {
        global.replyMsg(context, '图片发送失败，可能是网络问题/插画已被删除/原图地址失效');
        return;
      }

      const imgType = delTime === -1 ? 'flash' : null;
      if (privateR18) {
        global.bot('send_private_msg', {
          user_id: context.user_id,
          group_id: setting.r18OnlyPrivateAllowTemp ? context.group_id : undefined,
          message: CQcode.img(url, imgType),
        });
      } else {
        global
          .replyMsg(context, base64 ? CQcode.img64(base64, imgType) : CQcode.img(url, imgType))
          .then(r => {
            const message_id = _.get(r, 'data.message_id');
            if (delTime > 0 && message_id)
              setTimeout(() => {
                global.bot('delete_msg', { message_id });
              }, delTime * 1000);
          })
          .catch(e => {
            console.error(`${global.getTime()} [error] delete msg`);
            console.error(e);
          });
      }
      success = true;
    })
    .catch(e => {
      console.error(`${global.getTime()} [error]`);
      console.error(e);
      global.replyMsg(context, replys.setuError, at);
    })
    .finally(() => {
      if (!success) logger.releaseQuota(context.user_id, 'setu');
    });

  return true;
}

export default sendSetu;

function getSetuUrlByTemplate(tpl, setu, url) {
  const path = new URL(url).pathname.replace(/^\//, '');
  if (!/{{.+}}/.test(tpl)) return new URL(path, tpl).href;
  return _.template(tpl, { interpolate: /{{([\s\S]+?)}}/g })({ path, ..._.pick(setu, ['pid', 'p', 'uid', 'ext']) });
}
