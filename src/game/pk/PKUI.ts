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
    private arrowMC: eui.Group;
    private exitBtn: eui.Button;
    private ctrlMC: eui.Group;
    private numText: eui.Label;






    private touchID;
    private bulletArr = [];
    private freeBulletArr = [];
    private monsterArr = [];
    private txtPool = [];


    public shootBullet

    private data;
    private isStop = false
    private level = 1
    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this.closeBtn,this.hide)
        this.ctrlMC.touchEnabled = true;
        this.ctrlMC.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin,this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove,this);
        this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchEnd,this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd,this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd,this);


        this.addBtnEvent(this.exitBtn,()=>{
            this.hide();
        })

        this.arrowMC.visible = false;
    }

    private onTouchBegin(e:egret.TouchEvent){
        if(!this.touchID)
        {
            if(!this.shootBullet)
                return;
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
            this.addChild(this.arrowMC);

            this.shootBullet.x = this.arrowMC.x
            this.shootBullet.y = this.arrowMC.y
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

            this.arrowMC.visible = e.stageY < GameManager.uiHeight - 200;
            if(this.arrowMC.visible)
            {
                this.shootBullet.scaleX = this.shootBullet.scaleY = 1;
            }
            else
            {
                this.shootBullet.scaleX = this.shootBullet.scaleY = 2;
            }

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

    public show(data?,level?){
        this.isStop = false
        this.data = data;
        this.level = level || 1;
        this.freeBulletArr.length = 0
        for(var i=0;i<20;i++)
        {
            this.freeBulletArr.push(i+1);
        }

        super.show();
    }

    public onShow(){
        this.addChild(this.ctrlMC)
        this.renewMonster();
        this.addBullet();
        this.addPanelOpenEvent(GameEvent.client.timerE,this.onE)
        this.addChild(this.exitBtn);
    }

    private addBullet(){
        var id = this.freeBulletArr.shift();
        if(!id)
        {
            this.shootBullet = null;
            this.renewNum();
            return;
        }
        this.shootBullet = PKBulletItem.createItem();
        this.addChild(this.shootBullet)
        this.shootBullet.data = {
            id:id
        }


        this.reInitBulletXY();
        this.renewNum();
    }

    private renewNum(){
        var num = this.freeBulletArr.length
        if(this.shootBullet)
            num ++;
        this.numText.text = 'x ' + num
    }

    private reInitBulletXY(){
        if(!this.shootBullet)
            return;
        this.shootBullet.x = 320
        this.shootBullet.y = GameManager.uiHeight - 100;
        this.shootBullet.scaleX = this.shootBullet.scaleY = 2;
    }

    private renewMonster(){
        while(this.monsterArr.length > 0)
        {
            PKItem.freeItem(this.monsterArr.pop());
        }

        while(this.bulletArr.length > 0)
        {
            PKBulletItem.freeItem(this.bulletArr.pop());
        }

        var list = this.data.split('#')
        for(var i=0;i<list.length;i++)
        {
            var temp = list[i].split(',');
            var item = PKItem.createItem();
            this.monsterArr.push(item)
            this.addChild(item);
            item.x = parseInt(temp[0])
            item.y = parseInt(temp[1])
            item.data = {
                id:1,
                level:this.level,
                rate:Number(temp[2]),
            }
        }
    }

    private onE(){
        if(this.isStop)
            return;
        var len = this.bulletArr.length;
        var yy = GameManager.uiHeight - 200;
        for(var i=0;i<len;i++)
        {
            var bulletMC = this.bulletArr[i];
            bulletMC.move();
            bulletMC.testHit(this.monsterArr);
            if(!bulletMC.data.b && bulletMC.y < yy)
            {
                bulletMC.data.b = true;
                this.addBullet();
            }
            else if(bulletMC.data.b && bulletMC.y > yy)
            {
                //if(bulletMC.x > 260 && bulletMC.x < 380)
                //{
                //    this.freeBulletArr.push(bulletMC.data.id);
                //    this.renewNum();
                //}
                PKBulletItem.freeItem(bulletMC);
                this.bulletArr.splice(i,1);
                i--;
                len --;
            }
        }

        for(var i=0;i<this.monsterArr.length;i++)
        {
            var item = this.monsterArr[i];
            if(item.isDie == 2)
            {
                this.monsterArr.splice(i,1);
                i --;
            }
        }
        this.testResult();
    }

    private testResult(){
        if(this.monsterArr.length == 0)
        {
            console.log('win')
            this.isStop = true;
        }
        else if(this.bulletArr.length == 0 && this.freeBulletArr.length == 0 && !this.shootBullet)
        {
            console.log('fail')
            this.isStop = true;
        }
    }

    public shoot(){
        if(!this.touchID.end)
        {
            this.reInitBulletXY();
            return;
        }
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
        else
        {
            this.reInitBulletXY();
        }
    }

    //itemMC:显示对象
    public createBullet(x, y, rota) {
        var mc = this.shootBullet;
        this.bulletArr.push(mc);
        this.addChild(mc);
        mc.data = {
            id:mc.data.id,
            x:x,
            y:y,
            b:false,
            rota:rota/180*Math.PI,
        }
        mc.x = x
        mc.y = y
        egret.Tween.get(mc).wait(500).call(()=>{
            this.addChildAt(mc,2);
        });
        return mc
    }

    public playItemText(item:PKItem,value,color=0xFF0000){
        var txt = this.createTxt();
        txt.textColor = color;
        txt.text = value;
        txt.x = item.x;
        txt.y = item.y;
        this.addChild(txt)

        var tw = egret.Tween.get(txt);
        tw.to({y:txt.y - 50},800).call(function(){
            this.freeTxt(txt);
        },this)
    }

    private createTxt():eui.Label{
        var item:eui.Label = this.txtPool.pop();
        if(!item)
        {
            item = new eui.Label();
            item.size = 30;
            item.bold = true;
            item.stroke = 2;
            item.width = 160;
            item.textAlign="center"
            item.anchorOffsetX = 80;
            item.strokeColor = 0x000000
            item.cacheAsBitmap = true;
        }

        item.alpha = 1;
        return item;
    }

    private freeTxt(item){
        if(!item)
            return;
        egret.Tween.removeTweens(item)
        MyTool.removeMC(item);
        this.txtPool.push(item);
    }
}