(() => {


'use strict';

const Global = window.Global = window.Global || {};

//const {storage_get, storage_set, sleep, escalate, make_state} = Global.util;
const {call_api_stupidly} = Global.call_api_stupidly;

const safe_JSON_parse = (arg) => {
  try {
    return JSON.parse(arg);
  } catch(e) {
    return undefined;
  }
};

const regexp_1 = /^(.*) violent crime is (.*)\. \(The US average is 22\.7\)$/;
const maybe_process_violent_crime = async(candidate) => {
  const match = candidate.innerText.match(regexp_1);
  if(match === null)
    return;

  await call_api_stupidly({
    type: 'save arbitrary data',
    data: {
      type: 'bestplaces',
      subtype: 'violent crime',
      pathname: window.location.pathname,
      name: match[1],
      amount: match[2],
    },
  });
};

const regexp_2 = /^(.*) property crime is (.*)\. \(The US average is 35\.4\)$/;
const maybe_process_property_crime = async(candidate) => {
  const match = candidate.innerText.match(regexp_2);
  if(match === null)
    return;

  await call_api_stupidly({
    type: 'save arbitrary data',
    data: {
      type: 'bestplaces',
      subtype: 'property crime',
      pathname: window.location.pathname,
      name: match[1],
      amount: match[2],
    },
  });
};

const regexp_3 = /\. In (.*) ([0-9\.]+)% of the people voted Democrat in the last presidential election, ([0-9\.]+)% voted for the Republican Party, and the remaining ([0-9\.]+)% voted Independent\./;
const maybe_process_politics = async(candidate) => {
  const match = candidate.innerText.match(regexp_3);
  if(match === null)
    return;

  await call_api_stupidly({
    type: 'save arbitrary data',
    data: {
      type: 'bestplaces',
      subtype: 'politics',
      pathname: window.location.pathname,
      name: match[1],
      dem: match[2],
      rep: match[2],
    },
  });
};

const rip_data = () => {
  window.addEventListener('load', async(ev) => {
    const candidates_h5 = document.querySelectorAll('h5');
    for(const candidate of candidates_h5) {
      await maybe_process_violent_crime(candidate);
      await maybe_process_property_crime(candidate);
    }

    const candidates_p = document.querySelectorAll('p');
    for(const candidate of candidates_p) {
      await maybe_process_politics(candidate);
    }
  });
};

const site = (s) => (window.location.hostname.endsWith(s));

if(site('bestplaces.net')) {
  rip_data();
}


})();
