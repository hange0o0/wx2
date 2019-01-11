class MainPKUI extends game.BaseItem {
    public static instance;
    public constructor() {
        super();
        this.skinName = "MainPKUISkin";
        MainPKUI.instance = this;
    }

    private con: eui.Group;
    private scroller: eui.Scroller;
    private list1: eui.List;
    private list2: eui.List;
    private winGroup: eui.Group;
    private winText: eui.Label;
    private desGroup: eui.Group;
    private des1: eui.Label;
    private des2: eui.Label;
    private failGroup: eui.Group;
    private failText: eui.Label;
    private btnGroup: eui.Group;
    private backBtn: eui.Button;
    private replayBtn: eui.Button;







    public showData;
    public finish = false
    public lastRota = 0
    public list1Data
    public list2Data
    //public scrollTimer
    //public stopScrollTimer



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

        //this.scroller.addEventListener(egret.Event.CHANGE,this.onScroll,this)
    }

    private onBack(){
        this.hide();
        if(!this.showData.isMain)
            LogUI.getInstance().show()
    }

    //private onLink(evt){
    //    console.log( evt.text );
    //    CardInfoUI.getInstance().show(evt.text)
    //}

    public onVideoEvent(e){
        var videoData = e.data;
        if(videoData.type != PKConfig.VIDEO_MONSTER_ADD && videoData.type != PKConfig.VIDEO_MONSTER_DIE)
            return;
        var data:PKMonsterData = videoData.user;
        if(!data.index)
            return;

        var index = data.index - 1;
        var teamID = data.getOwner().teamData.id;
        //var name = data.getVO().name;
        //if(this.scrollText.text)
        //    this.scrollText.appendText('\n');
        //this.scrollText.appendText('['+DateUtil.getStringBySecond(Math.floor(PKData.getInstance().actionTime/1000)).substr(-5)+'] ');
        //this.scrollText.appendElement({ text:name + ' ', style:{"textColor":teamID==1?0x0152ae:0xA50002,"href" : "event:" + data.mid} })
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

                //if(data.dieTime)
                //{
                //    this.scrollText.appendElement({ text:'被召唤出来了', style:{"textColor":0x89FC7E}})
                //}
                //else if(data.isReborn)
                //{
                //    this.scrollText.appendElement({ text:'复活了', style:{"textColor":0x89FC7E}})
                //}
                //else
                //{
                //    this.scrollText.appendElement({ text:'加入了战斗', style:{"textColor":0x89FC7E}})
                //
                //    var owner = data.getOwner();
                //    this.scrollText.appendElement({ text:'  (出战：'+(owner.maxPlayer - owner.autoList.length)+'/' + owner.maxPlayer + ')'})
                //}


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
                //if(teamID == 1)
                //    (<any>this.list1.getChildAt(data.index-1)).showDie();
                //else
                //    (<any>this.list2.getChildAt(data.index-1)).showDie();
                //if(data.die)
                //{
                //    this.scrollText.appendElement({ text:'阵亡了', style:{"textColor":0xCFA5FF}})
                //}
                //else
                //{
                //    this.scrollText.appendElement({ text:'召唤时间已到', style:{"textColor":0xCFA5FF}})
                //}
                //var teamData = PKData.getInstance().getTeamByID(teamID)
                //this.scrollText.appendElement({ text:'  (场上剩余：'+PKData.getInstance().getMonsterByTeam(teamData).length + ')'})
                break;
        }

        //clearTimeout(this.scrollTimer);
        //if(TM.now() - this.stopScrollTimer > 5)
        //{
        //    this.scrollTimer = setTimeout(()=>{
        //        this.scroller.viewport.scrollV = Number.MAX_VALUE;
        //        MyTool.resetScrollV(this.scroller)
        //    },100)
        //}

    }

    private runItemFun(list,index,funName){
        if(list.numChildren <= index)
            return
        var item:any = list.getChildAt(index)
        item[funName] && item[funName]();
    }

    public show(data){
        //if(this.visible)
            //return;
        //console.log('show' , egret.getTimer())
        this.showData = data,
        this.visible = true;


        if(this.showData.isMain)
        {
            MyTool.removeMC(this.backBtn)
        }
        else
        {
            this.btnGroup.addChildAt(this.backBtn,0)
        }


        this.reset();
        this.addEventListener(egret.Event.ENTER_FRAME,this.onStep,this)

        this.dispatchEventWith('visible_change')
    }

    public hide(){
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

        this.showData.passTime = 0;

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

        var data = {
            seed:this.showData.seed,
            players:[
                {id:1,gameid:'team1',team:1,force:this.showData.force1,hp:1,autolist:this.showData.list1},
                {id:2,gameid:'team2',team:2,force:this.showData.force2,hp:1,autolist:this.showData.list2}
            ]
        };

        this.scroller.viewport.scrollV = 0;
        var list1 = this.list1Data = this.showData.list1.split(',');
        var list2 = this.list2Data = this.showData.list2.split(',');

        this.resetList(list1)
        this.resetList(list2)

        this.list1.dataProvider = new eui.ArrayCollection(list1)
        this.list2.dataProvider = new eui.ArrayCollection(list2)

        PKBulletManager.getInstance().freeAll();
        var PD = PKData.getInstance();
        PD.init(data);
        if(this.showData.passTime && this.showData.passTime > 0)
        {
            PD.quick = true;
            PD.quickTime = this.showData.passTime*1000;
        }

        PKVideoCon.getInstance().init(this.showData);


        PD.start();
        this.onStep()
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
        if(PD.isGameOver)
        {
            this.finish = true;

            PKBulletManager.getInstance().freeAll();
            var result = PD.getPKResult();
            if(this.showData.key)
                PKManager.getInstance().pkResult[this.showData.key] = PD.getPKResult();
            if(result == 3)
            {
                this.delayShowResult(this.failGroup);

                this.failText.text = '平手，庄家通吃'
            }
            else if(this.showData.cost1 || this.showData.cost2)
            {
                if(this.showData['cost' + result])
                {
                    var addCoin = PKManager.getInstance().getAddCoin(this.showData,result)
                    this.winText.text = '胜利'
                    this.delayShowResult(this.winGroup);
                    if(this.showData.isMain)
                        this.des1.text = '等待到帐'
                    else
                        this.des1.text = '恭喜获得'

                    this.winText.text = 'x' + NumberUtil.addNumSeparator(addCoin)
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
                this.desGroup.visible = false;
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
        setTimeout(()=>{
            mc.visible = true;
            mc.scaleX = mc.scaleY = 0;
            var tw = egret.Tween.get(mc).to({scaleX:1.2,scaleY:1.2},300).to({scaleX:1,scaleY:1},300)
            if(this.showData.isMain && this.showData.key != PKManager.getInstance().getCurrentKey())
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