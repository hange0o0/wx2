class ChangeJumpUI extends game.BaseWindow{

    private static _instance:ChangeJumpUI;
    public static getInstance() {
        if (!this._instance) this._instance = new ChangeJumpUI();
        return this._instance;
    }

    private list: eui.List;
    private destText: eui.Label;
    private titleText: eui.Label;
    private closeBtn: eui.Image;


    public fun;
    public str;
    public constructor() {
        super();
        this.skinName = "ChangeJumpUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = ChangeUserItem
        this.titleText.text = ('体验更多小程序')
        this.addBtnEvent(this.closeBtn,this.hide)
    }

    public show(str?,fun?){
        this.fun = fun;
        this.str = str;
        super.show()

    }

    public onShow(){
        this.renew();
    }

    public renew(){
        this.setHtml(this.destText, this.str);
        this.list.dataProvider = new eui.ArrayCollection(MyADManager.getInstance().getListByNum(9,this.fun))
    }

    public hide(){
        super.hide();
    }
}