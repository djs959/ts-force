"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Streaming = void 0;
var __1 = require("..");
var cometd_1 = require("cometd");
var Streaming = /** @class */ (function () {
    /**
     * Creates an instance of Streaming class.  Used to listen to PushTopic and Platform Events
     * @param {Rest} [client] Optional client to use instead of the default connection
     * @memberof Streaming
     */
    function Streaming(client) {
        var _this = this;
        /**
         * Method to connect to salesforce.  Call before attempting to subscribe to event events or topics
         *
         * @memberof Streaming
         */
        this.connect = function () {
            return new Promise(function (resolve, reject) {
                _this.listener.handshake(function (resp) {
                    if (resp.successful) {
                        resolve();
                    }
                    else {
                        reject(resp);
                    }
                });
            });
        };
        /**
         * Disconnects the streaming client.  Will unsubscribe for all active subscriptions
         *
         * @memberof Streaming
         */
        this.disconnect = function () {
            return new Promise(function (resolve, reject) {
                _this.listener.disconnect(function (m) {
                    if (m.successful) {
                        resolve();
                    }
                    else {
                        reject(m);
                    }
                });
            });
        };
        /**
         * Returns `true` if the client is currently connected with salesforce
         *
         * @memberof Streaming
         */
        this.isConnected = function () {
            return !_this.listener.isDisconnected();
        };
        client = client || new __1.Rest();
        this.subscribers = new Map();
        this.listener = new cometd_1.CometD();
        this.listener.websocketEnabled = false;
        this.listener.configure({
            url: "".concat(client.config.instanceUrl, "/cometd/").concat(client.config.version.toFixed(1), "/"),
            requestHeaders: { Authorization: "OAuth ".concat(client.config.accessToken) },
            appendMessageTypeToURL: false,
        });
    }
    /**
     * Removes a transport from the cometd connection.
     * See: https://docs.cometd.org/current/reference/#_javascript_transports_unregistering
     * @param {('websocket' | 'long-polling' | 'callback-polling')} transport
     * @memberof Streaming
     */
    Streaming.prototype.unregisterTransport = function (transport) {
        this.listener.unregisterTransport(transport);
    };
    /**
     * General purpose method to subscribe to any uri.
     *   Use `subscribeToTopic`, `subscribeToTopicMapped` & `subscribeToEvent` for most use cases
     *
     * @param {string} channel the relative uri to subscribe to.  EX: '/topic/abc'
     * @param {(message: any) => void} onEvent Callback handler to process received events
     * @returns {Promise<SubscriptionHandle>} A cometd SubscriberHandle.  It's recommended to use
     * @memberof StreamClient
     */
    Streaming.prototype._subscribe = function (channel, onEvent) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.listener.isDisconnected()) {
                reject('Streaming client is not connected!  Must run connect first!');
            }
            var subscriber = _this.listener.subscribe(channel, onEvent, function (m) {
                if (m.successful) {
                    _this.subscribers.set(channel, subscriber);
                    resolve(subscriber);
                }
                else {
                    reject(m);
                }
            });
        });
    };
    /**
     * Method to unsubscribe from any subscription.
     * @param {string} channel
     * @param {('topic' | 'event')} [type] Optional parameter to help build channel
     * @returns {Promise<void>}
     * @memberof StreamClient
     */
    Streaming.prototype.unsubscribe = function (channel, type) {
        var _this = this;
        channel = type ? "/".concat(type, "/").concat(channel) : channel;
        return new Promise(function (resolve, reject) {
            if (_this.subscribers.has(channel)) {
                var subscriber = _this.subscribers.get(channel);
                _this.listener.unsubscribe(subscriber, function (m) {
                    if (m.successful) {
                        resolve();
                    }
                    else {
                        reject(m);
                    }
                });
            }
            else {
                reject("No subscriber for ".concat(channel, " found"));
            }
        });
    };
    /**
     * Method to subscribe to a platform events
     * @template T type of the event `payload`
     * @param {string} event The name of the PlatformEvent to subscribe to.  EG: `My_Event__e` (do not include `/event/`)
     * @param {(m: PlatformEvent<T>) => void} onEvent
     * @returns {Promise<SubscriptionHandle>}
     * @memberof Streaming
     */
    Streaming.prototype.subscribeToEvent = function (event, onEvent) {
        return this._subscribe("/event/".concat(event), onEvent);
    };
    /**
     * Method to subscribe to a push topic
     *    See `subscribeToTopicMapped` to automatically map your response to a generated SObject class
     * @template T The signature of of the event `data.sobject`
     * @param {string} topic The name of the PushTopic to subscribe to.  EG: `MyTopic` (do not include `/topic/`)
     * @param {(m: TopicMessage<T>) => void} onEvent Your event handler
     * @returns {Promise<SubscriptionHandle>}
     * @memberof Streaming
     */
    Streaming.prototype.subscribeToTopic = function (topic, onEvent) {
        return this._subscribe("/topic/".concat(topic), onEvent);
    };
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
    Streaming.prototype.subscribeToTopicMapped = function (sObjectType, topic, onEvent) {
        return this.subscribeToTopic(topic, function (m) {
            var mappedEvent = {
                data: {
                    event: m.data.event,
                    sObject: sObjectType.fromSFObject(m.data.sobject),
                },
                channel: m.channel,
                clientId: m.clientId,
            };
            return onEvent(mappedEvent);
        });
    };
    return Streaming;
}());
exports.Streaming = Streaming;
