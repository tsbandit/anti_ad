(() => {


'use strict';

const Global = window.Global = window.Global || {};

const {sleep, make_state} = Global.util;

Global.anti_addiction = async() => {
  console.log('in anti_addiction()');

  const [get_is_disabled, set_is_disabled] = make_state(false);
  const disable = set_is_disabled;

  const disable_factorio_subreddit = () => {
    const es = document.getElementsByTagName('em');
    for(var i=0; i<es.length; ++i) {
      if(es[i].innerText === "Namaste. You seek balance. Here is my wisdom. Your mistakes have no cost but time, and the deconstruction planner even reduces that cost. Most games punish you for building, demolishing and rebuilding. Not Factorio. Let your anxiety wash away as you perceive that every belt placed can be moved. Every assembler is but a visitor to where it resides. The only significance is life, which leads to the further wisdom. Look both ways before you cross the tracks.")
        disable({reason: 'factorio subreddit'});
    }
  };

  const disable_ffviiremake_subreddit = () => {
    if(window.getComputedStyle(document.body, false).backgroundImage === 'url("https://a.thumbs.redditmedia.com/mgKSOsATIw9wFPOwGjD3cR9IyN2zD7ZJZ9iO3ooT2D4.png")')
      disable({reason: 'ffviiremake subreddit'});
  };

  const disable_certain_hostnames = () => {
    if(       window.location.hostname.indexOf('twitch.tv') >= 0
          ||  window.location.hostname.indexOf('factorio.com') >= 0
          ||  window.location.hostname.indexOf('reddit.com') >= 0
          )
      disable({reason: 'banned hostname'});
  };

  const disable_some_youtube_channels = () => {
    if(window.location.hostname.indexOf('youtube.com') >= 0) {
      var youtube_blacklist = ['NintendoCapriSun', 'EthosLab'];

      for(var k=0; k<youtube_blacklist.length; ++k) {
        var ch = youtube_blacklist[k];

        // Disable youtube videos from those channels
        const ess = document.getElementsByClassName('g-hovercard');
        for(var j=0; j<ess.length; ++j)
          if(ess[j].innerText === ch)
            disable({reason: 'username: ' + ch});

        // Disable other pages pertaining to those youtube channels
        if(window.location.href.toUpperCase().indexOf(ch.toUpperCase()) >= 0)
          disable({reason: 'url contains: ' + ch});
      }
    }
  };

  const determine_whether_to_disable_this_webpage = () => {
    disable_factorio_subreddit();
    disable_ffviiremake_subreddit();
    disable_certain_hostnames();
    disable_some_youtube_channels();
  };

  const only_disable_at_certain_times_of_day = () => {
    const time = new Date().getHours();
    if(time >= 12  &&  time < 22)
      set_is_disabled(false);
  };

  const enact_the_disabling = (reason) => {
    console.log('disabling because: ' + reason);
    clearTimeout(timeout_handle);
    if(document.head !== null) {
      document.head.remove();
    }
    document.body.remove();
    document.children[0].appendChild(document.createElement('body'));
    document.body.appendChild(document.createTextNode('Tommy has decided that this page cannot be viewed.'));
  };

  const main = async() => {
    determine_whether_to_disable_this_webpage();

    only_disable_at_certain_times_of_day();

    await sleep(0);

    const is_disabled = get_is_disabled();

    if(is_disabled) {
      enact_the_disabling(is_disabled.reason);
    }
  };

  await main();
};


})();
