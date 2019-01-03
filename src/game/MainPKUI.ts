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
    private winText2: eui.Label;
    private failGroup: eui.Group;
    private failText: eui.Label;
    private failText2: eui.Label;


    public showData;
    public finish = false

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


        this.reset();
        this.addEventListener(egret.Event.ENTER_FRAME,this.onStep,this)
    }

    public hide(){
        //console.log('hide' , egret.getTimer())
        this.visible = false;
        this.removeEventListener(egret.Event.ENTER_FRAME,this.onStep,this)
        PKVideoCon.getInstance().remove();
        PKManager.getInstance().testSendResult();
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

        PKVideoCon.getInstance().init();


        PD.start();
        this.onStep()
    }

    public onStep(){
        if(this.finish)
            return;
        var PD = PKData.getInstance();
        var PC = PKCode.getInstance();

        PC.onStep();
        PKVideoCon.getInstance().action();
        if(PD.isGameOver ||  (PD.actionTime > 3000 && PD.monsterList.length == 0))
        {
            this.finish = true;
            var result = PD.getPKResult();
            if(this.showData.key)
                PKManager.getInstance().pkResult[this.showData.key] = PD.getPKResult();
            if(result ==3)
            {
                this.failGroup.visible = false;
                this.failText.text = '平手，庄家通吃'
            }
            else if(this.showData.myChoose)
            {
                if(result == this.showData.myChoose)
                {
                    this.winGroup.visible = true;
                    this.winText.text = '胜利'
                }
                else
                {
                    this.failGroup.visible = true;
                    this.failText.text = '失败'
                }
            }
            else
            {
                this.winGroup.visible = true;
                this.winText.text = result +  '队获胜'
            }

            PKManager.getInstance().testSendResult();

        }
    }
}