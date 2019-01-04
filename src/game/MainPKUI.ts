class MainPKUI extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainPKUISkin";
    }

    private con: eui.Group;
    private scroller: eui.Scroller;
    private list: eui.List;
    private winGroup: eui.Group;
    private winText: eui.Label;
    private desGroup: eui.Group;
    private des1: eui.Label;
    private des2: eui.Label;
    private failGroup: eui.Group;
    private failText: eui.Label;




    public showData;
    public finish = false
    public lastRota = 0

    public childrenCreated() {
        super.childrenCreated();

        var pkvideo = PKVideoCon.getInstance();
        this.con.addChild(pkvideo)
        pkvideo.y = 0;
        pkvideo.x = -(PKConfig.floorWidth + PKConfig.appearPos*2 - 640)/2;
    }

    public show(data){
        if(this.visible)
            return;
        //console.log('show' , egret.getTimer())
        this.showData = data,
        this.visible = true;
        this.finish = false

        this.winGroup.visible = false;
        this.failGroup.visible = false;

        PKVideoCon.getInstance().x = -(PKConfig.floorWidth + PKConfig.appearPos*2 - 640)/2;
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

    public reset(){
        var data = {
            seed:this.showData.seed,
            players:[
                {id:1,gameid:'team1',team:1,force:this.showData.force1,hp:1,autolist:this.showData.list1},
                {id:2,gameid:'team2',team:2,force:this.showData.force2,hp:1,autolist:this.showData.list2}
            ]
        };
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
        },1000)
    }
}