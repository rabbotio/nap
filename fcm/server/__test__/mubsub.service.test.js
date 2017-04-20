const {
   connectMubSub
} = require('../mubsub.service')

test('mongoose connection', async() => {
   //remove all subs by list

   const isConnected = await connectMubSub('128.199.136.111');
   console.log('isConnected', isConnected)
   expect(isConnected).toBeTruthy()
});