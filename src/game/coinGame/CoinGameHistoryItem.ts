class CoinGameHistoryItem extends game.BaseItem{

    private list: eui.List;
    private indexText: eui.Label;
    private pageMC: eui.Group;



    public constructor() {
        super();
        this.skinName = "CoinGameHistoryItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = MainPKItem;

        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
         CoinGameHistoryUI.getInstance().hide();
        CoinGameUI.getInstance().renew(this.data)
    }

    public dataChanged():void {
        this.indexText.text = this.data + '';
        var data = PKManager.getInstance().getChapterData(this.data);
        var arr = data.list1.split(',')
        if(arr.length>6)
        {
            arr.length = 6;
            this.pageMC.visible = true
        }
        else
        {
            this.pageMC.visible = false
        }
        for(var i=0;i<arr.length;i++)
            arr[i] = MonsterVO.getObject(arr[i]);
        this.list.dataProvider = new eui.ArrayCollection(arr)
    }


}