const
    ALLOWED_NAMES_HERO = ['Absinthe', 'Brandy', 'Armagnac', 'Grappa', 'Calvados', 'Kirsch', 'Slivovitz', 'Whiskey', 'Bourbon'],
    DIRECTORY_MONSTERS_CREATURES = ['Gin', 'Ouzo', 'Maotai', 'Mulberry', 'Chacha', 'Cachaca', 'Rum', 'Tequila', 'Vodka'];

function Character(unitClass, life, damage) {
    this.unitClass = unitClass;
    this.life = life;
    this.damage = damage;
    this.maxLife = life;
    this.counter = 2;
}

Character.prototype.getName = function (dmg) {
    return this.name;
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

function Monster() {
    Character.apply(this, arguments);
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

Tournament.prototype.start = function () {
    while (this.unitList.length > 1) {
        let UnitWithoutPair, tempUnitList = [];
        if (this.unitList.length % 2) {
            UnitWithoutPair = this.unitList[this.unitList.length - 1];
            this.unitList.splice(-1, 1);
        }
        for (let i = 0; i < this.unitList.length; i += 2) {
            while (this.unitList[i].isAlive() && this.unitList[i + 1].isAlive()) {
                this.unitList[i].attack(this.unitList[i + 1]);
                console.log('Хп 1: ' + this.unitList[i + 1].getName() + ' ' + this.unitList[i + 1].getLife());
                if (this.unitList[i + 1].isAlive()) {
                    this.unitList[i + 1].attack(this.unitList[i]);
                    console.log('Хп 2: ' + this.unitList[i].getName() + ' ' + this.unitList[i].getLife());
                }
            }
            if (this.unitList[i].isAlive()) {
                this.unitList[i].refreshLife();
                tempUnitList.splice(-1, 0, this.unitList[i]);
            } else {
                this.unitList[i + 1].refreshLife();
                tempUnitList.splice(-1, 0, this.unitList[i + 1]);
            }
        }
        if (UnitWithoutPair) {
            tempUnitList.splice(-1, 0, UnitWithoutPair);
        }

        this.unitList = tempUnitList;
    }
    console.log('Победитель: ' + this.unitList[0].getName() + '!!!');
}

function VampireFactory() {
    return new Monster('Vampire', 220, 50);
}

function OrcsFactory() {
    return new Monster('Orcs', 520, 150);
}

function GoblinFactory() {
    return new Monster('Goblin', 320, 100);
}

function WizardFactory() {
    return new Hero('Wizard', 500, 250);
}

function WarriorFactory() {
    return new Hero('Warrior', 300, 275);
}

function ThiefFactory() {
    return new Hero('Thief', 100, 175);
}

let newTour = new Tournament(5);
newTour.registrationUnit(WizardFactory(), ThiefFactory(), VampireFactory(), GoblinFactory(), GoblinFactory());
newTour.showUnits();
newTour.start();