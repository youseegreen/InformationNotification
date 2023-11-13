// 15分毎に鉄道遅延情報のjsonを取得して遅延情報をツイートする
function TrainDelayNotification() {
  const nowHour = new Date().getHours();
  if (nowHour < 7 || nowHour > 23) return;

  const trainDelayInfoUrl = "https://ntool.online/data/train_all.json";
  const trainTargets = [
    {"line": "近鉄奈良線", "id": 285, "url": "https://www.kintetsu.jp/unkou/unkou.html"},
    {"line": "大阪メトロ御堂筋線", "id": 321, "url": "https://subway.osakametro.co.jp/guide/subway_information.php"},
    {"line": "大阪メトロ谷町線", "id": 322, "url": "https://subway.osakametro.co.jp/guide/subway_information.php"},
    {"line": "阪急宝塚線", "id": 285, "url": "http://www.hankyu.co.jp/railinfo/"},
  ];

  let response = UrlFetchApp.fetch(trainDelayInfoUrl);
  let result = JSON.parse(response.getContentText());

  let sendText = "";
  
  for (let i = 0; i < trainTargets.length; i++) {
    const line = trainTargets[i]["line"];
    const id = trainTargets[i]["id"];
    const url = trainTargets[i]["url"];
    const isPrevStatus = PropertiesService.getScriptProperties().getProperty(line);

    const info = result["data"]["6"].filter(row => row["railCode"] == id)[0];
    if (info.status !== "平常運転") {
      PropertiesService.getScriptProperties().setProperty(line, info.status);
      if (info.status !== isPrevStatus) sendText += `${info.railName}：${info.status}\n${info.info}\n${url}\n`;
    }
    else {
      PropertiesService.getScriptProperties().setProperty(line, info.status);
      if (isPrevStatus !== "平常運転") sendText += `${info.railName}：平常運転に戻りました\n${url}`;
    }
  }

  if (sendText !== "") {
    SlackPost("鉄道遅延情報", ":train:", sendText);
    LinePost("鉄道遅延情報", ":train:", sendText);
  }
}
