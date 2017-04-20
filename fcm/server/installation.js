require('isomorphic-fetch');
require('es6-promise').polyfill();
const DEBUG = false;

const serverKey = 'AIzaSyCndkHRvCS_TmAS7cdFMC_dtCxKVkJb5WQ';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `key=${serverKey}`
}

/**
 * Device sub single topic
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
 * Single device unsub multiple topic
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
 * Group of device sub single topic
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
}).then(async(callback) => {

  const callbackObject = await callback.json();
  DEBUG && console.log('fcm sub', FCMTokenList, topicString, callbackObject);

  return callbackObject.results;
});

/**
 * Device unsub single topic
 * @param {string} topicString 
 * @param {string} FCMToken 
 */
const unSub = (topicString, FCMToken) => fetch(`https://iid.googleapis.com/iid/v1/${FCMToken}/rel/topics/${topicString}`, {
  method: 'DELETE',
  headers
}).then((callback) => {
  DEBUG && console.log('fcm unSub', FCMToken.substring(0, 5), topicString, callback);
  return (callback.ok);
});

/**
 * Single device unsub multiple topic
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
 * Group of device unsub single topic
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
}).then(async(callback) => {
  const callbackObject = await callback.json();
  DEBUG && console.log('fcm unsub', FCMTokenList, topicString, callbackObject);

  return callbackObject.results;
});

/**
 * Publish single topic
 * @param {string} topicString 
 * @param {string} title 
 * @param {string} body 
 * @param {object} data 
 */
const pubTopic = (topicString, title, body, data) => pubDevice("/topics/" + topicString, title, body, data)

/**
 * Publish directly to single device
 * @param {stirng} FCMToken 
 * @param {string} title 
 * @param {string} body 
 * @param {object} data 
 */
const pubDevice = (FCMToken, title, body, data) => fetch('https://fcm.googleapis.com/fcm/send', {
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
}).then(async(callback) => {
  const data = await callback.json()
  return data
});

/**
 * Get list of subscription on single device
 * @param {string} FCMToken 
 * @return {*} Array when device is active, String when error (InvalidToken/No information found about this instance id.)
 */
const getSubList = (FCMToken) => fetch(`https://iid.googleapis.com/iid/info/${FCMToken}?details=true`, {
  method: 'GET',
  headers
}).then(async(callback) => {
  const data = await callback.json();
  if (data.hasOwnProperty('error')) {
    DEBUG && console.log(data.error);

    return data.error + '' //InvalidToken
  } else {
    const topics = data.hasOwnProperty('rel') ? data.rel.topics : {};

    DEBUG && console.log('getSubList', FCMToken.substring(0, 5), ' topic=', topics, data);
    return (Object.keys(topics));
  }
});

/**
 * Check if device has subbed this topic
 * @param {string} topicString 
 * @param {string} FCMToken 
 */
const isSub = (topicString, FCMToken) => new Promise(async(resolve, reject) => {
  const subList = await getSubList(FCMToken);
  const hasSub = subList.indexOf(topicString) >= 0;
  DEBUG && console.log('isSub', FCMToken.substring(0, 5), ' topic=', topicString, 'hasSub', hasSub);
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