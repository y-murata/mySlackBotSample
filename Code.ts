function doPost(e): TextOutput {
    var postData:any = JSON.parse(e.postData.getDataAsString());
  
    // Event Subscriptionsに必要な部分
    if(postData.type == 'url_verification') {
        return ContentService.createTextOutput(postData.challenge);
    } else if (this.isReply()) {
        let res:String = reply(postData);
        return ContentService.createTextOutput(res);
    }
    return ContentService.createTextOutput('ng');
}

function isReply(postData:any): boolean {

    if(postData.event.channel == 'チャンネルID' // 指定のチャンネルだけを観測する
        && postData.authed_users[0] != 'ボットユーザID' // botが発言者の場合には反応しない
        && postData.event.text.indexOf('ボットユーザID') != -1 // botが呼ばれた時だけ反応する
    ){
        return true;
    } 
    return false;
}
  
function reply(postData): HTTPResponse {
    // Incoming WebhooksのURL
    var slackUrl: String = 'Incoming WebhooksのURL';
    // botへのメンションを全て消す
    var text: String = postData.event.text.replace(/<@ボットユーザID>/g, '').trim();
    // おうむ返しするテキストを用意する
    var messageData: {text: String} = {
      'text': '<@' + postData.event.user + '> '　+ text
    };
  
    var options: {
        method: String,
        headers: {'Content-type': String},
        payload: String} = {
      'method' : 'POST',
      'headers' : {'Content-type': 'application/json'},
      'payload' : JSON.stringify(messageData)
    };
  
    return UrlFetchApp.fetch(slackUrl, options); 
}