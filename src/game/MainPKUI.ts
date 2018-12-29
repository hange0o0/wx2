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



    public childrenCreated() {
        super.childrenCreated();

        var pkvideo = PKVideoCon.getInstance();
        this.con.addChild(pkvideo)
        pkvideo.y = 0;
        pkvideo.x = -(PKConfig.floorWidth + PKConfig.appearPos*2 - 640)/2;
    }

    public show(){
        this.visible = true;
        this.reset();
        this.addEventListener(egret.Event.ENTER_FRAME,this.onStep,this)
    }

    public hide(){
        this.visible = false;
        this.removeEventListener(egret.Event.ENTER_FRAME,this.onStep,this)
    }

    //public renew(){
    //    var pkvideo = PKVideoCon.getInstance()
    //    if(pkvideo.parent != this.con)
    //        this.reset();
    //    this.addEventListener(egret.Event.ENTER_FRAME,this.onStep,this)
    //}

    public reset(){
        var data = {
            seed:TM.now(),
            players:[
                {id:1,gameid:UM.gameid,team:1,force:100,hp:1,autolist:'1,2,3,4,5,6,7,8'},
                {id:2,gameid:'npc',team:2,force:100,hp:1,autolist:'1,2,3,4,5,6,7,8'}
            ]
        };
        PKManager.getInstance().pkType = PKManager.TYPE_MAIN_HANG
        PKBulletManager.getInstance().freeAll();
        var PD = PKData.getInstance();
        PD.init(data);
        PD.isReplay = true
        PKVideoCon.getInstance().init();

        PD.start();
        this.onStep()
    }

    public onStep(){
        var PD = PKData.getInstance();
        var PC = PKCode.getInstance();
        var cd = PD.getPassTime() - PD.actionTime
        if(cd > 1000*5)
        {
            this.reset();
            return;
        }
        PC.onStep();
        PKVideoCon.getInstance().action();
        if(PD.isGameOver ||  (PD.actionTime > 3000 && PD.monsterList.length == 0))
        {
            if(PD.isGameOver)
                return;
        }
    }
}