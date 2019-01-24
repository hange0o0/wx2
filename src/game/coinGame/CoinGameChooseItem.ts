class CoinGameChooseItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "CoinGameChooseItemSkin";
    }

    private bg: eui.Image;
    private mc: eui.Image;


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
        MyTool.addLongTouch(this,this.onInfo,this)
    }


    private onInfo(){
        CardInfoUI.getInstance().show(this.data.id)
    }

    private onClick(){
         CoinGameUI.getInstance().deleteItem(this.data)
    }

    public dataChanged(){
        //this.indexText.text = this.data.index;
        var vo = MonsterVO.getObject(this.data.id)
        this.bg.source = vo.getBG()
        this.mc.source = vo.getImage()
    }


}