# Dappartment

**Dappartment** (originally DHotel) is a project developed by [@ledfusion](https://www.github.com/ledfusion) at the [Status.im](https://status.im/) Hackathon 2018, [awarded with the **first prize**](https://our.status.im/cryptolife-winners-round-up/#travel-track) [in the Travel Track](https://gitcoin.co/kudos/157/status_hackathon_2018_travel_track_first_prize) of the contest. 

Dappartment features a set of components that empower a **decentralized reservation system** running on the Ethereum Blockchain. At the same time, it allows checked-in users to **unlock their rooms with the speaker of the smartphone**. 

The project is made of four building blocks:

* Reservation Smart Contracts
* Mobile client Dapp
* Access control server
* Door simulator

## Complete use-case

1. A customer **books a room** with the mobile Dapp client
	- An amount of ether is held in the smart contract
	- The booking can be canceled for free until a given date
2. The user eventually **checks in**
	- The hotel receives the money locked in the smart contract
	- The smart contract flags the user as the current guest
3. The user **requests access** to the room
	- The mobile Dapp signs an off-chain transaction to the access control server
	- The server checks the current guest on the blockchain
	- If the request signer matches the current guest on the blockchain, the server signs a timestamp with its own key
4. The mobile client receives the signed timestamp
	- The phone **uses the speaker to emit** the payload from the server
	- The door locker receives the payload with a **microphone**
	- If the signed timestamp matches the expected public key of the access control server, the door opens

Steps #1 and #2 involve blockchain transactions, while steps #3 and #4 are entirely off-chain. 

---

The original repo submitted can be [found here](https://github.com/status-im/CryptoLife/tree/ledfusion-dhotel). The current repo is a refined and better structured version of it.


## Getting started

```
make init         Installs the dependencies on every component
make clean        Runs "make clean" on every component
make all          Runs "make build" on every component
```

Run `make init ; make all` . You are good to go with any of the following components.

## Blockchain

The following smart contracts are available:

* Bookings
	* Handles bookings, money and check in's
* DateTime
	* Helper library used to convert timestamps and dates
* Validator
	* Extracts the public key given a message and its signature

### Test Driven Development

* The contracts are located on `blockchain/contracts/*`
* The spec's can be found on `blockchain/test/*`
* Run `make test` after you are done with your edits. 
* `make build` will compile your contracts on `./build`
	* The artifacts in this folder are used by the client apps
* Customize the `blockchain/scripts/deploy.js` file in order to deploy the contracts 
* Every time a new version of the contract is deployed:
	* Update `client/config.json` and `door-simulator.js` with the Bookings contract address
	* Update the environment variables of the Door Simulator server

## Access Control server

This component handles:

* API requests of users wanting to access a room
* The static files of the **client** component (below)

The mobile client Dapp has two main screens:

* `client/src/views/home.js`
	* Allows to check for availability, book, cancel reservations and check in
* `client/src/views/room.js`
	* Once checked in, users can unlock the door and check out

### Lifecycle
* Run `make dev` to start Nodemon and develop locally.
* Run `make build` to package for production and `make run` to serve locally the production build.
* Run `make deploy` to deploy to Heroku.

**Note:**
* A default (dummy) private key is provided
* Override it with a secret one, obviously
* Get the corresponding public key and set it in `door-simulator/src/index.js` > `serverPublicKey`

## Mobile Client Dapp

The client app needs to be visited from a browser holding some (test) ether. You can use [Metamask](https://www.metamask.io/) or [Status.im](https://status.im/) if unsure.

* Develop locally with `make dev`
* Compile with `make build` and serve the production build locally with `make run`

The initial prototype was published on [https://dhotel-server.herokuapp.com/](https://dhotel-server.herokuapp.com/)

## Door Simulator

The functionality of this component is intended to run on a physical door locker. This component provides a static web page that can listen to incoming sound payloads and simulate a door open when a request signed by the expected Access Control Server. 

* Develop locally with `make dev`
* Compile with `make build` and serve the production build locally with `make run`

This component needs access to a `Validator.sol` smart contract instance. But it can be deployed anywhere, even on the same host. 

An instance from the Main Net is available at: `0x9bd7a73263e1994813fedd0624d243372927b4f8`. 

## Disclaimers

* Not taking into account the timezones
* Unable to simulate certain timestamps on the test cases
* Obviously, the server private key would never be on a repo
* Single person hackathon team, everything is a best effort

## Whishlist
* Run the Door Simulator on a Raspberry Pi tied to a physical locker
* Use a standalone version of `ecrecover`: https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#ecrecover
* Optimize the storage variables and callable methods from the contract
* Ensure that contracts are recompiled when the servers are started
* Account for a more detailed casuistry
	* Allow the next day's booker to force a check out if today's user didn't
* Implement a state channel to allow in-room expenses
* Settle the state channel expenses when checking out
* Allow the user to replay the sound for 1 minute
* Check that the signed timestamps are always incremental
* Design, look and feel
* Nicely arrange and reorder the code
