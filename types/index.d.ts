interface EmitterOptions {
    /**
     * A boolean value indicating whether the emitted message should also be sent to the `listeners` of the same tab.\
     * If `true`, the `listeners` of this Tab will be invoked after a message has been emitted. If not specified, defaults to `false`.
     */
    self?: boolean;
}
interface ListenerOptions {
    /**
     * A boolean value indicating that the `listener` should be invoked at most once after being added.\
     * If `true`, the `listener` would be automatically removed when invoked. If not specified, defaults to `false`.
     */
    once?: boolean;
}
type Listener<T> = (data: T) => void;
export declare class TabChannel<T> {
    /**
     * The BroadcastChannel used for communication.
     * @private
     */
    private channel;
    /**
     * Storage for event listeners.
     * @private
     */
    private store;
    /**
     * Retrieves or generates a unique identifier for the tab.\
     * If an identifier is already stored in sessionStorage, it retrieves it, otherwise it generates one.
     * @private
     */
    private get tabId();
    /**
     * Emits the provided data to all registered listeners.
     * @param data The data to emit.
     * @private
     */
    private emit;
    /**
     * Creates a new TabChannel instance with the specified name.
     * @param name The name of the channel.
     */
    constructor(name: string);
    /**
     * Sets up a callback function to handle incoming data posted to the channel.
     * @param listener A callback function invoked when data is posted.
     * @param options Optional parameters that control the behavior of the listener function.
     */
    onData: (listener: Listener<T>, options?: ListenerOptions) => void;
    /**
     * Posts data to the channel.
     * @param data The data to be sent.
     * @param options Optional parameters that specify additional behavior for the postData function.
     */
    postData: (data: T, options?: EmitterOptions) => void;
}
export default TabChannel;
