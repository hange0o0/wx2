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
    private buildBtn: eui.Group;
    private chapterBtn: eui.Group;
    private fightBtn: eui.Group;
    private shopBtn: eui.Group;
    private foodItem: ResourceItem;
    private woodItem: ResourceItem;
    private coinItem: ResourceItem;
    private diamondItem: ResourceItem;
    private grassItem: ResourceItem;
    private bloodItem: ResourceItem;
    private defBtn: eui.Button;





    private defItem = [];

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
        this.addBtnEvent(this.buildBtn,()=>{
              BuildUI.getInstance().show()
        })
        this.addBtnEvent(this.chapterBtn,()=>{

        })
        this.addBtnEvent(this.fightBtn,()=>{

        })
        this.addBtnEvent(this.shopBtn,()=>{
             ShopUI.getInstance().show();
        })

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
        this.renewCoin();
        this.renewDef();
        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.renewCoin)
    }

    public renewCoin(){
        this.foodItem.renew()
        this.woodItem.renew()
        this.diamondItem.renew()
        this.grassItem.renew()
        this.coinItem.renew()
        this.bloodItem.renew()
    }

    public renewDef(){
        var HM = HeroManager.getInstance();
         var def = HM.defList;
        var arr = []
        for(var i=0;i<def.length;i++)
        {
            var oo = HM.getMonster(def[i]);
            oo.level = HM.getLevelByExp(oo.exp)
            arr.push(oo)
        }
        ArrayUtil.sortByField(arr,['level'],[0])
        //var maxLevel = arr[arr.length - 1]
        //var min = arr[0]

        for(var i=0;i<arr.length;i++)
        {
            arr[i].
        }
    }

    public renewSoundBtn(){
        this.soundBtn.source = SoundManager.getInstance().bgPlaying?'sound_btn1_png':'sound_btn2_png'
    }



}