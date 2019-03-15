class ChangeUserUI extends game.BaseUI {

    private static _instance: ChangeUserUI;
    public static getInstance(): ChangeUserUI {
        if(!this._instance)
            this._instance = new ChangeUserUI();
        return this._instance;
    }

    private topUI: TopUI;
    private bottomUI: BottomUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private changeBtn: eui.Group;




    private dataProvider:eui.ArrayCollection

    public constructor() {
        super();
        this.skinName = "ChangeUserUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.bottomUI.setHide(this.hide,this);
        this.topUI.setTitle('精品应用推荐')

        this.scroller.viewport = this.list;
        this.list.itemRenderer = ChangeUserItem
        this.list.dataProvider = this.dataProvider = new eui.ArrayCollection();

        this.addBtnEvent(this.changeBtn,this.onChange);

    }

    private onChange(){
           JumpMC.getAD(()=>{
               this.renew();
           })
    }

    public show(){
        super.show()
    }

    public onShow(){
        this.renew();
    }

    public renew(){
        this.dataProvider.source = JumpMC.adList;
        this.dataProvider.refresh();
    }


}