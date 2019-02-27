class ShootMonster extends game.BaseItem{

    private static pool = [];
    public static createItem():ShootMonster {
        var item:ShootMonster = this.pool.pop();
        if (!item) {
            item = new ShootMonster();
        }
        return item;
    }

    public static freeItem(item) {
        if (!item)
            return;
        item.remove();
        this.pool.push(item);
    }

    private barGroup: eui.Group;
    private bar: eui.Rect;
    private teamMC: eui.Image;
    private list: eui.List;

    public mc = PKMonsterMV.createItem();

    public isDie = 0
    public hp = 0
    public maxHp = 0
    public constructor() {
        super();
        this.skinName = "PKMonsterItemSkin";
        this.touchChildren = this.touchEnabled = false;
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addChildAt(this.mc,0)
        this.mc.x = 50;
        this.mc.y = 300;
        this.anchorOffsetX = 50;
        this.anchorOffsetY = 300;
        this.mc.addEventListener('mv_die',this.onDieFinish,this)

        this.list.visible = false
        this.teamMC.visible = false

        this.bar.fillColor = 0xFF0000
    }

    private onDieFinish(){
        this.isDie = 2;
    }

    public dataChanged():void {
        this.isDie = 0;
        this.maxHp = this.data.vo.hp;
        this.hp = this.data.vo.hp;
         this.mc.load(this.data.id);
        this.mc.run();
        this.renewScale();
        this.barGroup.visible = false
    }

    private renewScale(){
        this.mc.scaleX = -this.data.atkRota;
    }

    public remove(){
        MyTool.removeMC(this);
        egret.Tween.removeTweens(this);
    }

    public beHit(){
        this.hp -= 50;
        if(this.hp <= 0)
        {
            this.isDie = 1;
            this.mc.die()
            this.barGroup.visible = false

            var addCoin = Math.floor(this.data.vo.cost)
           ShootGameUI.getInstance().addCoin(addCoin)
        }
        else
        {
            this.alpha = 0.5;
            this.once(egret.Event.ENTER_FRAME,()=>{
                this.alpha = 1;
            },this)
            this.barGroup.visible = true
            this.bar.width = 40 * this.hp/this.maxHp;
        }
    }

    public move(){
        if(this.isDie)
        {
            return;
        }
        this.x += this.data.atkRota * Math.round(this.data.speed)/10*20/60;
        if(this.data.atkRota == 1)
        {
            if(this.x > 640)
            {
                this.data.atkRota = -1
                this.renewScale();
            }
        }
        else
        {
            if(this.x < 0)
            {
                this.data.atkRota = 1
                this.renewScale();
            }
        }
    }

}