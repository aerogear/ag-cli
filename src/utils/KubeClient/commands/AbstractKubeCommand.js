"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_node_1 = require("@kubernetes/client-node");
var AbstractKubeCommand = /** @class */ (function () {
    function AbstractKubeCommand() {
        this.kubeConfig = new client_node_1.KubeConfig();
        this.kubeConfig.loadFromDefault();
    }
    AbstractKubeCommand.prototype.getCurrentNamespace = function () {
        var context = this.kubeConfig.getCurrentContext();
        if (context && context.includes('/')) {
            return context.split('/', 1)[0];
        }
        return context;
    };
    return AbstractKubeCommand;
}());
exports.AbstractKubeCommand = AbstractKubeCommand;
