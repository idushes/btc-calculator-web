const calculate = (elecCost, difficultyT, efficiency, blockReward) => {
    const difficultyKey = difficultyT * 1e12;
    const hashesPerBlock = difficultyKey * Math.pow(2, 32);
    const energyJoules = hashesPerBlock * (efficiency / 1e12);
    const energyKwh = energyJoules / 3.6e6;
    const costPerBlock = energyKwh * elecCost;
    const costPerBtc = costPerBlock / blockReward;
    
    console.log(`
    Inputs:
    Elec Cost: $${elecCost}
    Difficulty: ${difficultyT} T
    Efficiency: ${efficiency} J/TH
    Block Reward: ${blockReward} BTC
    
    Results:
    Hashes/Block: ${hashesPerBlock.toExponential(2)}
    Energy/Block: ${(energyKwh).toFixed(2)} kWh
    Cost/Block: $${costPerBlock.toFixed(2)}
    Cost/BTC: $${costPerBtc.toFixed(2)}
    `);
}

calculate(0.06, 125.86, 17.0, 3.125); // S21+
calculate(0.06, 125.86, 19.5, 3.125); // T21
