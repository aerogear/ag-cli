# Developing for the Aerogear CLI (ag-cli)

The aerogear CLI is developed in typescript and can be invoked as both `oc` or `kubectl` plugin.

It actually supports the following features:
* creating and deleting mobileclients on both the local workspace and the remote openshift cluster
* pulling moblieclients already present into the openshift cluster into the local workspace
* pushing an mobileclient from the local workspace to a remote cluster
* binding services to a mobile client locally without affecting the cluster
* pushing the changes done locally to an application to a remote cluster

When a service is bound to an application, validation of the service configuration is performed.
Moreover, it is easy to add custom validations for custom keys/configurations (see [Cli Commands](./CliCommands.md#Validators)).

When developing for CLI, usually 2 things needs to be done:
1. [add a new command to the CLI](./CliCommands.md)
2. [ass a new kube command](./KubeCommands.md) (optional)

