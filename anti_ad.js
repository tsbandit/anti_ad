(function() {


var timeout_handle = null;
var iframe_covers = [];


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
      cover.style.position = 'absolute';
      cover.innerText = 'Show iframe';
      cover.style.overflow = 'hidden';
      document.body.appendChild(cover);

      entry = {cover: cover, iframe: iframe};
      iframe_covers.push(entry);

      cover.onclick = function() {
        entry.cover = false;
        cover.remove();
        console.log('Tried to remove it!');
      };
    }

    if(cover === null)
      cover = entry.cover;

    if(cover !== false) {
      // Position the cover over the iframe
      var rect = iframe.getBoundingClientRect();
      cover.style.left   = (rect.left+pageXOffset) + 'px';
      cover.style.width  = rect.width + 'px';
      cover.style.top    = (rect.top+pageYOffset) + 'px';
      cover.style.height = rect.height + 'px';
//      cover.style.margin='0px';
//      cover.style.border='0px';
//      cover.style.padding='0px';
//      cover.style.left   = '50px';
//      cover.style.right  = '100px';
//      cover.style.top    = '50px';
//      cover.style.bottom = '100px';
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
