class ChapterUI extends game.BaseUI {

    private static _instance:ChapterUI;
    public static getInstance() {
        if (!this._instance) this._instance = new ChapterUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "ChapterUISkin";
    }

    private pkGroup: eui.Group;
    private titleText: eui.Label;
    private desText: eui.Label;
    private infoBtn: eui.Button;
    private btnGroup: eui.Group;
    private btn0: eui.Button;
    private btn1: eui.Button;
    private btn2: eui.Button;
    private btn3: eui.Button;
    private rateText: eui.Label;
    private closeBtn: eui.Image;






    private btnArr = [];

    public childrenCreated() {
        super.childrenCreated();
        this.btnArr.push(this.btn0)
        this.btnArr.push(this.btn1)
        this.btnArr.push(this.btn2)
        this.btnArr.push(this.btn3)
        this.addBtnEvent(this.btn0,()=>{
            this.onBtnClick(0)
        })
        this.addBtnEvent(this.btn1,()=>{
            this.onBtnClick(1)
        })
        this.addBtnEvent(this.btn2,()=>{
            this.onBtnClick(2)
        })
        this.addBtnEvent(this.btn3,()=>{
            this.onBtnClick(3)
        })
        this.addBtnEvent(this.infoBtn,()=>{

        })
    }

    private onBtnClick(index){
       this.btnArr[index].clickFun();
    }

    public onShow(){
        this.onIn();

        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.onCoinChange)
    }

    private onCoinChange(){

    }


    public onIn(){
        var CM = ChapterManager.getInstance();
        this.btnGroup.removeChildren();
        this.rateText.text = ''
        this.closeBtn.visible = true;
        this.titleText.text = '森林探索';
        this.desText.text = '请选择本次探索的距离，历史探索最远距离为：'+CM.max*10+'米';
        var start = Math.max(1,CM.max - 2);
        var end = CM.max + 1;
        var index = 0;
        for(var i=start;i<=end;i++)
        {
            var btn = this['btn' + index];
            this.btnGroup.addChild(btn);
            btn.label = i*10 + '米';
            btn.clickFun = this.createFun((a,b,c)=>{
                CM.onPKBefore(a)
            },i)
        }
    }

    public onStart(){
        var CM = ChapterManager.getInstance();
    }

    private createFun(fun,a?,b?,c?){
        return function(){
            fun(a,b,c);
        }
    }

}