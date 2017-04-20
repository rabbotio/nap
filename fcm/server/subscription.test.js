const UID = '58e76f466c08d52daa0e079a'


const {
   sub,
   unSub,
   pubTopic,
   pubUID,
   connectMongoose,
   findDeviceTokenByUID
} = require('./subscription');


const installation = require('./installation');

test('mongoose connection', async() => {
   //remove all subs by list

   const isConnected = await connectMongoose('128.199.136.111');
   console.log('isConnected', isConnected)
   expect(isConnected).toBeTruthy()
});

test('sub user', async() => {
   //remove all subs by list
   const topic = 'ffff'
   const result = await sub(topic, UID);
   console.log('result', result)
   expect(result.length).toBeGreaterThan(0)
});

test('Verify sub count on users device', async() => {
   //remove all subs by list
   const topic = 'ffff'
   const deviceTokenList = await findDeviceTokenByUID(UID);

   for (let i = 0; i < deviceTokenList.length; i++) {
      const deviceToken = deviceTokenList[i]

      const listOfTopic = await installation.getSubList(deviceToken) //some device token may not be active or InvalidToken/No information found about this instance id.

      if (listOfTopic instanceof Array) {
         console.log('listOfTopic=', listOfTopic)
         expect(listOfTopic.length).toBe(1)
      }
   }
});

test('unsub user', async() => {
   //remove all subs by list
   const topic = 'ffff'
   const result = await unSub(topic, UID);
   console.log('result', result)
   expect(result.length).toBeGreaterThan(0)
});

test('Verify unSub count on users device', async() => {
   //remove all subs by list
   const topic = 'ffff'
   const deviceTokenList = await findDeviceTokenByUID(UID);

   for (let i = 0; i < deviceTokenList.length; i++) {
      const deviceToken = deviceTokenList[i]

      const listOfTopic = await installation.getSubList(deviceToken) //some device token may not be active or InvalidToken/No information found about this instance id.

      if (listOfTopic instanceof Array) {
         console.log('listOfTopic=', listOfTopic)
         expect(listOfTopic.length).toBe(0)
      }
   }
});