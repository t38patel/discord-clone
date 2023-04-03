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

    //Creating channel
    const transaction = await discordclone.connect(deployer).createChannel("general", tokens(1))
    await transaction.wait()
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

    describe("Creating channels", () => {
      it('Returns total channels', async () => {
        const result = await discordclone.totalChannels()
        expect(result).to.be.equal(1)
      })
      it('Returns channel attributes', async () => {
        const channel = await discordclone.getChannel(1)
        expect(channel.id).to.be.equal(1)
        expect(channel.name).to.be.equal("general")
        expect(channel.cost).to.be.equal(tokens(1))
      })
    })

    describe("Joining Channels", () => {
      const ID = 1
      const AMOUNT = ethers.utils.parseUnits("1", 'ether')
  
      beforeEach(async () => {
        const transaction = await discordclone.connect(user).mint(ID, { value: AMOUNT })
        await transaction.wait()
      })
  
      it('Joins the user', async () => {
        const result = await discordclone.hasJoined(ID, user.address)
        expect(result).to.be.equal(true)
      })
  
      it('Increases total supply', async () => {
        const result = await discordclone.totalSupply()
        expect(result).to.be.equal(ID)
      })
  
      it('Updates the contract balance', async () => {
        const result = await ethers.provider.getBalance(discordclone.address)
        expect(result).to.be.equal(AMOUNT)
      })
    })

    describe("Withdrawing", () => {
      const ID = 1
      const AMOUNT = ethers.utils.parseUnits("10", 'ether')
      let balanceBefore
  
      beforeEach(async () => {
        balanceBefore = await ethers.provider.getBalance(deployer.address)
  
        let transaction = await discordclone.connect(user).mint(ID, { value: AMOUNT })
        await transaction.wait()
  
        transaction = await discordclone.connect(deployer).withdraw()
        await transaction.wait()
      })
  
      it('Updates the owner balance', async () => {
        const balanceAfter = await ethers.provider.getBalance(deployer.address)
        expect(balanceAfter).to.be.greaterThan(balanceBefore)
      })
  
      it('Updates the contract balance', async () => {
        const result = await ethers.provider.getBalance(discordclone.address)
        expect(result).to.equal(0)
      })
    })


})
