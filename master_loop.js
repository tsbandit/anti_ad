(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {make_state} = Global.util;

const [get_timeout_handle, set_timeout_handle] = make_state(null);

Global.master_loop = {get_timeout_handle, set_timeout_handle};


})();
