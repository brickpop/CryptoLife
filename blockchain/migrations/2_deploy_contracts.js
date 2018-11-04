const DateTime = artifacts.require("./DateTime.sol")
const Bookings = artifacts.require("./Bookings.sol")

const roomPrice = 300000000000000000
const roomDeposit = 300000000000000000

module.exports = function (deployer, env, accounts) {
  deployer.deploy(DateTime)
  deployer.link(DateTime, Bookings)
  deployer.deploy(Bookings, accounts[2], roomPrice, roomDeposit)
}
