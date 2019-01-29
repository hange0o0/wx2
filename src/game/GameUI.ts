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

    public team1: TeamUI;
    private team2: TeamUI;
    private coinGroup: eui.Group;
    private coinText: eui.Label;
    private bottomGroup: eui.Group;
    private shopBtn: eui.Group;
    private shopRedMC: eui.Image;
    private rankBtn: eui.Group;
    private wordGroup: eui.Group;
    private b1: eui.BitmapLabel;
    private b2: eui.BitmapLabel;
    private b3: eui.BitmapLabel;
    public cdText: eui.Label;
    private mailBtn: eui.Group;
    private settingBtn: eui.Group;
    private soundBtn: eui.Image;
    private mainPKUI: MainPKUI;
    public loadingGroup: eui.Group;
    private loadMC: eui.Image;
    private loadText: eui.Label;
    private stopingGroup: eui.Group;
    private stopCon: eui.Group;
    private stopBG: eui.Image;
    private scroller: eui.Scroller;
    private list: eui.List;




    private pkMV
    private mvState = ''

    private stopRote = 1
    private stopVO
    private stopMV = new PKMonsterMV()


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
        this.addChild(this.pkMV);
        this.pkMV.y = GameManager.uiHeight - 80;
        this.pkMV.x = 320;
        this.pkMV.scaleX = this.pkMV.scaleY = 1.5
        this.pkMV.visible = false;

        this.team1.teamID = 1
        this.team2.teamID = 2

        this.mainPKUI.addEventListener('visible_change',this.onMainVisibleChange,this)


        this.scroller.viewport = this.list
        this.list.itemRenderer = MainPKItem;
        this.list.dataProvider = new eui.ArrayCollection(ObjectUtil.objToArray(MonsterVO.data))

        this.stopCon.addChild(this.stopMV)
        this.stopMV.scaleX = this.stopMV.scaleY = 1.2
        this.addBtnEvent(this.stopCon,this.onStopClick)
    }

    private onStopClick(e)
    {
        this.stopMV.talk()
    }


    private onRank(){
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
        GuideManager.getInstance().isGuiding = !UM.guideFinish;
        UM.drawSaveData();
        super.show();
    }

    private callShow(){
        this.loadText.text = '初始化中'
        var index = PKManager.getInstance().getTodayIndex();
        PKManager.getInstance().loadLevelData(index,(data)=>{
            PKManager.getInstance().initData(index,data);
            this.initData();
        })
    }




    public onShow(){
        var self = this;
        this.bottomGroup.visible = false;
        this.stopingGroup.visible = false;
        this.onCoinChange();
        this.renewSound();
        //this.cdText.text = '.'
        this.loadingGroup.visible = true;
        egret.Tween.get(this.loadMC,{loop:true}).to({rotation:360},3000)
        self.loadText.text = '正在加载素材，请耐心等候..'
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
                self.loadText.text = '正在加载素材，请耐心等候..\n' + res.progress + '%'
                //console.log('下载进度', res.progress)
                //console.log('已经下载的数据长度', res.totalBytesWritten)
                //console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
            })

            return;
        }

        this.callShow();
    }

    private initData(){

        this.bottomGroup.visible = true;
        this.loadingGroup.visible = false;
        egret.Tween.get(this.loadMC,{loop:true}).to({rotation:360},3000);
        this.mainPKUI.visible = false;
        this.showIndex = -1;
        this.onTimer();
        this.onCoinChange();

        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.timerE,this.onE)
        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.onCoinChange)
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
            MyWindow.Alert('每天0:00-6:00是休战时间，休战结束后即可参与互动打赏')
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

    public onVisibleChange(){
        //SoundManager.getInstance().playSound('pkbg');
        if(this.visible)
            this.onTimer();
        else
        {
            SoundManager.getInstance().playSound('bg');
            this.mainPKUI.hide();
        }
    }

    private onE(){
        if(this.mvState == 'stop')
        {
            this.stopMV.x += (this.stopRote*this.stopVO.speed/10)*20/60
            if(this.stopMV.x < -100 || this.stopMV.x > 640 +100)
            {
                this.randomStoping();
            }
        }
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
            if(this.showData)
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
        if(!this.showData)
        {
            var t0 = DateUtil.getNextDateTimeByHours(6) - TM.now()
            this.showCurrentMV('stop',t0)

            return;
        }

        var playCD = 10*60 - PKConfig.addCoinTime;
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
        var costData = PKM.getCost(this.showData.seed,60*10)
        this.addChild(MainPKUI.instance);
        MainPKUI.instance.top = 75
        MainPKUI.instance.bottom = 105
        var playCD = 10*60 - PKConfig.addCoinTime;
        this.mainPKUI.show({
            isMain:true,
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

        this.stopingGroup.visible = false;
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
            case 'stop':
                this.wordGroup.visible = true;
                this.stopingGroup.visible = true;
                this.stopBG.source =  'map'+Math.ceil(Math.random()*7)+'_jpg'
                this.randomStoping();

                var cd = 400;
                this.getWordTween(this.b1,'休').to({rotation:360},cd).wait(cd+cd + 2000)
                this.getWordTween(this.b2,'战').wait(cd).to({rotation:360},cd).wait(cd + 2000)
                this.getWordTween(this.b3,'中').wait(cd+cd).to({rotation:360},cd).wait(0 + 2000)
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

    private randomStoping(){
        var arr = ObjectUtil.objToArray(MonsterVO.data)
        var mvo = this.stopVO =  ArrayUtil.randomOne(arr);
        this.stopMV.load(mvo.id);
        this.stopMV.run()
        this.stopRote = Math.random()>0.5?1:-1

        if(this.stopRote > 0)
        {
            this.stopMV.x = -100
            this.stopMV.currentMV.scaleX = -1
        }
        else
        {
            this.stopMV.x = 640 + 100;
            this.stopMV.currentMV.scaleX = 1
        }
        this.stopMV.y = 350 + Math.random()*100

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