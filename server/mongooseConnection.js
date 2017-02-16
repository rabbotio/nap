import mongoose from 'mongoose';
import { mongoUri } from '../graphql/config';

mongoose.Promise = Promise;
mongoose.connect(mongoUri, {
  server: {
    auto_reconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  }
});

export const connection = mongoose.connection;
connection.on('error', (e) => {
  if (e.message.code === 'ETIMEDOUT') {
    console.log(e);
    mongoose.connect(mongoUri);
  }
  console.log(e);
});
connection.once('open', () => {
  console.log(`MongoDB successfully connected to ${mongoUri}`);
});
