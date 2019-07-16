class PKUI extends game.BaseUI {

    private static _instance:PKUI;
    public static getInstance() {
        if (!this._instance) this._instance = new PKUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "PKUISkin";
    }

    private bg: eui.Image;
    private ctrlMC: eui.Image;
    private arrowMC: eui.Group;




    private touchID;
    private bulletArr = [];
    private monsterArr = [];


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this.closeBtn,this.hide)
        this.ctrlMC.touchEnabled = true;
        this.ctrlMC.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin,this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove,this);
        this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchEnd,this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd,this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd,this);


        this.arrowMC.visible = false;
    }

    private onTouchBegin(e:egret.TouchEvent){
        if(!this.touchID)
        {
            this.touchID = {
                id:e.touchPointID,
                start:{
                    x:e.stageX,
                    y:e.stageY,
                }

            }
            this.arrowMC.x = this.touchID.start.x
            this.arrowMC.y = this.touchID.start.y
            this.arrowMC.visible = false;
        }
    }

    private onTouchMove(e){
        if(this.touchID && e.touchPointID == this.touchID.id)
        {
            this.touchID.end = {
                x:e.stageX,
                y:e.stageY,
            }

            var len = MyTool.getDis(this.touchID.start,this.touchID.end)*2
            this.arrowMC.height = len;
            this.arrowMC.anchorOffsetY = len;

            this.arrowMC.visible = len > 100;

            var angle = Math.atan2(e.stageY-this.touchID.start.y,e.stageX-this.touchID.start.x)/Math.PI*180 + 90
            this.arrowMC.rotation = angle;
        }
    }

    private onTouchEnd(e){
        //其它手指，统一回弹
        if(this.touchID && e.touchPointID == this.touchID.id)
        {
            this.shoot();
            this.touchID = null;
            this.arrowMC.visible = false;
            console.log('shoot')
        }
    }

    public onShow(){
        this.addPanelOpenEvent(GameEvent.client.timerE,this.onE)
    }

    private onE(){
        var len = this.bulletArr.length;
        for(var i=0;i<len;i++)
        {
            var bulletMC = this.bulletArr[i];
            bulletMC.move();
            bulletMC.testHit(this.monsterArr);
            if(bulletMC.y > GameManager.uiHeight)
            {
                PKBulletItem.freeItem(bulletMC);
                this.bulletArr.splice(i,1);
                i--;
                len --;
            }
        }
    }

    public shoot(){
        var len = MyTool.getDis(this.touchID.start,this.touchID.end)*2
        if(len > 100 && this.touchID.end.y < GameManager.uiHeight - 200)
        {
            var angle = Math.atan2(this.touchID.end.y - this.touchID.start.y,this.touchID.end.x - this.touchID.start.x)/Math.PI*180// + 90
            angle = MyTool.resetAngle(angle);
            if(angle > 180)
            {
                  this.createBullet(this.touchID.start.x,this.touchID.start.y,angle)
            }
        }
    }

    //itemMC:显示对象
    public createBullet(x, y, rota) {
        var mc = PKBulletItem.createItem();
        this.bulletArr.push(mc);
        this.addChild(mc);
        mc.data = {
            x:x,
            y:y,
            rota:rota/180*Math.PI,
        }
        mc.x = x
        mc.y = y
        return mc
    }
}