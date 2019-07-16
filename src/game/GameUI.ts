class GameUI extends game.BaseUI {

    private static _instance:GameUI;
    public static getInstance() {
        if (!this._instance) this._instance = new GameUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "GameUISkin";
    }

    private soundBtn: eui.Image;
    private rankBtn: eui.Image;
    private feedBtn: eui.Group;
    private workBtn: eui.Group;
    private heroBtn: eui.Group;
    private collectBtn: eui.Group;
    private foodItem: ResourceItem;
    private woodItem: ResourceItem;
    private diamondItem: ResourceItem;
    private grassItem: ResourceItem;
    private defBtn: eui.Button;






    private defItem = [];
    private defHeight = 0

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.defBtn,()=>{
            HeroManager.getInstance().editDef();
        })

        this.addBtnEvent(this.rankBtn,()=>{
            RankUI.getInstance().show();
        })
        this.addBtnEvent(this.soundBtn,()=>{
            SoundManager.getInstance().soundPlaying = !SoundManager.getInstance().soundPlaying
            SoundManager.getInstance().bgPlaying = !SoundManager.getInstance().bgPlaying
            this.renewSoundBtn();
        })
        this.addBtnEvent(this.feedBtn,()=>{
            FeedUI.getInstance().show()
        })
        this.addBtnEvent(this.workBtn,()=>{
            WorkUI.getInstance().show()
        })
        this.addBtnEvent(this.heroBtn,()=>{
            HeroUI.getInstance().show();
        })
        this.addBtnEvent(this.collectBtn,()=>{
            CollectUI.getInstance().show();
        })
        //this.addBtnEvent(this.buildBtn,()=>{
        //    //BuildUI.getInstance().show()
        //})
        //this.addBtnEvent(this.chapterBtn,()=>{
        //    ChapterUI.getInstance().show();
        //})
        //this.addBtnEvent(this.fightBtn,()=>{
        //
        //})
        //this.addBtnEvent(this.shopBtn,()=>{
        //    //ShopUI.getInstance().show();
        //})

        MyTool.addLongTouch(this.soundBtn,()=>{
            if(DEBUG)
            {
                DebugUI.getInstance().show();
                return;
            }
            if(DebugUI.getInstance().debugOpen && !SoundManager.getInstance().soundPlaying)
            {
                DebugUI.getInstance().show();
            }
        },this)

    }

    public onShow(){
        this.defHeight = GameManager.uiHeight - 850;

        this.renewCoin();
        this.renewDef();
        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.renewCoin)
        this.addPanelOpenEvent(GameEvent.client.HERO_CHANGE,this.renewDef)
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        if(this.defItem.length && Math.random() < 0.5)
        {
            var item = ArrayUtil.randomOne(this.defItem)
            if(egret.getTimer() - item.lastMove > 5000)
                this.setItemMV(item)
        }
    }

    //private onHeroChange(){
    //    var HM = HeroManager.getInstance();
    //    for(var i=0;i<this.defItem.length;i++)
    //    {
    //        this.defItem[i].data.level = HM.getLevelByExp(this.defItem[i].data.exp)
    //        this.defItem[i].dataChanged();
    //    }
    //}

    public renewCoin(){
        this.foodItem.renew()
        this.woodItem.renew()
        this.diamondItem.renew()
        this.grassItem.renew()
    }

    public renewDef(){
        while(this.defItem.length)
        {
            PKItem.freeItem(this.defItem.pop());
        }


        var HM = HeroManager.getInstance();
        var def = HM.defList;
        var arr = []
        var minLevel = 9999
        var maxLevel = 0
        for(var i=0;i<def.length;i++)
        {
            var oo = HM.getMonster(def[i]);
            oo.level = HM.getLevelByExp(oo.exp)
            minLevel = Math.min(oo.level,minLevel)
            maxLevel = Math.max(oo.level,maxLevel)
            arr.push(oo)
        }
        ArrayUtil.sortByField(arr,['level'],[0])

        //var dis = Math.min(250/arr.length,50);
        for(var i=0;i<arr.length;i++)
        {
            arr[i].maxLevel = maxLevel
            arr[i].minLevel = minLevel

            var item = PKItem.createItem();
            item.x = 80 + (640 - 80*2)*Math.random();
            item.y = 150 + this.defHeight*Math.random()
            item.ox = item.x
            item.oy = item.y
            item.data = arr[i]
            item.lastMove = 0
            this.addChild(item);
            this.defItem.push(item)
            this.setItemMV(item,true);
        }
    }

    private setItemMV(item,noMV?){
        var num = 200
        while(num -- )
        {
            var b = true
            var oo = {
                x:80 + (640 - 80*2*item.scaleX)*Math.random(),
                y:200 + this.defHeight*Math.random()
            }

            for(var i=0;i<this.defItem.length;i++)
            {
                if(Math.abs(this.defItem[i].ox - oo.x) < 120 && Math.abs(this.defItem[i].oy - oo.y) < 180)
                {
                    b = false;
                    break
                }
            }
            if(b)
                break;
        }


        egret.Tween.removeTweens(item);
        var dis = MyTool.getDis({x:item.x,y:item.y},oo);
        if(noMV)
            dis = 0;
        egret.Tween.get(item).to(oo,dis*5).call(()=>{
            this.standMV(item);
        });

        item.ox = oo.x
        item.oy = oo.y
        item.lastMove = egret.getTimer()
    }

    private standMV(item){
        var cd = 700 + 300*Math.random()
        egret.Tween.removeTweens(item);
        egret.Tween.get(item,{loop:true}).to({y:item.y - 60},cd,egret.Ease.sineInOut).to({y:item.y },cd,egret.Ease.sineInOut);
    }

    public renewSoundBtn(){
        this.soundBtn.source = SoundManager.getInstance().bgPlaying?'sound_btn1_png':'sound_btn2_png'
    }



}