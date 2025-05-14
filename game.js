let round = 1;
let gameInterval = null;

class Player {
  constructor({ name, health, powers }) {
    this.name = name;
    this.health = health;
    this.powers = powers;
  }

  isAlive() {
    return this.health > 0;
  }

  getRandomPower() {
    const keys = Object.keys(this.powers);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return { key, value: this.powers[key] };
  }

  battle(opponent, output) {
    const myPower = this.getRandomPower();
    const oppPower = opponent.getRandomPower();

    output(`${this.name} (${myPower.key}: ${myPower.value}) vs ${opponent.name} (${oppPower.key}: ${oppPower.value})`);

    this.health -= 1;
    opponent.health -= 1;

    if (myPower.value > oppPower.value) {
      opponent.health -= 10;
      output(`${this.name} wins!`);
    } else if (myPower.value < oppPower.value) {
      this.health -= 10;
      output(`${opponent.name} wins!`);
    } else {
      output("Draw!");
    }
  }
}

function startGame() {
  const log = document.getElementById("output");
  log.innerText = "";
  round = 1;

  if (gameInterval) {
    clearTimeout(gameInterval);
  }

  function output(text) {
    log.innerText += text + "\n";
  }

  const playerData = [
    { name: "Nicolas Orozoco", health: 95, powers: { grit: 40, sneak: 35, smell: 50 } },
    { name: "Rachit Jaiswal", health: 90, powers: { argue: 45, speed: 20, stress: 40 } },
    { name: "Ruhaan Bansal", health: 100, powers: { speed: 50, reflex: 35, endurance: 30 } },
    { name: "Paaras Purhottie", health: 85, powers: { confusion: 45, luck: 40, stumble: 30 } },
    { name: "Mr. Mortensen", health: 100, powers: { patience: 50, vanish: 40, calm: 35 } },
  ];

  let players = playerData.map(data => new Player(data));

  function gameRound() {
    const alivePlayers = players.filter(p => p.isAlive());

    if (alivePlayers.length <= 1) {
      const winner = alivePlayers[0];
      output("\nGame Over!");
      if (winner) {
        output(`Winner: ${winner.name} with ${winner.health} health left.`);
      } else {
        output("No one survived.");
      }
      return;
    }

    output(`\n--- Round ${round} ---`);
    const attackerIndex = Math.floor(Math.random() * alivePlayers.length);
    const attacker = alivePlayers[attackerIndex];

    for (let i = 0; i < alivePlayers.length; i++) {
      if (i !== attackerIndex) {
        attacker.battle(alivePlayers[i], output);
      }
    }

    players = players.filter(p => p.isAlive());

    output("\nLeaderboard:");
    players
      .sort((a, b) => b.health - a.health)
      .forEach(p => output(`${p.name}: ${p.health} HP`));

    round++;
    gameInterval = setTimeout(gameRound, 1500);
  }

  gameRound();
}