// Common localStorage and sessionStorage functions
if( !localStorage.gm_control_current_sheet )
	localStorage.gm_control_current_sheet = "[]";

function local_storage_save(local_storage_var, json_to_save, overwrite, name) {
	debugConsole("local_storage_save(" + local_storage_var + ", " + json_to_save+ ") called");

	if( (json_to_save && local_storage_var && json_to_save != "[]") || overwrite) {
		if(!name)
			name = "";
		storage_object = {
			name: name,
			saved: new Date(),
			data: json_to_save
		};

		current_local_json = localStorage.getItem(local_storage_var);
		if( current_local_json )
			current_local_storage_obj = JSON.parse( current_local_json ) ;
		else
			current_local_storage_obj = Array();

		if( overwrite )
			current_local_storage_obj = Array();

 		current_local_storage_obj = current_local_storage_obj.concat(storage_object);

		debugConsole(storage_object);
		localStorage.setItem( local_storage_var, JSON.stringify(current_local_storage_obj) );
		return true;
	} else {
		return false;
	}
}

function local_stroage_remove(local_storage_var, index_to_remove) {
	debugConsole("local_storage_retrieve(" + local_storage_var + ", " + index_to_remove+ ") called");

	if( index_to_remove > -1 && local_storage_var) {
		current_local_json = localStorage.getItem(local_storage_var);
		if( current_local_json )
			current_local_storage_obj = JSON.parse( current_local_json ) ;
		else
			return false;

		if( index_to_remove > current_local_storage_obj.length) {
			return false
		} else {
			current_local_storage_obj.splice(index_to_remove, 1);
			localStorage.setItem( local_storage_var, JSON.stringify(current_local_storage_obj) );
		}

		return true;
	} else {
		return false;
	}
}

function local_storage_retrieve(local_storage_var, index_to_retrieve) {
	debugConsole("local_storage_retrieve(" + local_storage_var + ", " + index_to_retrieve+ ") called");

	if( index_to_retrieve > -1 && local_storage_var) {

		current_local_json = localStorage.getItem(local_storage_var);
		if( current_local_json )
			current_local_storage_obj = JSON.parse( current_local_json ) ;
		else
			current_local_storage_obj = Array();

		if( current_local_storage_obj[index_to_retrieve] ) {
			if( current_local_storage_obj[index_to_retrieve].data ) {
				return JSON.parse( current_local_storage_obj[index_to_retrieve].data );
			}
		}

		return false;
	} else {
		// get all items if possible
		current_local_json = localStorage.getItem(local_storage_var);
		if( current_local_json )
			current_local_storage_obj = JSON.parse( current_local_json ) ;


		if(current_local_storage_obj)
			return current_local_storage_obj;
		else
			return false;
	}
}

function prevent_default(event) {
	if(event.preventDefault)
	{
		prevent_default(event);
	}
	else
	{
		event.returnValue = false;
	}
}