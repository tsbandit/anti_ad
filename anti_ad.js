(() => {
'use strict';
const Global = window.Global = window.Global || {};
const {sleep, onload_promise} = Global.util;
const {set_timeout_handle} = Global.master_loop;
const {anti_addiction} = Global.anti_addiction;
const anti_ad = async function() {


console.log('anti_ad.js', window.location.href);

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

const occasionally_do = (function() {
  let timestamp = performance.now();
  return async function(f) {
    if(performance.now() - timestamp  >  2) {
      await f();
      timestamp = performance.now();
    }
  };
}());

const get_ancestor = function(node, f) {
  for(let j=0; j<100; ++j) {
    if(node === document)
      return null;
    else if(f(node))
      return node;
    else
      node = node.parentNode;
  }
  return null;
};

const decaying_interval = function(f) {
  let n = 100;
  const g = function() {
    setTimeout(g, n);
    if(n < 1000)
      n *= 1.1;
    f();
  };
  setTimeout(g, 0);
};

const get_stack = function() {
  try {
    throw new Error();
  } catch(e) {
    return e.stack;
  }
};

const log_stack = function() {
  console.log(get_stack());
}

const remove = function(x) {
  var e = document.getElementById(x);
  if(e !== null)
    e.remove();
};

const undisplay_selector = (selector) => {
  const style_tag = document.createElement('style');
  style_tag.innerText = `\
    ${selector} {
      visibility: hidden;
    }
  `;
  document.head.appendChild(style_tag);
};

const twitter_helper = function() {
  // Skip Twitter video ads
  if(site('twitter.com')) {
    const es = document.querySelectorAll('[data-testid="ad"]');
    for(let i=0; i<es.length; ++i) {
      const ancestor = get_ancestor(es[i], (x)=>x.classList.contains('PlayableMedia-reactWrapper'));
      if(ancestor !== null) {
        try {
          const video = ancestor.children[0].children[0].children[0].children[0].children[0].children[0];
          if(video.tagName === 'VIDEO') {
            video.currentTime = video.duration;
            console.log('Skipped twitter video ad');
          }
        } catch(_) {
        }
      }
    }
  }

  // Remove Twitter promoted tweets
  if(site('twitter.com')) {
    const es = document.querySelectorAll('*[data-testid="tweet"] svg + div span');
    for(let i=0; i<es.length; ++i) {
      if(!es[i].innerText.startsWith('Promoted'))
        continue;

      const node = get_ancestor(es[i], (x) => {
        return x.getAttribute('data-testid') === 'tweet';
      });
      if(node !== null) {
        node.remove();
        console.log('removed twitter promoted tweet');
      }
    }
  }

  const is_separator_element = function(div) {
    // Argument should be a child of the main timeline div [aria-label="Timeline: Your Home Timeline"]

    let x = true;
    x = x && (div.children.length === 1);
    x = x && (div.children[0].children.length === 1);
    x = x && (window.getComputedStyle(div.children[0].children[0]).backgroundColor === 'rgb(230, 236, 240)');
    return x;
  };

  // Remove Twitter "Who to follow" in the tweet stream
  if(site('twitter.com')) {
    const es = document.querySelectorAll('*[aria-label="Timeline: Your Home Timeline"]');
    let remove_mode = false;
    for(let i=0; i<es.length; ++i) {
      for(let j=0; j<es[i].children[0].children[0].children.length; ++j) {
        const node = es[i].children[0].children[0].children[j];

        if(node.innerText === 'Who to follow')
          remove_mode = true;

        if(is_separator_element(node))
          remove_mode = false;

        if(remove_mode) {
          node.remove();
          console.log('removed twitter "who to follow" in the tweet stream');
        }
      }
    }
  }

  // Remove Twitter "<someone> follows" tweets
  if(site('twitter.com')) {
    const es = document.querySelectorAll('*[data-testid="tweet"]');
    for(let i=0; i<es.length; ++i) {
      const node = es[i].previousSibling;

      if(node === null)
        continue;

      if(     !node.innerText.endsWith(' follows')
          &&  !node.innerText.endsWith(' follow' ) )
        continue;

      es[i].remove();
      console.log('removed twitter "someone follows" tweet');
    }
  }
};

// This function removes a bunch of bad stuff from the DOM
const f = async function() {
  let b = [];  // array of elements that will be removed
  let es;      // collection of elements                  (temp variable)
  let ess;     // another collection of elements          (temp variable)
  const bflush = function() {
    // Remove all the nodes we planned to remove.
    for(var i=0; i<b.length; ++i) {
      b[i].node.remove();
      console.log('['+window.location.href+'] removed:');
      console.log(b[i].stack);
    }
    b = [];
  };
  const maybe_yield = () => occasionally_do(async() => {
    await sleep(0);
    bflush();
  });
  const remove_later = function(node) {
    b.push({
      node,
      stack: new Error(),
    });
  };

  // Filter elements by exact class
  {
    var nuke_class = async function(classname) {
      const es = document.getElementsByClassName(classname);
      for(var i=0; i<es.length; ++i) {
        remove_later(es[i]);
        await maybe_yield();
      }
    };
    nuke_class('ad');
    nuke_class('spx-adwords');
    nuke_class('ad-banner-container');
    nuke_class('ad-container');
    nuke_class('adzerk-vote');
    nuke_class('ac_adbox_inner');
    nuke_class('adModule');
    nuke_class('pb-ads');
    nuke_class('video-ads');
    nuke_class('moov-banner-wrapper');
    nuke_class('js-ima-ads-container');  // twitch video ads
    nuke_class('direct-ad-frame');  // Gyazo ads
    nuke_class('clc-cp-container');  // Some stackoverflow ads?
    nuke_class('ethical-content');  // readthedocs.io
    nuke_class('ytp-endscreen-content');  // youtube related videos

    if(site('quora.com')) {
      nuke_class('dom_annotate_ad_promoted_answer');  // Quora "Promoted" thingies
    }

    if(!site('imgur.com')) {  // Doesn't work on imgur
      nuke_class('advertisement');
    }
  }

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
              remove_later(ess[j]);
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
      remove_later(es[i]);

  await(sleep(0));

  if(!site('imgur.com')) {
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
        remove_later(es[i]);
  }

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
      remove_later(es[i]);

  await(sleep(0));

/*
  // Filter <iframe> elements by class
  es = document.getElementsByTagName('iframe');
  for(var i=0; i<es.length; ++i)
    if(
            es[i].className.indexOf('qc-ad') >= 0
        ||  es[i].className.indexOf('cnvr-ad') >= 0
        )
      remove_later(es[i]);
*/

  await(sleep(0));

  if(!site('imgur.com')) {
    // Filter <img> elements by src
    es = document.getElementsByTagName("img");
    for(var i=0; i<es.length; ++i)
      if(
              es[i].src.indexOf('adnxs.com') >= 0
          )
        remove_later(es[i]);
  }

  await(sleep(0));

  // Filter elements containing suspicious <script> elements
  es = document.getElementsByTagName('script');
  for(var i=0; i<es.length; ++i)
    if(es[i].innerText.indexOf('ads.intergi.com') >= 0)
      remove_later(es[i].parentNode);

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
      remove_later(es[i]);

  await(sleep(0));

  // Filter <div> elements by class
  es = document.getElementsByTagName("div");
  for(var i=0; i<es.length; ++i)
    if(es[i].className.indexOf('taboola') >= 0)
      remove_later(es[i]);

  await(sleep(0));

  // Remove old-reddit promoted post
  es = document.getElementsByClassName('sponsored-tagline');
  for(var i=0; i<es.length; ++i)
    if(es[i].parentNode.parentNode.className.indexOf('promotedlink') >= 0)
      remove_later(es[i].parentNode.parentNode);

  await(sleep(0));

  // Remove reddit promoted post
  if(site('reddit.com')) {


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
      remove_later(r);
  }


  }

  await(sleep(0));

  // 2023-04-18: Remove reddit promoted post
  if(site('reddit.com')) {
    for(const elem of document.querySelectorAll('.promotedlink')) {
      remove_later(elem);
    }
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
        remove_later(ess[j]);
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
        remove_later(es[i]);
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
      remove_later(e);
  }

  await(sleep(0));

  // Actually, this code removes some stuff that isn't ads. So I better try something else instead.
//  // Remove some facebook ads
//  es = document.getElementsByClassName('ego_unit');
//  for(var i=0; i<es.length; ++i)
//    if(typeof es[i].getAttribute('data-ego-fbid') === 'string')
//      remove_later(es[i]);

  await(sleep(0));

  // Remove Google Doodle
  if(   window.location.host.endsWith('google.com')
      &&
        window.location.pathname === '/'
      ){
    const e = document.getElementById('hplogo');
    if(e !== null)
      remove_later(e);
  }

  await(sleep(0));

  // Remove Google Doodle from chrome://newtab
  if(window.location.href.startsWith('https://www.google.com/_/chrome/newtab?')) {
    const e = document.getElementById('dood');
    if(e !== null)
      remove_later(e);
  }

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
        remove_later(node);
    }
  }

  await(sleep(0));

  // Some reddit ads
  if(site('reddit.com')) {
    es = document.getElementsByTagName('div');
    for(let i=0; i<es.length; ++i) {
      if(window.getComputedStyle(es[i], '::before').content === '"advertisement"')
        remove_later(es[i]);
      await maybe_yield();
    }
  }

  await(sleep(0));

  // Twitter "Who to follow" and "Trends for you" and "Relevant people"
  if(site('twitter.com')) {
    const es = document.querySelectorAll('[aria-label="Timeline: Trending now"]');
    for(let i=0; i<es.length; ++i) {
      remove_later(es[i]);
      await maybe_yield();
    }
    const es2 = document.querySelectorAll('[aria-label="Who to follow"]');
    for(let i=0; i<es2.length; ++i) {
      remove_later(es2[i]);
      await maybe_yield();
    }
    const es3 = document.querySelectorAll('[aria-label="Relevant people"]');
    for(let i=0; i<es3.length; ++i) {
      remove_later(es3[i]);
      await maybe_yield();
    }
  }

  if(site('twitter.com'))
    twitter_helper();

  await(sleep(0));

  if(site('quora.com')) {


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
        remove_later(r);
    }

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
        remove_later(r);
    }

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
        remove_later(r);
    }

    const mainContent = document.getElementById('mainContent');

    // Get rid of ads that appear below an answer after clicking to expand the answer.
    try {
      for(const quora_item of mainContent.children[1].children) {
        try {
          const maybe_an_ad = quora_item.children[0].children[1];
          if(/^[^\n]*\nSponsored\n/.test(maybe_an_ad.innerText)) {
            remove_later(maybe_an_ad);
          }
        } catch(e) {
        }

        try {
          const maybe_an_ad = quora_item.children[1];
          if(/^[^\n]*\nSponsored\n/.test(maybe_an_ad.innerText)) {
            remove_later(maybe_an_ad);
          }
        } catch(e) {
        }
      }
    } catch(e) {
    }

    // Get rid of an ad that appears just below the question.
    try {
      const maybe_an_ad = mainContent.children[1].children[0];
      if(maybe_an_ad.innerText.startsWith('Ad by ')) {
        remove_later(maybe_an_ad);
      }
    } catch(e) {
    }

    // Get rid of "Sponsored by " posts that occur in the main stream of answers.
    try {
      for(const maybe_an_ad of mainContent.children[1].children) {
        try {
          if(maybe_an_ad.innerText.startsWith('Sponsored by ')) {
            remove_later(maybe_an_ad);
          }
        } catch(e) {
        }
      }
    } catch(e) {
    }


  }

  if(site('stackoverflow.com')) {
    remove('hireme');
  }

  await maybe_yield();

  await(sleep(0));

  // Remove a few elements with specific id
//  remove('pagelet_growth_expanding_cta');  // "Log in to Facebook!"
  remove('googa');
  remove('social_badges');
  remove('taboola-container');
  remove('google_companion_ad_div');
  remove('ad');
  remove('pubmatic_parent');
  remove('at4-share');  // A floating share-button thingie on the side

  if(site('youtube.com')) {
    //remove('player-ads');  //Youtube video top-right ads
    undisplay_selector('ytd-watch-next-secondary-results-renderer');  // related videos in right-hand column
  }

  if(site('imgur.com')) {
    remove('div-ad-top_banner');
    remove('sidebar-bottom-ads');
    remove('side-gallery');
  }

  await(sleep(0));

  // "Log in to Facebook!"
  // Look for <a> tags containing "Not Now" and with other telling signs nearby
  es = document.getElementsByTagName('a');
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
  es = document.getElementsByTagName('video');
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

  await anti_addiction();
};

// Call f() every once in a while
var g = function() {
  set_timeout_handle(setTimeout(g, 1000));
  f();  // Might call clearTimeout(timeout_handle)
};

// Possibly launch the main loop:
if(!site('imgur.com')) {
  onload_promise.then(g);
}

if(site('imgur.com')) {
  setInterval(function() {
    const remove_children = function(id) {
      const e = document.getElementById(id);
      for(let i=0; i<e.children.length; ++i) {
        const x = e.children[i];
        x.style.display = 'none';
      }
    };
//    remove_children('div-ad-top_banner');
//    remove_children('sidebar-bottom-ads');
    const es = document.getElementsByClassName('advertisement');
    for(let i=0; i<es.length; ++i) {
      const e = es[i];
      e.style.display = 'none';
    }
//    document.getElementById('div-ad-top_banner').style.display = 'none';
//    document.getElementById('sidebar-bottom-ads').style.display = 'none';
//    remove('div-ad-top_banner');
//    remove('sidebar-bottom-ads');
    remove('side-gallery');
  }, 300)
}

if(site('twitter.com')) {
  let tweet_count = -1;
  setInterval(function() {
    let caught = true;
    let new_tweet_count;
    try {
      new_tweet_count = document.getElementById('stream-items-id').children.length;
      caught = false;
    } catch(_) {
    }
    if(!caught) {
      if(new_tweet_count !== tweet_count) {
        console.log('tweet count changed');
        tweet_count = new_tweet_count;
        twitter_helper();
      }
    }
  }, 100);
}

if(site('facebook.com')) {
  decaying_interval(function() {
    // Remove "Suggested Groups"
    for(const e of document.querySelectorAll('[data-referrer="pagelet_ego_contextual_group"]')) {
      e.remove();
      console.log('removed facebook suggested groups');
    }

    // Remove "Sponsored" post
    for(const e of document.querySelectorAll('[aria-label="Public"]')) {
      try {
        if(!e.parentNode.innerText.startsWith('Sponsored'))
          continue;
        const a = get_ancestor(e, (x => x.parentNode.getAttribute('role') === 'feed'));
        if(a === null)
          continue;
        a.remove();
        console.log('removed facebook sponsored post');
      } catch(_) {
      }
    }
  });
}


};
Global.anti_ad = {anti_ad};
})();
