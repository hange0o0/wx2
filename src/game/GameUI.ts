class GameUI extends game.BaseUI {

    private static _instance:GameUI;
    public static getInstance() {
        if (!this._instance) this._instance = new GameUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "GameUISkin";
    }

    private mainScroller: eui.Scroller;
    private scrollGroup: eui.Group;
    private teamGroup: eui.Group;
    public team1: TeamUI;
    public team2: TeamUI;
    private coinGroup: eui.Group;
    private coinText: eui.Label;
    private bottomGroup: eui.Group;
    private rankBtn: eui.Group;
    private shopBtn: eui.Group;
    private shopRedMC: eui.Image;
    public mainGroup: eui.Group;
    private wordGroup: eui.Group;
    private b1: eui.BitmapLabel;
    private b2: eui.BitmapLabel;
    private b3: eui.BitmapLabel;
    private cdText: eui.Label;
    public settingBtn: eui.Group;
    private chapterRedMC: eui.Image;
    private mailBtn: eui.Group;
    private mainPKUI: MainPKUI;
    private soundBtn: eui.Image;
    public loadingGroup: eui.Group;
    private loadMC: eui.Image;
    private loadText: eui.Label;
    private startBtn: eui.Image;
    private changeUser: ChangeUserUI;






    private infoBtn:UserInfoBtn


    private pkMV
    private mvState = ''

    private stopRote = 1
    private stopVO
    private stopMV = new PKMonsterMV()


    private haveGetInfo = false;
    private haveLoadFinish = false;
    private haveGetUser = false;
    private needShowStartBtn = false;

    private firstShow = true;
    public showIndex = -1;
    public showData;
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.soundBtn,this.onSetting)
        this.addBtnEvent(this.settingBtn,this.onChapter)
        this.addBtnEvent(this.mailBtn,this.onMail)
        this.addBtnEvent(this.shopBtn,this.onShop)
        this.addBtnEvent(this.rankBtn,this.onRank)

        var name = 'pk_mv'
        var data:any = RES.getRes(name + "_json"); //qid
        var texture:egret.Texture = RES.getRes(name + "_png");
        var mcFactory = new egret.MovieClipDataFactory(data, texture);
        this.pkMV = new egret.MovieClip();
        this.pkMV.movieClipData = mcFactory.generateMovieClipData('mv');
        this.mainGroup.addChild(this.pkMV);
        this.pkMV.y = 5;
        this.pkMV.x = 58;
        this.pkMV.scaleX = this.pkMV.scaleY = 1.5
        this.pkMV.visible = false;

        this.team1.teamID = 1
        this.team2.teamID = 2

        this.mainPKUI.addEventListener('visible_change',this.onMainVisibleChange,this)



        this.infoBtn = new UserInfoBtn(this.startBtn, (res)=>{
            //UserManager.getInstance().updateUserInfo(res,()=>{
            this.renewInfo(res);
            //});

        }, this, Config.localResRoot + "wx_btn_info.png");
        this.infoBtn.visible = false;
        this.startBtn.visible = false;
        //MyTool.removeMC(this.startBtn)
    }


    private renewInfo(res?){
        var wx = window['wx'];
        if(!wx)
        {
            this.haveGetUser = true;
            this.initData();
            return;
        }
        if(res)
        {
            if(!res.userInfo)
            {
                this.infoBtn.visible = false;
                this.haveGetUser = true;
                this.initData();
                return;
            }
            this.infoBtn.visible = false;
            this.haveGetUser = true;
            this.initData();
            UM.renewInfo(res.userInfo)
            return;
        }
        wx.getSetting({
            success: (res) =>{
                console.log(res.authSetting)
                if(res.authSetting["scope.userInfo"])//已授权
                {
                    this.haveGetUser = true;
                    this.initData()
                    wx.getUserInfo({
                        success: (res) =>{
                            var userInfo = res.userInfo
                            UM.renewInfo(userInfo)
                            //UM.head = userInfo.avatarUrl
                            //UM.gender = userInfo.gender || 1 //性别 0：未知、1：男、2：女
                        }
                    })
                }
                else
                {
                    this.needShowStartBtn = true;
                    //this.infoBtn.visible = true;
                }
            }
        })
    }

    public scrollToBottom(){
        this.mainScroller.viewport.scrollV = this.mainScroller.viewport.contentHeight - this.mainScroller.height;
        this.changeUser.renew()
    }


    public resizeFun(){
        this.team1.height = this.team2.height = (this.height- 75 -105)/2
        this.team2.y = this.team1.height;
        this.teamGroup.height = this.team1.height*2;
    }


    private onRank(){
        //this['sfasfsfsadf']();
        RankUI.getInstance().show();
    }

    private onSetting(){
        SoundManager.getInstance().soundPlaying = !SoundManager.getInstance().soundPlaying
        SoundManager.getInstance().bgPlaying = !SoundManager.getInstance().bgPlaying
        this.renewSound();

    }
    private onChapter(){
        CoinGameUI.getInstance().show();
    }

    private renewSound(){
        this.soundBtn.source = SoundManager.getInstance().bgPlaying?'sound_btn1_png':'sound_btn2_png'
    }

    public onMail(){
        LogUI.getInstance().show();
        //this.mainPKUI.hide();
        //this.team1.visible = this.team2.visible = !this.mainPKUI.visible
    }

    public onShop(){
        GetCoinUI.getInstance().show();
    }

    public show(){


        super.show();
    }

    private callShow(){
        this.loadText.text = '初始化中'
        var index = PKManager.getInstance().getTodayIndex();
        PKManager.getInstance().loadLevelData(()=>{
        //PKManager.getInstance().loadLevelData(index,(data)=>{
            //PKManager.getInstance().initData(index,data);
            if(this.needShowStartBtn)
            {
                this.haveLoadFinish = true;
                this.initData();
                return;
            }
            setTimeout(()=>{
                this.haveLoadFinish = true;
                this.initData();
            },1000)



        })
    }




    public onShow(){
        var self = this;
        this.bottomGroup.visible = false;
        this.coinText.text = '******'


        this.renewSound();
        //this.cdText.text = '.'
        this.loadingGroup.visible = true;
        egret.Tween.get(this.loadMC,{loop:true}).to({rotation:360},3000)
        self.loadText.text = '正在加载素材，请耐心等候..'

        this.renewInfo();
        UserManager.getInstance().getUserInfo(()=>{
            this.haveGetInfo = true;
            this.initData();
        });
        var wx =  window["wx"];
        if(wx)
        {
            const loadTask = wx.loadSubpackage({
                name: 'assets2', // name 可以填 name 或者 root
                success(res) {
                    // 分包加载成功后通过 success 回调
                    self.callShow();
                },
                fail(res) {
                    // 分包加载失败通过 fail 回调
                }
            })

            loadTask.onProgressUpdate(res => {
                self.loadText.text = '正在加载素材，请耐心等候..' + res.progress + '%'
                //console.log('下载进度', res.progress)
                //console.log('已经下载的数据长度', res.totalBytesWritten)
                //console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
            })




            return;
        }

        this.callShow();
    }

    private initData(){
        if(this.haveLoadFinish && this.haveGetInfo && !this.haveGetUser && this.needShowStartBtn)
        {
            this.changeUser.renew()
            this.loadText.text = '点击屏幕受权进入游戏';
            this.needShowStartBtn = false;
            this.infoBtn.visible = true;
            this.loadMC.visible = false;
            egret.Tween.removeTweens(this.loadMC);
            return;
            //this.loadText.text = '用户授权后可进入游戏'
        }
        if(!this.haveLoadFinish || !this.haveGetInfo  || !this.haveGetUser)
            return;
        //JumpMC.getAD();
        this.changeUser.renew()
        GuideManager.getInstance().isGuiding = !UM.guideFinish;
        this.bottomGroup.visible = true;
        this.loadingGroup.visible = false;
        egret.Tween.removeTweens(this.loadMC);
        this.mainPKUI.visible = false;
        this.showIndex = -1;
        this.onTimer();
        this.onCoinChange();
        this.renewChapterRed();
        this.scrollGroup.addChild(this.changeUser)

        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.timerE,this.onE)
        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.onCoinChange)
        //this.addPanelOpenEvent(GameEvent.client.pass_day,this.onPassDay)
        this.firstShow = false;

        if(GuideManager.getInstance().isGuiding)
        {
            GuideManager.getInstance().showGuide();
        }
        else
        {
            SoundManager.getInstance().playSound('bg');
            if(this.mvState == 'stop')
                MyWindow.Alert('每天0:00-6:00是休战时间，休战结束后即可参与队伍互动')
        }
    }

    //private onPassDay(){
    //    var index = PKManager.getInstance().getTodayIndex();
    //    PKManager.getInstance().loadLevelData(index,(data)=>{
    //        PKManager.getInstance().initData(index,data);
    //    })
    //}

    public showGuideArrow(){
        this.team1.showGuide()
        this.team2.showGuide()
    }
    public hideGuideArrow(){
        this.team1.hideGuide()
        this.team2.hideGuide()
    }

    public endGuide(){
        //SoundManager.getInstance().playSound('bg');
        this.mainPKUI.hide();
        this.showIndex = -1;
        this.onTimer();

        if(this.mvState == 'stop')
        {
            MyWindow.Alert('每天0:00-6:00是休战时间，休战结束后即可参与投注')
        }
        else if(this.mvState == 'pking')
        {
             MyWindow.Alert('当前正在PK中，PK结束后可参与下一轮互动')
        }
    }

    private onCoinChange(){
        this.coinText.text = NumberUtil.addNumSeparator(UM.coin);
    }

    private renewCoinRed(){
        var coinObj = UM.coinObj;
        this.shopRedMC.visible = !coinObj.loginDayAward;

        if(!this.shopRedMC.visible && coinObj.onLineAwardNum < 5)
        {
            var coinCD = UM.onLineAwardCD
            var nextAwardTime = coinObj.onLineAwardTime + coinCD[coinObj.onLineAwardNum];
            this.shopRedMC.visible = TM.now() >=  nextAwardTime
        }
    }

    private renewChapterRed(){
        this.chapterRedMC.visible = UM.chapterLevel < 2;
    }

    public onVisibleChange(){
        //SoundManager.getInstance().playSound('pkbg');
        if(this.visible)
        {
            this.onTimer();
            this.renewChapterRed()
        }
        else
        {
            SoundManager.getInstance().playSound('bg');
            this.mainPKUI.hide();
        }
    }

    private onE(){

    }

    public onTimer(){
        if(!this.visible)
            return;
        //console.log(TM.now(),TM.loginTime,TM.getTimer())
         this.renewCoinRed();





        var PKM = PKManager.getInstance();
        var index = PKM.getCurrentIndex()
        if(index != this.showIndex)
        {
            if(this.showIndex != -1)
            {
                 if(this.mainPKUI.visible && this.mainPKUI.finish && this.mainPKUI.dataIn.isMain)
                 {
                     this.mainPKUI.hide();
                     this.team1.visible = this.team2.visible = !this.mainPKUI.visible
                 }
            }
            this.showIndex = index;
            this.showData = PKM.getCurrentData();
            if(this.showData && this.showIndex != -1)
            {
                this.team1.showList(this.showData.list1.split(','))
                this.team2.showList(this.showData.list2.split(','))
            }
            else
            {
                this.team1.showList([])
                this.team2.showList([])
            }
            PKManager.getInstance().testSendResult(this.firstShow);
        }
        if(!this.showData || this.showIndex == -1)
        {
            var t0 = DateUtil.getNextDateTimeByHours(6) - TM.now()
            this.showCurrentMV('stop',t0)

            return;
        }

        var playCD = PKM.roundTime - PKConfig.addCoinTime;
        var cd = PKM.getEndTime() - playCD - TM.now();
        if(cd <= 0)
        {
            this.playGame();
            this.showCurrentMV('pking',cd + playCD)
            //this.cdText.text = '战斗中\n'+DateUtil.getStringBySecond(cd + playCD).substr(-5);
            return;
        }
        this.showCurrentMV('addCoin',cd)

        var costData = PKM.getCost(this.showData.seed,PKConfig.addCoinTime - cd)
        this.team1.renewCost(costData);
        this.team2.renewCost(costData);
        this.team1.randomTalk();
        this.team2.randomTalk();
    }

    public playGame(){
        if(this.mainPKUI.visible)
            return;
        var PKM = PKManager.getInstance();

        setTimeout(()=>{ //10秒内随机一个时间写
            PKM.upDateUserData();
        },Math.random()*10*1000)

        //PKM.callSendCost(true);
        var costData = PKM.getCost(this.showData.seed,PKM.roundTime)
        this.teamGroup.addChild(MainPKUI.instance);
        MainPKUI.instance.top = 0
        MainPKUI.instance.bottom = 0
        //MainPKUI.instance.top = 75
        //MainPKUI.instance.bottom = 105
        var playCD = PKM.roundTime - PKConfig.addCoinTime;
        this.mainPKUI.show({
            isMain:true,
            noSpeed:true,
            key:PKM.getCurrentKey(),
            list1:this.showData.list1,
            list2:this.showData.list2,
            seed:this.showData.seed,
            showData:UM.lastGuess,
            passTime:TM.now() - (PKM.getEndTime()-playCD),
            force1:PKM.getForceAdd(costData.cost1 + UM.lastGuess.teamCost1) + PKM.baseForce,
            force2:PKM.getForceAdd(costData.cost2 + UM.lastGuess.teamCost2) + PKM.baseForce
        });
    }



    public onMainVisibleChange(){
        this.team1.visible = this.team2.visible = !this.mainPKUI.visible
    }

    private showCurrentMV(stat,cdIn){
        if(cdIn >=3600)
            this.cdText.text = DateUtil.getStringBySeconds(cdIn,true,2);
        else
            this.cdText.text = DateUtil.getStringBySecond(cdIn).substr(-5);

        if(this.mvState == stat)
            return;

        this.stopMV.stop()


        this.mvState = stat;
        this.pkMV.visible = false
        this.pkMV.stop();
        this.wordGroup.visible = false;
        this.reInitWord(this.b1,0)
        this.reInitWord(this.b2,1)
        this.reInitWord(this.b3,2)
        switch(this.mvState)
        {
            case 'pking':
                this.pkMV.visible = true
                this.pkMV.play(-1);
                break;
            case 'addCoin':
                this.wordGroup.visible = true;
                var cd = 400;
                this.getWordTween(this.b1,'备').to({y:5},cd/2).to({y:18},cd/2).wait(cd+cd+2000)
                this.getWordTween(this.b2,'战').wait(cd).to({y:5},cd/2).to({y:18},cd/2).wait(cd+2000)
                this.getWordTween(this.b3,'中').wait(cd+cd).to({y:5},cd/2).to({y:18},cd/2).wait(0 + 2000)
                break;
        }
    }


    private reInitWord(mc,index){
        egret.Tween.removeTweens(mc)
        mc.rotation = 0;
        mc.x = 18 + 35*index;
        mc.y = 18;
    }

    private getWordTween(mc,word){
        mc.text = word;
        return egret.Tween.get(mc,{loop:true})
    }


}