class Fighter {
    constructor(name, health, attackPower) {
        this.name = name;
        this.health = health;
        this.attackPower = attackPower;
    }

    attack(opponent) {
        if (opponent.health > 0) {
            opponent.health -= this.attackPower;
            if (opponent.health < 0) opponent.health = 0;
        }
    }

    static async generateFighter() {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        const name = `${data.results[0].name.first} ${data.results[0].name.last}`;
        const health = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
        const attackPower = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
        return new Fighter(name, health, attackPower);
    }
}

class Game {
    static renderFighter(fighter) {
        const container = document.getElementById('game');
        const fighterDiv = document.createElement('div');
        fighterDiv.classList.add('fighter');
        fighterDiv.innerHTML = `
            <img src="https://www.shutterstock.com/image-vector/brown-bulldog-boxer-cartoon-illustration-600nw-2430850963.jpg" alt="Fighter Image" class="fighter-image">
            <h2>${fighter.name}</h2>
            <p>Health: <span id="${fighter.name}-health">${fighter.health}</span></p>
            <progress id="${fighter.name}-progress" value="${fighter.health}" max="200"></progress>
            <p>Attack Power: ${fighter.attackPower}</p>
            <button id="${fighter.name}-attack" class="punch-button">Punch!</button>
        `;
        container.appendChild(fighterDiv);

        document.getElementById(`${fighter.name}-attack`).addEventListener('click', () => {
            const opponent = fighters.find(f => f !== fighter);
            if (opponent) {
                fighter.attack(opponent);
                document.getElementById(`${opponent.name}-health`).textContent = opponent.health;
                document.getElementById(`${opponent.name}-progress`).value = opponent.health;
                if (opponent.health === 0) {
                    alert(`${fighter.name} wins!`);
                }
            }
        });
    }

    static startGame() {
        const container = document.getElementById('game');
        container.classList.add('game-container');
        const button = document.createElement('button');
        button.id = 'generate-fighter';
        button.textContent = 'Generate Fighter';
        button.classList.add('generate-button');
        button.addEventListener('click', Game.addFighter);
        container.appendChild(button);
    }

    static async addFighter() {
        if (fighters.length < 2) {
            const fighter = await Fighter.generateFighter();
            fighters.push(fighter);
            Game.renderFighter(fighter);
        }
        if (fighters.length === 2) {
            document.getElementById('generate-fighter').disabled = true;
        }
    }
}

const fighters = [];

Game.startGame();