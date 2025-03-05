(() => {
    throw new Error('let us disable intercept_requests.js for now');

console.log('success in intercept req');

    const to_be_injected = () => {

    const get_url = (resource) => {
        if (typeof resource === 'string') {
            return resource;
        }
        else if ('url' in resource && typeof resource.url === 'string') {
            return resource.url;
        }
        else if ('href' in resource && typeof resource.href === 'string') {
            return resource.href;
        }
        else {
            throw new Error('unexpected condition nppaiofewj9832a');
        }
    };
    const originalFetch = window.fetch;
    const new_fetch = async (resource, options) => {
        console.log('ymmot2');
        const response = await originalFetch(resource, options);
        const clonedResponse = response.clone();
        clonedResponse.json().then(data => {
            //console.log('Intercepted fetch API response:', { url: resource, data });
            processResponse(get_url(resource), data);
        }).catch(err => console.error('Error parsing fetch:', err));
        return response;
    };
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    //(...args) => {};
    const new_open = function (...args) {
        console.log('ymmot3');
        const [method, url] = args;
        this.addEventListener('load', () => {
            try {
                const responseData = JSON.parse(this.responseText);
                console.log('Intercepted XHR response:', { url, data: responseData });
                processResponse(typeof url === 'string' ? url : url.href, responseData);
            }
            catch (e) {
                //console.error('Error parsing XHR:', e);
            }
        });
        originalXhrOpen.apply(this, args);
    };

    const processResponse = (url, data) => {
//        if (url.includes('api.example.com')) {
            console.log('Processing:', {url, data});
            //            data.customField = 'Added by script';
//        }
    };

    const replace_functions = () => {
//        console.log('calling replace_functions');
        window.fetch = new_fetch;
//        console.log({"fetch_replaced?": (window.fetch === new_fetch), "not replaced?": window.fetch === originalFetch});
        XMLHttpRequest.prototype.open = new_open;
//        console.log({"open_replaced?": (XMLHttpRequest.prototype.open === new_open), "not replaced?": XMLHttpRequest.prototype.open === originalXhrOpen});

//        console.log('testing:');
//        const temp = new XMLHttpRequest();
//        temp.open('get', 'https://search.brave.com');
    };

    replace_functions();
//    setInterval(replace_functions, 1000);

    };

    const script_tag = document.createElement('script');
    script_tag.textContent = '(' + to_be_injected + ')();';
    script_tag.onload = function() {this.remove();};
    document.head.appendChild(script_tag);
})();
//# sourceMappingURL=temporary_file.js.map
