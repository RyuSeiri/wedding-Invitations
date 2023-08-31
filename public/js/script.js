// 图片加载数
var loadSum = 0;
var loadTimer;
var domLists = [];

/**
 * 图片加载
 */
function loadDone() {
  loadSum++;
}

//加载百度地图
(function () {
  window.HOST_TYPE = "2";
  window.BMap_loadScriptTime = new Date().getTime();
  document.write(
    '<script type="text/javascript" src="https://api.map.baidu.com/getscript?v=2.0&ak=S6EO9oPso0n8aTMvfH1g0aLUX6vGZx1l&services=&t=20230808153658"></script>'
  );
})();

/**
 * 开始函数
 */
function start() {
  clearInterval(loadTimer);
  let forEach = [].forEach;
  // 画面加载完毕之后loading消失
  setTimeout(() => {
    document.getElementById("loading-mask").style.display = "none";
  }, 100);

  document.querySelector(".pageing-container").fullpage({
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
      //第10页的加载百度地图
      if (e.cur === 9 && !map) {
        initMap();
        //每秒执行一次倒计时
        timer = setInterval(function () {
          showtime();
        }, 1000);
      } else if (map) {
        destoryMap();
        if (timer) clearInterval(timer);
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

//清除动画时间
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

var map;
// 地图绘制
function initMap() {
  if (window.BMap) {
    //婚礼地点坐标
    let mapCenter = [123.066801, 41.793575];
    //百度地图对象声明（大小定义）
    map = new BMap.Map("map", { minZoom: 10, maxZoom: 30 });
    //设置坐标和大小
    map.centerAndZoom(new BMap.Point(mapCenter[0], mapCenter[1]), 50);

    //定义自定义类
    function ComplexCustomOverlay(point, text, mouseoverText) {
      this._point = point;
      this._text = text;
      this._overText = mouseoverText;
    }

    ComplexCustomOverlay.prototype = new BMap.Overlay();
    //重写初期函数
    ComplexCustomOverlay.prototype.initialize = function (map) {
      this._map = map;
      let div = (this._div = document.createElement("div"));
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
      let span = (this._span = document.createElement("span"));
      div.appendChild(span);
      span.appendChild(document.createTextNode(this._text));

      let arrow = (this._arrow = document.createElement("div"));
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
      let map = this._map;
      let pixel = map.pointToOverlayPixel(this._point);
      this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
      this._div.style.top = pixel.y - 30 + "px";
    };

    let myCompOverlay = new ComplexCustomOverlay(
      new BMap.Point(mapCenter[0], mapCenter[1]),
      "婚礼现场",
      ""
    );

    map.addOverlay(myCompOverlay);

    document.querySelector('#location-btn').addEventListener('click', () => {
      map.panTo(new BMap.Point(mapCenter[0], mapCenter[1]))
    })
  }
}

//地图删除函数
function destoryMap() {
  map.clearOverlays();
  let mapEl = document.getElementById("map");
  mapEl.innerHTML = "";
  mapEl.style = "height: 200px; width: 300px";
  map = null;
}

//跳转到微信地图
function dh() {
  // window.location.href = `https://www.xiyoupark.com/weixin/wxhome/Navigation?back=1&latitude=123.066801&longitude=41.793575&name=%E6%B2%88%E9%98%B3%E5%B8%82%E6%96%B0%E6%B0%91%E5%B8%82%E5%8F%91%E5%93%88%E7%89%9B%E5%BC%A0%E8%AE%B0%E9%A3%9F%E5%BA%9C%E4%BA%8C%E6%A5%BC&address=9%E6%9C%8816%E5%8F%B7%E4%B8%8D%E8%A7%81%E4%B8%8D%E6%95%A3`;
}

var timer;
// 倒计时函数
function showtime() {
  let nowtime = new Date(), //获取当前时间
    endtime = new Date("2023/9/16 08:58"); //定义目标时间
  let lefttime = endtime.getTime() - nowtime.getTime(), //距离结束时间的毫秒数
    leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)), //计算天数
    lefth = Math.floor((lefttime / (1000 * 60 * 60)) % 24), //计算小时数
    leftm = Math.floor((lefttime / (1000 * 60)) % 60), //计算分钟数
    lefts = Math.floor((lefttime / 1000) % 60); //计算秒数
  document.getElementById("day").innerHTML = String(leftd).padStart("2", 0);
  document.getElementById("hour").innerHTML = String(lefth).padStart("2", 0);
  document.getElementById("minute").innerHTML = String(leftm).padStart("2", 0);
  document.getElementById("second").innerHTML = String(lefts).padStart("2", 0);
}

// 画面加载事件
window.onload = function () {
  // 滚屏动画控制
  loadTimer = setInterval(() => {
    //图片全部加载完开始
    if (loadSum >= 20) {
      start();
    }
  }, 300);

  let mp3 = document.querySelector("#mp3");
  let playBtn = document.querySelector("#play-btn");
  let play;
  mp3.load();

  //微信模式下执行此代码
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

  //播放按钮点击事件
  playBtn.addEventListener(
    "click",
    function (event) {
      if (play) {
        event.target.style.animationPlayState = "paused";
        mp3.pause();
        play = false;
      } else {
        if (mp3.readyState === 4) {
          event.target.style.animationPlayState = "running";
          mp3.play();
          play = true;
        }
      }
    },
    true
  );
};
