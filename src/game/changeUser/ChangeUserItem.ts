class ChangeUserItem extends game.BaseItem{

    //"appid": "wxec9471079f8b6c27",
    //"desc": “免费抽⼤大奖，免费领奖品，再奖⼀一个亿！",
    //"img": "https://wllm.oss-cn-beijing.aliyuncs.com/trackposter/wxec9471079f8b6c27/75428.jpg",
    //"logo": "https://wllm.oss-cn-beijing.aliyuncs.com/logoa/wxec9471079f8b6c27.png",
    //"name": "测试号1"


    private mc: eui.Image;
    private nameText: eui.Label;
    private desText: eui.Label;


    public constructor() {
        super();
        this.skinName = "ChangeUserItemSkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }


    private onClick(){
        var wx = window['wx'];
        wx.previewImage({
            urls: [this.data.img],
            success: function () {
            }
        })
    }

    public dataChanged():void {
        this.mc.source = this.data.logo;
        this.nameText.text = this.data.name;
        this.desText.text = this.data.desc;
    }

}