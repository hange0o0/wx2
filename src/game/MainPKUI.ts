class MainPKUI extends game.BaseItem {
    public static instance;
    public constructor() {
        super();
        this.skinName = "MainPKUISkin";
        MainPKUI.instance = this;
    }

    private con: eui.Group;
    private scroller: eui.Scroller;
    public list1: eui.List;
    private lineMC: eui.Rect;
    private list2: eui.List;
    private teamCost1Text: eui.Label;
    private cost1Text: eui.Label;
    private forceText1: eui.Label;
    private teamCost2Text: eui.Label;
    private costText2: eui.Label;
    private forceText2: eui.Label;
    private timeText: eui.Label;
    private winGroup: eui.Group;
    private winText: eui.Label;
    private desGroup: eui.Group;
    private des1: eui.Label;
    private des2: eui.Label;
    private failGroup: eui.Group;
    private failText: eui.Label;
    private cost1Group: eui.Group;
    private cost2Group: eui.Group;
    private btnGroup: eui.Group;
    public cdGroup: eui.Group;
    private backBtn: eui.Button;
    private replayBtn: eui.Button;









    public dataIn;
    public finish = false
    public lastRota = 0
    public list1Data
    public list2Data
    public resultTimer
    public isQuick



    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.replayBtn,this.onReplay)
        this.addBtnEvent(this.backBtn,this.onBack)

        var pkvideo = PKVideoCon.getInstance();
        this.con.addChild(pkvideo)
        pkvideo.y = 0;
        pkvideo.x = -(PKConfig.floorWidth + PKConfig.appearPos*2 - 640)/2;

        PKData.getInstance().addEventListener('video_word',this.onVideoEvent,this);

        this.list1.itemRenderer = MainPKItem
        this.list2.itemRenderer = MainPKItem
    }

    private onBack(){
        this.hide();
        //if(!this.dataIn.isMain)
        //    LogUI.getInstance().show()
    }


    public onVideoEvent(e){
        var videoData = e.data;
        if(videoData.type != PKConfig.VIDEO_MONSTER_ADD && videoData.type != PKConfig.VIDEO_MONSTER_DIE)
            return;
        var data:PKMonsterData = videoData.user;
        if(!data.index)
            return;

        var index = data.index - 1;
        var teamID = data.getOwner().teamData.id;
        switch(videoData.type)//动画类型
        {
            case PKConfig.VIDEO_MONSTER_ADD:
                if(teamID == 1)
                {
                    this.runItemFun(this.list1,index,'showBorn')
                    this.list1Data[index].isDie = false;
                }
                else
                {
                    this.runItemFun(this.list2,index,'showBorn')
                    this.list2Data[index].isDie = false;
                }
                break;

            case PKConfig.VIDEO_MONSTER_DIE:
                if(teamID == 1)
                {
                    this.runItemFun(this.list1,index,'showDie')
                    this.list1Data[index].isDie = true;
                }
                else
                {
                    this.runItemFun(this.list2,index,'showDie')
                    this.list2Data[index].isDie = true;
                }
                break;
        }
    }

    private runItemFun(list,index,funName){
        if(list.numChildren <= index)
            return
        var item:any = list.getChildAt(index)
        item[funName] && item[funName]();
    }

    public show(data){
        PKManager.getInstance().isPKing = true

        this.dataIn = data,
        this.visible = true;


        if(this.dataIn.isMain)
        {
            MyTool.removeMC(this.backBtn)
        }
        else
        {
            this.btnGroup.addChildAt(this.backBtn,0)
            this.backBtn.label = '关闭'
        }

        if(this.dataIn.isPK)
        {
            this.currentState = 's2'
        }
        else
        {
            this.currentState = 's1'
            var showData = this.dataIn.showData;
            var green = 0x66ff66
            var white = 0xFFEDC9


            var costData = PKManager.getInstance().getCost(this.dataIn.seed,60*10)
            var teamCost1 =  Math.floor(costData.cost1 + showData.teamCost1)
            var teamCost2 =  Math.floor(costData.cost2 + showData.teamCost2)
            this.teamCost1Text.text = NumberUtil.addNumSeparator(teamCost1)
            this.teamCost2Text.text = NumberUtil.addNumSeparator(teamCost2)
            this.teamCost1Text.textColor = teamCost1 > teamCost2 ? green:white
            this.teamCost2Text.textColor = teamCost1 < teamCost2 ? green:white


            this.forceText1.text = NumberUtil.addNumSeparator(this.dataIn.force1)
            this.forceText2.text = NumberUtil.addNumSeparator(this.dataIn.force2)

            this.forceText1.textColor = this.dataIn.force1 > this.dataIn.force2 ? green:white
            this.forceText2.textColor = this.dataIn.force1 < this.dataIn.force2 ? green:white


            this.cost1Text.text = '1 队打赏：' + NumberUtil.addNumSeparator(showData.cost1)
            this.costText2.text = '2 队打赏：' + NumberUtil.addNumSeparator(showData.cost2)
            this.cost1Group.visible = showData.cost1 > 0
            this.cost2Group.visible = showData.cost2 > 0
            this.cost1Text.textColor = showData.cost1 > showData.cost2 ? green:white
            this.costText2.textColor = showData.cost1 < showData.cost2 ? green:white
        }




        this.reset();
        this.addEventListener(egret.Event.ENTER_FRAME,this.onStep,this)

        this.dispatchEventWith('visible_change')
    }

    public hide(){
        PKManager.getInstance().isPKing = false
        SoundManager.getInstance().playSound('bg');
        //console.log('hide' , egret.getTimer())
        this.visible = false;
        this.removeEventListener(egret.Event.ENTER_FRAME,this.onStep,this)
        PKVideoCon.getInstance().remove();
        PKManager.getInstance().testSendResult();


        this.dispatchEventWith('visible_change')
    }

    //public renew(){
    //    var pkvideo = PKVideoCon.getInstance()
    //    if(pkvideo.parent != this.con)
    //        this.reset();
    //    this.addEventListener(egret.Event.ENTER_FRAME,this.onStep,this)
    //}

    public onReplay(){

        this.dataIn.passTime = 0;

        this.reset();
    }

    private resetList(list){
        for(var i=0;i<list.length;i++)
        {
            list[i]  = {id:list[i],isDie:true,index:i+1}
        }
    }

    public reset(){

        PKVideoCon.getInstance().x = -(PKConfig.floorWidth + PKConfig.appearPos*2 - 640)/2;
        //this.stopScrollTimer = 0;
        this.winGroup.visible = false;
        this.failGroup.visible = false;
        this.btnGroup.visible = false;
        this.finish = false;
        this.isQuick = true;

        clearTimeout(this.resultTimer);
        egret.Tween.removeTweens(this.failGroup)
        egret.Tween.removeTweens(this.winGroup)

        var data = {
            seed:this.dataIn.seed,
            players:[
                {id:1,gameid:'team1',team:1,force:this.dataIn.force1,hp:1,autolist:this.dataIn.list1},
                {id:2,gameid:'team2',team:2,force:this.dataIn.force2,hp:1,autolist:this.dataIn.list2}
            ]
        };

        this.scroller.viewport.scrollV = 0;
        var list1 = this.list1Data = this.dataIn.list1.split(',');
        var list2 = this.list2Data = this.dataIn.list2.split(',');

        this.resetList(list1)
        this.resetList(list2)

        this.list1.dataProvider = new eui.ArrayCollection(list1)
        this.list2.dataProvider = new eui.ArrayCollection(list2)

        this.lineMC.height =  Math.ceil(Math.max(list1.length,list2.length)/3)*(95+6)

        PKBulletManager.getInstance().freeAll();
        var PD = PKData.getInstance();
        PD.init(data);
        if(this.dataIn.passTime && this.dataIn.passTime > 0)
        {
            PD.quick = true;
            PD.quickTime = this.dataIn.passTime*1000;
        }

        PKVideoCon.getInstance().init(this.dataIn);


        PD.start();
        this.onStep()
        this.isQuick = false;
        if(PD.isGameOver)
        {
            PKVideoCon.getInstance().resetView();


            var videoCon = PKVideoCon.getInstance();
            var result = PD.getPKResult();
            if(result == 1)
            {
                var item = PKData.getInstance().getFirstItem(PKData.getInstance().myPlayer.teamData.id);
                var item2 = PKData.getInstance().getBackItem(PKData.getInstance().myPlayer.teamData.id);
            }
            else if(result == 2)
            {
                var item = PKData.getInstance().getFirstItem(PKData.getInstance().myPlayer.teamData.enemy.id);
                var item2 = PKData.getInstance().getBackItem(PKData.getInstance().myPlayer.teamData.enemy.id);
            }
            else
            {
                var item = PKData.getInstance().getFirstItem(PKData.getInstance().myPlayer.teamData.id);
                var item2 = PKData.getInstance().getFirstItem(PKData.getInstance().myPlayer.teamData.enemy.id);
            }

            if(item && item2)
            {
                var w = 640
                var scrollH = -((item.x + item2.x)/2 - w/2);
                if(scrollH > 0)
                    scrollH = 0;
                else if(scrollH < w - videoCon.width)
                    scrollH = w - videoCon.width;
                videoCon.x = scrollH;
            }

        }
        else
            SoundManager.getInstance().playSound('pkbg')
    }

    public onStep(){
        if(this.finish)
        {
            PKVideoCon.getInstance().action();
            return;
        }
        var PD = PKData.getInstance();
        var PC = PKCode.getInstance();

        PC.onStep();
        PKVideoCon.getInstance().action();
        this.timeText.text = Math.floor(PD.actionTime/1000) + ''
        if(PD.isGameOver)
        {
            this.finish = true;
            this.desGroup.visible = false;
            this.desGroup['callVisible'] = false
            PKBulletManager.getInstance().freeAll();
            var result = PD.getPKResult();
            if(this.dataIn.isPK)
            {
                if(result == 1)
                {
                    this.delayShowResult(this.failGroup);
                    this.failText.text = '失败'
                    this.backBtn.label = '重试'
                }
                else if(result == 2)
                {
                    this.delayShowResult(this.winGroup);
                    this.winText.text = '胜利'
                    var addCoin = PKManager.getInstance().onChapterWin(this.dataIn.level);
                    if(addCoin)
                    {
                        this.desGroup['callVisible'] = true
                        this.des1.text = '恭喜获得'
                        this.des2.text = 'x' + NumberUtil.addNumSeparator(addCoin)
                    }
                    this.backBtn.label = '下一关'
                }
                else
                {
                    this.delayShowResult(this.failGroup);
                    this.failText.text = '平手'
                    this.backBtn.label = '重试'
                }
            }
            else
            {
                if(this.dataIn.key)
                    PKManager.getInstance().pkResult[this.dataIn.key] = PD.getPKResult();
                if(result == 3)
                {
                    this.delayShowResult(this.failGroup);

                    this.failText.text = '平手，庄家通吃'
                }
                else if(this.dataIn.showData.cost1 || this.dataIn.showData.cost2)
                {
                    if(this.dataIn.showData['cost' + result])
                    {
                        this.desGroup['callVisible'] = true
                        var addCoin = PKManager.getInstance().getAddCoin(this.dataIn.showData,result)
                        this.winText.text = '胜利'
                        this.delayShowResult(this.winGroup);
                        if(this.dataIn.isMain)
                        {
                            var isFinish = PKManager.getInstance().getFinishTimeByKey(this.dataIn.key) <= TM.now();
                            if(isFinish)
                                this.des1.text = '恭喜获得'
                            else
                                this.des1.text = '等待到帐'
                        }
                        else
                            this.des1.text = '恭喜获得'

                        this.des2.text = 'x' + NumberUtil.addNumSeparator(addCoin)
                    }
                    else
                    {
                        this.delayShowResult(this.failGroup);
                        this.failText.text = '失败'
                    }
                }
                else
                {
                    this.delayShowResult(this.winGroup);
                    this.winText.text = result +  '队获胜'
                    this.desGroup['callVisible'] = false

                }
            }


            PKManager.getInstance().testSendResult();  //可能看录像
        }
        else
        {
            var item = PKData.getInstance().getFirstItem(PKData.getInstance().myPlayer.teamData.id);
            var item2 = PKData.getInstance().getFirstItem(PKData.getInstance().myPlayer.teamData.enemy.id);
            if(item && item2)
            {
                var videoCon = PKVideoCon.getInstance();
                var w = 640
                var scrollH = -((item.x + item2.x)/2 - w/2);
                if(scrollH > 0)
                    scrollH = 0;
                else if(scrollH < w - videoCon.width)
                    scrollH = w - videoCon.width;
                var dec = Math.abs(videoCon.x - scrollH)
                var rote =  videoCon.x > scrollH ?1:-1
                if(dec > 80 || this.lastRota == rote)
                {
                    egret.Tween.removeTweens(videoCon)
                    if(dec > 10)
                    {
                        var tw = egret.Tween.get(videoCon)
                        tw.to({x:scrollH},Math.min(300,dec*10))
                    }
                    else
                    {
                        videoCon.x = scrollH;
                    }
                    this.lastRota = rote
                }

            }
        }
    }

    public delayShowResult(mc)
    {

        clearTimeout(this.resultTimer);
        if(this.isQuick)
        {
            SoundManager.getInstance().playSound('bg');
            if(this.dataIn.isMain && this.dataIn.key != PKManager.getInstance().getCurrentKey())
            {
                this.hide();
                return;
            }
            mc.visible = true;
            mc.scaleX = mc.scaleY = 1;
            this.desGroup.visible = this.desGroup['callVisible'];
            this.btnGroup.visible = true
            return;
        }

        this.resultTimer = setTimeout(()=>{
            if(mc == this.winGroup)
                SoundManager.getInstance().playEffect('win');
            else
                SoundManager.getInstance().playEffect('fail');
            mc.visible = true;
            mc.scaleX = mc.scaleY = 0;
            var tw = egret.Tween.get(mc).to({scaleX:1.2,scaleY:1.2},300).to({scaleX:1,scaleY:1},300)
            tw.call(()=>{
                SoundManager.getInstance().playSound('bg');
                this.desGroup.visible = this.desGroup['callVisible'];
            })
            if(this.dataIn.isMain && this.dataIn.key != PKManager.getInstance().getCurrentKey())
            {
                tw.wait(2000).call(()=>{
                    this.hide();
                })
            }
            else
            {
                tw.call(()=>{
                    this.btnGroup.visible = true
                })
            }
        },1000)
    }
}