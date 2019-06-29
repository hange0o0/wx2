class GameManager {
    private static _instance:GameManager;
    public static getInstance():GameManager {
        if (!this._instance)
            this._instance = new GameManager();
        return this._instance;
    }

    private timeID: egret.Timer;
    private timeE = new MyTimer(1000/60);
    private lastTime: number;
    public lastTouchTime: number;
    public lastTouchMC;

    public onShowFun
    public shareFailTime = 0
	public constructor() {
        this.timeID = new egret.Timer(1000);
        this.timeID.addEventListener(egret.TimerEvent.TIMER,this.timerun,this);
        this.timeID.start();

        this.timeE.addEventListener(egret.TimerEvent.TIMER,this.onTimeE,this);
        this.timeE.start();
	}
	
    public static stage:egret.Stage;
    public static stageX;
    public static stageY;
    public static container:egret.DisplayObjectContainer;
    public static loadStep

    public static isLiuHai(){
        return this.stage.stageHeight > 1250;
    }
    public static paddingTop(){
        return GameManager.isLiuHai()?50:0
    }
    public static paddingBottom(){
        if(App.isIphoneX)
            return 30;
        return 0;
    }

    public static get uiHeight(){
        var h = this.stage.stageHeight// - Config.adHeight;

        if(this.isLiuHai())
        {
            if(App.isIphoneX)
                return h-this.paddingTop()-30;
            return h-this.paddingTop();
        }
        return h//Math.min(1136,this.stage.stageHeight);
        //return this.stage.stageHeight;
    }
    public static get uiWidth(){
        return this.stage.stageWidth;
    }

    public isWebGL(){
        return egret.Capabilities.renderMode == 'webgl';
    }

    public init(){
        GameManager.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onTouchMove,this);
        GameManager.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouchBegin,this);
        //this.createAD();
    }

    //private createAD(){
    //    //Config.adHeight = 200;
    //    if(!window['wx'])
    //        return;
    //    if(GameManager.stage.stageHeight < 1080)
    //        return;
    //
    //
    //    var btnw = Math.min(Math.pow(GameManager.stage.stageHeight/1330,1.6)*640,640)
    //
    //    let scalex = screen.availWidth/640;
    //    let scaley = screen.availHeight/GameManager.stage.stageHeight;
    //    if(btnw * scalex < 300){ //微信限制广告宽度不能小于300
    //        btnw = 300 / scalex;
    //    }
    //    Config.adHeight =  btnw/640 * 224;
    //    var  btny = GameManager.uiHeight;//给广告留的高度
    //    var  paddingTop = GameManager.paddingTop();
    //    var btnx =  (640-btnw)/2;
    //
    //    let left = scalex * (btnx);
    //    let top = scaley * (btny + paddingTop);
    //    let width = scalex * btnw;
    //
    //    let bannerAd = wx.createBannerAd({
    //        adUnitId: 'adunit-d406f443acb5f7d2',
    //        style: {
    //            left: left,
    //            top: top,
    //            width: width
    //        }
    //    })
    //    bannerAd.onError(()=>{
    //        Config.adHeight = 0
    //        GameManager.stage.dispatchEventWith(egret.Event.RESIZE);
    //    })
    //    bannerAd.onLoad(()=>{
    //
    //    })
    //    bannerAd.onResize((res)=>{
    //        var hh = res.height/scalex*(640/btnw);
    //        if(Math.abs(hh - 224)/224 > 0.02)
    //        {
    //            Config.adHeight =  btnw/640 * hh;
    //            GameManager.stage.dispatchEventWith(egret.Event.RESIZE);
    //            bannerAd.style.top = scaley * (GameManager.uiHeight + paddingTop);
    //        }
    //        //console.log(res,scalex,scaley,GameManager.stage.stageHeight)
    //    })
    //    bannerAd.show()
    //}

    public stopTimer(){
        this.timeID.stop();
        this.timeE.stop();
    }


    private onTimeE(){
        EM.dispatch(GameEvent.client.timerE);
    }


    private onTouchMove(e){
        GameManager.stageX = e.stageX;
        GameManager.stageY = e.stageY;
    }
    private onTouchBegin(e){
        this.lastTouchMC = e.target;
        GameManager.stageX = e.stageX;
        GameManager.stageY = e.stageY;
        this.lastTouchTime = egret.getTimer();
    }


    private timerun(): void {
        var now = TM.now();
        if(!this.lastTime) {
            this.lastTime = now;
            return;
        }
        if(!DateUtil.isSameDay(this.lastTime,now))//跨0点
        {
            //TeamPVEManager.getInstance().passDay();
            //DayGameManager.getInstance().passDay();
            //GuessManager.getInstance().passDay();

            UserManager.getInstance().testPassDay();
            EM.dispatch(GameEvent.client.pass_day);
        }
        EM.dispatch(GameEvent.client.timer);



        //if(UM.friendtime == 0){  //拿过日志了
        //    if(now%30 == 0) //5分钟请求一次
        //    {
        //        FriendManager.getInstance().getLog(null,null,false);
        //    }
        //}
        this.lastTime = now
        //if(SyncDataManager.getInstance().lastConnectTime && now - SyncDataManager.getInstance().lastConnectTime > 3600) //超过1小时要重新登录
        //{
        //    MyWindow.AlertRelogin('已经离开很长时间了，请重新登陆吧')
        //}
    }

    //取现在到晚上12点还差的时间
    public getZeroCD(){
        return this.getZeroTime() - TM.now();
    }
    public getZeroTime(){
        var d= DateUtil.timeToChineseDate(TM.now());
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        d.setHours(24);

        return Math.floor(d.getTime()/1000);
    }

}


class App {
    public static touchEvent: string = egret.TouchEvent.TOUCH_TAP;
    
    public constructor() {
    }

    public static get isIphoneX():boolean{
        let hh = screen.height, ww = screen.width;
        if(window['wx']){
            hh = screen.availHeight, ww = screen.availWidth;
        }
        let _iphoneX = /iphone/gi.test(navigator.userAgent) && (hh == 812 && ww == 375);
        let _iphoneXR = /iphone/gi.test(navigator.userAgent) && (hh == 896 && ww == 414);
        return _iphoneX || _iphoneXR;
    }
    	
    public static get isMobile():boolean{
        return egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE;
    }
    public static get isAndroid():boolean{
        //var Agents:string[] = ["Android", "iPhone",  "SymbianOS", "Windows Phone",  "iPad", "iPod"];
        var ua:string = navigator.userAgent.toLowerCase();
        return ua.indexOf('android') != -1;
    }
    public static get isIOS():boolean{
        //var Agents:string[] = ["Android", "iPhone",  "SymbianOS", "Windows Phone",  "iPad", "iPod"];
        var ua:string = navigator.userAgent.toLowerCase();
        return /ip(ad|hone|od)/.test(ua);
    }
}

//var _get = {};
//var url = location.hash || location.search;
//var splitStr = location.hash ? '#' : '?';
//if (url.indexOf(splitStr) != -1) {
//    var str = url.substr(1);
//    var strs = str.split("&");
//    for (var i = 0; i < strs.length; i++) {
//        var a = strs[i].split("=");
//        var k = a[0];
//        var v = a[1];
//        _get[k] = v;
//    }
//}


//function handleErr(msg,url, line, col, errorObj)
//{
//    //if(!Net.getInstance().serverHost)
//    //    return;
//    var txt = (url|| '').substr(-30,27)+ ':' + msg + '|' + line + "--" + col+ "--" + (errorObj && errorObj.stack);
//    var str = MyTool.getBtnPath(GameManager.getInstance().lastTouchMC);
//    if(str)
//        txt += str;
//    sendClientError(txt);
//    //Net.send(GameEvent.sys.client_error,{msg:txt});
//    //if(LoginManager.getInstance().isAuto)
//    //{
//    //    LoginManager.getInstance().showLoginUI();
//    //}
//    //else if(GuideManager.getInstance().isGuiding)
//    //{
//    //    Alert('发生未知错误',MyTool.refresh);
//    //}
//    return false
//}

function sendClientError(str){
    //var url =  'http://172.17.196.195:90/error_wx2/log_error.php'
    //if(window["wx"])
    var url =  'https://www.hangegame.com/error_wx2/log_error.php'
    Net.getInstance().send(url,{str:str});
}
//window.onerror=handleErr;


if(window["wx"])
{
    window['sendClientError'] =  sendClientError;
    window["BottomUI"] = BottomUI;
    window["TopUI"] = TopUI
    window["ChangeUserUI"] = ChangeUserUI
    window["GameManager"] = GameManager;


    var wx =  window["wx"];

    wx.onError(function(res){
        UM.upDateUserData();
        try{
            var str = "onError:" + ("openid:" + UM.gameid + "--") + res.message + "--" + res.stack;
            sendClientError(str);
        }catch(e){}
    });

    wx.onHide(function(res){
        if(!GameManager.stage)
            return;
        UM.upDateUserData();
        SoundManager.getInstance().stopBgSound();
        GameManager.stage.dispatchEventWith(egret.Event.DEACTIVATE);
        console.log('hide')
        //GameUI.getInstance().cleanTouch();
    });

    wx.onShow(function(res){
        if(!GameManager.stage)
            return;
            SoundManager.getInstance().playSound('bg');
        GameManager.stage.dispatchEventWith(egret.Event.ACTIVATE);
        GameManager.getInstance().onShowFun && GameManager.getInstance().onShowFun();
        GameManager.getInstance().onShowFun = null;
        //GameUI.getInstance().cleanTouch();
        console.log('show')

        MyADManager.getInstance().onShow();

    });
    //wx.exitMiniProgram(function(res){
    //    if(!GameManager.stage)
    //        return;
    //    PKManager.getInstance().upDateUserData();
    //});

    wx.onShareAppMessage(() => ({
        title: '这个游戏很好玩，推荐一下',
        imageUrl: Config.localResRoot + "share_img_2.jpg"
    }))

    if(wx.getUpdateManager){ //1.9.90以上版本支持
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            //console.log(res.hasUpdate)
            if(res.hasUpdate){
                wx.showToast({icon:"none", title:"有新版本，正在下载中..", duration: 600000});//10分钟
                window["clearTempCache"] && window["clearTempCache"]();
            }
        })
        updateManager.onUpdateReady(function () {
            wx.hideToast();
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，请点击确定重启应用',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })

        })
        updateManager.onUpdateFailed(function () {
            wx.hideToast();
            wx.showModal({
                title: '更新提示',
                content: '新版本下载失败，点击确定重试哦',
                showCancel: false,
                success: function (res) {
                    updateManager.applyUpdate()
                }
            })
        })
    }

    wx.setKeepScreenOn && wx.setKeepScreenOn({keepScreenOn:true});//屏幕常亮




    Config.isDebug = false;
}
