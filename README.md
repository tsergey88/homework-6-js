# homework-6-js

Итак, на основе 5 и 6 лекции, благодаря коллективным усилиям у нас появилась игра, в которой монстр может сражаться с героем, но просто 1 на 1 - это не интересно, поэтому объявляется турнир. В турнире могут принимать участие как герои, так и монстры, битвы на турнире будут проходить в формате 1 на 1, при этом герои с героями и монстры с монстрами сражаться так же могут. Для того, что бы заявиться на турнир участнику необходимо иметь имя ( при этом имя Героя должно быть из списка Разрешенных Имен Героев, а имя Монстра из справочника по Монстрам и Тварям). Так же герой должен представлять один из трех героических классов: Вор, Воин или Волшебник, а монстр один из трех классов монстров: Гоблин, Толпа орков или Вампир. Каждый из классов обладает своими характеристиками силы и здоровья. Так же надо учесть, что некоторые хитрые герои или монстры, могут принять некое волшебное пойло перед турниром, которое даст им спецспособность противоположной расы (соответственно для героя - спецспособность монстра, для монстра - спецспособность героя) работать она будет при тех же условиях, что и основная способность.

Основные способности:
Для героя - когда уровень жизни снижается ниже 50%, на два хода становится неуязвимым
Для монстра - когда уровень жизни снижается ниже 50%, на два хода увеличивает свой урон в два раза

Итак, как происходит турнир - 

Объявляется турнир на N участников, после этого происходит их регистрация, каждый участник проходит фейсконтроль и если он не соответствует вышеописанным параметрам - он не допускается для турнира, о чем герольды тут же сообщают. На турнир не может зарегистрироваться более N участников, менее N считается допустимым. 

По окончанию регистрации начинаются бои участников между собой - погибший участник автоматически выбывает из турнира. Турнир заканчивается, когда остается один (соответственно он и объявляется победителем) или ниодного (увы, достойного не нашлось).

##### Код с 6й лекции

    function Character(life,damage){
      this.life = life;
      this.damage = damage;
      this.maxLife = life;
      this.counter = 2;
    }

    Character.prototype.setLife = function(dmg) {
      this.life -= dmg;
    }

    Character.prototype.getDamage = function() {
      return this.damage;
    }

    Character.prototype.attack = function(obj) {
      obj.setLife(this.getDamage());
    }

    Character.prototype.isAlive = function() {
      return this.life > 0;
    }

    Character.prototype.getLife = function() {
      return this.life;
    }

    Character.prototype.shouldUseSkill = function() {
      return (this.life < this.maxLife/2 && this.counter > 0); 
    }



    function Hero () {
      Character.apply(this, arguments);
    }


    Hero.prototype = Object.create(Character.prototype);
    Hero.prototype.constructor = Hero;


    Hero.prototype.setLife = function(dmg) {

      if ( this.shouldUseSkill() ) {
        this.counter--;   
      } else {
          this.life -= dmg;
        } 

    }



    function Monster () {
      Character.apply(this, arguments);
    }

    Monster.prototype = Object.create(Character.prototype);
    Monster.prototype.constructor = Monster;


    Monster.prototype.getDamage = function() {

      if ( this.shouldUseSkill() ) {
        this.counter--;
        return this.damage*2;
      }

      return this.damage;
    }


    function monsterFactory() {
      return new Monster(220, 50);
    }

    function heroFactory() {
      return new Hero(300, 75);
    }

    function Game(monster, hero) {
      this.hero = hero;
      this.monster = monster;
    }

    Game.prototype.getHero = function() {
      return this.hero;
    }

    Game.prototype.getMonster = function() {
      return this.monster;
    }

    Game.prototype.fight = function (hero, monster) {
      while (hero.isAlive() && monster.isAlive()) {
        hero.attack(monster);
        console.log('Хп монстра: ' + monster.getLife());
        monster.attack(hero);
        console.log('Хп героя: ' +hero.getLife());
      }
    }

    var myGame = new Game(monsterFactory(), heroFactory());

    myGame.fight(myGame.getHero(), myGame.getMonster());





















