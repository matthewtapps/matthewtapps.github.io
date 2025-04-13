// class_character.js

function class_character() {
  this.reset = reset;
  function reset() {
    debugConsole("reset() called");
    this.name = "";
    this.player = "";

    this.attributes = {};
    this.attributes.st = 10;
    this.attributes.dx = 10;
    this.attributes.iq = 10;
    this.attributes.ht = 10;

    this.secondary = {};
    this.secondary.will = 10;
    this.secondary.per = 10;
    this.secondary.fatigue = 10;
    this.secondary.curr_fatigue = 10;
    this.secondary.hp = 10;
    this.secondary.curr_hp = 10;

    this.secondary.speed = 5;
    this.secondary.move = 5;

    this.secondary.reaction = 0;

    this.melee_weapon_attack_skill = 10;
    this.brawling_skill = 10;
    this.ranged_weapon_attack_skill = 10;

    this.weapon = {
      ready: false,
      time_to_ready: 1,
      time_between_shots: 1,
      time_to_reload: 2,
      shots_current: 6,
      shots_max: 6,
    };

    this.defenses = {};
    this.defenses.dr = 0;
    this.defenses.dodge = 7;
    this.defenses.parry = 7;
    this.defenses.block = 7;

    this.points = 0;

    this.notes = "";

    this.posture = "Standing";

    this.maneuver = "Do nothing";

    this.colour = "";
  }

  this.calc = calc;
  function calc() {
    debugConsole("calc() called");
  }

  // On creation of object, set the default attributes
  this.reset();

  this.set_name = set_name;
  function set_name(new_value) {
    debugConsole("set_name('" + new_value + "') called");
    this.name = new_value;
  }

  this.get_name = get_name;
  function get_name() {
    debugConsole("get_name() called");
    return this.name;
  }

  this.set_player = set_player;
  function set_player(new_value) {
    debugConsole("set_player('" + new_value + "') called");
    this.player = new_value;
  }

  this.get_player = get_player;
  function get_player() {
    debugConsole("get_player() called");
    return this.player;
  }

  this.get_attribute = get_attribute;
  function get_attribute(attr_name) {
    debugConsole("get_attribute('" + attr_name + "') called");
    if (typeof this.attributes[attr_name] != "undefined")
      return this.attributes[attr_name];
    return "(undefined)";
  }

  this.get_defense = get_defense;
  function get_defense(defense_name) {
    debugConsole("get_defense('" + defense_name + "') called");
    if (typeof this.defenses[defense_name] != "undefined")
      return this.defenses[defense_name];
    return "(undefined)";
  }

  this.get_secondary = get_secondary;
  function get_secondary(attr_name) {
    debugConsole("get_secondary('" + attr_name + "') called");
    if (typeof this.secondary[attr_name] != "undefined")
      return this.secondary[attr_name];
    return "(undefined)";
  }

  this.set_attribute = set_attribute;
  function set_attribute(attr_name, new_value) {
    debugConsole(
      "set_attribute('" + attr_name + "', '" + new_value + "') called",
    );
    if (typeof this.attributes[attr_name] != "undefined") {
      this.attributes[attr_name] = new_value;
      this.calc();
      return this.attributes[attr_name];
    } else {
      return false;
    }
  }

  this.set_secondary = set_secondary;
  function set_secondary(attr_name, new_value) {
    debugConsole(
      "set_secondary('" + attr_name + "', '" + new_value + "') called",
    );
    if (typeof this.secondary[attr_name] != "undefined") {
      this.secondary[attr_name] = new_value;
      this.calc();
      return this.secondary[attr_name];
    } else {
      return false;
    }
  }

  this.set_defense = set_defense;
  function set_defense(defense_name, new_value) {
    debugConsole(
      "set_defense('" + defense_name + "', '" + new_value + "') called",
    );
    if (typeof this.defenses[defense_name] != "undefined") {
      this.defenses[defense_name] = new_value;
      this.calc();
      return this.defenses[defense_name];
    } else {
      return false;
    }
  }

  this.set_melee_weapon_attack_skill = set_melee_weapon_attack_skill;
  function set_melee_weapon_attack_skill(new_value) {
    this.melee_weapon_attack_skill = new_value;
  }

  this.get_melee_weapon_attack_skill = get_melee_weapon_attack_skill;
  function get_melee_weapon_attack_skill() {
    return this.melee_weapon_attack_skill;
  }

  this.set_brawling_skill = set_brawling_skill;
  function set_brawling_skill(new_value) {
    this.brawling_skill = new_value;
  }

  this.get_brawling_skill = get_brawling_skill;
  function get_brawling_skill() {
    return this.brawling_skill;
  }

  this.set_ranged_weapon_attack_skill = set_ranged_weapon_attack_skill;
  function set_ranged_weapon_attack_skill(new_value) {
    this.ranged_weapon_attack_skill = new_value;
  }

  this.get_ranged_weapon_attack_skill = get_ranged_weapon_attack_skill;
  function get_ranged_weapon_attack_skill() {
    return this.ranged_weapon_attack_skill;
  }

  this.set_notes = set_notes;
  function set_notes(new_value) {
    this.notes = new_value;
  }

  this.get_notes = get_notes;
  function get_notes() {
    return this.notes;
  }

  this.set_posture = set_posture;
  function set_posture(new_value) {
    this.posture = new_value;
  }

  this.get_posture = get_posture;
  function get_posture() {
    return this.posture;
  }

  this.set_maneuver = set_maneuver;
  function set_maneuver(new_value) {
    this.maneuver = new_value;
  }

  this.get_maneuver = get_maneuver;
  function get_maneuver() {
    const parts = this.maneuver.split("::") || [];
    return parts.length ? parts.join("<br>") : "-";
  }

  this.set_weapon = set_weapon;
  this.get_weapon = get_weapon;

  function set_weapon(field_name, new_value) {
    debugConsole(`set_weapon('${field_name}', '${new_value}') called`);
    if (typeof this.weapon[field_name] !== "undefined") {
      this.weapon[field_name] = new_value;
      return this.weapon[field_name];
    }
    return false;
  }

  function get_weapon(field_name) {
    debugConsole(`get_weapon('${field_name}') called`);
    if (typeof this.weapon[field_name] !== "undefined") {
      return this.weapon[field_name];
    }
    return "(undefined)";
  }

  this.set_colour = set_colour;
  this.get_colour = get_colour;

  function set_colour(new_value) {
    this.colour = new_value;
  }

  function get_colour() {
    return this.colour;
  }
}
