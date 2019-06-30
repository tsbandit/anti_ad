(function() {


console.log(window.location.href);

// Refer to https://stackoverflow.com/questions/21751377/foolproof-way-to-detect-if-this-page-is-inside-a-cross-domain-iframe
const is_cross_origin_iframe = function() {
  try {
    if(window.top === window.self)
      return false;
    return (!window.top.location.hostname);  // For checking cross-origin
//    return true;
  } catch (e) {
    return true;
  }
};

if(is_cross_origin_iframe()) {
  const iframe_cover = document.createElement('div');
  const style = iframe_cover.style;
  style.backgroundColor = 'rgba(64,64,64,1)';
  style.color = 'rgba(255,255,255,1)';
  style.font = 'medium sans-serif';
  style.position = 'fixed';
  style.left = style.top = style.right = style.bottom = '0';
  style.zIndex = 9e10;
  iframe_cover.innerText = 'Show iframe';
  iframe_cover.onclick = function() {
    iframe_cover.remove();
  };
  document.body.appendChild(iframe_cover);
}

const sleep = (n) => new Promise((resolve, reject) => {
  setTimeout(resolve, n);
});


var is_fixed = function(el) {
  for(var i=0; i<10000; ++i) {
    if(el === null)
      return false;

    if(window.getComputedStyle(el).getPropertyValue('position').toLowerCase() === 'fixed')
      return true;

    el = el.parentElement;
  }
  throw 'loop ran for too long';
};

const site = function(s) {
  return window.location.hostname.endsWith(s);
};

if(window.location.href === 'https://www.reddit.com/r/yangforpresidenthq/new/') {
  setTimeout(function() {
    window.location.reload();
  }, 10 * 1000);
}

const maybe_yield = (function() {
  let timestamp = performance.now();
  return async function() {
    if(performance.now() - timestamp  >  2) {
      await sleep(0);
      timestamp = performance.now();
    }
  };
}());

// This function removes a bunch of bad stuff from the DOM
var f = async function() {
  var b = [];  // array of elements that will be removed
  var es;      // collection of elements                  (temp variable)
  var ess;     // another collection of elements          (temp variable)

  // Filter elements by exact class
  var nuke_class = async function(classname) {
    var es = document.getElementsByClassName(classname);
    for(var i=0; i<es.length; ++i) {
      b.push(es[i]);
      await maybe_yield();
    }
  };
  nuke_class('ad');
  nuke_class('spx-adwords');
  nuke_class('advertisement');
  nuke_class('ad-banner-container');
  nuke_class('ad-container');
  nuke_class('adzerk-vote');
  nuke_class('ac_adbox_inner');
  nuke_class('adModule');
  nuke_class('pb-ads');
  nuke_class('video-ads');
  nuke_class('moov-banner-wrapper');
  nuke_class('js-ima-ads-container');  // twitch video ads
  nuke_class('advertisement');
  nuke_class('direct-ad-frame');  // Gyazo ads
  nuke_class('clc-cp-container');  // Some stackoverflow ads?
  nuke_class('ethical-content');  // readthedocs.io
  nuke_class('ytp-endscreen-content');  // youtube related videos

  // Remove youtube related videos in sidebar
  es = document.getElementsByTagName('ytd-compact-video-renderer');
  for(let i=0; i<es.length; ++i) {
    b.push(es[i]);
    await maybe_yield();
  }

  await(sleep(0));

  // Remove youtube "related ad videos"
  es = document.getElementsByClassName('ad-badge-byline');
  for(var i=0; i<es.length; ++i) {
    b.push(es[i].parentNode.parentNode);
    await maybe_yield();
  }

  await(sleep(0));

  // Completely destroy webpages built by infolinks
  es = document.getElementsByTagName('iframe');
  for(var i=0; i<es.length; ++i) {
    if(es[i].src.indexOf('infolinks.com') >= 0) {
      if(    es[i].parentNode === document.body
          && document.body.className === 'singular page' ) {
        var real_page = document.getElementById('page');
        if(real_page !== null && real_page.parentNode===document.body) {
          ess = document.body.childNodes;
          for(var j=0; j<ess.length; ++j)
            if(ess[j] !== es[i] && ess[j] !== real_page)
              b.push(ess[j]);
          break;
        }
      }
    }
  }
  es = document.getElementsByClassName('IL_AD');
  for(var i=0; i<es.length; ++i) {
    await maybe_yield();
    if(es[i].tagName==='span' || es[i].tagName==='SPAN') {
      var replacement = document.createElement('span');

      ess = es[i].childNodes;
      for(var j=0; j<ess.length; ++j)
        replacement.appendChild(ess[j]);

      es[i].parentNode.insertBefore(replacement, es[i]);
      es[i].remove();
    }
  }
      
  await(sleep(0));

  // Filter <a> elements by href
  es = document.getElementsByTagName("a");
  for(var i=0; i<es.length; ++i)
    if(     ''.indexOf.call(es[i].href, "trafficfactory.biz") >= 0
        ||  ''.indexOf.call(es[i].href, "adzerk.net") >= 0
        )
      b.push(es[i]);

  await(sleep(0));

  // Filter <iframe> elements by src
  es = document.getElementsByTagName("iframe");
  for(var i=0; i<es.length; ++i)
    if(
            es[i].src.indexOf("adnxs.com") >= 0
        ||  es[i].src.indexOf("disqusads.com") >= 0
        ||  es[i].src.indexOf("amazon-adsystem.com") >= 0
        ||  es[i].src.indexOf("google.com/afs/ads") >= 0
        ||  es[i].src.indexOf("bidvertiser.com") >= 0
        )
      b.push(es[i]);

  await(sleep(0));

  // Filter <iframe> elements by id
  es = document.getElementsByTagName("iframe");
  for(var i=0; i<es.length; ++i)
    if(    es[i].id.indexOf("google_ads") === 0
        || es[i].id.indexOf("adsonar") === 0
//        || es[i].id.indexOf("ados_frame_adzerk") === 0
        || es[i].id.indexOf("fif_slot_auto") === 0
        || es[i].id.indexOf("amznad") === 0
        || es[i].id.indexOf("aswift") === 0
        || es[i].id.indexOf("utif_apn_ad_slot_") === 0
        || es[i].id.indexOf("sovrn_ad_unit_") === 0
        )
      b.push(es[i]);

  await(sleep(0));

/*
  // Filter <iframe> elements by class
  es = document.getElementsByTagName('iframe');
  for(var i=0; i<es.length; ++i)
    if(
            es[i].className.indexOf('qc-ad') >= 0
        ||  es[i].className.indexOf('cnvr-ad') >= 0
        )
      b.push(es[i]);
*/

  await(sleep(0));

  // Filter <img> elements by src
  es = document.getElementsByTagName("img");
  for(var i=0; i<es.length; ++i)
    if(
            es[i].src.indexOf('adnxs.com') >= 0
        )
      b.push(es[i]);

  await(sleep(0));

  // Filter elements containing suspicious <script> elements
  es = document.getElementsByTagName('script');
  for(var i=0; i<es.length; ++i)
    if(es[i].innerText.indexOf('ads.intergi.com') >= 0)
      b.push(es[i].parentNode);

  await(sleep(0));

  // Filter <div> elements by id
  es = document.getElementsByTagName("div");
  for(var i=0; i<es.length; ++i)
    if(    es[i].id.indexOf("adtech_") === 0
        || es[i].id.indexOf('grv-personalization') === 0
        || es[i].id.indexOf('zergnet-widget') === 0
        || es[i].id.indexOf('google_ads') === 0
        || es[i].id.indexOf('rcjsload') === 0
        || es[i].id.indexOf('outbrain') === 0
        || es[i].id.indexOf('amzn_assoc_ad_div_adunit') === 0
        || es[i].id.indexOf('adblock') >= 0
        || es[i].id.indexOf('trc_wrapper_') === 0  // Sponsored links by Taboola
        )
      b.push(es[i]);

  await(sleep(0));

  // Filter <div> elements by class
  es = document.getElementsByTagName("div");
  for(var i=0; i<es.length; ++i)
    if(es[i].className.indexOf('taboola') >= 0)
      b.push(es[i]);

  await(sleep(0));

  // Remove old-reddit promoted post
  es = document.getElementsByClassName('sponsored-tagline');
  for(var i=0; i<es.length; ++i)
    if(es[i].parentNode.parentNode.className.indexOf('promotedlink') >= 0)
      b.push(es[i].parentNode.parentNode);

  await(sleep(0));

  // Remove reddit promoted post
  es = document.getElementsByTagName('span');
  for(let i=0; i<es.length; ++i) {
    const should_remove = function() {
      try {
        let scrollerItem = es[i];
        for(let j=0; j<20; ++j)
          if(scrollerItem.classList.contains('scrollerItem'))
            break;
          else
            scrollerItem = scrollerItem.parentNode;

        const div = scrollerItem.parentNode.parentNode;

        if(
                es[i].innerText === 'PROMOTED'
            &&
                es[i].parentNode.children[1].innerText.charCodeAt(0) === 8226
            &&
                scrollerItem.children[0].children[0].children[0].getAttribute('data-click-id') === 'upvote'
            ) {
          return div;
        }
        throw 0;
      } catch(e) {
        return false;
      }
    };
    const r = should_remove();
    if(r !== false)
      b.push(r);
  }

  await(sleep(0));

  // Find <iframe> elements that are siblings of <div> with
  // id matching "google_ads"
  es = document.getElementsByTagName("div");
  for(var i=0; i<es.length; ++i) {
    if(es[i].id.indexOf("google_ads") !== 0)
      continue;

    ess = es[i].parentNode.childNodes;
    for(var j=0; j<ess.length; ++j)
      if(    ess[j].tagName === 'iframe'
          || ess[j].tagName === 'IFRAME' )
        b.push(ess[j]);
  }

  await(sleep(0));

  // Remove reddit ads (iframes that are direct children of <div id="...">)
  var remove_reddit = function(x) {
    var e = document.getElementById(x);
    if(e === null)
      return;

    var es = e.childNodes;
    for(var i=0; i<es.length; ++i)
      if(    es[i].tagName === 'iframe'
          || es[i].tagName === 'IFRAME' )
        b.push(es[i]);
  };
  remove_reddit('ad_main');
  remove_reddit('ad_main_top');

  await(sleep(0));

  // Remove some stackoverflow ads ...
  var e = document.getElementById('hireme');
  if(e !== null) {
    if(     e.innerText.indexOf('Jobs near you') === 0
        ||  e.innerText.indexOf('Looking for a job?') === 0
        )
      b.push(e);
  }

  await(sleep(0));

  // Actually, this code removes some stuff that isn't ads. So I better try something else instead.
//  // Remove some facebook ads
//  es = document.getElementsByClassName('ego_unit');
//  for(var i=0; i<es.length; ++i)
//    if(typeof es[i].getAttribute('data-ego-fbid') === 'string')
//      b.push(es[i]);

  await(sleep(0));

  // Remove some sidebar ads in youtube
  es = document.getElementsByTagName('ytd-compact-promoted-video-renderer');
  for(var i=0; i<es.length; ++i)
    b.push(es[i]);

  await(sleep(0));

  // Remove some newer upper-right ads in youtube
  es = document.getElementsByTagName('ytd-movie-offer-module-renderer');
  for(var i=0; i<es.length; ++i)
    b.push(es[i]);

  await(sleep(0));

  // Remove Google Doodle
  if(   window.location.host.endsWith('google.com')
      &&
        window.location.pathname === '/'
      ){
    const e = document.getElementById('hplogo');
    if(e !== null)
      b.push(e);
  }

  await(sleep(0));

  // Remove Google Doodle from chrome://newtab
  if(window.location.href.startsWith('https://www.google.com/_/chrome/newtab?')) {
    const e = document.getElementById('dood');
    if(e !== null)
      b.push(e);
  }

  const get_ancestor = function(node, f) {
    for(let j=0; j<100; ++j) {
      if(node === null)
        return null;
      else if(f(node))
        return node;
      else
        node = node.parentNode;
    }
    return null;
  };

  await(sleep(0));

  // Some Facebook ads
  if(site('facebook.com')) {
    es = document.getElementsByTagName('a');
    for(let i=0; i<es.length; ++i) {
      if(es[i].innerText !== 'Sponsored')
        continue;
      const node = get_ancestor(es[i], (x) => {
        return x.classList.contains('ego_section');
      });
      if(node !== null)
        b.push(node);
    }
  }

  await(sleep(0));

  // Some reddit ads
  if(site('reddit.com')) {
    es = document.getElementsByTagName('div');
    for(let i=0; i<es.length; ++i) {
      if(window.getComputedStyle(es[i], '::before').content === '"advertisement"')
        b.push(es[i]);
      await maybe_yield();
    }
  }

  await(sleep(0));

  // Newer Quora "Ad by" thingies
  es = document.getElementsByTagName('div');
  for(let i=0; i<es.length; ++i) {
    const should_remove = function() {
      try {
        if(!es[i].innerText.startsWith('Ad by '))
          return null;

        return get_ancestor(es[i], (x) => {
          return x.parentNode.classList.contains('question_main_col');
        });
      } catch(e) {
        return null;
      }
    };
    const r = should_remove();
    if(r !== null)
      b.push(r);
  }

  await(sleep(0));

  // Quora "Ad by" thingies
  es = document.getElementsByTagName('div');
  for(let i=0; i<es.length; ++i) {
    const should_remove = function() {
      try {
        if(!es[i].innerText.startsWith('Ad by '))
          return false;

        let node = es[i];
        for(let j=0; j<100; ++j)
          if(node.classList.contains('PromptsList'))
            break;
          else
            node = node.parentNode;
        if(j >= 100)
          return false;

        return node.parentNode;
      } catch(e) {
        return false;
      }
    };
    const r = should_remove();
    if(r !== false)
      b.push(r);
  }

  await(sleep(0));

  // Quora "Promoted by" thingies
  es = (function() {
    const a1 = document.getElementsByTagName('div');
    const a2 = document.getElementsByTagName('p');
    const result = [];
    for(let i=0; i<a1.length; ++i)
      result.push(a1[i]);
    for(let i=0; i<a2.length; ++i)
      result.push(a2[i]);
    return result;
  }());
  for(let i=0; i<es.length; ++i) {
    const should_remove = function() {
      try {
        if(
              !es[i].innerText.startsWith('Promoted by ')
            &&
              es[i].innerText !== 'By Quora for Business'
            &&
              !es[i].innerText.startsWith('Sponsored by ')
            )
          return false;

        let node = es[i];
        for(let j=0; j<100; ++j)
          if(
                node.parentNode.classList.contains('paged_list_wrapper')
              ||
                node.parentNode.classList.contains('pagelist_item')
              )
            break;
          else
            node = node.parentNode;
        if(j >= 100)
          return false;

        return node;
      } catch(e) {
        return false;
      }
    };
    const r = should_remove();
    if(r !== false)
      b.push(r);
  }

  await(sleep(0));

  // Finally remove those elements we filtered
  for(var i=0; i<b.length; ++i) {
    b[i].remove();
    console.log('removed!');
  }

  await(sleep(0));

  // Remove a few elements with specific id
  var remove = function(x) {
    var e = document.getElementById(x);
    if(e !== null)
      e.remove();
  };
//  remove('pagelet_growth_expanding_cta');  // "Log in to Facebook!"
  remove('googa');
  remove('social_badges');
  remove('taboola-container');
  remove('google_companion_ad_div');
  remove('ad');
  remove('pubmatic_parent');
  remove('player-ads');  //Youtube video top-right ads
  remove('at4-share');  // A floating share-button thingie on the side

  await(sleep(0));

  // "Log in to Facebook!"
  // Look for <a> tags containing "Not Now" and with other telling signs nearby
  var es = document.getElementsByTagName('a');
  for(var i=0; i<es.length; ++i) {
    // Verify that the <a> tag matches all the criteria, otherwise continue.
    if(es[i].innerHTML !== 'Not Now')
      continue;
    try {
      if(es[i].parentElement.childNodes[0].childNodes[0].innerText.indexOf(
                'To see more from') !== 0)
        throw 0;
    } catch(_) {
      try{
        if(es[i].id !== 'expanding_cta_close_button')
          throw 0;
        if(es[i].parentElement.childNodes[0].childNodes[0].innerText.indexOf(
                'See more of') !== 0)
          throw 0;
      } catch(_) {
        continue;
      }
    }

    es[i].parentElement.parentElement.parentElement.remove();
  }

  await(sleep(0));

  // Skip youtube video ads
  var es = document.getElementsByTagName('video');
  for(var i=0; i<es.length; ++i) {
    if(es[i].parentElement.parentElement.className.indexOf('ad-interrupting') >= 0)
      try {
//        es[i].pause();
        const t = es[i].duration - 0.2;
        if(es[i].currentTime < t)
          es[i].currentTime = t;
      } catch(_) {}
  }

  await(sleep(0));

  // Skip twitter video ads
  if(site('twitter.com')) {
    es = document.getElementsByTagName('video');
    for(let i=0; i<es.length; ++i) {
      try {
        const ad_indicators = es[i].parentElement.parentElement.parentElement.parentElement.parentElement.children[1]
        for(let j=0; j<ad_indicators.children; ++j)
          .children[0].children[0].children[0].children[0].children[1];
        if(ad_indicator.getAttribute('data-testid') === 'ad' && ad_indicator.innerText === 'Ad') {
          es[i].currentTime = es[i].duration;
          console.log('Skipped twitter video ad');
        }
      } catch(_) {
      }
    }
  }

  // Skip funimation video ads
  if(window.location.href.startsWith('https://www.funimation.com/player')) {
    (async() => {
      const n = 15;
      for(let i=0; i<n; ++i) {
        const xs = document.getElementsByClassName('vjs-fw-video');

        for(let i=0; i<xs.length; ++i) {
          const x = xs[0];
          x.currentTime = 35;
          x.muted = 'muted';
        }

        await sleep(1000/n);
      }
    })();
  };

  await(sleep(0));

  // Determine whether to disable this webpage
  {
    var disable = false;

/*
    // Disable /r/factorio
    var es = document.getElementsByTagName('em');
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
        var ess = document.getElementsByClassName('g-hovercard');
        for(var j=0; j<ess.length; ++j)
          if(ess[j].innerText === ch)
            disable = {reason: 'username: ' + ch};

        // Disable other pages pertaining to those youtube channels
        if(window.location.href.toUpperCase().indexOf(ch.toUpperCase()) >= 0)
          disable = {reason: 'url contains: ' + ch};
      }
    }

    // Only disable at certain times of day
    const time = new Date().getHours();
    if(time >= 12  &&  time < 22)
      disable = false;
  }

  disable = false;

  await(sleep(0));

  // Disable if necessary
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

// Call f() every once in a while
var g = function() {
  timeout_handle = setTimeout(g, 1000);
  f();  // Might call clearTimeout(timeout_handle)
};
timeout_handle = setTimeout(g, 0);

//alert('working');
//console.log('stupid tommy debug stmt');


}());
