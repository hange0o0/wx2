class RankItem extends game.BaseItem{

    private bg: eui.Rect;
    private headMC: eui.Image;
    private indexText: eui.Label;
    private nickText: eui.Label;
    private iconMC: eui.Image;
    private valueText: eui.Label;


    public constructor() {
        super();
        this.skinName = "RankItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged():void {
        let color = this.data.index%2 == 0 ? 0xA8671C:0xb47c39;
        this.bg.fillColor = color

        this.indexText.textColor = this.data.index < 4 ? 0xffffff : 0xcccccc;
        this.indexText.text = this.data.index;
        this.nickText.text = this.data.nick
        this.headMC.source = this.data.head
        this.iconMC.source = this.data.type == 'coin'?'icon_coin_png':'icon_force2_png'
        this.valueText.text = this.data.type == 'coin'?NumberUtil.addNumSeparator(this.data.value,2):'第' +this.data.value + '关'
    }


}