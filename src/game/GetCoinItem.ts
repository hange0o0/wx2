class GetCoinItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "GetCoinItemSkin";
    }

    private bg: eui.Image;
    private goBtn: eui.Button;
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
                GetCoinUI.getInstance().hide();
                GameUI.getInstance().scrollToBottom();
                //UM.coinObj.shareNum ++;
                //ShareTool.share('日常推荐一个好游戏',Config.localResRoot + "share_img_2.jpg",{},()=>{
                //    this.dataChanged();
                //})
            }
            else  if(this.data.type == 4)
            {
                ShareTool.share('我需要你们的帮助！！',Config.localResRoot + "share_img_1.jpg",{type:1,from:UM.gameid},()=>{
                    this.desText.text = '等待好友加入'
                    this.goBtn.visible = false;
                },true)
            }
            else if(this.data.type == 5)
            {
                ShareTool.openGDTV(()=>{
                    UM.coinObj.videoNum ++;
                    this.dataChanged();
                })
            }
            else if(this.data.type == 6)
            {
                UM.coinObj.gameNum ++;
                this.dataChanged();
                ShootGameUI.getInstance().show();
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
            case 5: //
                UM.coinObj.videoAwardNum ++;
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
        this.bg.source = 'coin_bg'+this.data.type+'_jpg'
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
                this.addCoin = 2000;
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
                this.addCoin = 200*Math.min(coinObj.onLineAwardNum + 1,5);
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
                        this.goBtn.skinName = 'Btn2Skin'
                        this.goBtn.label = '前往'
                        this.goWork = true
                    }
                }
                this.titleText.text = '体验任意小程序30秒'
                this.addCoin = 1000;
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
                    this.goBtn.skinName = 'Btn2Skin'
                    this.goBtn.label = '邀请'
                    this.goWork = true
                }
                this.titleText.text = '邀请第'+max+'位新好友'
                this.addCoin = 5000*max;
                break;
            case 5: // 观看广告
                if(coinObj.videoAwardNum >= 3)
                {
                    this.goBtn.skinName = 'Btn3Skin'
                    this.goBtn.label = '今日已领'
                }
                else
                {
                    if(coinObj.videoAwardNum < coinObj.videoNum)
                    {
                        this.goBtn.label = '领取'
                        this.canAward = true;
                    }
                    else
                    {
                        this.goBtn.skinName = 'Btn2Skin'
                        this.goBtn.label = '观看广告'
                        this.goWork = true
                    }
                }
                this.titleText.text = '观看广告（'+coinObj.videoAwardNum+'/3）'
                this.addCoin = 1000;
                break;
            case 6: // 射击游戏
                if(coinObj.gameNum >= 3)
                {
                    this.goBtn.skinName = 'Btn3Skin'
                    this.goBtn.label = '今日已领'
                }
                else
                {
                    this.goBtn.skinName = 'Btn2Skin'
                    this.goBtn.label = '开始游戏'
                    this.goWork = true
                }
                this.titleText.text = '炮击怪物（'+coinObj.gameNum+'/3）'
                break;
            case 99: // debug
                this.titleText.text = '临时加钱'
                this.addCoin = 1000;
                this.goBtn.label = '领取'
                this.canAward = true;

                break;

        }

        if(min > max)
            min = max;
        this.addCoinText.text = 'x' + this.addCoin;
        if(this.data.type == 6)
            this.addCoinText.text = '无上限';
        //this.rateText.text = min+'/'+max;
        this.rateText.text = ''
        //if(this.data.type == 2 && coinObj.onLineAwardNum >= 5)
        //    this.rateText.text = '明天继续'
        //else if(this.data.type == 2 && coinObj.onLineAwardNum >= 5)
        //    this.rateText.text = '明天继续'
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
                this.rateText.text = ''
            }
            else
            {
                this.goBtn.visible = false;
                this.canAward = false;
                this.rateText.text = DateUtil.getStringBySecond(max - min);
            }

        }

    }



}