import React from "react"
import ReactDOM from "react-dom"

import getValidatorInstance from "../../client/src/contracts/validator.js"

const mainNetValidatorAddress = "0x9bd7a73263e1994813fedd0624d243372927b4f8"
const serverPublicKey = "0xbda352aeb022a1d8e847ee6372795d02dcbf53f8"

const Validator = getValidatorInstance(mainNetValidatorAddress)

class DoorSimulator extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			open: false,
			readError: null, // string if any
			receivedPayload: ""
		}

		// Clean if only partial content was received
		setInterval(() => {
			this.setState({ receivedPayload: "" })
		}, 5000)
	}

	componentDidMount() {
		// INIT AUDIO
		Quiet.addReadyCallback(() => {
			// RECEIVER
			Quiet.receiver({
				profile: "audible",
				// profile: "ultrasonic-experimental",
				onReceive: payload => this.gotPayload(Quiet.ab2str(payload)),
				onCreateFail: reason => console.error("failed to create quiet receiver: " + reason),
				onReceiveFail: () => console.error("RCV FAIL")
			});

			// SENDER
			const transmit = Quiet.transmitter({
				profile: "audible",
				// profile: "ultrasonic-experimental",
				onFinish: () => console.log("sent"),
				clampFrame: false
			});

			setTimeout(() => {
				const text = "WELCOME TO DHOTEL"
				transmit.transmit(Quiet.str2ab(text));
			}, 1800)
		}, err => {
			console.log("ERR", err)
		});
	}

	gotPayload(str) {
		if (!str) return
		const newPayload = this.state.receivedPayload + str
		this.setState({ receivedPayload: newPayload })
		if (str.length < 100) {
			this.checkPayload(newPayload)
		}
	}

	checkPayload(payload) {
		try {
			payload = JSON.parse(payload)
			if (payload && payload.signature && payload.timestamp) {
				this.verifySignature(payload.signature, payload.timestamp)
			}
		}
		catch (err) {
			this.setState({ open: false, receivedPayload: "", readError: "Unable to parse the response" })
			setTimeout(() => this.setState({ readError: null }), 4000)
			console.error("There was an error while parsing the response", payload)
		}
	}

	verifySignature(signature, timestamp) {
		// recover the public key of the sender
		signature = signature.substr(2)
		const r = '0x' + signature.slice(0, 64)
		const s = '0x' + signature.slice(64, 128)
		const v = '0x' + signature.slice(128, 130)
		const v_decimal = web3.utils.toDecimal(v)

		// get the timestamp provided
		const fixed_msg = `\x19Ethereum Signed Message:\n${timestamp.length}${timestamp}`
		const hashedTimestamp = web3.utils.sha3(fixed_msg)

		// decode address
		Validator.methods.verify(r, s, v_decimal, hashedTimestamp).call()
			.then(signerPublicKey => {
				// get the checked in guest
				console.log("RECEIVED", signerPublicKey)
				console.log("SERVER", serverPublicKey)

				if (!signerPublicKey || !signerPublicKey.toLowerCase || signerPublicKey == "0x0") {
					this.setState({ open: false, receivedPayload: "", readError: "The signature is not recognized" })
					setTimeout(() => this.setState({ readError: null }), 4000)
					return alert("Invalid signature")
				}

				// compare address with blockchain data
				if (signerPublicKey.toLowerCase() != serverPublicKey.toLowerCase()) {
					this.setState({ open: false, receivedPayload: "", readError: "The signature is not recognized" })
					setTimeout(() => this.setState({ readError: null }), 4000)
					return alert("Invalid signature")
				}

				this.setState({ open: true, receivedPayload: "" })

				// Close after a while
				setTimeout(() => {
					this.setState({ open: false })
				}, 5000)
			})
			.catch(err => {
				this.setState({ open: false, receivedPayload: "", readError: "Unable to verify the signature" })
				setTimeout(() => this.setState({ readError: nul }), 4000)
				console.error("There was en error while validating the server signature")
			})
	}

	renderError() {
		return <div className="container">
			<h1>Door simulator</h1>
			<h2>The payload could not be fully decoded</h2>

			<div className="status-box">{this.state.readError}</div>
		</div>
	}

	renderStatus() {
		return <div className="container">
			<h1>Door simulator</h1>
			<h2>The door is currently</h2>

			<div className="status-box">{this.state.open ? "OPEN" : "CLOSED"}</div>
		</div>
	}

	render() {
		return <div id="main" className={this.state.readError ? "door-error" : (this.state.open ? "door-open" : "door-closed")}>
			{this.state.readError ? this.renderError() : this.renderStatus()}
		</div>
	}
}

ReactDOM.render(<DoorSimulator />, document.getElementById("root"))
