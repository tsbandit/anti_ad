(() => {


const Global = window.Global = window.Global || {};

const {sleep} = Global.util;

Global.anti_addiction = async() => {
  let disable = null;

  const determine_whether_to_disable_this_webpage = () => {
    disable = false;

/*
    // Disable /r/factorio
    es = document.getElementsByTagName('em');
    for(var i=0; i<es.length; ++i) {
      if(es[i].innerText === "Namaste. You seek balance. Here is my wisdom. Your mistakes have no cost but time, and the deconstruction planner even reduces that cost. Most games punish you for building, demolishing and rebuilding. Not Factorio. Let your anxiety wash away as you perceive that every belt placed can be moved. Every assembler is but a visitor to where it resides. The only significance is life, which leads to the further wisdom. Look both ways before you cross the tracks.")
        disable = {reason: 'factorio subreddit'};
    }

    // Disable /r/ffviiremake
    if(window.getComputedStyle(document.body, false).backgroundImage === 'url("https://a.thumbs.redditmedia.com/mgKSOsATIw9wFPOwGjD3cR9IyN2zD7ZJZ9iO3ooT2D4.png")')
      disable = {reason: 'ffviiremake subreddit'};
*/

    // Disable certain hostnames
    if(false
        ||  window.location.hostname.indexOf('twitch.tv') >= 0
        ||  window.location.hostname.indexOf('factorio.com') >= 0
        ||  window.location.hostname.indexOf('reddit.com') >= 0
        )
      disable = {reason: 'banned hostname'};

    // Disable some youtube channels
    if(window.location.hostname.indexOf('youtube.com') >= 0) {
      var youtube_blacklist = ['NintendoCapriSun', 'EthosLab'];

      for(var k=0; k<youtube_blacklist.length; ++k) {
        var ch = youtube_blacklist[k];

        // Disable youtube videos from those channels
        ess = document.getElementsByClassName('g-hovercard');
        for(var j=0; j<ess.length; ++j)
          if(ess[j].innerText === ch)
            disable = {reason: 'username: ' + ch};

        // Disable other pages pertaining to those youtube channels
        if(window.location.href.toUpperCase().indexOf(ch.toUpperCase()) >= 0)
          disable = {reason: 'url contains: ' + ch};
      }
    }
  };

  const only_disable_at_certain_times_of_day = () => {
    const time = new Date().getHours();
    if(time >= 12  &&  time < 22)
      disable = false;
  };

  // Disable if necessary
  const disable_if_necessary = () => {
    if(disable) {
      console.log('disabling because: ' + disable.reason);
      clearTimeout(timeout_handle);
      if(document.head !== null) {
        document.head.remove();
      }
      document.body.remove();
      document.children[0].appendChild(document.createElement('body'));
      document.body.appendChild(document.createTextNode('Tommy has decided that this page cannot be viewed.'));
    }
  };

  const main = async() => {
    determine_whether_to_disable_this_webpage();
    only_disable_at_certain_times_of_day();
    await(sleep(0));
    disable_if_necessary();
  };

  await main();
};


})();
