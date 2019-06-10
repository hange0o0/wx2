/**
 *
 * @author 
 *
 */
class SoundManager {
    private static instance: SoundManager;

    public constructor() {
        this.init();
    }

    public static getInstance(): SoundManager {
        if(!this.instance)
            this.instance = new SoundManager();
        return this.instance;
    }
    //默认关闭音乐
    private _soundPlaying: boolean = false;
    private _bgPlaying: boolean = false;
    private _openShake: boolean = true;
    private _isPlayMovie: boolean = true;
    private _isMessage: boolean = true;

    private currentChannel:egret.SoundChannel;
    private wxChannel;
    private currentKey :string;
    private bgKey :string;
    private lastBGKey :string;
    private isLoad:boolean=false;

    private init(){

            this._soundPlaying = true;
            this._bgPlaying = true;

        var som = SharedObjectManager.getInstance();
        if(som.getValue("sound") != undefined)
            this._soundPlaying = som.getValue("sound");
        if(som.getValue("bgsound") != undefined)
            this._bgPlaying = som.getValue("bgsound");

        if(som.getValue("openShake") != undefined)
            this._openShake = som.getValue("openShake");
        if(som.getValue("playMovie") != undefined)
            this._isPlayMovie = som.getValue("playMovie");
        if(som.getValue("showMessage") != undefined)
            this._isMessage = som.getValue("showMessage");

        this.isLoad=this._soundPlaying;
    }

    public get soundPlaying(){
        return this._soundPlaying
    }
    public get bgPlaying(){
        return this._bgPlaying
    }
    public get openShake(){
        return this._openShake
    }
    public get isPlayMovie(){
        return this._isPlayMovie
    }
    public get isMessage(){
        return this._isMessage
    }

    public set soundPlaying(v){
        if(this._soundPlaying!=v)
            SharedObjectManager.getInstance().setValue("sound",v)
        this._soundPlaying = v;
    }
    public set bgPlaying(v){
        if(this._bgPlaying!=v){
            SharedObjectManager.getInstance().setValue("bgsound",v);
        }
        this._bgPlaying= v;

        if(!v ){
            this.stopBgSound();
        }
        else{
            if(MainPKUI.instance.visible && !PKData.getInstance().isGameOver)
                this.playSound('pkbg');
            else
                this.playSound('bg');
        }
    }
    public set openShake(v){
        if(this._openShake!=v)
            SharedObjectManager.getInstance().setValue("openShake",v)
        this._openShake= v;
    }
    public set isPlayMovie(v){
        if(this._isPlayMovie!=v)
            SharedObjectManager.getInstance().setValue("playMovie",v)
        this._isPlayMovie= v;
    }
    public set isMessage(v){
        if(this._isMessage!=v)
            SharedObjectManager.getInstance().setValue("showMessage",v)
        this._isMessage= v;
    }

    public addBtnClickEffect(btn:egret.DisplayObject){
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
            this.playBtn();
        },this)
    }

    public playBtn(){
        this.playEffect('btn');
    }

    public stopBgSound(){
        this.lastBGKey = this.bgKey;
        this.bgKey = null;
        if(window['wx'])
        {
            if(this.wxChannel) {
                this.wxChannel.destroy()
            }
            this.currentKey = null;
            return;
        }

        try{
            egret.clearTimeout(this.playTime);
            if(this.currentChannel){
                egret.Tween.removeTweens(this.currentChannel);
                this.currentChannel.stop();
            }
            this.onSoundComplete();
        }catch(e){}
    }

    public playEffect(v:string, fun?,thisObj?){
        if(GuideManager.getInstance().isGuiding)
            return;
        if(!this.soundPlaying) return;

        if(window['wx'])
        {
            const innerAudioContext = window['wx'].createInnerAudioContext()
            innerAudioContext.autoplay = true
            innerAudioContext.src = "resource/sound/" + v +".mp3";
            return;
        }


        var url = "resource/sound/" + v +".mp3"
        var loader: egret.URLLoader = new egret.URLLoader();
        loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
        loader.once(egret.Event.COMPLETE,()=>{
            var sound: egret.Sound = <egret.Sound>loader.data;
            var channel = sound.play(0,1);
            if(fun)
                channel.once(egret.Event.SOUND_COMPLETE,fun,thisObj)
        },this);
        loader.load(new egret.URLRequest(url));
    }


    private tempLoop:number;
    public playSound(key:string, loop:number = 9999){

        if(GuideManager.getInstance().isGuiding)
            return;
        if(!this.bgPlaying) return;
        if(this.bgKey == key) return;



        var url = "resource/sound/" + key +".mp3"
        if(this.currentKey == url) return;

        this.stopBgSound()
        this.bgKey = key;
        this.currentKey=url;


        if(window['wx'])
        {
            const innerAudioContext = this.wxChannel = window['wx'].createInnerAudioContext()
            innerAudioContext.autoplay = true
            innerAudioContext.src =url;
            innerAudioContext.loop =true;
            return;
        }
        
        try{

            this.tempLoop = loop;

            var loader: egret.URLLoader = new egret.URLLoader();
            loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
            loader.addEventListener(egret.Event.COMPLETE,this.onLoadComplete,this);
            loader.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onLoadError,this);
            loader.load(new egret.URLRequest(url));
        }
        catch(e){
        }
    }

    /************************************************************************************************** */
    
    private playTime:number;
    private onLoadComplete(event: egret.Event): void {
        egret.clearTimeout(this.playTime);

        var loader: egret.URLLoader = <egret.URLLoader>event.target;
        var self = this;
        try{
            this.onLoadError(event);
            if((this.currentKey && loader.data.url != this.currentKey) || !this._bgPlaying)
                return;
            if(this.currentChannel){

                            self.currentChannel.stop();
                            self.currentChannel=null;


                            if(!self._bgPlaying)return;

                             fun();

            }
            else
                fun();
        }
        catch(e){
        }

        function fun(){
            var sound: egret.Sound = <egret.Sound>loader.data;
            var channel: egret.SoundChannel = sound.play(0,self.tempLoop);
            self.currentChannel = channel;
            channel.addEventListener(egret.Event.SOUND_COMPLETE, self.onSoundComplete, self);
        }

    }

    private onSoundComplete(event?:egret.Event):void {
        this.currentChannel = null;
        this.currentKey = null;
    }

    private onLoadError(event: egret.Event): void {
        var loader: egret.URLLoader = <egret.URLLoader>event.target;
        loader.removeEventListener(egret.Event.COMPLETE,this.onLoadComplete,this);
        loader.removeEventListener(egret.IOErrorEvent.IO_ERROR,this.onLoadError,this);
    }
    

}
