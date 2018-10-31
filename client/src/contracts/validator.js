import { getWeb3 } from "./web3"
import validatorAbi from "./validator.json"
import config from "../config.json"

export default function (customAddress) {
    let web3 = getWeb3()
    if (customAddress)
        return new web3.eth.Contract(validatorAbi, customAddress)
    else
        return new web3.eth.Contract(validatorAbi, config.VALIDATOR_CONTRACT_ADDRESS)
}
