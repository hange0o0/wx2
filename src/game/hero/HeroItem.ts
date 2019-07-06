class HeroItem extends game.BaseItem{

    private skillBG: eui.Image;
    private mc: eui.Image;
    private txt: eui.Label;
    private lvText: eui.Label;
    private icon: eui.Image;


    public constructor() {
        super();
        this.skinName = "HeroItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    public onClick(){
        HeroInfoUI.getInstance().show(this.data)
    }

    public dataChanged():void {
        var HM = HeroManager.getInstance()
        var lv = HM.getLevelByExp(this.data.exp);
        this.lvText.text = 'LV.' + lv;
        var vo = MonsterVO.getObject(this.data.id);
        this.mc.source = vo.getThumb();
        if(this.txt)
            this.txt.text = vo.name;
        this.icon.visible = false;
        if(this.data.isDie)
            this.setIcon('icon_die_png')
        else if(HM.isDef(this.data.key))
            this.setIcon('icon_def_png')
        else if(HM.isAtk(this.data.key))
            this.setIcon('icon_atk_png')
        this.skillBG.source = HeroManager.getInstance().getSkillBG(this.data.skill);
    }

    private setIcon(url){
        this.icon.source = url;
        this.icon.visible = true;
    }
}


