import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { TabChannel } from './index.ts';

describe('Class TabChannel:', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    afterEach(() => {
        sessionStorage.clear();
    });

    test('Create a "TabChannel" instance.', () => {
        expect(new TabChannel(crypto.randomUUID())).toBeInstanceOf(TabChannel);
    });

    test('Use the "BroadcastChannel" nammed "x" to send data.', () => {
        const channelName = crypto.randomUUID();
        let value = false;

        const bc = new BroadcastChannel(channelName);

        bc.addEventListener('message', () => {
            value = true;
            expect(value).toEqual(true);
        });

        const tc = new TabChannel<void>(channelName);
        tc.postData();
    });

    describe('(PRIVATE) Getter tabId:', () => {
        test('Return sessionStorage value from key "tab-channel-id".', () => {
            const id = window.crypto.randomUUID();
            sessionStorage.setItem('tab-channel-id', id);
            expect(new TabChannel('')['tabId']).toEqual(id);
        });

        test('Generate, store a value to sessionStorage "tab-channel-id", then return it.', () => {
            const id = new TabChannel('')['tabId'];
            expect(sessionStorage.getItem('tab-channel-id')).toEqual(id);
        });
    });

    describe('Method onData:', () => {
        test('Receive data multiple time or only once (option once).', async () => {
            const listener = { default: () => {}, once: () => {} };
            const spyListenerDefault = vi.spyOn(listener, 'default');
            const spyListenerOnce = vi.spyOn(listener, 'once');

            const channelName = crypto.randomUUID();
            const tcOn = new TabChannel(channelName);
            const tcPost = new TabChannel(channelName);

            // @ts-expect-error - random tabId to pretend to be on a different tab.
            vi.spyOn(tcOn, 'tabId', 'get').mockReturnValue('x');

            tcOn.onData(listener.default);
            tcOn.onData(listener.once, {
                once: true,
            });

            tcPost.postData(null);
            tcPost.postData(null);
            tcPost.postData(null);
            tcPost.postData(null);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(spyListenerDefault.mock.calls.length).toEqual(4);
            expect(spyListenerOnce.mock.calls.length).toEqual(1);
        });
    });

    describe('Method postData:', () => {
        test('Send data only to other tab.', async () => {
            const listenerSameTab = { x: () => {} };
            const listenerOtherTab = { x: () => {} };
            const spyListenerSameTab = vi.spyOn(listenerSameTab, 'x');
            const spyListenerOtherTab = vi.spyOn(listenerOtherTab, 'x');

            const channelName = crypto.randomUUID();
            const tcPost = new TabChannel(channelName);
            const tcSameTab = new TabChannel(channelName);
            const tcOtherTab = new TabChannel(channelName);

            // @ts-expect-error - random tabId to pretend to be on a different tab.
            vi.spyOn(tcOtherTab, 'tabId', 'get').mockReturnValue('x');

            tcSameTab.onData(listenerSameTab.x);
            tcOtherTab.onData(listenerOtherTab.x);

            tcPost.postData(null);
            tcPost.postData(null);
            tcPost.postData(null);
            tcPost.postData(null);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(spyListenerSameTab.mock.calls.length).toEqual(0);
            expect(spyListenerOtherTab.mock.calls.length).toEqual(4);
        });

        test('Send data only to current and other tab. (option self)', async () => {
            const listenerSameTab = { x: () => {} };
            const listenerOtherTab = { x: () => {} };
            const spyListenerSameTab = vi.spyOn(listenerSameTab, 'x');
            const spyListenerOtherTab = vi.spyOn(listenerOtherTab, 'x');

            const channelName = crypto.randomUUID();
            const tcPost = new TabChannel(channelName);
            const tcSameTab = new TabChannel(channelName);
            const tcOtherTab = new TabChannel(channelName);

            // @ts-expect-error - random tabId to pretend to be on a different tab.
            vi.spyOn(tcOtherTab, 'tabId', 'get').mockReturnValue('x');

            tcSameTab.onData(listenerSameTab.x);
            tcOtherTab.onData(listenerOtherTab.x);

            tcPost.postData(null, { self: true });
            tcPost.postData(null, { self: true });
            tcPost.postData(null, { self: true });
            tcPost.postData(null, { self: true });

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(spyListenerSameTab.mock.calls.length).toEqual(4);
            expect(spyListenerOtherTab.mock.calls.length).toEqual(4);
        });
    });
});
