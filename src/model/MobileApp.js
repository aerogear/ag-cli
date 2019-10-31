"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
/**
 * Object representation of a mobile application.
 * This class is used to load and save mobile application JSON files so that they are ready to be pushed to the server.
 */
var MobileApp = /** @class */ (function () {
    function MobileApp(name, namespace) {
        this.name = name;
        this.apikey = uuid_1.v4();
        this.ns = namespace;
    }
    MobileApp.prototype.getName = function () {
        return this.name;
    };
    MobileApp.prototype.getNameSpace = function () {
        return this.ns;
    };
    /**
     * Utility method to change the MobileApp namespace on the fly so that it can be chained.
     * @param ns the new namespace
     */
    MobileApp.prototype.namespace = function (ns) {
        this.ns = ns;
        return this;
    };
    MobileApp.prototype.toJson = function () {
        return {
            apiVersion: 'mdc.aerogear.org/v1alpha1',
            kind: 'MobileClient',
            metadata: {
                name: this.name,
            },
            spec: {
                name: this.name,
            },
            status: {
                clientId: this.name,
                namespace: this.ns,
                services: [],
            },
        };
    };
    return MobileApp;
}());
exports.MobileApp = MobileApp;
