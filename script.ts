import { TabChannel } from './src/index';

const tabChannel = new TabChannel<string>('id');

tabChannel.onData((data) => {
    console.log(data);
});

tabChannel.postData('Hello!', { self: true });
