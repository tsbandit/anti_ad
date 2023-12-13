(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {sleep, storage_get, onload_promise, make_state} = Global.util;
const {call_api_stupidly} = Global.call_api_stupidly;

const parse_url = () => {
  if(window.location.href.startsWith('https://www.youtube.com/embed/')) {
    return {
      video_id: window.location.pathname.slice(7),
    };
  } else if(window.location.href.startsWith('https://www.youtube.com/watch?')) {
    return {
      video_id: new URL(window.location.href).searchParams.get('v'),
    };
  } else {
    return 'not youtube';
  }
};

const [get_last_call_time, set_last_call_time] = make_state(-5000);

const spy_on_youtube = async() => {
  console.log('called spy_on_youtube()');

  const parsed_url = parse_url();
  if(parsed_url === 'not youtube') {
    // Do nothing
  } else {
    const {video_id} = parsed_url;

    await onload_promise;

    let videos;

    while(true) {
      videos = document.querySelectorAll('video');
      if(videos.length === 1) {
        break;
      } else if(videos.length === 0) {
        console.log('anti_ad waiting for video to render');
      } else {
        console.log('anti_ad is confused because there are ' + videos.length + ' videos on the page');
      }
      await sleep(2000);
    }

    if(videos.length !== 1)
      throw new Error('unexpected condition RktzEPaEgQPeUHhmFVaT');

    const video_tag = videos[0];

    video_tag.addEventListener('timeupdate', async() => {
      const now = Date.now();
      if(now > get_last_call_time() + 5000) {
        set_last_call_time(now);  // Setting this first prevents undesired reentry.
        const req = {
          type: 'youtube',
          video_timestamp: video_tag.currentTime,
          video_id,
        };
        await call_api_stupidly(req);
      }
    });
  }
};

Global.spy_on_youtube = {spy_on_youtube};


})();
