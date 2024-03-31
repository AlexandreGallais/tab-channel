# TabChannel

A simple class for communicating between different tabs on the same domain using BroadcastChannel.

## Installation

Follow this video to install the npm package.

<https://youtu.be/7CNC0QBCY-Y?si=5yk7pI5w1X5hKMoQ&t=250>

Create a `.npmrc` file

```bash
@alexandregallais:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_TOKEN
```

Follow the video to create your token (**YOUR TOKEN MUST BE KEPT SECRET**).

Then, install the package with npm.

```bash
npm i @alexandregallais/tab-channel
```

## Usage

```ts
import { TabChannel } from '@alexandregallais/tab-channel';

const tabChannel = new TabChannel<string>('my-channel-id');

tabChannel.onData((data) => {
    console.log(data);
    // logs 'Hello!' if you open a new tab.
});

tabChannel.postData('Hello!');
```

### Listen once

You can listen to the event just once with the `once` option.

```ts
import { TabChannel } from '@alexandregallais/tab-channel';

const tabChannel = new TabChannel<string>('my-channel-id');

tabChannel.onData(
    (data) => {
        console.log(data);
        // logs 'Hello!' if you open a new tab.
    },
    { once: true },
);

tabChannel.onData((data) => {
    console.log(data);
    // logs 'Hello!' if you open a new tab.
    // logs 'Hello!' if you open a new tab.
});

tabChannel.postData('Hello!');
tabChannel.postData('Hello!');
```

### Emit to its own tab

Send the event to its own tab and the others with the option `self`.

```ts
import { TabChannel } from '@alexandregallais/tab-channel';

const tabChannel = new TabChannel<string>('my-channel-id');

tabChannel.onData((data) => {
    console.log(data);
    // logs 'Hello!'
});

tabChannel.postData('Hello!', { self: true });
```
