interface Window {
  FutureNative?: {
    connect():void;
    selectProvider(provider:string):void;
    openAudioSettings():void;
    disconnect():void;
    capture():void;
    speak(text:string,rate:number):void;
    stopSpeaking():void;
    listen(id:string):void;
    stopListening():void;
    askGuide(id:string,question:string):void;
    cancelGuide(id:string):void;
    pairGuide(code:string):void;
    guideStatus():void;
    exportJournal(text:string):void;
  };
  onFutureNative?:(event:{type:string,id?:string,text?:string,data?:string,ready?:boolean})=>void;
}
