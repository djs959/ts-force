import { Rest, SObjectStatic } from '..';
import { SubscriptionHandle } from 'cometd';
import { RestObject } from '../rest/restObject';
import { Omit } from '../types';
export declare class Streaming {
    private listener;
    private subscribers;
    /**
     * Creates an instance of Streaming class.  Used to listen to PushTopic and Platform Events
     * @param {Rest} [client] Optional client to use instead of the default connection
     * @memberof Streaming
     */
    constructor(client?: Rest);
    /**
     * Method to connect to salesforce.  Call before attempting to subscribe to event events or topics
     *
     * @memberof Streaming
     */
    connect: () => Promise<void>;
    /**
     * Removes a transport from the cometd connection.
     * See: https://docs.cometd.org/current/reference/#_javascript_transports_unregistering
     * @param {('websocket' | 'long-polling' | 'callback-polling')} transport
     * @memberof Streaming
     */
    unregisterTransport(transport: 'websocket' | 'long-polling' | 'callback-polling'): void;
    /**
     * General purpose method to subscribe to any uri.
     *   Use `subscribeToTopic`, `subscribeToTopicMapped` & `subscribeToEvent` for most use cases
     *
     * @param {string} channel the relative uri to subscribe to.  EX: '/topic/abc'
     * @param {(message: any) => void} onEvent Callback handler to process received events
     * @returns {Promise<SubscriptionHandle>} A cometd SubscriberHandle.  It's recommended to use
     * @memberof StreamClient
     */
    _subscribe(channel: string, onEvent: (message: any) => void): Promise<SubscriptionHandle>;
    /**
     * Method to unsubscribe from any subscription.
     * @param {string} channel
     * @param {('topic' | 'event')} [type] Optional parameter to help build channel
     * @returns {Promise<void>}
     * @memberof StreamClient
     */
    unsubscribe(channel: string, type?: 'topic' | 'event'): Promise<void>;
    /**
     * Method to subscribe to a platform events
     * @template T type of the event `payload`
     * @param {string} event The name of the PlatformEvent to subscribe to.  EG: `My_Event__e` (do not include `/event/`)
     * @param {(m: PlatformEvent<T>) => void} onEvent
     * @returns {Promise<SubscriptionHandle>}
     * @memberof Streaming
     */
    subscribeToEvent<T>(event: string, onEvent: (m: PlatformEvent<T>) => void): Promise<SubscriptionHandle>;
    /**
     * Method to subscribe to a push topic
     *    See `subscribeToTopicMapped` to automatically map your response to a generated SObject class
     * @template T The signature of of the event `data.sobject`
     * @param {string} topic The name of the PushTopic to subscribe to.  EG: `MyTopic` (do not include `/topic/`)
     * @param {(m: TopicMessage<T>) => void} onEvent Your event handler
     * @returns {Promise<SubscriptionHandle>}
     * @memberof Streaming
     */
    subscribeToTopic<T extends TopicSObject>(topic: string, onEvent: (m: TopicMessage<T>) => void): Promise<SubscriptionHandle>;
    /**
     * Method to subscribe to a PushTopic and parse event messages directly to a generated SObject type
     *
     * @template T The SObject type.  Implied from `sObjectType` param
     * @param {SObjectStatic<T>} sObjectType The static instance of the SObject type to map.  EG: `Account`
     * @param {string} topic The name of the PushTopic to subscribe to.  EG: `MyTopic` (do not include `/topic/`)
     * @param {(event: SObjectTopicMessage<T>) => void} onEvent Your event handler.  Payload will be parsed to your `sObjectType`
     * @returns {Promise<SubscriptionHandle>}
     * @memberof Streaming
     *
     * Example:
     *
     * ```typescript
     *await stream.subscribeToTopicMapped(
     *   Account,
     *   topic.name,
     *   e => {
     *      let acc: Account = e.data.sObject;
     *      console.log(acc.annualRevenue);
     *   }
     * );
     * ```
     */
    subscribeToTopicMapped<T extends RestObject>(sObjectType: SObjectStatic<T>, topic: string, onEvent: (event: SObjectTopicMessage<T>) => void): Promise<SubscriptionHandle>;
    /**
     * Disconnects the streaming client.  Will unsubscribe for all active subscriptions
     *
     * @memberof Streaming
     */
    disconnect: () => Promise<void>;
    /**
     * Returns `true` if the client is currently connected with salesforce
     *
     * @memberof Streaming
     */
    isConnected: () => boolean;
}
export interface SObjectTopicMessage<T extends RestObject> extends Omit<TopicMessage<any>, 'data'> {
    data: {
        event: Event;
        sObject: T;
    };
}
export interface TopicMessage<T extends TopicSObject> {
    clientId: string;
    data: Data<T>;
    channel: string;
}
export interface Event {
    createdDate: Date;
    replayId: number;
    type: TopicEventType;
}
export type TopicEventType = 'created' | 'updated' | 'deleted' | 'undeleted';
export interface TopicSObject {
    Id: string;
}
export interface Data<T extends TopicSObject> {
    event: Event;
    sobject: T;
}
export interface PlatformEvent<T> {
    data: PlatformEventData<T>;
    channel: string;
}
export interface PlatformEventInfo {
    replayId: number;
}
export interface PlatformEventData<T> {
    schema: string;
    payload: T;
    event: PlatformEventInfo;
}
