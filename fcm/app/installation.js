const fetch = require('isomorphic-fetch');
const DEBUG = false;
const serverKey = 'AIzaSyCndkHRvCS_TmAS7cdFMC_dtCxKVkJb5WQ';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'key=' + serverKey
};
console.log('json...',JSON)
/**
 * @param {string} topicString 
 * @param {string} FCMToken 
 */
const sub = (topicString, FCMToken) => fetch(`https://iid.googleapis.com/iid/v1/${FCMToken}/rel/topics/${topicString}`, {
  method: 'POST',
  headers
}).then((callback) => {
  DEBUG && console.log('fcm sub', FCMToken.substring(0, 5), topicString, callback.ok);
  return callback.ok;
});

/**
 * @param {array<string>} topicStringList 
 * @param {string} FCMToken 
 */
const subList = (topicStringList, FCMToken) => new Promise(async(resolve, reject) => {
  let isOk = false;

  for (let i = 0; i < topicStringList.length; i++) {
    let result = await sub(topicStringList[i], FCMToken);
    isOk = isOk || result
  }

  resolve(isOk);
});

/**
 * @param {string} topicString 
 * @param {array<string>} FCMTokenList 
 */
const subDeviceList = (topicString, FCMTokenList) => fetch('https://iid.googleapis.com/iid/v1:batchAdd', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    to: `/topics/${topicString}`,
    registration_tokens: FCMTokenList
  })
}).then((callback) => {
  DEBUG && console.log('fcm sub', FCMToken.substring(0, 5), topicString, callback.results);
  return callback.ok;
});

/**
 * @param {string} topicString 
 * @param {string} FCMToken 
 */
const unSub = (topicString, FCMToken) => fetch(`https://iid.googleapis.com/iid/v1/${FCMToken}/rel/topics/${topicString}`, {
  method: 'DELETE',
  headers
}).then((callback) => {
  DEBUG && console.log('fcm unSub', FCMToken.substring(0, 5), topicString, callback.ok);
  return (callback.ok);
});

/**
 * @param {array<string>} topicStringList 
 * @param {string} FCMToken 
 */
const unSubList = (topicStringList, FCMToken) => new Promise(async(resolve, reject) => {
  let isOk = false;

  for (let i = 0; i < topicStringList.length; i++) {
    let result = await unSub(topicStringList[i], FCMToken);
    isOk = isOk || result
  }

  resolve(isOk);
});
/**
 * 
 * @param {string} topicString 
 * @param {array<string>} FCMTokenList 
 */
const unSubDeviceList = (topicString, FCMTokenList) => fetch('https://iid.googleapis.com/iid/v1:batchRemove', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    to: `/topics/${topicString}`,
    registration_tokens: FCMTokenList
  })
}).then((callback) => {
  DEBUG && console.log('fcm sub', FCMToken.substring(0, 5), topicString, callback.results);
  return callback.ok;
});

const pubTopic = (topicString, title, body, data) => fetch('https://fcm.googleapis.com/fcm/send', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    to: "/topics/" + topicString,
    notification: {
      title,
      body,
      click_action: "fcm.ACTION.DEFAULT"
    },
    data
  })
});

const pubDevice = (deviceToken, title, body, data) => fetch('https://fcm.googleapis.com/fcm/send', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    to: FCMToken,
    notification: {
      title,
      body,
      click_action: "fcm.ACTION.DEFAULT"
    },
    data
  })
});

const getSubList = (FCMToken) => fetch(`https://iid.googleapis.com/iid/info/${FCMToken}?details=true`, {
  method: 'GET',
  headers
}).then(async(callback) => {
  const data = await callback.json();
  const topics = data.hasOwnProperty('rel') ? data.rel.topics : {};

  DEBUG && console.log('getSubList', FCMToken.substring(0, 5), topics);
  return (Object.keys(topics));
});

const isSub = (topicString, FCMToken) => new Promise(async(resolve, reject) => {
  const subList = await getSubList(FCMToken);
  const hasSub = subList.indexOf(topicString) >= 0;
  DEBUG && console.log('isSub', FCMToken.substring(0, 5), topicString, hasSub);
  resolve(hasSub);
});

module.exports = {
  sub,
  subList,
  subDeviceList,
  unSub,
  unSubList,
  unSubDeviceList,
  pubTopic,
  pubDevice,
  getSubList,
  isSub
}