(function() {


var timeout_handle = null;
var iframe_covers = [];


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

// This function removes a bunch of bad stuff from the DOM
var f = function() {
  var b = [];  // array of elements that will be removed
  var es;      // collection of elements                  (temp variable)
  var ess;     // another collection of elements          (temp variable)

  // Filter elements by exact class
  var nuke_class = function(classname) {
    var es = document.getElementsByClassName(classname);
    for(var i=0; i<es.length; ++i)
      b.push(es[i]);
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

  // Remove youtube "related ad videos"
  es = document.getElementsByClassName('ad-badge-byline');
  for(var i=0; i<es.length; ++i)
    b.push(es[i].parentNode.parentNode);

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
    if(es[i].tagName==='span' || es[i].tagName==='SPAN') {
      var replacement = document.createElement('span');

      ess = es[i].childNodes;
      for(var j=0; j<ess.length; ++j)
        replacement.appendChild(ess[j]);

      es[i].parentNode.insertBefore(replacement, es[i]);
      es[i].remove();
    }
  }
      

  // Filter <a> elements by href
  es = document.getElementsByTagName("a");
  for(var i=0; i<es.length; ++i)
    if(     ''.indexOf.call(es[i].href, "trafficfactory.biz") >= 0
        ||  ''.indexOf.call(es[i].href, "adzerk.net") >= 0
        )
      b.push(es[i]);

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
        )
      b.push(es[i]);

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

  // Filter <img> elements by src
  es = document.getElementsByTagName("img");
  for(var i=0; i<es.length; ++i)
    if(
            es[i].src.indexOf('adnxs.com') >= 0
        )
      b.push(es[i]);

  // Filter elements containing suspicious <script> elements
  es = document.getElementsByTagName('script');
  for(var i=0; i<es.length; ++i)
    if(es[i].innerText.indexOf('ads.intergi.com') >= 0)
      b.push(es[i].parentNode);

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

  // Filter <div> elements by class
  es = document.getElementsByTagName("div");
  for(var i=0; i<es.length; ++i)
    if(es[i].className.indexOf('taboola') >= 0)
      b.push(es[i]);

  // Remove reddit promoted post
  es = document.getElementsByClassName('sponsored-tagline');
  for(var i=0; i<es.length; ++i)
    if(es[i].parentNode.parentNode.className.indexOf('promotedlink') >= 0)
      b.push(es[i].parentNode.parentNode);

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

  // Remove some stackoverflow ads ...
  var e = document.getElementById('hireme');
  if(e !== null) {
    if(     e.innerText.indexOf('Jobs near you') === 0
        ||  e.innerText.indexOf('Looking for a job?') === 0
        )
      b.push(e);
  }

  // Actually, this code removes some stuff that isn't ads. So I better try something else instead.
//  // Remove some facebook ads
//  es = document.getElementsByClassName('ego_unit');
//  for(var i=0; i<es.length; ++i)
//    if(typeof es[i].getAttribute('data-ego-fbid') === 'string')
//      b.push(es[i]);

  // Remove some sidebar ads in youtube
  es = document.getElementsByTagName('ytd-compact-promoted-video-renderer');
  for(var i=0; i<es.length; ++i)
    b.push(es[i]);

  // Finally remove those elements we filtered
  for(var i=0; i<b.length; ++i)
    b[i].remove();

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

  // Cover any remaining iframes
  var iframes = document.getElementsByTagName('iframe');
  for(var i=0; i<iframes.length; ++i) {(function() {
    var iframe = iframes[i];

    // Find the cover for this iframe
    var entry = null;
    for(var j=0; j<iframe_covers.length; ++j)
      if(iframe_covers[j].iframe === iframe)
        entry = iframe_covers[j];

    var cover = null;

    // Create the cover if it doesn't exist
    if(entry === null) {
      cover = document.createElement('div');
      cover.style.backgroundColor = 'rgba(128,128,128,1)';
      cover.style.color = 'rgba(255,255,255,1)';
      cover.style.font = 'medium sans-serif';
      cover.innerText = 'Show iframe';
      cover.style.overflow = 'hidden';
      document.body.appendChild(cover);

      entry = {cover: cover, iframe: iframe};
      iframe_covers.push(entry);

      cover.onclick = function() {
        entry.cover = false;
        cover.remove();
      };
    }

    if(cover === null)
      cover = entry.cover;

    if(cover !== false) {
      // Position the cover over the iframe
      var s = getComputedStyle(iframe);
      cover.style.position = 'absolute';
      var rect = iframe.getBoundingClientRect();
      var xoff = pageXOffset;
      var yoff = pageYOffset;
      if(iframe===null)
        throw 0;
      if(is_fixed(iframe)) {
        xoff = yoff = 0;
        cover.style.position = 'fixed';
      }
      cover.style.left = (rect.left + xoff) + 'px';
      cover.style.top = (rect.top + yoff) + 'px';
      cover.style.width = rect.width + 'px';
      cover.style.height = rect.height + 'px';
      cover.style.zIndex = 999999999999;
    }
  }());}

  // Clean up any iframe-covers that shouldn't exist anymore.
  for(var j=iframe_covers.length-1; j>=0; --j) {
    if(!document.body.contains(iframe_covers[j].iframe)) {
      if(iframe_covers[j].cover !== false)
        iframe_covers[j].cover.remove();
      iframe_covers.splice(j, 1);
    }
  }

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

  // Skip youtube video ads
  var es = document.getElementsByTagName('video');
  for(var i=0; i<es.length; ++i) {
    if(es[i].parentElement.parentElement.className.indexOf('ad-interrupting') >= 0)
      try {
        es[i].currentTime = es[i].duration;
      } catch(_) {}
  }

  // Determine whether to disable this webpage
  {
    var disable = false;

    // Disable /r/factorio
    var es = document.getElementsByTagName('em');
    for(var i=0; i<es.length; ++i) {
      if(es[i].innerText === "Namaste. You seek balance. Here is my wisdom. Your mistakes have no cost but time, and the deconstruction planner even reduces that cost. Most games punish you for building, demolishing and rebuilding. Not Factorio. Let your anxiety wash away as you perceive that every belt placed can be moved. Every assembler is but a visitor to where it resides. The only significance is life, which leads to the further wisdom. Look both ways before you cross the tracks.")
        disable = true;
    }

    // Disable /r/ffviiremake
    if(window.getComputedStyle(document.body, false).backgroundImage === 'url("https://a.thumbs.redditmedia.com/mgKSOsATIw9wFPOwGjD3cR9IyN2zD7ZJZ9iO3ooT2D4.png")')
      disable = true;

    // Disable twitch.tv
    if(window.location.hostname.indexOf('twitch.tv') >= 0)
      disable = true;

    // Disable some youtube channels
    if(window.location.hostname.indexOf('youtube.com') >= 0) {
      var youtube_blacklist = ['NintendoCapriSun', 'EthosLab'];

      for(var k=0; k<youtube_blacklist.length; ++k) {
        var ch = youtube_blacklist[k];

        // Disable youtube videos from those channels
        var ess = document.getElementsByClassName('g-hovercard');
        for(var j=0; j<ess.length; ++j)
          if(ess[j].innerText === ch)
            disable = true;

        // Disable other pages pertaining to those youtube channels
        if(window.location.href.toUpperCase().indexOf(ch.toUpperCase()) >= 0)
          disable = true;
      }
    }
  }

//  console.log('stupid');

  // Disable if necessary
  if(disable) {
    clearTimeout(timeout_handle);
    document.head.remove();
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
