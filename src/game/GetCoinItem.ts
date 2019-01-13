class GetCoinItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "GetCoinItemSkin";
    }

    private goBtn: eui.Button;
    private barMC: eui.Image;
    private titleText: eui.Label;
    private rateText: eui.Label;
    private desText: eui.Label;
    private addCoinText: eui.Label;




    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        UM.addCoin(1000);
        PKManager.getInstance().needUpUser = true;
    }

    public dataChanged(){

    }



}