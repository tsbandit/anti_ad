(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {make_state} = Global.util;

const [get_recent_tabs_data, set_recent_tabs_data] = make_state(null);

Global.recent_tabs_data_state = {get_recent_tabs_data, set_recent_tabs_data};


})();
