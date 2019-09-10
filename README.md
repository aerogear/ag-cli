# Aerogear CLI

A command line tool to be used as plugin for both kubectl and oc clis to enable easy integration and management of 
aerogear mobile services.

## Requirements

Openshift 3.11+, Kubernetes 1.11 + or kubectl 1.12+

## Usage

Clone the repo and run:

```
make install
```

This will build, run all tests and copy both `kubectl-ag` and `plugin.yaml` files into their required targets.

The CLI then can then be use by either kubectl or oc:

```bash
$ kubectl ag ...
$ oc ag ...
```

It can also be directly invoked by using the `kubectl-ag` binary.

## Development

Running tests:

```bash
$ npm test
```

## License

This software is licensed under Apache 2.0, see the "LICENSE" file for a full description of its terms.