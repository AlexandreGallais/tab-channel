interface ListenerOptions {
    /**
     * A boolean value indicating that the `listener` should be invoked at most once after being added.\
     * If `true`, the `listener` would be automatically removed when invoked. If not specified, defaults to `false`.
     */
    once?: boolean;
}

interface EmitterOptions {
    /**
     * A boolean value indicating whether the emitted message should also be sent to the `listeners` of the same tab.\
     * If `true`, the `listeners` of this Tab will be invoked after a message has been emitted. If not specified, defaults to `false`.
     */
    self?: boolean;
}

type ChannelData<T> = {
    tabId: TabChannel<void>['tabId'];
    self: boolean;
    data: T;
};

type Listener<T> = (data: T) => void;

type Store<T> = {
    once: Listener<T>[];
    default: Listener<T>[];
};

export class TabChannel<T> {
    /**
     * The BroadcastChannel used for communication.
     */
    private channel: BroadcastChannel;

    /**
     * Storage for event listeners.
     */
    private store: Store<T> = { once: [], default: [] };

    /**
     * Retrieves or generates a unique identifier for the tab.\
     * If an identifier is already stored in sessionStorage, it retrieves it, otherwise it generates one.
     */
    private get tabId(): string {
        let id = sessionStorage.getItem('tab-channel-id');
        if (id) return id;
        id = [...crypto.getRandomValues(new Uint8Array(8))]
            .map((x) => x % 10)
            .join('');
        sessionStorage.setItem('tab-channel-id', id);
        return id;
    }

    /**
     * Emits the provided data to all registered listeners.
     * @param data The data to emit.
     */
    private emit = (data: T) => {
        this.store.default.forEach((x) => x(data));
        this.store.once.forEach((x) => x(data));
        this.store.once = [];
    };

    /**
     * Creates a new TabChannel instance with the specified name.
     *
     * @description
     * This constructor creates a new `TabChannel` instance that utilizes the `BroadcastChannel` interface for communication between tabs.\
     * The provided name will be used as the name of the `BroadcastChannel`.\
     * Please be cautious when choosing a name to avoid conflicts with other `BroadcastChannel`.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel
     *
     * @param name The name of the channel.
     */
    constructor(name: string) {
        this.channel = new BroadcastChannel(name);

        this.channel.addEventListener(
            'message',
            (event: MessageEvent<ChannelData<T>>) => {
                const { tabId, self, data } = event.data;

                if (this.tabId === tabId && !self) return;

                this.emit(data);
            },
        );
    }

    /**
     * Sets up a callback function to handle incoming data posted to the channel.
     * @param listener A callback function invoked when data is posted.
     * @param options Optional parameters that control the behavior of the listener function.
     */
    onData = (listener: Listener<T>, options?: ListenerOptions) => {
        this.store[options?.once ? 'once' : 'default'].push(listener);
    };

    /**
     * Posts data to the channel.
     * @param data The data to be sent.
     * @param options Optional parameters that specify additional behavior for the postData function.
     */
    postData = (data: T, options?: EmitterOptions) => {
        this.channel.postMessage({
            tabId: this.tabId,
            self: !!options?.self,
            data,
        } satisfies ChannelData<T>);

        if (options?.self) this.emit(data);
    };
}

export default TabChannel;
