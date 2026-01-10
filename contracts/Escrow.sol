// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {
    // STATE VARIABLES
    address public depositor;      // Who deposits money
    address public beneficiary;    // Who receives money
    address public arbiter;        // Who approves release
    uint public amount;            // Amount locked
    bool public isApproved;        // Approval status
    
    // EVENTS (for frontend to listen)
    event Approved(uint balance);
    
    // CONSTRUCTOR - Called when contract is deployed
    // msg.value = ETH sent with deployment
    constructor(address _arbiter, address _beneficiary) payable {
        depositor = msg.sender;         // Person deploying = depositor
        beneficiary = _beneficiary;     // Set beneficiary
        arbiter = _arbiter;             // Set arbiter
        amount = msg.value;             // Store ETH amount
    }
    
    // APPROVE FUNCTION - Only arbiter can call
    function approve() external {
        // Security check: Only arbiter can approve
        require(msg.sender == arbiter, "Only arbiter can approve!");
        
        // Mark as approved
        isApproved = true;
        
        // Send all money to beneficiary
        (bool success, ) = beneficiary.call{value: address(this).balance}("");
        require(success, "Transfer failed!");
        
        // Emit event (frontend will see this!)
        emit Approved(amount);
    }
}
