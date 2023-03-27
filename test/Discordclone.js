const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Discordclone", function () {

let deployer, user
let discordclone

const NAME = "Discordclone"
const SYMBOL = "DC"

  beforeEach(async () => {
    [deployer, user] = await ethers.getSigners()

    const Discordclone = await ethers.getContractFactory("discordclone")
    discordclone = await Discordclone.deploy(NAME, SYMBOL)
  })

    describe("Deployment", function () {
      it("Sets the name", async () => {
        // Fetch name

        let result = await discordclone.name()
        // Check name
        expect(result).to.equal(NAME)
      })

      it("Sets the symbol", async () => {

        // Fetch symbol
        let result = await discordclone.symbol()
        // Check symbol
        expect(result).to.equal(SYMBOL)
      })

      it("Sets the owner", async () => {
        let result = await discordclone.owner()
        // Check symbol
        expect(result).to.equal(deployer.address)
      })
    })
})
