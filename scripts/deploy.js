const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts & variables
  const [deployer] = await ethers.getSigners()
  const NAME = "Discordclone"
  const SYMBOL = "DC"

  // Deploy contract
  const Discordclone = await ethers.getContractFactory("Discordclone")
  const discordclone = await Discordclone.deploy(NAME, SYMBOL)
  await discordclone.deployed()

  console.log(`Deployed Discordclone Contract at: ${discordclone.address}\n`)

  // Create 3 Channels
  const CHANNEL_NAMES = ["general", "intro", "jobs"]
  const COSTS = [tokens(1), tokens(0), tokens(0.25)]

  for (var i = 0; i < 3; i++) {
    const transaction = await discordclone.connect(deployer).createChannel(CHANNEL_NAMES[i], COSTS[i])
    await transaction.wait()

    console.log(`Created text channel #${CHANNEL_NAMES[i]}`)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});