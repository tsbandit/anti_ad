(() => {


'use strict';

const Global = window.Global = window.Global || {};

//const {storage_get, storage_set, sleep, escalate, make_state} = Global.util;
const {showToast} = Global.util;
const {call_api_stupidly} = Global.call_api_stupidly;

let tab_id;

const safe_JSON_parse = (arg) => {
  try {
    return JSON.parse(arg);
  } catch(e) {
    return undefined;
  }
};

const unique_event_id = 'intercepted_data_THcGejFSLkADi51EGd3W';      // Keep this in sync with the line below ...

const to_be_injected = () => {
    const unique_event_id = 'intercepted_data_THcGejFSLkADi51EGd3W';  // Keep this in sync with the line above.

    const safe_JSON_parse = (arg) => {
      try {
        return JSON.parse(arg);
      } catch(e) {
        return undefined;
      }
    };

    const get_url = (resource) => {
        if (typeof resource === 'string') {
            return resource;
        } else if ('url' in resource && typeof resource.url === 'string') {
            return resource.url;
        } else if ('href' in resource && typeof resource.href === 'string') {
            return resource.href;
        } else {
            return {type:'error', unique_id:'nppaiofewj9832a'};
        }
    };
    const originalFetch = window.fetch;
    const new_fetch = async (resource, options) => {
        const response = await originalFetch(resource, options);
        const clonedResponse = response.clone();
        const random_id = Math.random();
        const req_body = options?.body;
        clonedResponse.text().then(data => {
            //console.log(random_id, 'about to attempt processing');
            processResponse(get_url(resource), data, req_body);
            //console.log(random_id, 'done processing');
        }).catch(err => console.error(random_id, 'Error parsing fetch:', err));
        //console.log(random_id, 'continuing concurrently with parse');
        return response;
    };
    const original_xhr = window.XMLHttpRequest;
    const new_xhr = new Proxy(original_xhr, {
      construct(Target, args_1) {
//        console.log('construct called');
        const xhr = new Target(...args_1);
        let method, url;
        xhr.open = new Proxy(xhr.open, {
          apply(target, self, args_2) {
            [method, url] = args_2;
//            console.log('apply called', {url});
            return Reflect.apply(target, self, args_2);
          },
        });
        xhr.send = new Proxy(xhr.send, {
          apply(target, self, args_2) {
            const [req_body] = args_2;
            xhr.addEventListener('load', () => {
              const data = (() => {
                if(xhr.responseType === 'json') {
                  return JSON.stringify(xhr.response);
                } else if(xhr.responseType === ''  ||  xhr.responseType === 'text') {
                  return xhr.responseText;
                }
              })();
              processResponse(typeof url === 'string' ? url : url.href, data, req_body);
            });
            return Reflect.apply(target, self, args_2);
          },
        });
        return xhr;
      },
    });

    const ai_coding = (operation) => {
      return new Promise((resolve, reject) => {
        const event_id = Math.random()+''+Math.random();
        const listener = async(ev) => {
          document.removeEventListener(event_id, listener);
          resolve(ev.detail.result);
        };
        document.addEventListener(event_id, listener);
        document.dispatchEvent(new CustomEvent(unique_event_id, {detail: {type: 'ai coding', operation, event_id}}));
      });
    };

//        const [method, url] = args;
//        this.addEventListener('load', () => {
//            try {
//                const responseData = JSON.parse(this.responseText);
//                processResponse(typeof url === 'string' ? url : url.href, responseData);
//            }
//            catch (e) {
//            }
//        });
//        originalXhrOpen.apply(this, args);
//    };

    const processResponse = (url, data, req_body) => {
      document.dispatchEvent(new CustomEvent(unique_event_id, {detail: {type: 'intercepted request', url, data, req_body}}));
    };

    const replace_the_functions = () => {
        window.fetch = new_fetch;
        //XMLHttpRequest.prototype.open = new_open;
        window.XMLHttpRequest = new_xhr;
        window.ai_coding = ai_coding;
    };

    replace_the_functions();
};

const extract_stuff_to_save = ({page_url, req_url: url, data: data_string, req_body}) => {
  console.log('extract_stuff_to_save', {page_url, req_url: url, data_string, req_body});

  const data = safe_JSON_parse(data_string);

  const url_obj = URL.parse(url, window.location.href);
  if(url_obj === null)
    throw new Error('unexpected condition IruKFT2WNQzMtwUJ5cjT');

  const page_url_obj = URL.parse(page_url, window.location.href);
  if(page_url_obj === null)
    throw new Error('unexpected condition bsM1aIDgxWk9NcWuiFIU');

  // 7cups:
  const _7cups_regexp = /api.*message/;
  if(_7cups_regexp.test(url)  &&  typeof data === 'object'  &&  data !== null  &&  Array.isArray(data.messages)) {
    return data.messages.map((subdata) => ({type: '7cups message', data: subdata}));
  }

  // Grok:
  const grok_regexp = /\Wx\.com.*api.*GrokConversationItemsByRestId/;
  const maybe_array = data?.data?.grok_conversation_items_by_rest_id?.items;
  if(grok_regexp.test(url)  &&  Array.isArray(maybe_array)) {
    const variables = safe_JSON_parse(url_obj.searchParams.get('variables'));

    return maybe_array.map((subdata) => {
      // Let's suppress these gigantic parts
      const {post_ids_results, web_results, cited_web_results, media_post_ids_results, ...subdata_2} = subdata;
      return {type: 'grok message', conversation_id: variables?.restId, data: subdata_2, tab_id};
    });
  }

  // Brave Search LLM:
  {
    const regexp = /^https:\/\/search\.brave\.com\/api\/chatllm\/enrichments/;
    if(regexp.test(url_obj.href)) {
      return [{
        type: 'brave search llm message pair',
        timestamp: new Date().toISOString(),
        followup: url_obj.searchParams.get('followup'),
        key: url_obj.searchParams.get('key'),
        conversation: url_obj.searchParams.get('conversation'),
        tab_id,
        index: url_obj.searchParams.get('index'),
        data,
        format: 'v1',
      }];
    }

    const regexp_2 = /^https:\/\/search\.brave\.com\/api\/tap\/v1\/stream/;
    if(regexp_2.test(url_obj.href)) {
      const parsed_body = safe_JSON_parse(req_body);
      const data_lines = data_string.split('\n');
      let raw_response = '';
      const data_2 = [];
      for(const line of data_lines) {
        const item = safe_JSON_parse(line);
        if(item?.type === 'text_delta')
          continue;
        if(item?.type === 'text_start')
          continue;
        if(item?.type === 'text_stop')
          raw_response += item.text;
        data_2.push(item);
      }
      const followup = (() => {
        const possibility_1 = url_obj.searchParams.get('query');
        const possibility_2 = parsed_body?.query;
        if(!possibility_1)
          return possibility_2;
        if(!possibility_2)
          return possibility_1;
        console.log({diagnostic: {possibility_1, possibility_2, url, data_string, page_url, req_body}});
        showToast({red: true, message: "Didn't save; ambiguous value of `followup`"});
        throw new Error('unexpected condition ma023vioanfiwe903ow');
      })();
      const conversation = (() => {
        const possibility_1 = page_url_obj.searchParams.get('conversation');
//        const possibility_2 = parsed_body?.symmetric_key;
//        const possibility_3 = url_obj.searchParams.get('symmetric_key')+','+url_obj.searchParams.get('id');
        return possibility_1;
      })();
      const symmetric_key = parsed_body?.symmetric_key;
      if(!followup  ||  !raw_response  ||  !conversation) {
        console.log({diagnostic: {followup, raw_response, conversation, url, data_string, page_url, req_body}});
        showToast({red: true, message: 'Something is missing though'});
        console.error('unexpected condition INnbkAmnd4NhZxyGkDyZ');
      }
      return [{
        type: 'brave search llm message pair',
        timestamp: new Date().toISOString(),
        followup,
//        key: url_obj.searchParams.get('key'),
        conversation,
        symmetric_key,
        tab_id,
//        index: url_obj.searchParams.get('index'),
        data: {raw_response, more_data: data_2},
        format: 'v2',
      }];
    }

    const regexp_3 = /^https:\/\/search\.brave\.com\/api\/tap\/v1\/get_current_state/;
    if(regexp_3.test(url_obj.href)) {
      if(!Array.isArray(data))
        return (console.log('unexpected data format; refusing to attempt to save.', data), []);

      let followup = undefined;
      let raw_response = '';
      for(const item of data.flat()) {
        if(item.type === 'user') {
          if(followup !== undefined) {
            console.log('Considering saving chat data; but reconsidering because multiple user queries are present in the API response.');
            return [];
          }
          followup = item.query;
        }
        if(item.type === 'quick_answer')
          raw_response += item.message;
        if(item.type === 'text_stop')
          raw_response += item.text;
      }

      const symmetric_key = (() => {
        return url_obj.searchParams.get('symmetric_key');
      })();

      if(!followup  ||  !raw_response  ||  !symmetric_key) {
        console.log({diagnostic: {followup, raw_response, symmetric_key, url, data_string, page_url, req_body}});
        showToast({red: true, message: 'Something is missing though'});
        console.error('unexpected condition amvd0923ej9230vqokn');
      }

      return [{
        type: 'brave search llm message pair',
        timestamp: new Date().toISOString(),
        followup,
//        key: url_obj.searchParams.get('key'),
        symmetric_key,
        tab_id,
//        index: url_obj.searchParams.get('index'),
        data: {raw_response},
        format: 'v2 2',
      }];
    }
  }

  return [];
};

const do_the_instrumentation = () => {
  tab_id = JSON.stringify([Math.random(), Math.random(), Math.random()]);

  const script_tag = document.createElement('script');
  script_tag.textContent = '(' + to_be_injected + ')();';
  script_tag.onload = function() {this.remove();};
  document.head.appendChild(script_tag);

  document.addEventListener(unique_event_id, async(ev) => {
    //console.log('tommy5', ev.detail);
    if(ev.detail.type === 'intercepted request') {
      const {url, data, req_body} = ev.detail;
      const array_of_data_to_save = extract_stuff_to_save({page_url: window.location.href, req_url: url, data, req_body});

      for(const data_to_save of array_of_data_to_save) {
        console.log('data_to_save', data_to_save);
        await call_api_stupidly({
          type: 'save arbitrary data',
          data: data_to_save,
        });
      }
    } else if(ev.detail.type === 'ai coding') {
      const {operation, event_id} = ev.detail;
      chrome.runtime.sendMessage(undefined, ev.detail, undefined, (result) => {
        document.dispatchEvent(new CustomEvent(event_id, {detail: {result}}));
      });
    } else {
      console.log('noaimde98v2a3202', ev.detail);
      throw 'noaimde98v2a3202';
    }
  });
};

const main = () => {
  const site = (s) => (window.location.hostname.endsWith(s));
  
  if(site('x.com')  ||  site('7cups.com')  ||  site('search.brave.com')) {
    do_the_instrumentation();
  }
};

main();


})();
