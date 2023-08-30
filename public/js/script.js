// 滚屏动画控制
if (isMobile !== false) {
  var loadTimer = setInterval(() => {
    if (loadSum >= 17) {
      start();
    }
  }, 300);
}

var domLists = [];
var mapFlag = false;

function start() {
  clearInterval(loadTimer);
  var forEach = [].forEach;
  setTimeout(() => {
    document.getElementById("loading-mask").style.display = "none";
  }, 100);
  document.getElementsByClassName("wp-inner")[0].fullpage({
    change: function (e) {
      clearTime();
      // 移除动画属性
      forEach.call(
        document
          .querySelectorAll(".page")
          [e.cur].querySelectorAll(".js-animate"),
        function (v) {
          v.classList.add("hide");
          v.classList.remove(v.dataset["animate"]);
          if (v.dataset["sec"]) {
            v.classList.remove(v.dataset["sec"]);
          }
        }
      );
    },
    afterChange: function (e) {
      //第六页的加载百度地图
      if (e.cur === 5 && !mapFlag) {
        initMap();
      }

      domLists = document
        .querySelectorAll(".page")
        [e.cur].querySelectorAll(".js-animate");
      forEach.call(domLists, (v) => {
        var time = v.dataset.time;
        v.timer = setTimeout(function () {
          v.classList.add(v.dataset["animate"]);
          v.classList.remove("hide");
          if (v.dataset["sec"]) {
            var time = v.dataset.sectime || 0;
            v.sectimer = setTimeout(function () {
              v.classList.remove(v.dataset["animate"]);
              v.classList.add(v.dataset["sec"]);
            }, time);
          }
        }, time);
      });
    },
  });
}

function clearTime() {
  domLists.forEach((dom, i, arr) => {
    if (dom.timer) {
      clearTimeout(dom.timer);
    }
    if (dom.sectimer) {
      clearTimeout(dom.sectimer);
    }
    if (arr && arr.splice) {
      arr.splice(i, 1);
    }
  });
}

// 地图
function initMap() {
  if (window.BMap) {
    mapFlag = true;
    //坐标
    var mapCenter = [123.066801,41.793575];
    //百度地图对象声明（大小定义）
    var map = new BMap.Map("map", { minZoom: 20, maxZoom: 50 });
    //设置坐标和大小
    map.centerAndZoom(new BMap.Point(mapCenter[0], mapCenter[1]), 50);

    function ComplexCustomOverlay(point, text, mouseoverText) {
      this._point = point;
      this._text = text;
      this._overText = mouseoverText;
    }
    ComplexCustomOverlay.prototype = new BMap.Overlay();
    ComplexCustomOverlay.prototype.initialize = function (map) {
      this._map = map;
      var div = (this._div = document.createElement("div"));
      div.style.position = "absolute";
      div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
      div.style.backgroundColor = "#E60000";
      div.style.borderRadius = "3px";
      div.style.color = "white";
      div.style.height = "18px";
      div.style.padding = "2px 4px";
      div.style.lineHeight = "18px";
      div.style.whiteSpace = "nowrap";
      div.style.MozUserSelect = "none";
      div.style.fontSize = "12px";
      var span = (this._span = document.createElement("span"));
      div.appendChild(span);
      span.appendChild(document.createTextNode(this._text));

      var arrow = (this._arrow = document.createElement("div"));
    //   arrow.style.background = "url(http://map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png) no-repeat";
      arrow.style.position = "absolute";
      arrow.style.width = "0";
      arrow.style.height = "0";
      arrow.style.top = "22px";
      arrow.style.left = "10px";
      arrow.style.overflow = "hidden";
      arrow.style.border = "6px solid transparent";
      arrow.style.borderTop = "6px solid #E60000";
      div.appendChild(arrow);

      map.getPanes().labelPane.appendChild(div);

      return div;
    };
    ComplexCustomOverlay.prototype.draw = function () {
      var map = this._map;
      var pixel = map.pointToOverlayPixel(this._point);
      this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
      this._div.style.top = pixel.y - 30 + "px";
    };

    var myCompOverlay = new ComplexCustomOverlay(
      new BMap.Point(mapCenter[0], mapCenter[1]),
      "婚礼现场",
      "N and Y"
    );

    map.addOverlay(myCompOverlay);

    document.querySelector("#location-btn").addEventListener("click", () => {
      map.panTo(new BMap.Point(mapCenter[0], mapCenter[1]));
    });
  }
}

// 音乐播放控制
window.onload = function () {
  let mp3 = document.querySelector("#mp3");
  let playBtn = document.querySelector("#play-btn");
  let play;

  mp3.load();

  document.addEventListener(
    "WeixinJSBridgeReady",
    function () {
      mp3.play();
      if (!mp3.paused) {
        playBtn.style.animationPlayState = "running";
        mp3.play();
        play = true;
      }
    },
    false
  );

  play = !mp3.paused && mp3.readyState === 4;
  if (play) {
    playBtn.style.animationPlayState = "running";
  } else {
    playBtn.style.animationPlayState = "paused";
  }

  playBtn.addEventListener("click", function (event) {
    if (play) {
      this.style.animationPlayState = "paused";
      mp3.pause();
      play = false;
    } else {
      if (mp3.readyState === 4) {
        this.style.animationPlayState = "running";
        mp3.play();
        play = true;
      }
    }
  });

};
  
