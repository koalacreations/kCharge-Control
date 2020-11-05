import io from 'socket.io-client';
import { boot } from 'quasar/wrappers';

// initialise the socket io client and connect to the same domain
const socketio = io(`${window.location.hostname}:8000`);

export default boot(({ Vue }) => {
  socketio.on('connect', () => {
    console.log("Socket connected!");
  });

  socketio.on('disconnect', () => {
    console.log("Socket disconnected!");
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.prototype.$socketio = socketio;
});
