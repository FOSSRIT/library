_satellite.pushAsyncScript(function(event, target, $variables){
  // make sure the _sdi object and dependencies exist
var _sdi = window._sdi = window._sdi || {};
_sdi.dtm = _sdi.dtm || {};
_sdi.dtm.video = _sdi.dtm.video || {};
// SDI Youtube Object
_sdi.dtm.video.youtube = {
  /****** START Configuration ******/
  milestones: [25, 50, 75, 95],
  directCallRules: {
    start: 'YouTube Video Play',
    milestone: 'YouTube Milestone'
  },
  dataElements: {
    title: "videoTitle",
    time: "videoTime",
    milestone: "videoMilestone",
    duration: "videoDuration"
  },
  playerName: 'Youtube',
  timeout: 1000,
  /****** END Configuration ******/
  /****** START YT Tracking ******/
  stages: {},
  players: {},
  init: function() {
    // look at the scripts on the page to see if the YT API is already referenced
    // if not referenced, load the YT API
    var scripts = document.getElementsByTagName('script'),
      api = false,
      ids = [],
      vids = _sdi.dtm.video.youtube.videos;
    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i],
        src = script.src || '';
      if (src.match(/youtube\.com\/iframe_api/)) {
        api = true;
      }
    }
    if (api === false) {
      // api script not found, load it in
      _satellite.loadScript('//www.youtube.com/iframe_api', function() {
        _sdi.dtm.video.youtube.ready('api');
      });
    } else {
      _sdi.dtm.video.youtube.ready('api');
    }
  },
  ready: function(stage) {
    // make sure dom ready has been reached and the api is ready
    _sdi.dtm.video.youtube.stages[stage] = true;
    if (_sdi.dtm.video.youtube.stages.dom && _sdi.dtm.video.youtube.stages.api) {
      _sdi.dtm.video.youtube.checkIframes();
    }
  },
  checkIframes: function() {
    // check the YT iframes to make sure protocols and origin match
    // check the YT iframes to make sure js reporting api is enabled
    // update the video src if needed based on the above
    var vids = _sdi.dtm.video.youtube.videos;
    _satellite.cssQuery('iframe[src*="youtube"]', function(iframes) {
      for (var i = 0; i < iframes.length; i++) {
        var ifr = iframes[i];
        if (!ifr.getAttribute('data-sdi')) { // make sure we have not already looked at the iframe
          var vid = ifr.src.match(/(https?:)?\/\/www\.youtube(-nocookie)?\.com\/embed\/([\w-]{11})(?:\?.*)?/),
            id = (vid.length > 3 ? vid[3] : '');
          if (!ifr.id) {
            ifr.id = id;
          }
          var ifrSrc = ifr.src;
          //update video protocol
          if (document.location.protocol == "https:") {
            ifrSrc = ifrSrc.replace("http:", "https:");
          }
          //check for origin
          if (!ifrSrc.match(/origin/) && document.location.protocol == "https:") {
            ifrSrc = ifrSrc + (ifrSrc.indexOf('?') > -1 ? '&' : '?') + 'origin=' + document.location.protocol + '//' + document.location.host;
          } else if (ifrSrc.match(/origin/)) {
            var srcArr = ifrSrc.split('origin=');
            var afterOrigin = srcArr[1];
            ifrSrc = srcArr[0] + 'origin=' + document.location.protocol + '//' + document.location.host;
          }
          //check for enablejsapi
          if (!ifrSrc.match(/enablejsapi=1/)) {
            ifrSrc = ifrSrc + (ifrSrc.indexOf('?') > -1 ? '&' : '?') + 'enablejsapi=1';
          }
          //update src if it is different
          if (ifrSrc !== ifr.src) {
            ifr.src = ifrSrc;
          }
          if (ifrSrc.match(/enablejsapi=1/)) {
            if (typeof YT != 'undefined') {
              if (typeof YT.get != 'undefined') {
                ready = true;
                vids[id] = {};
                if (!YT.get(ifr.id)) {
                  // configure the API for the iframe if not already configured
                  vids[id].player = new YT.Player(ifr.id, {
                    events: {
                      onReady: function() {},
                      onStateChange: function() {},
                      videoId: ifr.id
                    }
                  });
                  ifr.setAttribute('data-sdi', 'true');
                } else {
                  ifr.setAttribute('data-sdi', 'true');
                  // API for the iframe is already configured
                }
                _sdi.dtm.video.youtube.timeout = 1000;
              } else {
                // YT.get is not ready
                // lower the timeout length
                _sdi.dtm.video.youtube.timeout = 100;
              }
            } else {
              // YT is not ready
              // lower the timeout length
              _sdi.dtm.video.youtube.timeout = 100;
            }
          }
        }
      }
    });
    setTimeout(function() {
      _sdi.dtm.video.youtube.checkIframes();
    }, _sdi.dtm.video.youtube.timeout);
  },
  videos: {},
  setVideoData: function(n, v) {
    // setting data elements with video data
    var de = _sdi.dtm.video.youtube.dataElements || {};
    // set a specific value
    if (n && v) {
      _satellite.setVar(de[n], v);
    }
    // set multiple values, object literal
    else if (typeof n == 'object') {
      for (var name in n) {
        _satellite.setVar(de[name], n[name]);
      }
    }
    // player
    if (de.player && _sdi.dtm.video.youtube.playerName) {
      _satellite.setVar(de.player, _sdi.dtm.video.youtube.playerName);
    }
  }
};
_sdi.dtm.video.youtube.init();
_satellite.addEventHandler(window, 'message', function(r) {
  // listen to messages sent to the parent domain from the YT domain
  // populate data about the video being watched
  // fire direct call rules for the player interaction events
  var d = {};
  if (r.origin.match(/\.youtube(-nocookie)?\.com/) && typeof JSON != 'undefined') {
    d = typeof r.data == 'string' ? JSON.parse(r.data) : {};
    var videos = _sdi.dtm.video.youtube.videos,
      dc = _sdi.dtm.video.youtube.directCallRules || {},
      de = _sdi.dtm.video.youtube.dataElements || {},
      data = {},
      v = {},
      id, vName;
    // video info
    if (d.event == 'infoDelivery') {
      if (d.info.videoData) {
        id = d.info.videoData.video_id;
        v = videos[id] || {};
        v.info = d.info;
        v.id = d.id;
        videos[id] = v;
        vName = _sdi.dtm.video.youtube.playerName + '|' + v.info.videoData.video_id + '|' + v.info.videoData.title;
      } else {
        for (var vs in videos) {
          var vid = videos[vs];
          if (vid.id == d.id) {
            v = vid;
          }
        }
        if (v.info) {
          // video time changes
          vName = _sdi.dtm.video.youtube.playerName + '|' + v.info.videoData.video_id + '|' + v.info.videoData.title;
          if (d.info.currentTime) {
            // capture a scrub by checking if the last time we tracked was more than 1.5 seconds
            if (Math.abs(d.info.currentTime - v.info.currentTime) > 1.5) {
              if (dc.seek) {
                // capture seek
                data = {
                  title: v.info.videoData.title,
                  time: d.info.currentTime
                };
                _sdi.dtm.video.youtube.setVideoData(data);
                _satellite.track(dc.seek);
              }
            }
            // milestones
            var m = _sdi.dtm.video.youtube.milestones || [],
              t = d.info.currentTime;
              //_satellite.notify('T = ' + t);
            if (m.length > 0) {
              v.milestones = v.milestones || {};
              var pct = t / v.info.duration * 100;
              
              for (var i = 0; i < m.length; i++) {
                var next = m[i + 1] || 100;
                if (pct > m[i] && pct <= next && !v.milestones[m[i]]) {
                  if (dc.milestone) {
                    _satellite.setVar(de.milestone, m[i]);
                    _satellite.setVar(de.time, t);
                    _satellite.track(dc.milestone.replace(/\{milestone\}/ig, '' + m[i]));
                    v.milestones[m[i]] = true;
                  }
                }
              }
            }
            v.info.currentTime = d.info.currentTime;
          }

        }
      }
      // player state changes
      if (typeof d.info.playerState != "undefined") {
        for (var vs2 in videos) {
          var vid2 = videos[vs2];
          if (vid2.id == d.id) {
            v = vid2;
          }
        }
        data = {
          title: v.info.videoData.title,
          duration: v.info.duration,
          time: v.info.currentTime
        };
        // video play
        if (d.info.playerState == 1) {
          // video start
          if (!v.started || v.completed) {
            v.started = true;
            v.completed = false;
            if (dc.start) {
              _sdi.dtm.video.youtube.setVideoData(data);
              _satellite.track(dc.start);
            }
          }
          // video resume
          else {
            if (dc.resume) {
              _sdi.dtm.video.youtube.setVideoData(data);
              _satellite.track(dc.resume);
            }
          }
          v.state = 'playing';
        }
      }
    }
  }
});
_satellite.domReady(function() {
  // dom ready has been reached
  _sdi.dtm.video.youtube.ready('dom');
});
});
