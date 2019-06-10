class ChangeUserUI extends game.BaseContainer {



    private list: eui.List;
    private dataProvider:eui.ArrayCollection

    public constructor() {
        super();
        this.skinName = "ChangeUserUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = ChangeUserItem
        this.list.dataProvider = this.dataProvider = new eui.ArrayCollection();
    }

    private timer
    public renew(){
        var list = MyADManager.getInstance().getListByNum(10)
        if(list.length == 0)
        {
            clearTimeout(this.timer)
            this.timer = setTimeout(()=>{
                this.renew();
            },500);
            return;
        }
        this.dataProvider.source = list;
        this.dataProvider.refresh();
    }
}