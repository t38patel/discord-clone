// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Discordclone is ERC721 {

    address public owner;
    uint256 public totalChannels;
    uint256 public totalSupply;

    struct Channel {
        uint256 id;
        string name;
        uint256 cost;
    }

    mapping(uint256 => Channel) public channels;
    mapping(uint256 => mapping(address => bool)) public hasJoined;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function createChannel(string memory _name, uint256 _cost) public onlyOwner {
        // _cost is the cost to join the channel
        totalChannels++;
        channels[totalChannels] = Channel(totalChannels, _name, _cost);
    }

    function mint(uint256 _channel_id) public payable {
        require(_channel_id != 0);
        require(_channel_id <= totalChannels);
        require(hasJoined[_channel_id][msg.sender] == false);
        require(msg.value >= channels[_channel_id].cost);

        hasJoined[_channel_id][msg.sender] = true;

        totalSupply++;
        _safeMint(msg.sender, totalSupply);
    }

    function getChannel(uint256 _channel_id) public view returns (Channel memory) {
        return channels[_channel_id];
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }

}
