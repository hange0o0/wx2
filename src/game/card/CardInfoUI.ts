class CardInfoUI extends game.BaseWindow {

    private static _instance: CardInfoUI;
    public static getInstance(): CardInfoUI {
        if(!this._instance)
            this._instance = new CardInfoUI();
        return this._instance;
    }

    private item: PKCardInfoUI;
    public con: eui.Image;
    private leftBtn: eui.Image;
    private rightBtn: eui.Image;
    private pageGroup: eui.Group;
    private p0: eui.Image;
    private p1: eui.Image;
    private p2: eui.Image;
    private p3: eui.Image;
    private p4: eui.Image;
    private p5: eui.Image;
    private p6: eui.Image;
    private p7: eui.Image;
    private p8: eui.Image;
    private p9: eui.Image;
    private p10: eui.Image;
    private p11: eui.Image;
    private p12: eui.Image;
    private p13: eui.Image;
    private p14: eui.Image;
    private p15: eui.Image;
    private p16: eui.Image;
    private p17: eui.Image;
    private p18: eui.Image;
    private p19: eui.Image;
    private closeBtn: eui.Image;











    public list
    public index
    public data;
    private pageArr = []

    public constructor() {
        super();
        this.skinName = "CardInfoUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.closeBtn,this.hide)
        this.addBtnEvent(this.leftBtn,this.onLeft)
        this.addBtnEvent(this.rightBtn,this.onRight)


        for(var i=0;i<20;i++)
        {
            this.pageArr.push(this['p'+i]);
        }
        this.pageGroup.touchChildren = this.pageGroup.touchEnabled = false;

        //this.touchEnabled = false;
    }

    private onLeft(){
        this.index--;
        this.data = this.list[this.index];
        this.renew();
    }

    private onRight(){
        this.index++;
        this.data = this.list[this.index];
        this.renew();
    }



    public show(v?,list?,index=-1){
        this.data = v;
        this.list = list
        this.index = index;
        if(list && index==-1)
        {
            this.index = list.indexOf(this.data)
        }
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){

        this.renew();

    }

    public showFinish(){
         GuideManager.getInstance().testShowGuide()
    }



    public renew(){
        this.item.renew({
            mid:this.data,
            force:100,
        });

        if(this.list && this.list.length > 1)
        {
            this.leftBtn.visible = true
            this.rightBtn.visible = true
            MyTool.changeGray(this.leftBtn,this.index == 0,true)
            MyTool.changeGray(this.rightBtn,this.index == this.list.length-1,true)

            this.pageGroup.visible = true;
            var total = this.list.length
            var index = this.index+1;
            while(index > 20)
            {
                index -= 20;
                total -= 20
            }
            if(total > 20)
                total = 20;



            this.pageGroup.removeChildren();
            for(var i=0;i<total;i++)
            {
                var mc = this.pageArr[i];
                this.pageGroup.addChild(mc);
                mc.source = index-1 == i?'point2_png':'point1_png'
            }
        }
        else
        {
            this.leftBtn.visible = false
            this.rightBtn.visible = false
            this.pageGroup.visible = false
        }
    }


}