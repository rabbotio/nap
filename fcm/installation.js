const fetch = require('node-fetch');
require('es6-promise').polyfill();
require('isomorphic-fetch');
const JSON = require('json');
const DEBUG = false;
const serverKey = 'AIzaSyCndkHRvCS_TmAS7cdFMC_dtCxKVkJb5WQ';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'key=' + serverKey
};

sub = (topicString, FCMToken) => fetch('https://iid.googleapis.com/iid/v1/' + FCMToken + '/rel/topics/' + topicString, {
  method: 'POST',
  headers
}).then((callback) => {
  DEBUG && console.log('fcm sub', FCMToken.substring(0, 5), topicString, callback.ok);
  return callback.ok;
});

subList = (topicStringList, FCMToken) => new Promise(async(resolve, reject) => {
  let isOk = false;

  for (let i = 0; i < topicStringList.length; i++) {
    let result = await sub(topicStringList[i], FCMToken);
    isOk = isOk || result
  }

  resolve(isOk);
});

unSub = (topicString, FCMToken) => fetch('https://iid.googleapis.com/iid/v1/' + FCMToken + '/rel/topics/' + topicString, {
  method: 'DELETE',
  headers
}).then((callback) => {
  DEBUG && console.log('fcm unSub', FCMToken.substring(0, 5), topicString, callback.ok);
  return (callback.ok);
});

unSubList = (topicStringList, FCMToken) => new Promise(async(resolve, reject) => {
  let isOk = false;

  for (let i = 0; i < topicStringList.length; i++) {
    let result = await unSub(topicStringList[i], FCMToken);
    isOk = isOk || result
  }

  resolve(isOk);
});

pubTopic = (topicString, message, data) => fetch('https://fcm.googleapis.com/fcm/send', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    to: "/topics/" + topicString,
    notification: {
      title: "Clogii",
      body: message,
      click_action: "fcm.ACTION.DEFAULT"
    },
    data
  })
});

pubToken = (FCMToken, message, data) => fetch('https://fcm.googleapis.com/fcm/send', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    to: FCMToken,
    notification: {
      title: "Clogii",
      body: message,
      click_action: "fcm.ACTION.DEFAULT"
    },
    data
  })
});

getSubList = (FCMToken) => fetch('https://iid.googleapis.com/iid/info/' + FCMToken + '?details=true', {
  method: 'GET',
  headers
}).then(async(callback) => {
  const data = await callback.json();
  const topics = data.hasOwnProperty('rel') ? data.rel.topics : {};

  DEBUG && console.log('getSubList', FCMToken.substring(0, 5), topics);
  return (Object.keys(topics));
});

isSub = (topicString, FCMToken) => new Promise(async(resolve, reject) => {
  const subList = await getSubList(FCMToken);
  const hasSub = subList.indexOf(topicString) >= 0;
  DEBUG && console.log('isSub', FCMToken.substring(0, 5), topicString, hasSub);
  resolve(hasSub);
});