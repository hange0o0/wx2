class MyADManager {
    private static instance:MyADManager;

    public static getInstance() {
        if (!this.instance) this.instance = new MyADManager();
        return this.instance;
    }

    public changeUserTime = 0
    public changeUserID = 0
    public changeUserFun;
    
    public cloudPath = 'cloud://hange0o0-16b7c5.6861-hange0o0-16b7c5/'
    private adList;

    public extraData
    public finishExtraUin = -1;
    
    public onShow(){
        if(this.changeUserTime)
        {
            if(TM.now() - this.changeUserTime > 30) //停留超过30秒
            {
                this.addJoinAppid(this.changeUserID);
                if(this.changeUserFun)
                    this.changeUserFun();

                ChangeJumpUI.getInstance().hide();
                UM.needUpUser = true;;
            }
            this.changeUserTime = 0;
            this.changeUserFun = null
        }
    }

    public navigateToMiniProgram(data){
        var wx = window['wx'];

        if(!wx)
        {
            console.log('click AD')

            return;
        }
        var self = this;
        wx.navigateToMiniProgram({
            appId:data.appid,
            success(res) {
                self.addJoinAppid(data.appid);
                data.fun && data.fun('changeUser');
            }
        })
    }

    public addJoinAppid(appid){
        var arr = SharedObjectManager.getInstance().getMyValue('exchangeUserAppid')|| [];
        var index = arr.indexOf(appid)
        if(index != -1)
            arr.splice(index,1);
        arr.push(appid)
        while(arr.length > 30)
            arr.shift()
        SharedObjectManager.getInstance().setMyValue('exchangeUserAppid',arr)
    }

    public getAD(fun?){
        if(this.adList)
        {
            fun && fun();
            return;
        }

        var self = this;
        //var splitList = ['wxd5d9d807682d46bb',"wxf9c8e218c23e2eb7","wxe066524f2972cb1a","wx2f66e2c8de744d53"]
        this.adList = []
        var num = 20
        var wx = window['wx'];
        //console.log(333333)
        if(!wx) {
            var temp = {
                isSelf:true,
                "appid": "wxd5d9d807682d46bb",
                "logo": "icon_coin_png",
                img:'icon_coin_png',
                "desc": "右手油门，左手刹车，做一个平民车神！",
                name:'前方有测速监控'
            }
            this.adList.push(temp)
            this.adList.push(temp)
            this.adList.push(temp)
            this.adList.push(temp)


            fun && fun();
            return;
        }

        wx.wladGetAds(num,function (res) { //第⼀一个参数为获取⼴广告条数，第⼆二个参数为获取成功后回调⽅方法;
            self.adList = self.adList.concat(res.data);
            self.resetAdList();
            fun && fun();
        })

        wx.cloud.downloadFile({
            fileID: self.cloudPath + 'adList.txt',
            success: res => {
                var url =  res.tempFilePath;
                var loader: egret.URLLoader = new egret.URLLoader();
                loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
                loader.once(egret.Event.COMPLETE,()=>{
                    var str = loader.data.replace(/\r\n/g,'')
                    var arr = JSON.parse(str);
                    self.resetPath(arr)

                },this);
                loader.load(new egret.URLRequest(url));
            },
            fail: err => {
                console.log(err)
            }
        })
        //var loader = new egret.URLLoader();
        //loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        //loader.once(egret.Event.COMPLETE,()=>{
        //    console.log(JSON.parse(loader.data.replace(/\r\n/g,'')));
        //},this);
        //loader.load(new egret.URLRequest('http://172.17.196.195:9034/resource/data/adList.txt'));

        //window['xhtad'].xhtAdsData('fixed').then(ads => {
        //    if(ads)
        //    {
        //        ads.appid = ads.appId;
        //        ads.logo = ads.img;
        //        ads.img = ads.qrImg;
        //        ads.isXiaoHu = true;
        //        self.adList.push(ads)
        //    }
        //})
    }

    //把非自己的去掉
    private resetAdList(){
        var myObj = {};
        for(var i=0;i<this.adList.length;i++)
        {
            if(this.adList[i].isSelf)
            {
                myObj[this.adList[i].appid] = true;
            }
        }
        for(var i=0;i<this.adList.length;i++)
        {
            if(!this.adList[i].isSelf &&  myObj[this.adList[i].appid])
            {
                this.adList.splice(i,1);
                i--;
            }
        }
    }

    //重置路径
    private resetPath(arr){

        for(var i=0;i<arr.length;i++)
        {
            var oo = arr[i];
            if(oo.appid ==  Config.myAppID)
            {
                arr.splice(i,1);
                i--;
                continue;
            }
            this.resetOne(oo);
        }
    }

    private resetOne(oo){
        var wx = window['wx'];
        var self = this;
        oo.isSelf = true;
        oo.step = 2;
        wx.cloud.downloadFile({
            fileID: this.cloudPath + oo.logo,
            success: res => {
                oo.logo =  res.tempFilePath;
                self.pushADData(oo);
            }
        })

        wx.cloud.downloadFile({
            fileID: this.cloudPath + oo.img,
            success: res => {
                oo.img =  res.tempFilePath;
                self.pushADData(oo);
            }
        })
    }

    private pushADData(oo){
        oo.step --;
        if(!oo.step)
        {
            this.adList.push(oo)
            this.resetAdList();
        }
    }

    public showAD(data){
        var wx = window['wx'];

        if(!wx)
        {
            console.log('click AD')

            return;
        }

        //if(data.isXiaoHu)
        //{
        //    window['xhtad'].xhtAdsClick(data.adName)
        //    return;
        //}

        var self = this;
        wx.previewImage({
            urls: [data.img],
            success: function () {
                self.changeUserFun = data.fun;
                self.changeUserTime = TM.now();
                self.changeUserID = data.appid;
            }
        })
    }

    public getListByNum(num,fun?){
        if(!this.adList)
            return [];
        var arr = SharedObjectManager.getInstance().getMyValue('exchangeUserAppid')|| [];
        for(var i=0;i<this.adList.length;i++)
        {
            this.adList[i].temp = arr.indexOf(this.adList[i].appid)

            if(this.adList[i].isSelf)
                this.adList[i].temp2 = 1
            else if(this.adList[i].isXiaoHu)
                this.adList[i].temp2 = 2
            else
                this.adList[i].temp2 = 3
            this.adList[i].fun = fun;
        }
        ArrayUtil.sortByField(this.adList,['temp','temp2'],[0,0]);
        return this.adList.slice(0,num);
    }


    ////////////////////////////////banner///////////////////
    public bannerAD
    public bannerBG
    public createAD(){
        //Config.adHeight = 200;
        if(!window['wx'])
            return;
        if(!Config.wx_ad)
            return;
        if(GameManager.stage.stageHeight < 1080)
            return;
        var wx = window['wx']


        var btnw = Math.min(Math.pow(GameManager.stage.stageHeight/1330,1.6)*640,640)

        let scalex = screen.availWidth/640;
        let scaley = screen.availHeight/GameManager.stage.stageHeight;
        if(btnw * scalex < 300){ //微信限制广告宽度不能小于300
            btnw = 300 / scalex;
        }
        Config.adHeight =  btnw/640 * 224;
        var  btny = GameManager.uiHeight;//给广告留的高度
        var  paddingTop = GameManager.paddingTop();
        var btnx =  (640-btnw)/2;

        let left = scalex * (btnx);
        let top = scaley * (btny + paddingTop);
        let width = scalex * btnw;

        let bannerAd = this.bannerAD = wx.createBannerAd({
            adUnitId: Config.wx_ad,
            style: {
                left: left,
                top: top,
                width: width
            }
        })
        bannerAd.onError(()=>{
            Config.adHeight = 0
            GameManager.stage.dispatchEventWith(egret.Event.RESIZE);
        })
        bannerAd.onLoad(()=>{

        })
        bannerAd.onResize((res)=>{
            var hh = res.height/scalex*(640/btnw);
            if(Math.abs(hh - 224)/224 > 0.02)
            {
                Config.adHeight =  btnw/640 * hh;
                GameManager.stage.dispatchEventWith(egret.Event.RESIZE);
                bannerAd.style.top = scaley * (GameManager.uiHeight + paddingTop);
            }
            //console.log(res,scalex,scaley,GameManager.stage.stageHeight)
        })
        bannerAd.show()
        bannerAd.hide();
    }
    private wx4_functionX_54600(){console.log(7039)}

    public showBanner(bottom){
        if(this.bannerAD)
        {
            if(!this.bannerBG)
            {
                this.bannerBG = new eui.Image('bg8_png')
                this.bannerBG.width = 640;
                this.bannerBG.height = Config.adHeight;
            }
            GameManager.container.addChild(this.bannerBG)
            this.bannerBG.bottom = bottom;
            this.bannerAD.show()
            var scaley = screen.availHeight/GameManager.stage.stageHeight;
            var  paddingTop = GameManager.paddingTop();
            this.bannerAD.style.top = scaley * (GameManager.uiHeight + paddingTop - bottom - GameManager.paddingBottom() - Config.adHeight);
        }
    }

    public hideBanner(){
        if(this.bannerAD)
            this.bannerAD.hide();
        MyTool.removeMC(this.bannerBG)
    }



    public initExtra(data){
        this.extraData = null;
        if(!data || !data.referrerInfo || !data.referrerInfo.extraData || !data.referrerInfo.extraData.appid)
        {
            return;
        }
        if(this.finishExtraUin != data.referrerInfo.extraData.uin)
            this.extraData = data.referrerInfo.extraData
    }

    //前往WX5
    public openWX5(data){
        var wx = window['wx'];
        data.appid = Config.myAppID//我的APPID
        data.uin = Math.floor(Math.random()*1000000000000000);//唯一Key
        if(!wx || DebugUI.getInstance().debugOpen)
        {
            this.extraData = data
            this.testWX5Back()
            return;
        }

        wx.navigateToMiniProgram({
            appId: 'wxe2875716299fa092',//别点小广告
            envVersion:'trial',
            extraData:data,
            complete(res) {
            }
        })
    }

    //WX5回调
    public testWX5Back(){
        if(!this.extraData)
            return
        this.finishExtraUin = this.extraData.uin;
        switch(this.extraData.callBack)
        {
            case 'reborn':
                HeroManager.getInstance().rebornAllFun()
                break;
        }
    }
}