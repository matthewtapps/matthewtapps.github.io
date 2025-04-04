// gm_control.js
var gm_control_sheet = new Array();
var gm_control_current_turn = 0;
var gm_control_current_combatatant = 0;
var gm_control_currently_editing = 0;
function gm_control_propogate_mooks() {
  debugConsole("gm_control_propogate_mooks() called");
  original_length = gm_control_sheet.length;
  for (count = 0; count < 5; count++) {
    gm_control_sheet.push(new class_character());
    gm_control_sheet[count + original_length].set_name("Long Name Mook #" + (count + 1));
  }
  gm_control_display_sheet();
}

var gm_control_sheet_currently_selected = Array();

function gm_control_start_combat() {
  gm_control_current_turn = 1;
  gm_control_current_combatatant = 0;
  gm_control_sort_by_base_speed();
  gm_control_update_turn_box();

  if (gm_control_sheet.length > 0)
    $(".js-turn-controls").slideDown();
  else
    create_alert("It's probably a good idea to have participants in the combat before you start combat.", "warning");
}

function gm_control_apply_fatigue(char_index, fatigue_amount) {
  gm_control_sheet[char_index].secondary.curr_fatigue -= fatigue_amount;
  //	gm_control_sheet[char_index].shock_amount = damage_amount;
  //	if( gm_control_sheet[char_index].shock_amount > 4)
  //		gm_control_sheet[char_index].shock_amount = 4;
  gm_control_display_sheet();
}

function gm_control_next_combatatant() {
  gm_control_sheet[gm_control_current_combatatant].shock_amount = 0;

  gm_control_current_combatatant++;
  if (gm_control_current_combatatant >= gm_control_sheet.length) {
    gm_control_current_combatatant = 0;
    gm_control_current_turn++;
  }
  gm_control_update_turn_box();
}

function gm_control_stop_combat() {
  for (gm_count = 0; gm_count < gm_control_sheet.length; gm_count++)
    gm_control_sheet[gm_count].shock_amount = 0;
  $(".js-turn-controls").slideUp();
  gm_control_current_turn = 0;
  gm_control_display_sheet();
}

function gm_control_update_turn_box() {
  html = "<fieldset><legend>Combat Turn Control - Turn #" + gm_control_current_turn + "</legend>";
  if (gm_control_current_combatatant > 0) {
    html += '<a href="#" class="js-gm-control-go-to-beginning-turn"><span class="glyphicon glyphicon-fast-backward" title="Go to start of turn"></span></a>';
    html += '<a href="#" class="js-gm-control-go-to-previous-turn"><span class="glyphicon glyphicon-backward" title="Start back a turn"></span></a>';
  } else {
    html += '<span class="glyphicon glyphicon glyphicon-fast-backward" title="Start Combat Session"></span>';
    html += '<span class="glyphicon glyphicon glyphicon-backward" title="Start Combat Session"></span>';
  }
  html += '<a href="#" class="js-gm-control-stop-combat"><span class="glyphicon glyphicon glyphicon-stop" title="Stop Combat Session"></span></a>';
  html += '<a href="#" class="js-gm-control-go-to-next-turn"><span class="glyphicon glyphicon glyphicon-forward" title="Go to next turn"></span></a>';
  html += '</fieldset>';

  $(".js-turn-controls").html(html);

  $(".js-gm-control-go-to-beginning-turn").unbind('click');
  $(".js-gm-control-go-to-beginning-turn").click(function(event) {
    debugConsole(".js-gm-control-go-to-beginning-turn clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    gm_control_current_combatatant = 0;
    gm_control_update_turn_box();
  });

  $(".js-gm-control-go-to-previous-turn").unbind('click');
  $(".js-gm-control-go-to-previous-turn").click(function(event) {
    debugConsole(".js-gm-control-go-to-previous-turn clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    gm_control_current_combatatant = gm_control_current_combatatant - 1;
    if (gm_control_current_combatatant < 0)
      gm_control_current_combatatant = 0;
    gm_control_update_turn_box();
  });

  $(".js-gm-control-stop-combat").unbind('click');
  $(".js-gm-control-stop-combat").click(function(event) {
    debugConsole(".js-gm-control-stop-combat clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    gm_control_stop_combat();
  });

  $(".js-gm-control-go-to-next-turn").unbind('click');
  $(".js-gm-control-go-to-next-turn").click(function(event) {
    debugConsole(".js-gm-control-go-to-next-turn clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    gm_control_next_combatatant();
    gm_control_update_turn_box();

  });

  gm_control_display_sheet();
}



function gm_control_export_json(selected_only) {
  export_object = Array();

  for (count = 0; count < gm_control_sheet.length; count++) {
    export_item = {
      name: gm_control_sheet[count].get_name(),
      player: gm_control_sheet[count].get_player(),

      attributes: {
        st: gm_control_sheet[count].get_attribute('st') / 1,
        dx: gm_control_sheet[count].get_attribute('dx') / 1,
        iq: gm_control_sheet[count].get_attribute('iq') / 1,
        ht: gm_control_sheet[count].get_attribute('ht') / 1
      },

      secondary: {
        will: gm_control_sheet[count].get_secondary('will') / 1,
        per: gm_control_sheet[count].get_secondary('per') / 1,
        fatigue: gm_control_sheet[count].get_secondary('fatigue') / 1,
        curr_fatigue: gm_control_sheet[count].get_secondary('curr_fatigue') / 1,
        hp: gm_control_sheet[count].get_secondary('hp') / 1,
        curr_hp: gm_control_sheet[count].get_secondary('curr_hp') / 1,

        speed: gm_control_sheet[count].get_secondary('speed') / 1,
        move: gm_control_sheet[count].get_secondary('move') / 1,

        reaction: gm_control_sheet[count].get_secondary('reaction') / 1,

      },

      defenses: {
        dodge: gm_control_sheet[count].get_defense('dodge') / 1,
        parry: gm_control_sheet[count].get_defense('parry') / 1,
        block: gm_control_sheet[count].get_defense('block') / 1,
        dr: gm_control_sheet[count].get_defense('dr') / 1
      },
      melee_weapon_attack_skill: gm_control_sheet[count].get_melee_weapon_attack_skill(),
      ranged_weapon_attack_skill: gm_control_sheet[count].get_ranged_weapon_attack_skill(),
      brawling_skill: gm_control_sheet[count].get_brawling_skill(),

      posture: gm_control_sheet[count].get_posture(),
      maneuver: gm_control_sheet[count].get_maneuver(),
      notes: gm_control_sheet[count].get_notes(),
    }

    if (selected_only) {
      if ($.inArray(count, gm_control_sheet_currently_selected) > -1)
        export_object.push(export_item);
    } else {
      export_object.push(export_item);
    }
  }
  return JSON.stringify(export_object);
}

function gm_control_save_to_local_storage() {
  debugConsole("gm_control_save_to_local_storage() called");
  local_storage_save("gm_control_current_sheet", gm_control_export_json(), true);
}


function gm_control_import_json(import_string, overwrite) {
  debugConsole("gm_control_import_json() called");
  try {
    import_object = JSON.parse(import_string);

    if (overwrite) {
      for (var i = gm_control_sheet.length - 1; i >= 0; i--) {
        player_name = gm_control_sheet[i].get_player();
        if (!player_name)
          gm_control_sheet.splice(i, 1);
      }
    }

    debugConsole("gm_control_import_json() - type is " + typeof (import_object));
    if (typeof (import_object) == "object") {
      debugConsole("gm_control_import_json() - import is an array");
      for (import_count = 0; import_count < import_object.length; import_count++) {
        imported_object = gm_control_import_object(import_object[import_count]);
        gm_control_sheet.push(imported_object);
      }
    }
    gm_control_display_sheet();
  }
  catch (error) {
    create_alert("Could not import JSON. Please check the formatting!", "danger");
  }
}

function gm_control_import_object(importing_object) {
  debugConsole("gm_control_import_object() called");
  return_value = new class_character();

  if (typeof (importing_object.name) != "undefined")
    return_value.set_name(importing_object.name);

  if (typeof (importing_object.player) != "undefined")
    return_value.set_player(importing_object.player);

  if (typeof (importing_object.attributes.st) != "undefined")
    return_value.set_attribute('st', importing_object.attributes.st / 1);
  if (typeof (importing_object.attributes.dx) != "undefined")
    return_value.set_attribute('dx', importing_object.attributes.dx / 1);
  if (typeof (importing_object.attributes.iq) != "undefined")
    return_value.set_attribute('iq', importing_object.attributes.iq / 1);
  if (typeof (importing_object.attributes.ht) != "undefined")
    return_value.set_attribute('ht', importing_object.attributes.ht / 1);

  if (typeof (importing_object.secondary.will) != "undefined")
    return_value.set_secondary('will', importing_object.secondary.will / 1);
  if (typeof (importing_object.secondary.per) != "undefined")
    return_value.set_secondary('per', importing_object.secondary.per / 1);
  if (typeof (importing_object.secondary.fatigue) != "undefined")
    return_value.set_secondary('fatigue', importing_object.secondary.fatigue / 1);
  if (typeof (importing_object.secondary.curr_fatigue) != "undefined")
    return_value.set_secondary('curr_fatigue', importing_object.secondary.curr_fatigue / 1);

  if (typeof (importing_object.secondary.hp) != "undefined")
    return_value.set_secondary('hp', importing_object.secondary.hp / 1);
  if (typeof (importing_object.secondary.curr_hp) != "undefined")
    return_value.set_secondary('curr_hp', importing_object.secondary.curr_hp / 1);


  if (typeof (importing_object.secondary.reaction) != "undefined")
    return_value.set_secondary('reaction', importing_object.secondary.reaction / 1);

  if (typeof (importing_object.secondary.move) != "undefined")
    return_value.set_secondary('move', importing_object.secondary.move / 1);
  if (typeof (importing_object.secondary.speed) != "undefined")
    return_value.set_secondary('speed', importing_object.secondary.speed / 1);

  if (typeof (importing_object.melee_weapon_attack_skill) != "undefined")
    return_value.set_melee_weapon_attack_skill(importing_object.melee_weapon_attack_skill);
  if (typeof (importing_object.ranged_weapon_attack_skill) != "undefined")
    return_value.set_ranged_weapon_attack_skill(importing_object.ranged_weapon_attack_skill);
  if (typeof (importing_object.brawling_skill) != "undefined")
    return_value.set_brawling_skill(importing_object.brawling_skill);

  if (typeof (importing_object.posture) != "undefined")
    return_value.set_posture(importing_object.posture);
  if (typeof (importing_object.maneuver) != "undefined")
    return_value.set_maneuver(importing_object.maneuver);
  if (typeof (importing_object.notes) != "undefined")
    return_value.set_notes(importing_object.notes);

  if (typeof (importing_object.defenses) != "undefined") {
    if (typeof (importing_object.defenses.dodge) != "undefined")
      return_value.set_defense('dodge', importing_object.defenses.dodge / 1);
    if (typeof (importing_object.defenses.parry) != "undefined")
      return_value.set_defense('parry', importing_object.defenses.parry / 1);
    if (typeof (importing_object.defenses.block) != "undefined")
      return_value.set_defense('block', importing_object.defenses.dodge / 1);
    if (typeof (importing_object.defenses.dr) != "undefined")
      return_value.set_defense('dr', importing_object.defenses.dr / 1);
  }

  return return_value;
}

function gm_control_display_sheet() {
  debugConsole("gm_control_display_sheet() called");
  html = "";
  activate_sort_table = false;
  local_storage_save("gm_control_current_sheet", gm_control_export_json(), true);
  if (gm_control_sheet.length > 0) {
    for (count = 0; count < gm_control_sheet.length; count++) {
      current_combatatant = "";
      if (gm_control_current_turn > 0 && gm_control_current_combatatant == count)
        current_combatatant = " current-combatatant";
      html += '<tr class="dragrow' + current_combatatant + '" ref="' + count + '">';
      checked = '';
      if ($.inArray(count, gm_control_sheet_currently_selected) > -1) {
        checked = 'checked="checked" ';
      }

      player_name = gm_control_sheet[count].get_player();

      is_pc = "is_pc='0'";
      if (player_name)
        is_pc = "is_pc='1'";

      html += '<td class="text-right"><span class="glyphicon glyphicon-move drag-select"></span><input ' + is_pc + ' ' + checked + 'type="checkbox" ref="' + count + '" class="js-select-check" /></td>';
      html += '<td>';
      html += '<a href="#" ref="' + count + '" title="View This Entry" class="js-gm-control-line-view"><span class="glyphicon glyphicon-eye-open"></span></a> ';
      is_hidden = "style='display: none'";
      if (gm_control_sheet[count].shock_amount)
        is_hidden = "";
      html += "<span class='shock-damage js-shock-damage-" + count + "' " + is_hidden + " title='This character is in shock!'>-" + gm_control_sheet[count].shock_amount + "</span>";
      html += gm_control_sheet[count].get_name();

      if (player_name)
        html += " (" + player_name + ")";
      html += '<div class="js-mobile-details js-mobile-details-' + count + '" style="display:none">';
      html += '<h5>Attributes</h5>';
      html += '<div><strong>ST</strong>: ' + gm_control_sheet[count].get_attribute('st') + ' <strong>DX</strong>: ' + gm_control_sheet[count].get_attribute('dx') + ' <strong>IQ</strong>: ' + gm_control_sheet[count].get_attribute('iq') + ' <strong>HT</strong>: ' + gm_control_sheet[count].get_attribute('ht') + '</div>';
      html += '<div>Reaction: ' + gm_control_sheet[count].get_secondary('reaction') + '</div>';
      html += '<div>Will/Perception: ' + gm_control_sheet[count].get_secondary('will') + '/' + gm_control_sheet[count].get_secondary('per') + '</div>';
      html += '<div class="text-right">';
      html += ' <a href="#" ref="' + count + '" title="Edit This Entry" class="js-gm-control-line-edit"><span class="glyphicon glyphicon-edit"></span></a> ';
      html += ' <a href="#" ref="' + count + '" title="Duplicate This Entry" class="js-gm-control-line-duplicate"><span class="glyphicon glyphicon-share"></span></a> ';
      html += ' <a href="#" ref="' + count + '" title="Remove This Entry" class="js-gm-control-line-remove"><span class="glyphicon glyphicon-trash"></span></a> ';
      html += '</div>';
      html += '</div>';
      html += '</td>';

      //html += '<td class="hidden-xs">' + gm_control_sheet[count].get_attribute('st') + ' / ' + gm_control_sheet[count].get_attribute('dx') + ' / ' + gm_control_sheet[count].get_attribute('iq') + ' / ' + gm_control_sheet[count].get_attribute('ht') + '</td>';
      //html += '<td class="hidden-xs">' + gm_control_sheet[count].get_secondary('will') + ' / ' + gm_control_sheet[count].get_secondary('per') + '</td>';
      html += '<td class="text-center">' + gm_control_sheet[count].get_secondary('speed');
      if (gm_control_sheet[count].random_roll)
        html += ' <sub title="This is the random roll for ties">' + gm_control_sheet[count].random_roll + '</sub>';
      html += ' </td>';
      html += '<td class="text-center">' + gm_control_sheet[count].get_secondary('move') + '</td>';
      html += '<td class="text-center">' + gm_control_sheet[count].get_defense('dodge') + ' / ' + gm_control_sheet[count].get_defense('block') + ' / ' + gm_control_sheet[count].get_defense('parry') + '</td>';
      html += '<td class="text-center">' + gm_control_sheet[count].get_defense('dr') + '</td>';
      html += '<td class="text-center">';
      html += '<a href="#" ref="' + count + '" title="Apply Damage" class="js-gm-control-damage-modify js-gm-control-damage-modify-' + count + '">' + gm_control_sheet[count].get_secondary('curr_hp') + '</a> / ' + gm_control_sheet[count].get_secondary('hp');
      html += '<div class="js-gm-control-damage-modify-dropdown">';
      html += '<a href="#" ref="' + count + '" class="js-gm-control-damage-modify-zero"><span class="glyphicon glyphicon-circle-arrow-down"></span></a>';
      html += '<a href="#" ref="' + count + '" class="js-gm-control-damage-modify-minus"><span class="glyphicon glyphicon-minus"></span></a>';
      html += '<a href="#" ref="' + count + '" class="js-gm-control-damage-modify-ok"><span class="glyphicon glyphicon-ok"></span></a>';
      html += '<a href="#" ref="' + count + '" class="js-gm-control-damage-modify-plus"><span class="glyphicon glyphicon-plus"></span></a>';
      html += '<a href="#" ref="' + count + '" class="js-gm-control-damage-modify-max"><span class="glyphicon glyphicon-circle-arrow-up"></span></a>';
      html += '</div></td>';
      html += '<td class="text-center">';
      html += '<a href="#" ref="' + count + '" title="Apply Fatigue" class="js-gm-control-fatigue-modify js-gm-control-fatigue-modify-' + count + '">' + gm_control_sheet[count].get_secondary('curr_fatigue') + '</a> / ' + gm_control_sheet[count].get_secondary('fatigue');

      html += '<div class="js-gm-control-fatigue-modify-dropdown">';
      html += '<a href="#" ref="' + count + '" class="js-gm-control-fatigue-modify-zero"><span class="glyphicon glyphicon-circle-arrow-down"></span></a>';
      html += '<a href="#" ref="' + count + '" class="js-gm-control-fatigue-modify-minus"><span class="glyphicon glyphicon-minus"></span></a>';
      html += '<a href="#" ref="' + count + '" class="js-gm-control-fatigue-modify-ok"><span class="glyphicon glyphicon-ok"></span></a>';
      html += '<a href="#" ref="' + count + '" class="js-gm-control-fatigue-modify-plus"><span class="glyphicon glyphicon-plus"></span></a>';
      html += '<a href="#" ref="' + count + '" class="js-gm-control-fatigue-modify-max"><span class="glyphicon glyphicon-circle-arrow-up"></span></a>';
      html += '</div></td>';

      html += '</td>';
      html += '<td class="text-center">' + gm_control_sheet[count].get_melee_weapon_attack_skill() + '</td>';
      html += '<td class="text-center">' + gm_control_sheet[count].get_ranged_weapon_attack_skill() + '</td>';
      html += '<td class="text-center">' + gm_control_sheet[count].get_brawling_skill() + '</td>';

      html += '<div class="js-gm-control-posture-modify">'
      html += '<td class="text-center js-editable js-posture-edit" data-field="posture" data-index="' + count + '">' + gm_control_sheet[count].get_posture() + '</td>';
      html += '</div>'

      html += '<div class="js-gm-control-maneuver-modify">'
      html += '<td class="text-center js-editable js-maneuver-edit" data-field="maneuver" data-index="' + count + '">' + gm_control_sheet[count].get_maneuver() + '</td>';
      html += '</div>'

      html += '<div class="js-gm-control-notes-modify">'
      html += '<td class="text-center js-editable js-notes-edit" data-field="notes" data-index="' + count + '">' + gm_control_sheet[count].get_notes() + '</td>';
      html += '</div>'
      //	html += '<td class="hidden-xs">' + gm_control_sheet[count].get_secondary('reaction') + '</td>';
      html += '<td class="hidden-xs text-center">';
      html += ' <a href="#" ref="' + count + '" title="Edit This Entry" class="js-gm-control-line-edit"><span class="glyphicon glyphicon-edit"></span></a> ';
      html += ' <a href="#" ref="' + count + '" title="Duplicate This Entry" class="js-gm-control-line-duplicate"><span class="glyphicon glyphicon-share"></span></a> ';
      html += ' <a href="#" ref="' + count + '" title="Remove This Entry" class="js-gm-control-line-remove"><span class="glyphicon glyphicon-trash"></span></a> ';
      //			html += '<a href="#" ref="' + count + '" title="Duplicate This Entry" class="js-gm-control-duplicate-line"><span class="glyphicon glyphicon-minus"></span></a>';


      html += '</td>';
      html += '</tr>';
      activate_sort_table = true;
    }
  } else {
    html += "<tr><td colspan='15'>There are no items in your control sheet</td></tr>"
  }

  $(".js-gm-control-sheet-display-data").html(html);

  gm_control_refresh_events();



  if (activate_sort_table) {


    //$(".js-gm-control-sheet-display-data").sortable();
    $('.sorted_table').sortable({
      containerSelector: 'table',
      itemPath: '> tbody',
      itemSelector: '.dragrow',
      handle: '.drag-select',
      placeholder: '<tr class="placeholder" />',
      onDrop: function(item, container, _super) {
        var field,
          newIndex = item.index();
        oldIndex = item.attr("ref");

        var temp_item = gm_control_sheet[oldIndex];
        gm_control_sheet[oldIndex] = gm_control_sheet[newIndex];
        gm_control_sheet[newIndex] = temp_item;

        // now swap the oldIndex with the newIndex in the gm_control_sheet_currently_selected
        for (select_count = 0; select_count < gm_control_sheet_currently_selected.length; select_count++) {
          if (gm_control_sheet_currently_selected[select_count] / 1 == oldIndex / 1) {
            gm_control_sheet_currently_selected[select_count] = newIndex / 1;
          } else {
            if (gm_control_sheet_currently_selected[select_count] / 1 == newIndex / 1)
              gm_control_sheet_currently_selected[select_count] = oldIndex / 1;
          }
        }
        temp_item = "";
        gm_control_display_sheet();
      }
    });
    $('.sorted_table').touchDraggable();

  } else {
    $(".sorted_table").sortable("disable");
  }




}

function gm_control_propogate_damage_form(character) {
  debugConsole("gm_control_init_entry_form() called");
  if (character) {
    $(".js-char-entry-field-name").val(character.get_name());
    $(".js-char-entry-field-player").val(character.get_player());

    $(".js-char-entry-field-hp").val(character.get_secondary('hp'));
    $(".js-char-entry-field-curr_hp").val(character.get_secondary('curr_hp'));

    $(".js-char-entry-field-fatigue").val(character.get_secondary('fatigue'));
    $(".js-char-entry-field-curr_fatigue").val(character.get_secondary('curr_fatigue'));

    $(".js-char-entry-field-dodge").val(character.get_defense('dodge'));
    $(".js-char-entry-field-parry").val(character.get_defense('parry'));
    $(".js-char-entry-field-block").val(character.get_defense('block'));
    $(".js-char-entry-field-dr").val(character.get_defense('dr'));
  }
}

function gm_control_init_entry_form(character) {
  debugConsole("gm_control_init_entry_form() called");
  if (character) {
    $(".js-char-field-name").val(character.get_name());
    $(".js-char-field-player").val(character.get_player());

    $(".js-char-field-st").val(character.get_attribute('st'));
    $(".js-char-field-dx").val(character.get_attribute('dx'));
    $(".js-char-field-iq").val(character.get_attribute('iq'));
    $(".js-char-field-ht").val(character.get_attribute('ht'));

    $(".js-char-field-speed").val(character.get_secondary('speed'));
    $(".js-char-field-move").val(character.get_secondary('move'));
    $(".js-char-field-will").val(character.get_secondary('will'));
    $(".js-char-field-per").val(character.get_secondary('per'));

    $(".js-char-field-reaction").val(character.get_secondary('reaction'));


    $(".js-char-field-hp").val(character.get_secondary('hp'));
    $(".js-char-field-curr_hp").val(character.get_secondary('curr_hp'));

    $(".js-char-field-fatigue").val(character.get_secondary('fatigue'));
    $(".js-char-field-curr_fatigue").val(character.get_secondary('curr_fatigue'));

    $(".js-char-field-dodge").val(character.get_defense('dodge'));
    $(".js-char-field-parry").val(character.get_defense('parry'));
    $(".js-char-field-block").val(character.get_defense('block'));
    $(".js-char-field-dr").val(character.get_defense('dr'));

    $(".js-char-field-melee_weapon_attack_skill").val(character.get_melee_weapon_attack_skill());
    $(".js-char-field-ranged_weapon_attack_skill").val(character.get_ranged_weapon_attack_skill());
    $(".js-char-field-brawling_skill").val(character.get_brawling_skill());

    $(".js-char-field-posture").val(character.get_posture());
    $(".js-char-field-maneuver").val(character.get_maneuver());
    $(".js-char-field-notes").val(character.get_notes());
  } else {
    $(".js-char-field-name").val('');
    $(".js-char-field-player").val('');

    $(".js-char-field-st").val('10');
    $(".js-char-field-dx").val('10');
    $(".js-char-field-iq").val('10');
    $(".js-char-field-ht").val('10');

    $(".js-char-field-speed").val('5');
    $(".js-char-field-move").val('5');
    $(".js-char-field-will").val('10');
    $(".js-char-field-per").val('10');

    $(".js-char-field-dodge").val('7');
    $(".js-char-field-parry").val('0');
    $(".js-char-field-block").val('0');
    $(".js-char-field-dr").val('0');

    $(".js-char-field-melee_weapon_attack_skill").val('10');
    $(".js-char-field-ranged_weapon_attack_skill").val('10');
    $(".js-char-field-brawling_skill").val('10');

    $(".js-char-field-posture").val('Standing');

    $(".js-char-field-maneuver").val('Do nothing');

    $(".js-char-field-notes").val('');

    $(".js-char-field-reaction").val('0');

    $(".js-char-field-hp").val('10');
    $(".js-char-field-curr_hp").val('10');

    $(".js-char-field-fatigue").val('10');
    $(".js-char-field-curr_fatigue").val('10');
  }

  $(".js-char-field-move").unbind("keyup");
  $(".js-char-field-move").keyup(function() {
    gm_control_update_edit_char();
  }
  );

  $(".js-char-field-speed").unbind("keyup");
  $(".js-char-field-speed").keyup(function() {
    gm_control_update_edit_char('speed');
  }
  );

  $(".js-char-field-st").unbind("keyup");
  $(".js-char-field-st").keyup(function() {
    gm_control_update_edit_char('st');
  }
  );

  $(".js-char-field-dx").unbind("keyup");
  $(".js-char-field-dx").keyup(function() {
    gm_control_update_edit_char();
  }
  );

  $(".js-char-field-dx").unbind("keyup");
  $(".js-char-field-dx").keyup(function() {
    gm_control_update_edit_char('dx');
  }
  );

  $(".js-char-field-iq").unbind("keyup");
  $(".js-char-field-iq").keyup(function() {
    gm_control_update_edit_char('iq');
  }
  );

  $(".js-char-field-ht").unbind("keyup");
  $(".js-char-field-ht").keyup(function() {
    gm_control_update_edit_char('ht');
  }
  );
}

function gm_control_update_edit_char(changed_name) {
  debugConsole("gm_control_update_edit_char() called");

  if (changed_name == "ht" || changed_name == "dx") {
    new_speed = ($(".js-char-field-ht").val() / 1 + $(".js-char-field-dx").val() / 1) / 4;
    $(".js-char-field-speed").val(new_speed);
    $(".js-char-field-move").val(Math.floor($(".js-char-field-speed").val() / 1));
    $(".js-char-field-dodge").val($(".js-char-field-move").val() / 1 + 3);
  }

  if (changed_name == "speed") {
    $(".js-char-field-move").val(Math.floor($(".js-char-field-speed").val() / 1));
    $(".js-char-field-dodge").val($(".js-char-field-move").val() / 1 + 3);
  }

  if (changed_name == "iq") {
    $(".js-char-field-will").val($(".js-char-field-iq").val());
    $(".js-char-field-per").val($(".js-char-field-iq").val());
  }

  if (changed_name == "st") {
    $(".js-char-field-hp").val($(".js-char-field-st").val());
    $(".js-char-field-curr_hp").val($(".js-char-field-st").val());
  }
  if (changed_name == "ht") {
    $(".js-char-field-fatigue").val($(".js-char-field-ht").val());
    $(".js-char-field-curr_fatigue").val($(".js-char-field-ht").val());
  }

}

function gm_control_assign_data_to_char(character) {
  debugConsole("gm_control_assign_data_to_char() called");
  character.set_name($(".js-char-field-name").val());
  character.set_player($(".js-char-field-player").val());

  character.set_attribute("st", $(".js-char-field-st").val() / 1);
  character.set_attribute("dx", $(".js-char-field-dx").val() / 1);
  character.set_attribute("iq", $(".js-char-field-iq").val() / 1);
  character.set_attribute("ht", $(".js-char-field-ht").val() / 1);

  character.set_secondary("speed", $(".js-char-field-speed").val() / 1);
  character.set_secondary("move", $(".js-char-field-move").val() / 1);
  character.set_secondary("will", $(".js-char-field-will").val() / 1);
  character.set_secondary("per", $(".js-char-field-per").val() / 1);

  character.set_secondary("reaction", $(".js-char-field-reaction").val() / 1);


  character.set_secondary("hp", $(".js-char-field-hp").val() / 1);
  character.set_secondary("curr_hp", $(".js-char-field-curr_hp").val() / 1);

  character.set_secondary("fatigue", $(".js-char-field-fatigue").val() / 1);
  character.set_secondary("curr_fatigue", $(".js-char-field-curr_fatigue").val() / 1);

  character.set_melee_weapon_attack_skill($(".js-char-field-melee_weapon_attack_skill").val());
  character.set_ranged_weapon_attack_skill($(".js-char-field-ranged_weapon_attack_skill").val());
  character.set_brawling_skill($(".js-char-field-brawling_skill").val());

  character.set_defense("dr", $(".js-char-field-dr").val() / 1);
  character.set_defense("block", $(".js-char-field-block").val() / 1);
  character.set_defense("parry", $(".js-char-field-parry").val() / 1);
  character.set_defense("dodge", $(".js-char-field-dodge").val() / 1);

  character.set_notes($(".js-char-field-notes").val());
  character.set_maneuver($(".js-char-field-maneuver").val());
  character.set_posture($(".js-char-field-posture").val());


  return character;
}

function gm_control_show_add_line_dialog() {
  debugConsole("gm_control_show_add_line_dialog() called");
  gm_control_init_entry_form();
  $(".js-gm-control-line-dialog-action-button").text("Add").button('refresh');
  $(".js-gm-control-line-dialog-title").text("Adding Entry");
  $(".js-area-add-more").show();

  $('.js-gm-control-line-dialog-action-button').unbind('click');
  $('.js-gm-control-line-dialog-action-button').on("click", function(event) {
    event.preventDefault();
    document.getSelection().removeAllRanges();

    number_to_add = $(".js-char-field-add-more").val();

    if (number_to_add > 1) {
      for (add_count = 0; add_count < number_to_add; add_count++) {


        // Create a new character object
        newChar = new class_character();

        // Add entry data to new character
        newChar = gm_control_assign_data_to_char(newChar);

        new_name = newChar.get_name() + " #" + (add_count + 1);
        console.log("new_name" + new_name);

        newChar.set_name(new_name);
        gm_control_sheet.push(newChar);
      }
    } else {
      // Create a new character object
      newChar = new class_character();

      // Add entry data to new character
      newChar = gm_control_assign_data_to_char(newChar);

      // add to gm_control_sheet array
      gm_control_sheet.push(newChar);
    }

    // Refresh Sheet
    gm_control_display_sheet();
    $('.js-gm-control-line-dialog').modal('hide');
    return false;
  });

  $('.js-gm-control-line-dialog').modal();
}

function gm_control_show_edit_line_dialog(character, index) {
  gm_control_init_entry_form(character);
  $(".js-gm-control-line-dialog-action-button").val("Save").button('refresh');
  $(".js-gm-control-line-dialog-title").text("Editing Entry");

  $(".js-area-add-more").hide();
  gm_control_currently_editing = index;
  $('.js-gm-control-line-dialog-action-button').unbind('click');
  $('.js-gm-control-line-dialog-action-button').on("click", function(event) {
    event.preventDefault();
    document.getSelection().removeAllRanges();
    // Update data to exiting character in gm_control_sheet
    gm_control_sheet[gm_control_currently_editing] = gm_control_assign_data_to_char(gm_control_sheet[gm_control_currently_editing]);
    //		console.log( gm_control_sheet[gm_control_currently_editing] );
    // Refresh Sheet
    gm_control_display_sheet();
    gm_control_currently_editing = 0;
    $('.js-gm-control-line-dialog').modal('hide');
    return false;
  });


  $('.js-gm-control-line-dialog').modal();
}

function gm_control_show_edit_damage_dialog(character, index) {
  gm_control_init_entry_form(character);
  $(".js-gm-control-damage-dialog-action-button").val("Save").button('refresh');
  $(".js-gm-control-damage-dialog-title").text("Applying Damage");

  options_html = "";
  for (damagecount = 1; damagecount < 21; damagecount++)
    options_html += '<option value="' + damagecount + '">' + damagecount + ' points</option>';

  $(".js-applied-damage-field").html(options_html);
  $(".js-area-add-more").hide();
  gm_control_currently_editing = index;
  gm_control_propogate_damage_form(gm_control_sheet[gm_control_currently_editing]);
  $('.js-gm-control-damage-dialog-action-button').unbind('click');
  $('.js-gm-control-damage-dialog-action-button').on("click", function(event) {
    event.preventDefault();
    document.getSelection().removeAllRanges();
    // Update data to exiting character in gm_control_sheet
    gm_control_apply_damage(gm_control_currently_editing, $(".js-applied-damage-field").val());
    //		console.log( gm_control_sheet[gm_control_currently_editing] );
    // Refresh Sheet
    gm_control_display_sheet();
    gm_control_currently_editing = 0;
    $('.js-gm-control-damage-dialog').modal('hide');
    return false;
  });


  $('.js-gm-control-damage-dialog').modal();
}


function gm_control_show_edit_fatigue_dialog(character, index) {
  gm_control_init_entry_form(character);
  $(".js-gm-control-fatigue-dialog-action-button").val("Save").button('refresh');
  $(".js-gm-control-fatigue-dialog-title").text("Applying Damage");

  options_html = "";
  for (damagecount = 1; damagecount < 21; damagecount++)
    options_html += '<option value="' + damagecount + '">' + damagecount + ' points</option>';

  $(".js-applied-fatigue-field").html(options_html);
  $(".js-area-add-more").hide();
  gm_control_currently_editing = index;
  gm_control_propogate_damage_form(gm_control_sheet[gm_control_currently_editing]);
  $('.js-gm-control-fatigue-dialog-action-button').unbind('click');
  $('.js-gm-control-fatigue-dialog-action-button').on("click", function(event) {
    event.preventDefault();
    document.getSelection().removeAllRanges();
    // Update data to exiting character in gm_control_sheet
    gm_control_apply_fatigue(gm_control_currently_editing, $(".js-applied-fatigue-field").val());
    //		console.log( gm_control_sheet[gm_control_currently_editing] );
    // Refresh Sheet
    gm_control_display_sheet();
    gm_control_currently_editing = 0;
    $('.js-gm-control-fatigue-dialog').modal('hide');
    return false;
  });


  $('.js-gm-control-fatigue-dialog').modal();
}

function gm_control_show_duplicate_line_dialog(character) {
  gm_control_init_entry_form(character);
  $(".js-gm-control-line-dialog-action-button").val("Add").button('refresh');
  $(".js-gm-control-line-dialog-title").text("Duplicating Entry");
  $(".js-area-add-more").show();


  $('.js-gm-control-line-dialog-action-button').unbind('click');
  $('.js-gm-control-line-dialog-action-button').on("click", function(event) {
    event.preventDefault();
    document.getSelection().removeAllRanges();

    number_to_add = $(".js-char-field-add-more").val();

    if (number_to_add > 1) {
      for (add_count = 0; add_count < number_to_add; add_count++) {
        new_name = $(".js-char-field-name").val() + " #" + (add_count + 1);

        // Create a new character object
        newChar = new class_character();

        // Add entry data to new character
        newChar = gm_control_assign_data_to_char(newChar);

        newChar.set_name(new_name);
        gm_control_sheet.push(newChar);
      }
    } else {
      // Create a new character object
      newChar = new class_character();

      // Add entry data to new character
      newChar = gm_control_assign_data_to_char(newChar);

      // add to gm_control_sheet array
      gm_control_sheet.push(newChar);
    }

    // Refresh Sheet
    gm_control_display_sheet();

    // hide dialog
    $('.js-gm-control-line-dialog').modal('hide');
    return false;
  });

  $('.js-gm-control-line-dialog').modal();
}

function gm_control_refresh_events() {
  // function for making sure any new HTML created have events tied
  debugConsole("gm_control_refresh_events() called");

  // Action Bar Controls
  $('.js-gm-control-new').unbind('click');
  $('.js-gm-control-new').click(function(event) {
    debugConsole(".js-gm-control-new clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    if (confirm("This will clear out ALL items (both PCs and NPCs) in your current control sheet. Are you sure you want to do this?"))
      gm_control_sheet = Array();
    gm_control_display_sheet();
    return false;
  });

  $('.js-gm-control-start-combat').unbind('click');
  $('.js-gm-control-start-combat').click(function(event) {
    debugConsole(".js-gm-control-start-combat clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    gm_control_start_combat();
    return false;
  });

  $('.js-gm-control-add-line').unbind('click');
  $('.js-gm-control-add-line').click(function(event) {
    debugConsole(".js-gm-control-add-line clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    gm_control_show_add_line_dialog();
    return false;
  });

  $('.js-gm-control-save').unbind('click');
  $('.js-gm-control-save').click(function(event) {
    debugConsole(".js-gm-control-save clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    //		create_alert("This function is still a work in progress", "danger");
    number_items = 0;
    if (gm_control_sheet_currently_selected.length > 0)
      number_items = gm_control_sheet_currently_selected.length;
    else
      number_items = gm_control_sheet.length;

    $(".js-gm-control-save-message").text("You are saving " + number_items + " characters in this group");

    $(".js-gm-control-save-dialog-action-button").unbind("click");
    $(".js-gm-control-save-dialog-action-button").click(function() {

      if (gm_control_sheet_currently_selected.length > 0)
        export_json = gm_control_export_json(true);
      else
        export_json = gm_control_export_json(false);

      save_name = "( Unnamed )";
      if ($(".js-gm-control-save-dialog-name").val() != "")
        save_name = $(".js-gm-control-save-dialog-name").val();

      local_storage_save("gm_control_saved_items", export_json, false, save_name);

    });
    if (gm_control_sheet.length > 0)
      $(".js-gm-control-save-dialog").modal();
    else
      create_alert("You need to have items in your control sheet to save them", "warning");
    return false;
  });

  $('.js-gm-control-load').unbind('click');
  $('.js-gm-control-load').click(function(event) {
    debugConsole(".js-gm-control-load clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();


    $(".js-gm-control-load-dialog-overwrite").removeAttr("checked");


    propogate_load_items();

    // handler functions for new html
    $(".js-gm-control-load-dialog-load").unbind("click");
    $(".js-gm-control-load-dialog-load").click(function(event) {
      event.preventDefault();
      document.getSelection().removeAllRanges();
      do_it = false;
      if (gm_control_sheet.length > 0 && $('.js-gm-control-load-dialog-overwrite').is(":checked")) {
        if (confirm("Are you sure you want to overwrite the NPCs in your current control group?"))
          do_it = true;
      } else {
        do_it = true;
      }

      if (do_it) {
        item_index = $(this).attr("ref") / 1;
        overwrite = false;
        if ($('.js-gm-control-load-dialog-overwrite').is(":checked"))
          overwrite = true;

        loaded_items = local_storage_retrieve("gm_control_saved_items", item_index);
        //for(loaded_item_count = 0; loaded_item_count < loaded_items.length; loaded_item_count++)
        gm_control_import_json(JSON.stringify(loaded_items), overwrite);

        gm_control_display_sheet();
        $('.js-gm-control-load-dialog').modal('hide');
      }
    });

    $(".js-gm-control-load-dialog-remove").unbind("click");
    $(".js-gm-control-load-dialog-remove").click(function(event) {
      event.preventDefault();
      document.getSelection().removeAllRanges();
      if (confirm("Are you sure you want to remove this group?")) {
        index_to_remove = $(this).attr("ref") / 1;
        local_stroage_remove("gm_control_saved_items", index_to_remove);
        propogate_load_items();
      }
    });

    $(".js-gm-control-load-dialog").modal();
    return false;
  });

  function propogate_load_items() {
    load_html = "";
    saved_items = local_storage_retrieve("gm_control_saved_items");
    if (saved_items.length > 0) {
      load_html += '<label><input type="checkbox" name="overwrite" class="js-gm-control-load-dialog-overwrite" /> Overwrite NPCs</label>';
      load_html += "<table>";
      load_html += "<tr>";
      load_html += "<th>Encounter Name</th>";
      load_html += "<th>Saved On</th>";
      load_html += "<th>Number in Group</th>";
      load_html += "<th>&nbsp;</th>";
      load_html += "<r>";
      for (saved_item_count = 0; saved_item_count < saved_items.length; saved_item_count++) {
        item_data = JSON.parse(saved_items[saved_item_count].data);
        load_html += "<tr>";
        load_html += "<td>" + saved_items[saved_item_count].name + "</td>";
        load_html += "<td>" + saved_items[saved_item_count].saved + "</td>";
        load_html += "<td>" + item_data.length + "</td>";
        load_html += "<td>";

        load_html += ' <a href="#" ref="' + saved_item_count + '" title="Load This Group" class="js-gm-control-load-dialog-load"><span class="glyphicon glyphicon-floppy-open"></span></a> ';
        load_html += ' <a href="#" ref="' + saved_item_count + '" title="Remove This Group" class="js-gm-control-load-dialog-remove"><span class="glyphicon glyphicon-trash"></span></a> ';

        load_html += "</td>";
        load_html += "</tr>";
      }
      load_html += "</table>";
    } else {
      load_html += "<p>You have no saved items on this device.</p>";
    }

    $(".js-gm-control-load-saved-items").html(load_html);
  }

  $('.js-gm-control-import').unbind('click');
  $('.js-gm-control-import').click(function(event) {
    debugConsole(".js-gm-control-import clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();

    $(".js-gm-control-import-dialog-overwrite").removeAttr("checked");
    $(".js-gm-control-import-dialog-action-button").unbind("click");
    $(".js-gm-control-import-dialog-action-button").click(function() {
      import_string = $(".js-gm-control-import-dialog-data").val();
      overwrite = false;
      if ($('.js-gm-control-import-dialog-overwrite').is(":checked"))
        overwrite = true;
      gm_control_import_json(import_string, overwrite);
    });



    $(".js-gm-control-import-dialog").modal();

    return false;
  });

  $('.js-gm-control-export').unbind('click');
  $('.js-gm-control-export').click(function(event) {
    debugConsole(".js-gm-control-export clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    if (gm_control_sheet_currently_selected.length > 0)
      export_json = gm_control_export_json(true);
    else
      export_json = gm_control_export_json(false);

    $(".js-gm-control-export-dialog-data").unbind("click");
    $(".js-gm-control-export-dialog-data").click(function() {
      $(this).select();
    });
    $(".js-gm-control-export-dialog-data").val(export_json);

    if (gm_control_sheet.length > 0)
      $(".js-gm-control-export-dialog").modal();
    else
      create_alert("You need to have items in your control sheet to export them", "warning");


    return false;
  });

  // Entry Item Controls
  $('.js-gm-control-line-remove').unbind('click');
  $('.js-gm-control-line-remove').click(function(event) {
    debugConsole(".js-gm-control-remove clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    if (confirm("Are you sure you want to delete this line?"))
      gm_control_sheet.splice($(this).attr("ref"), 1);
    gm_control_display_sheet();
    return false;
  });

  $('.js-gm-control-line-duplicate').unbind('click');
  $('.js-gm-control-line-duplicate').click(function(event) {
    debugConsole(".js-gm-control-duplicate clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    gm_control_show_duplicate_line_dialog(gm_control_sheet[$(this).attr("ref")]);
    return false;
  });

  $('.js-gm-control-line-edit').unbind('click');
  $('.js-gm-control-line-edit').click(function(event) {
    debugConsole(".js-gm-control-edit clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    gm_control_show_edit_line_dialog(gm_control_sheet[$(this).attr("ref")], $(this).attr("ref"));
    return false;
  });


  $('.js-gm-control-damage-modify').unbind('click');
  $('.js-gm-control-damage-modify').click(function(event) {
    debugConsole(".js-gm-control-damage-modify clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();

    $(".js-gm-control-fatigue-modify-dropdown").slideUp();
    if ($(this).next(".js-gm-control-damage-modify-dropdown").is(":visible") == false) {
      $(".js-gm-control-damage-modify-dropdown").slideUp();
      $(this).next(".js-gm-control-damage-modify-dropdown").slideDown();
    } else {
      $(".js-gm-control-damage-modify-dropdown").slideUp();
    }

    return false;
  });


  $('.js-gm-control-damage-modify-plus').unbind('click');
  $('.js-gm-control-damage-modify-plus').click(function(event) {
    debugConsole(".js-gm-control-damage-modify-plus clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    current_selected = $(this).attr('ref') / 1;
    current_value = gm_control_sheet[current_selected].get_secondary('curr_hp') / 1;
    current_value++;
    gm_control_sheet[current_selected].set_secondary('curr_hp', current_value);
    $('.js-gm-control-damage-modify-' + current_selected).text(current_value);

    if (gm_control_current_turn > 0) {
      if (typeof (gm_control_sheet[current_selected].shock_amount) == "undefined")
        gm_control_sheet[current_selected].shock_amount = 0;

      gm_control_sheet[current_selected].shock_amount--;


      if (gm_control_sheet[current_selected].shock_amount > 4)
        gm_control_sheet[current_selected].shock_amount = 4;
      if (gm_control_sheet[current_selected].shock_amount < 0)
        gm_control_sheet[current_selected].shock_amount = 0;

      $(".js-shock-damage-" + current_selected).text("-" + gm_control_sheet[current_selected].shock_amount);
      if (gm_control_sheet[current_selected].shock_amount > 0) {
        $(".js-shock-damage-" + current_selected).show();
      } else {
        $(".js-shock-damage-" + current_selected).hide();
      }
    }

    gm_control_save_to_local_storage();
    return false;
  });
  $('.js-gm-control-damage-modify-ok').unbind('click');
  $('.js-gm-control-damage-modify-ok').click(function(event) {
    debugConsole(".js-gm-control-damage-modify-ok clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();

    current_selected = $(this).attr('ref') / 1;

    $(this).parent('.js-gm-control-damage-modify-dropdown').slideUp();
    return false;
  });

  $('.js-gm-control-damage-modify-minus').unbind('click');
  $('.js-gm-control-damage-modify-minus').click(function(event) {
    debugConsole(".js-gm-control-damage-modify-minus clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    current_selected = $(this).attr('ref') / 1;
    current_value = gm_control_sheet[current_selected].get_secondary('curr_hp') / 1;
    current_value--;

    if (gm_control_current_turn > 0) {
      if (typeof (gm_control_sheet[current_selected].shock_amount) == "undefined")
        gm_control_sheet[current_selected].shock_amount = 0;

      gm_control_sheet[current_selected].shock_amount++;

      if (gm_control_sheet[current_selected].shock_amount > 4)
        gm_control_sheet[current_selected].shock_amount = 4;
      if (gm_control_sheet[current_selected].shock_amount < 0)
        gm_control_sheet[current_selected].shock_amount = 0;

      $(".js-shock-damage-" + current_selected).text("-" + gm_control_sheet[current_selected].shock_amount);
      if (gm_control_sheet[current_selected].shock_amount > 0) {
        $(".js-shock-damage-" + current_selected).show();
      } else {
        $(".js-shock-damage-" + current_selected).hide();
      }
    }

    gm_control_sheet[current_selected].set_secondary('curr_hp', current_value);
    $('.js-gm-control-damage-modify-' + current_selected).text(current_value);
    gm_control_save_to_local_storage();
    return false;
  });


  $('.js-gm-control-damage-modify-zero').unbind('click');
  $('.js-gm-control-damage-modify-zero').click(function(event) {
    debugConsole(".js-gm-control-damage-modify-zero clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    current_selected = $(this).attr('ref') / 1;

    current_value = 0;

    gm_control_sheet[current_selected].set_secondary('curr_hp', current_value);
    $('.js-gm-control-damage-modify-' + current_selected).text(current_value);
    gm_control_save_to_local_storage();
    return false;
  });

  $('.js-gm-control-damage-modify-max').unbind('click');
  $('.js-gm-control-damage-modify-max').click(function(event) {
    debugConsole(".js-gm-control-damage-modify-zero clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    current_selected = $(this).attr('ref') / 1;

    current_value = gm_control_sheet[current_selected].get_secondary('hp') / 1;

    gm_control_sheet[current_selected].set_secondary('curr_hp', current_value);
    $('.js-gm-control-damage-modify-' + current_selected).text(current_value);
    gm_control_save_to_local_storage();
    return false;
  });

  $('.js-gm-control-fatigue-modify').unbind('click');
  $('.js-gm-control-fatigue-modify').click(function(event) {

    debugConsole(".js-gm-control-fatigue-modify clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    $(".js-gm-control-damage-modify-dropdown").slideUp();
    if ($(this).next(".js-gm-control-fatigue-modify-dropdown").is(":visible") == false) {
      $(".js-gm-control-fatigue-modify-dropdown").slideUp();
      $(this).next(".js-gm-control-fatigue-modify-dropdown").slideDown();
    } else {
      $(".js-gm-control-fatigue-modify-dropdown").slideUp();
    }

    return false;
  });


  $('.js-gm-control-fatigue-modify-plus').unbind('click');
  $('.js-gm-control-fatigue-modify-plus').click(function(event) {
    debugConsole(".js-gm-control-fatigue-modify-plus clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    current_selected = $(this).attr('ref') / 1;
    current_value = gm_control_sheet[current_selected].get_secondary('curr_fatigue') / 1;
    current_value++;
    gm_control_sheet[current_selected].set_secondary('curr_fatigue', current_value);
    $('.js-gm-control-fatigue-modify-' + current_selected).text(current_value);
    gm_control_save_to_local_storage();
    return false;
  });
  $('.js-gm-control-fatigue-modify-ok').unbind('click');
  $('.js-gm-control-fatigue-modify-ok').click(function(event) {
    debugConsole(".js-gm-control-fatigue-modify-ok clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    current_selected = $(this).attr('ref') / 1;

    $(this).parent('.js-gm-control-fatigue-modify-dropdown').slideUp();
    return false;
  });

  $('.js-gm-control-fatigue-modify-minus').unbind('click');
  $('.js-gm-control-fatigue-modify-minus').click(function(event) {
    debugConsole(".js-gm-control-fatigue-modify-minus clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    current_selected = $(this).attr('ref') / 1;
    current_value = gm_control_sheet[current_selected].get_secondary('curr_fatigue') / 1;
    current_value--;

    gm_control_sheet[current_selected].set_secondary('curr_fatigue', current_value);
    $('.js-gm-control-fatigue-modify-' + current_selected).text(current_value);
    gm_control_save_to_local_storage();
    return false;
  });

  $('.js-gm-control-fatigue-modify-zero').unbind('click');
  $('.js-gm-control-fatigue-modify-zero').click(function(event) {
    debugConsole(".js-gm-control-fatigue-modify-zero clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    current_selected = $(this).attr('ref') / 1;

    current_value = 0;

    gm_control_sheet[current_selected].set_secondary('curr_fatigue', current_value);
    $('.js-gm-control-fatigue-modify-' + current_selected).text(current_value);
    gm_control_save_to_local_storage();
    return false;
  });

  $('.js-gm-control-fatigue-modify-max').unbind('click');
  $('.js-gm-control-fatigue-modify-max').click(function(event) {
    debugConsole(".js-gm-control-fatigue-modify-zero clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    current_selected = $(this).attr('ref') / 1;

    current_value = gm_control_sheet[current_selected].get_secondary('max_fatigue') / 1;

    gm_control_sheet[current_selected].set_secondary('curr_hp', current_value);
    $('.js-gm-control-fatigue-modify-' + current_selected).text(current_value);
    gm_control_save_to_local_storage();
    return false;
  });

  $('.js-select-check').unbind('change');
  $(".js-select-check").change(function() {
    debugConsole(".js-select-check changed");
    $(".js-gm-control-check-all").removeAttr("checked");
    gm_control_sheet_currently_selected = Array()
    $(".js-select-check:checked").each(function() {
      debugConsole("SELECTCHECK() called - " + $(this).attr('ref'));
      gm_control_sheet_currently_selected.push($(this).attr('ref') / 1);
    });
  });

  $(".js-gm-control-check-all").unbind('change');
  $(".js-gm-control-check-all").change(function() {
    debugConsole(".js-gm-control-check-all changeed");
    if ($(".js-gm-control-check-all").is(":checked")) {
      $(".js-select-check").prop('checked', true);
    } else {
      $(".js-select-check").prop('checked', false);
    }

    gm_control_sheet_currently_selected = Array()
    $(".js-select-check:checked").each(function() {
      if ($(this).attr('is_pc') / 1 == 0)
        gm_control_sheet_currently_selected.push($(this).attr('ref') / 1);
    });
    $(".js-select-check[is_pc=1]").prop('checked', false);
  });

  $(".js-gm-control-trash").unbind('click');
  $(".js-gm-control-trash").click(function(event) {
    debugConsole(".js-gm-control-trash clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    if (gm_control_sheet_currently_selected.length == 0) {
      create_alert("Please select the characters you want to remove by placing a check next to their name.", "warning");
    } else {
      if (confirm("Are you sure you want to remove the selected NPCs?")) {
        for (var i = gm_control_sheet_currently_selected.length - 1; i >= 0; i--)
          gm_control_sheet.splice(gm_control_sheet_currently_selected[i], 1);
        gm_control_sheet_currently_selected = Array();
        $(".js-gm-control-check-all").removeAttr("checked");
        gm_control_display_sheet();
      }
    }

  });

  $(".js-gm-control-add-mooks").unbind('click');
  $(".js-gm-control-add-mooks").click(function(event) {
    debugConsole(".js-gm-control-add-mooks clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    gm_control_propogate_mooks();
  });

  $(".js-gm-control-line-view").unbind('click');
  $(".js-gm-control-line-view").click(function(event) {
    event.preventDefault();
    document.getSelection().removeAllRanges();
    debugConsole(".js-gm-control-line-view clicked");
    ref = $(this).attr("ref");

    if ($(".js-mobile-details-" + ref).is(":visible")) {
      $(".js-mobile-details-" + ref).slideUp();
    } else {
      $(".js-mobile-details").slideUp();
      $(".js-mobile-details-" + ref).stop().slideDown();
    }
  });


  $(".js-gm-control-add-mooks").unbind('click');
  $(".js-gm-control-add-mooks").click(function(event) {
    debugConsole(".js-gm-control-add-mooks clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    gm_control_propogate_mooks();
  });

  $(".js-gm-control-sort-by-name").unbind('click');
  $(".js-gm-control-sort-by-name").click(function(event) {
    debugConsole(".js-gm-control-sort-by-name clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    gm_control_sort_by_name();
  });

  $(".js-gm-control-sort-by-base-speed").unbind('click');
  $(".js-gm-control-sort-by-base-speed").click(function(event) {
    debugConsole(".js-gm-control-sort-by-base-speed clicked");
    event.preventDefault();
    document.getSelection().removeAllRanges();
    gm_control_sort_by_base_speed();

  });

  $(".js-editable").off("click").on("click", function() {
    let $this = $(this);
    let index = $this.data("index");
    let field = $this.data("field");
    let currentValue = gm_control_sheet[index][`get_${field}`]();

    // Create an input box with auto-selection
    let input = $("<input>", {
      type: "text",
      class: "form-control",
      value: currentValue,
    }).css("width", "100%");

    // Swap in the input field and auto-select the text
    $this.html(input);
    input.focus().select();

    function saveInput() {
      let newValue = input.val().trim();
      gm_control_sheet[index][`set_${field}`](newValue);
      $this.html(newValue || "-"); // Restore text or placeholder
      local_storage_save("gm_control_current_sheet", gm_control_export_json(), true);
    }

    // Save on blur
    input.on("blur", saveInput);

    // Save on Enter
    input.on("keydown", function(e) {
      if (e.key === "Enter") {
        saveInput();
        input.blur(); // Ensure blur event still fires
      }
    });

    // Prevent event bubbling
    input.on("click", function(e) { e.stopPropagation(); });
  });
}

function sort_chars_by_name(a, b) {
  if (a.name < b.name) {
    return -1;
  } else {
    if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  }
}

function sort_chars_by_speed(a, b) {
  if (a.secondary.speed < b.secondary.speed) {
    return -1;
  } else {
    if (a.secondary.speed > b.secondary.speed) {
      return 1;
    } else {
      return a.name > b.name;

    }
  }
}

function sort_chars_by_speed_reverse(a, b) {

  if (a.secondary.speed > b.secondary.speed) {
    return -1;
  } else {
    if (a.secondary.speed < b.secondary.speed) {
      return 1;
    } else {
      if (a.attributes.dx > b.attributes.dx) {
        return -1;
      } else {
        if (a.attributes.dx < b.attributes.dx) {
          return 1;
        } else {
          if (a.random_roll > b.random_roll) {
          } else {
            if (a.random_roll < b.random_roll) {
              return 1;
            } else {
              return -1;
            }
          }
        }
      }
    }
  }
}

function gm_control_sort_by_base_speed() {
  debugConsole("gm_control_sort_by_base_speed called");
  for (gm_rand_count = 0; gm_rand_count < gm_control_sheet.length; gm_rand_count++) {
    gm_control_sheet[gm_rand_count].random_roll = rollDice("1d6");
  }
  gm_control_sheet.sort(sort_chars_by_speed_reverse);
  gm_control_display_sheet();
}

function gm_control_sort_by_name() {
  debugConsole("gm_control_sort_by_name called");

  gm_control_sheet.sort(sort_chars_by_name);
  gm_control_display_sheet();
}

$(document).ready(function() {
  gm_control_current_sheet_obj = local_storage_retrieve("gm_control_current_sheet", 0);
  if (gm_control_current_sheet_obj) {
    gm_control_import_json(JSON.stringify(gm_control_current_sheet_obj), 1);
  }

  gm_control_display_sheet();
});
