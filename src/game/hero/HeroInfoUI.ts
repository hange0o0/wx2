class HeroInfoUI extends game.BaseWindow {

    private static _instance:HeroInfoUI;
    public static getInstance() {
        if (!this._instance) this._instance = new HeroInfoUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "HeroInfoUISkin";
    }

    private bloodItem: ResourceItem;
    private bloodItem2: ResourceItem;
    private skillBG: eui.Image;
    private mc: eui.Image;
    private icon: eui.Image;
    private feedBtn: eui.Button;
    private splitBtn: eui.Button;
    private barMC: eui.Image;
    private lvText: eui.Label;
    private skillTitleText: eui.Label;
    private skillText: eui.Label;








    private data;
    private needBlood;
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.feedBtn,()=>{
            if(!UM.checkResource({blood:this.needBlood}))
                return;
            if(this.data.isDie)
            {
                HeroManager.getInstance().rebornOne(this.data)
            }
            else
            {
                HeroManager.getInstance().feed(this.data,this.needBlood)
            }
            this.renew();
        })
        this.addBtnEvent(this.splitBtn,()=>{
            MyWindow.Confirm('确定要炼化该蛊虫吗？',(b)=>{
                if(b==1)
                {
                    if(HeroManager.getInstance().split(this.data))
                        this.hide();
                }
            },['取消','炼化']);

        })

    }

    public show(data?){
        this.data = data;
        super.show();


    }

    private onCoinChange(){
        this.bloodItem.data = this.needBlood
    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.onCoinChange)
    }

    public renew(){
        var HM = HeroManager.getInstance()
        var lv = HM.getLevelByExp(this.data.exp);
        this.bloodItem2.setText(NumberUtil.addNumSeparator(HM.getSplitAward(this.data)))
        this.lvText.text = 'LV.' + lv;
        var nextExp = HM.getExpByLevel(lv + 1)
        var beforeExp = HM.getExpByLevel(lv)
        this.barMC.width = 204 * (this.data.exp - beforeExp)/(nextExp - beforeExp)
        var skillBase = HM.skillBase[this.data.skill];
        this.skillTitleText.text = skillBase.name
        this.skillText.text = skillBase.des

        var mvo = MonsterVO.getObject(this.data.id);
        this.mc.source = mvo.getThumb();
        this.setTitle(mvo.name)

        this.icon.visible = false;
        if(this.data.isDie)
            this.setIcon('icon_die_png')
        else if(HM.isDef(this.data.key))
            this.setIcon('icon_def_png')
        else if(HM.isAtk(this.data.key))
            this.setIcon('icon_atk_png')
        this.skillBG.source = HeroManager.getInstance().getSkillBG(this.data.skill);
         if(this.data.isDie)
         {
             this.currentState = 'die'
             this.needBlood = HM.getRebornCost(lv)
         }
        else
         {
             this.currentState = 'normal'
             this.needBlood = nextExp - this.data.exp
         }
        this.onCoinChange();
    }

    private setIcon(url){
        this.icon.source = url;
        this.icon.visible = true;
    }
}