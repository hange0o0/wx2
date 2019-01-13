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

    private team1: TeamUI;
    private team2: TeamUI;
    private coinGroup: eui.Group;
    private coinText: eui.Label;
    private bottomGroup: eui.Group;
    private shopBtn: eui.Group;
    private shopRedMC: eui.Image;
    private rankBtn: eui.Group;
    private cdText: eui.Label;
    private loadText: eui.Label;
    private mailBtn: eui.Group;
    private mailRed: eui.Image;
    private settingBtn: eui.Group;
    private mainPKUI: MainPKUI;
    private loadingGroup: eui.Group;
    private loadMC: eui.Image;



    public showIndex = -1;
    public showData;
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.settingBtn,this.onClick)
        this.addBtnEvent(this.mailBtn,this.onMail)
        this.addBtnEvent(this.shopBtn,this.onShop)
        this.addBtnEvent(this.rankBtn,this.onRank)

        this.team1.teamID = 1
        this.team2.teamID = 2

        this.mainPKUI.addEventListener('visible_change',this.onMainVisibleChange,this)
    }

    private onRank(){
        RankUI.getInstance().show();
    }

    public onClick(){
       this.playGame();
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
        PKManager.getInstance().loadLevelData(PKManager.getInstance().getTodayIndex(),(data)=>{
            PKManager.getInstance().initData(data);
            this.initData();
        })
    }




    public onShow(){
        var self = this;
        this.onCoinChange();
        this.cdText.text = '加载中'
        this.loadingGroup.visible = true;
        egret.Tween.get(this.loadMC,{loop:true}).to({rotation:360},3000)
        self.loadText.text = '0%'
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
                self.loadText.text = res.progress + '%'
                //console.log('下载进度', res.progress)
                //console.log('已经下载的数据长度', res.totalBytesWritten)
                //console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
            })

            return;
        }

        this.callShow();
    }

    private initData(){
        this.loadingGroup.visible = false;
        egret.Tween.get(this.loadMC,{loop:true}).to({rotation:360},3000)
        this.mainPKUI.visible = false;
        this.showIndex = -1;
        this.onTimer();
        this.onCoinChange();

        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.onCoinChange)
    }

    private onCoinChange(){
        this.coinText.text = UM.coin + ''
    }

    public onTimer(){
        var PKM = PKManager.getInstance();
        var index = PKM.getCurrentIndex()
        if(index != this.showIndex)
        {
            if(this.showIndex != -1)
            {
                 if(this.mainPKUI.visible && this.mainPKUI.finish && this.mainPKUI.showData.isMain)
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
            PKManager.getInstance().testSendResult();
        }
        if(!this.showData)
        {
            var t0 = DateUtil.getNextDateTimeByHours(6) - TM.now()
            if(t0 >=3600)
                this.cdText.text = '修战中\n'+DateUtil.getStringBySeconds(t0,true,2);
            else
                this.cdText.text = '修战中\n'+DateUtil.getStringBySecond(t0).substr(-5);
            return;
        }

        var playCD = 10*60 - PKConfig.addCoinTime;
        var cd = PKM.getEndTime() - playCD - TM.now();
        if(cd <= 0)
        {
            this.playGame();
            this.cdText.text = '战斗中\n'+DateUtil.getStringBySecond(cd + playCD).substr(-5);
            return;
        }
        this.cdText.text = '投注中\n'+DateUtil.getStringBySecond(cd).substr(-5);
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
        MainPKUI.instance.top = 90
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


}