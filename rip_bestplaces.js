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
      rep: match[3],
      bugfixed: true,
    },
  });
};

const regexp_4 = /^Housing costs in (.*)\?(?:x|[^x])*A typical home costs \$([0-9,\.]*), which is (?:x|[^x])*\. Renting a two-bedroom unit in .* costs \$([0-9,\.]*) per month, which is/;
const maybe_process_cost = async(candidate) => {
  const match = candidate.innerText.match(regexp_4);
  if(match === null)
    return;

  await call_api_stupidly({
    type: 'save arbitrary data',
    data: {
      type: 'bestplaces',
      subtype: 'housing',
      pathname: window.location.pathname,
      name: match[1],
      buy: match[2],
      rent: match[3],
    },
  });
};

const regexp_5 = /The population in (.*) is ([0-9,\.]+). There are ([0-9,\.]+) people per square mile aka population density. The median age in (?:.*) is ([0-9,\.]+), the US median age is 38.4. The number of people per household in (?:.*) is ([0-9,\.]+), the US average of people per household is 2.6.\n\nFamily in (?:.*)\n- ([0-9,\.]+)% are married\n- ([0-9,\.]+)% are divorced\n- ([0-9,\.]+)% are married with children\n- ([0-9,\.]+)% have children, but are single\nRace in (?:.*)\n\n- ([0-9,\.]+)% are White\n- ([0-9,\.]+)% are Black\n- ([0-9,\.]+)% are Asian\n- ([0-9,\.]+)% are Native American\n- ([0-9,\.]+)% claim Other\n- ([0-9,\.]+)% claim Hispanic ethnicity\n- ([0-9,\.]+)% Two or more races\n- ([0-9,\.]+)% Hawaiian, Pacific Islander/;
const maybe_process_people = async(candidate) => {
  const match = candidate.innerText.match(regexp_5);
  if(match === null)
    return;

  await call_api_stupidly({
    type: 'save arbitrary data',
    data: {
      type: 'bestplaces',
      subtype: 'people',
      pathname: window.location.pathname,
      name: match[1],
      population: match[2],
      density: match[3],
      median_age: match[4],
      people_per_household: match[5],
      percentage_married: match[6],
      percentage_divorced: match[7],
      percentage_married_with_children: match[8],
      percentage_single_with_children: match[9],
      percentage_race_white: match[10],
      percentage_race_black: match[11],
      percentage_race_asian: match[12],
      percentage_race_native_american: match[13],
      percentage_race_other: match[14],
      percentage_race_hispanic: match[15],
      percentage_race_mixed: match[16],
      percentage_race_pacific_islander: match[17],
    },
  });
};

const rip_data = () => {
  // Only rip data when looking at certain URLs:
  const path_parts = window.location.pathname.split('/');
  if(path_parts.length < 3  ||  path_parts[2] !== 'city')
    return;

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

    const candidates_div_card_body = document.querySelectorAll('div.card-body');
    for(const candidate of candidates_div_card_body) {
      await maybe_process_cost(candidate);
      await maybe_process_people(candidate);
    }
  });
};

const site = (s) => (window.location.hostname.endsWith(s));

if(site('bestplaces.net')) {
  rip_data();
}


})();
