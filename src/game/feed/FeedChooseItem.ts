class FeedChooseItem extends game.BaseItem{

    private skillBG: eui.Image;
    private mc: eui.Image;
    private lvText: eui.Label;
    private heroMC: eui.Image;



    public constructor() {
        super();
        this.skinName = "FeedChooseItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    public onClick():void {
         FeedInfoUI.getInstance().removeItem(this.data);
    }

    public dataChanged():void {
        this.heroMC.visible = this.data.skill
        this.skillBG.source = HeroManager.getInstance().getSkillBG(this.data.skill);
        var vo = MonsterVO.getObject(this.data.id)
        if(this.data.exp)
            this.lvText.text = 'LV.' +  HeroManager.getInstance().getLevelByExp(this.data.exp)
        else
            this.lvText.text = 'LV.' +  vo.level;
        this.mc.source = vo.getThumb();
    }


}

class FeedChooseItem2 extends FeedChooseItem{
    public constructor() {
        super();
    }

    public onClick():void {
        FeedChooseUI.getInstance().addItem(this.data);
    }


}