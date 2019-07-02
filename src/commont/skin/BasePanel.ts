class BasePanel extends game.BaseContainer {
    public constructor() {
        super();
        this.skinName = "BasePanelSkin";
    }

    private bottomGroup: eui.Group;
    private nameText: eui.Label;
    private closeBtn: eui.Image;


    public relateMC
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn,()=>{
            this.relateMC && this.relateMC.hide();
        })
    }


    public setTitle(title){
       this.nameText.text = title
    }

    public setBottomHeight(v){
       this.bottomGroup.height = v
    }
}