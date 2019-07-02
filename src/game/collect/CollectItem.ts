class CollectItem extends game.BaseItem{

    private mc: eui.Image;
    private txtGroup: eui.Group;
    private lockMC: eui.Image;
    private txt: eui.Label;
    private lvText: eui.Label;



    public constructor() {
        super();
        this.skinName = "CollectItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,()=>{
            CollectInfoUI.getInstance().show(this.data)
        })
    }

    public dataChanged():void {
        var vo = MonsterVO.getObject(this.data.id)
        if(this.data.isLock)
            this.txtGroup.addChildAt(this.lockMC,0)
        else
            MyTool.removeMC(this.lockMC)
        this.mc.source = vo.getThumb()
        this.txt.text = vo.name
        this.lvText.text = 'LV.' + vo.level
    }


}