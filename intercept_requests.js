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
        clonedResponse.json().then(data => {
            processResponse(get_url(resource), data);
        }).catch(err => console.error('Error parsing fetch:', err));
        return response;
    };
    const original_xhr = window.XMLHttpRequest;
    const new_xhr = new Proxy(original_xhr, {
      construct(Target, args_1) {
//        console.log('construct called');
        const xhr = new Target(...args_1);
        xhr.open = new Proxy(xhr.open, {
          apply(target, self, args_2) {
            const [method, url] = args_2;
//            console.log('apply called', {url});
            xhr.addEventListener('load', () => {
              const data = (() => {
                if(xhr.responseType === 'json') {
                  return xhr.response;
                } else if(xhr.responseType === ''  ||  xhr.responseType === 'text') {
                  return safe_JSON_parse(xhr.responseText);
                }
              })();
              processResponse(typeof url === 'string' ? url : url.href, data);
            });
            return Reflect.apply(target, self, args_2);
          },
        });
        return xhr;
      },
    });

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

    const processResponse = (url, data) => {
      document.dispatchEvent(new CustomEvent(unique_event_id, {detail: {url, data}}));
    };

    const replace_the_functions = () => {
        window.fetch = new_fetch;
        //XMLHttpRequest.prototype.open = new_open;
        window.XMLHttpRequest = new_xhr;
    };

    replace_the_functions();
};

const extract_stuff_to_save = ({url, data}) => {
  const _7cups_regexp = /api.*message/;
  if(_7cups_regexp.test(url)  &&  typeof data === 'object'  &&  data !== null  &&  Array.isArray(data.messages)) {
    return data.messages.map((subdata) => ({type: '7cups message', data: subdata}));
  }

  const grok_regexp = /\Wx\.com.*api.*GrokConversationItemsByRestId/;
  const maybe_array = data?.data?.grok_conversation_items_by_rest_id?.items;
  if(grok_regexp.test(url)  &&  Array.isArray(maybe_array)) {
    const url_obj = (() => {
      try {
        return new URL(url);
      } catch(e) {
        throw new Error('unexpected condition rRin7U3ekXlXd6JWmWkE');
      }
    })();

    const variables = safe_JSON_parse(url_obj.searchParams.get('variables'));

    return maybe_array.map((subdata) => {
      // Let's suppress these gigantic parts
      const {post_ids_results, web_results, cited_web_results, media_post_ids_results, ...subdata_2} = subdata;
      return {type: 'grok message', conversation_id: variables?.restId, data: subdata_2};
    });
  }

  return [];
};

const do_the_instrumentation = () => {
  const script_tag = document.createElement('script');
  script_tag.textContent = '(' + to_be_injected + ')();';
  script_tag.onload = function() {this.remove();};
  document.head.appendChild(script_tag);

  document.addEventListener(unique_event_id, async(ev) => {
    const {url, data} = ev.detail;
    const array_of_data_to_save = extract_stuff_to_save({url, data});

    for(const data_to_save of array_of_data_to_save) {
      await call_api_stupidly({
        type: 'save arbitrary data',
        data: data_to_save,
      });
    }
  });
};

const site = (s) => (window.location.hostname.endsWith(s));

if(site('x.com')  ||  site('7cups.com')) {
  do_the_instrumentation();
}


})();
