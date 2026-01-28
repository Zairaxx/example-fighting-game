class Fighter {
    constructor(name, health, attackPower, defense) {
        this.name = name;
        this.health = health;
        this.attackPower = attackPower;
        this.defense = defense;
    }

    attack(opponent) {
        if (opponent.health > 0) {
            opponent.health -= (this.attackPower - opponent.defense);
            if (opponent.health < 0) opponent.health = 0;
        }
    }

    static async generateFighter() {
        //Slumpmässigt namn från api
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        const name = `${data.results[0].name.first} ${data.results[0].name.last}`;
        const health = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
        const attackPower = Math.floor(Math.random() * (30 - 20 + 1)) + 20;
        const defense = Math.floor(Math.random() * (15 - 10 + 1)) + 10;
        return new Fighter(name, health, attackPower,defense);
    }
}

class Game {

    static fighters = [];
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
            <p>Defense: ${fighter.defense}</p>
            <button id="${fighter.name}-attack" class="punch-button">Punch!</button>
        `;
        container.appendChild(fighterDiv);

        document.getElementById(`${fighter.name}-attack`).addEventListener('click', () => {
            const opponent = fighters.find(f => f !== fighter);
            if (opponent) {
                fighter.attack(opponent); //Ändrar värdet i datat
                document.getElementById(`${opponent.name}-health`).textContent = opponent.health; //Uppdatera DOM:en till nya värden i datat 
                document.getElementById(`${opponent.name}-progress`).value = opponent.health; //Uppdatera DOM:en till nya värden i datat 
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
        document.body.prepend(button);
    }

    static async addFighter() {
        if (Game.fighters.length < 2) {
            const fighter = await Fighter.generateFighter();
            fighters.push(fighter);
            Game.renderFighter(fighter);
        }
        if (Game.fighters.length === 2) {
            document.getElementById('generate-fighter').disabled = true;
        }
    }
}

const fighters = [];

Game.startGame();