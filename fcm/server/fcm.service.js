const cluster = require('cluster');
if (cluster.isMaster) {

   const workerCount = 1;
   for (let i = 0; i < workerCount; i++) {
      cluster.fork();
   }
   //if the worker dies, restart it.
   cluster.on('exit', (worker) => {
      console.log('Worker ' + worker.id + ' died..');
      cluster.fork();
   });
} else {
   console.log(`New connectMubSub ${cluster.worker.id}`);

   const {
      connectMubSub
   } = require('./mubsub.service')
   connectMubSub('128.199.136.111', 'dev');
}