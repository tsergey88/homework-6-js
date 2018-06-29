const
    ALLOWED_NAMES_HERO = ['Absinthe', 'Brandy', 'Armagnac', 'Grappa', 'Calvados', 'Kirsch', 'Slivovitz', 'Whiskey', 'Bourbon'],
    DIRECTORY_MONSTERS_CREATURES = ['Gin', 'Ouzo', 'Maotai', 'Mulberry', 'Chacha', 'Cachaca', 'Rum', 'Tequila', 'Vodka'];

function Character(unitClass, life, damage) {
    this.unitClass = unitClass;
    this.life = life;
    this.damage = damage;
    this.maxLife = life;
    this.counter = 2;
    this.rateCheat = Math.floor(Math.random() * 10); //Коэффицент читерства ))
}

Character.prototype.getName = function (dmg) {
    return this.name;
}

Character.prototype.getType = function (dmg) {
    return this.unitType;
}

Character.prototype.getUnitClass = function (dmg) {
    return this.unitClass;
}

Character.prototype.getDamage = function () {
    return this.damage;
}

Character.prototype.attack = function (obj) {
    obj.setLife(this.getDamage());
}

Character.prototype.isAlive = function () {
    return this.life > 0;
}

Character.prototype.setLife = function (dmg) {
    this.life -= dmg;
}

Character.prototype.getLife = function () {
    if (this.life > 0) {
        return this.life;
    } else return ('is dead');
}

Character.prototype.refreshLife = function (dmg) {
    this.life = this.maxLife;
}

Character.prototype.shouldUseSkill = function () {
    return (this.life < this.maxLife / 2 && this.counter > 0);
}

function Hero() {
    Character.apply(this, arguments);
    this.unitType = 'Hero';
    let randNameForHero = Math.floor(Math.random() * ALLOWED_NAMES_HERO.length);
    this.name = ALLOWED_NAMES_HERO[randNameForHero];
    if (!this.name || ALLOWED_NAMES_HERO.indexOf(this.name) == -1) {
        throw new Error('Неверное имя');
    }
}

Hero.prototype = Object.create(Character.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.setLife = function (dmg) {

    if (this.shouldUseSkill()) {
        this.counter--;
    } else {
        this.life -= dmg;
    }

}

Hero.prototype.getOpponent = function (obj) {
    if (obj.getType() == 'Monster' && this.rateCheat > 5) {
        Hero.prototype.setLife = function (dmg) {
            this.life -= dmg;
        }
        Hero.prototype.getDamage = function () {
            if (this.shouldUseSkill()) {
                this.counter--;
                return this.damage * 2;
            }

            return this.damage;
        }
    }
}

function Monster() {
    Character.apply(this, arguments);
    this.unitType = 'Monster';
    let randNameForMonster = Math.floor(Math.random() * DIRECTORY_MONSTERS_CREATURES.length);
    this.name = DIRECTORY_MONSTERS_CREATURES[randNameForMonster];
    if (!this.name || DIRECTORY_MONSTERS_CREATURES.indexOf(this.name) == -1) {
        throw new Error('Неверное имя');
    }
}

Monster.prototype = Object.create(Character.prototype);
Monster.prototype.constructor = Monster;

Monster.prototype.getDamage = function () {

    if (this.shouldUseSkill()) {
        this.counter--;
        return this.damage * 2;
    }

    return this.damage;
}

Monster.prototype.getOpponent = function (obj) {
    if (obj.getType() == 'Hero' && this.rateCheat > 5) {
        Monster.prototype.setLife = function (dmg) {
            if (this.shouldUseSkill()) {
                this.counter--;
            } else {
                this.life -= dmg;
            }
        }
        Monster.prototype.getDamage = function () {
            return this.damage;
        }
    }
}

function Tournament(countUnit) {
    this.countUnit = countUnit;
}

Tournament.prototype.registrationUnit = function () {
    this.unitList = [];
    for (let i = 0; i < this.countUnit; i++) {
        if (arguments[i]) {
            this.unitList[i] = arguments[i];
        }
    }
}

Tournament.prototype.showUnits = function () {
    for (let i = 0; i < this.unitList.length; i++) {
        console.log('Name: ' + this.unitList[i].getName() + '. Unit Class: ' + this.unitList[i].getUnitClass() + '. Life: ' + this.unitList[i].getLife() + '. Damage: ' + this.unitList[i].getDamage());
    }
}

Tournament.prototype.meetsUnit = function (firstUnit, secondUnit) {
    this.unitList[firstUnit].getOpponent(this.unitList[secondUnit]);
    this.unitList[secondUnit].getOpponent(this.unitList[firstUnit]);
}

Tournament.prototype.fight = function (firstUnit, secondUnit) {
    this.meetsUnit(firstUnit, secondUnit);
    while (this.unitList[firstUnit].isAlive() && this.unitList[secondUnit].isAlive()) {
        this.unitList[firstUnit].attack(this.unitList[secondUnit]);
        console.log('Хп 1: ' + this.unitList[secondUnit].getName() + ' ' + this.unitList[secondUnit].getLife());
        if (this.unitList[secondUnit].isAlive()) {
            this.unitList[secondUnit].attack(this.unitList[firstUnit]);
            console.log('Хп 2: ' + this.unitList[firstUnit].getName() + ' ' + this.unitList[firstUnit].getLife());
        }
    }
}

Tournament.prototype.getWinnerUnitList = function (firstUnit, secondUnit, winnerUnitList) {
    if (this.unitList[firstUnit].isAlive()) {
        this.unitList[firstUnit].refreshLife();
        return winnerUnitList.splice(-1, 0, this.unitList[firstUnit]);
    } else {
        this.unitList[secondUnit].refreshLife();
        return winnerUnitList.splice(-1, 0, this.unitList[secondUnit]);
    }
}

Tournament.prototype.start = function () {
    while (this.unitList.length > 1) {

        let unitWithoutPair;
        if (this.unitList.length % 2) {
            unitWithoutPair = this.unitList[this.unitList.length - 1];
            this.unitList.splice(-1, 1);
        }

        let winnerUnitList = [];
        for (let i = 0; i < this.unitList.length; i += 2) {

            let firstUnit = i,
                secondUnit = i + 1;

            this.fight(firstUnit, secondUnit);
            this.getWinnerUnitList(firstUnit, secondUnit, winnerUnitList);
        }

        if (unitWithoutPair) {
            winnerUnitList.splice(-1, 0, unitWithoutPair);
        }

        this.unitList = winnerUnitList;
    }
    console.log('Победитель: ' + this.unitList[0].getName() + '!!!');
}

function VampireFactory() {
    return new Monster('Vampire', 220, 50);
}

function OrcsFactory() {
    return new Monster('Orcs', 520, 100);
}

function GoblinFactory() {
    return new Monster('Goblin', 320, 100);
}

function WizardFactory() {
    return new Hero('Wizard', 200, 300);
}

function WarriorFactory() {
    return new Hero('Warrior', 300, 275);
}

function ThiefFactory() {
    return new Hero('Thief', 100, 175);
}

let newTour = new Tournament(5);
newTour.registrationUnit(WizardFactory(), ThiefFactory(), VampireFactory(), GoblinFactory(), OrcsFactory());
newTour.showUnits();
newTour.start();