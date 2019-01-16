class GetCoinItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "GetCoinItemSkin";
    }

    private goBtn: eui.Button;
    private barMC: eui.Image;
    private titleText: eui.Label;
    private rateText: eui.Label;
    private desText: eui.Label;
    private addCoinText: eui.Label;




    public addCoin = 0;
    public canAward = false
    public goWork = false
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.goBtn,this.onClick)
    }

    private onClick(){
        if(this.goWork)
        {
            if(this.data.type == 3)
            {
                UM.coinObj.shareNum ++;
                ShareTool.share('好游戏，日常推荐一下',Config.localResRoot + "share_img_1.jpg",{},()=>{
                    this.dataChanged();
                })

            }
            else  if(this.data.type == 4)
            {

                ShareTool.share('我看你就是我一直在寻觅的人，快加入我们吧',Config.localResRoot + "share_img_1.jpg",{type:1,from:UM.gameid},()=>{
                    this.desText.text = '等待好友加入'
                })
            }
            return;
        }
        if(!this.canAward)
        {
            return;
        }
        UM.addCoin(this.addCoin);
        MyWindow.ShowTips('获得金币：'+MyTool.createHtml(this.addCoin,0xFFFF00),3000)
        PKManager.getInstance().needUpUser = true;
        SoundManager.getInstance().playEffect('coin');

        switch(this.data.type)
        {
            case 1:  //{type:1,title:'等陆第X天'},
                UM.coinObj.loginDayAward =1;
                break;
            case 2:   //{type:2,title:'X小时后可领'},
                UM.coinObj.onLineAwardNum ++;
                UM.coinObj.onLineAwardTime = TM.now();
                break;
            case 3:   //{type:3,title:'告诉我的好友们'},
                UM.coinObj.shareAward ++;
                break;
            case 4: // {type:4,title:'邀请X位新的好友'},
                UM.coinObj.newAward ++;
                break;
        }
        this.dataChanged();
    }

    public dataChanged(){
        this.canAward = false;
        this.goWork = false;
        this.desText.text = '';
        var coinObj = UM.coinObj
        var min=1
        var max=1
        this.goBtn.visible = true;
        this.goBtn.skinName = 'Btn1Skin'
        switch(this.data.type)
        {
            case 1:  //{type:1,title:'等陆第X天'},
                min = coinObj.loginDays
                max = coinObj.loginDays
                if(coinObj.loginDayAward)
                {
                     //min = coinObj.loginDays
                     //max = coinObj.loginDays + 1
                    this.goBtn.skinName = 'Btn3Skin'
                    this.goBtn.label = '今日已领'

                }
                else
                {

                    this.goBtn.label = '领取'
                    this.canAward = true;
                }
                this.titleText.text = '每日登陆奖励'
                this.addCoin = 1000;
                break;
            case 2:   //{type:2,title:'X小时后可领'},
                if(coinObj.onLineAwardNum >= 5)
                {
                    this.goBtn.skinName = 'Btn3Skin'
                    this.goBtn.label = '今日已领'
                }
                //else
                //{
                //   this.onTimer()
                //}
                this.titleText.text = '在线金币礼包'
                this.addCoin = 100*Math.min(coinObj.onLineAwardNum + 1,5);
                break;
            case 3:   //{type:3,title:'告诉我的好友们'},
                if(coinObj.shareAward)
                {
                    this.goBtn.skinName = 'Btn3Skin'
                    this.goBtn.label = '今日已领'
                }
                else
                {
                    min = coinObj.shareNum,
                    max = 1
                    if(min >= max)
                    {
                        this.goBtn.label = '领取'
                        this.canAward = true;
                    }
                    else
                    {
                        this.goBtn.label = '前往'
                        this.goWork = true
                    }
                }
                this.titleText.text = '告诉我的好友们'
                this.addCoin = 100;
                break;
            case 4: // {type:4,title:'邀请X位新的好友'},
                min = ObjectUtil.objLength(UM.friendNew),
                    max = coinObj.newAward + 1
                if(min >= max)
                {
                    this.goBtn.label = '领取'
                    this.canAward = true;
                }
                else
                {
                    this.goBtn.label = '邀请'
                    this.goWork = true
                }
                this.titleText.text = '邀请'+max+'位新的好友'
                this.addCoin = 500*max;
                break;
            case 99: // debug
                this.titleText.text = 'debug add'
                this.addCoin = 1000;
                this.goBtn.label = '领取'
                this.canAward = true;

                break;

        }

        if(min > max)
            min = max;
        this.addCoinText.text = 'x' + this.addCoin;
        this.barMC.mask = new egret.Rectangle(0,0,min/max*204,26);
        this.rateText.text = min+'/'+max;
        if(coinObj.onLineAwardNum >= 5)
            this.rateText.text = ''
        this.onTimer();
    }

    public onTimer(){
        if(this.data.type == 2)
        {
            var coinObj = UM.coinObj
            if(coinObj.onLineAwardNum >= 5)
                return;

            var coinCD = UM.onLineAwardCD
            var nextAwardTime = coinObj.onLineAwardTime + coinCD[coinObj.onLineAwardNum];
            var min = TM.now() - coinObj.onLineAwardTime
            var max = nextAwardTime - coinObj.onLineAwardTime
            if(min >= max)
            {
                min = max;
                this.goBtn.label = '领取'
                this.goBtn.visible = true;
                this.canAward = true;
            }
            else
            {
                this.goBtn.visible = false;
                this.canAward = false;
            }

            this.barMC.mask = new egret.Rectangle(0,0,min/max*204,26);
            this.rateText.text = DateUtil.getStringBySecond(max - min);
        }

    }



}