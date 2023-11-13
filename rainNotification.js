function RainNorification() {
  const nowHour = new Date().getHours();
  if (nowHour < 7 || nowHour > 23) return;

  const rainTargets = [
    {"cityKanji": "八尾", "url": "https://tenki.jp/amedas/6/30/62051.html"}, 
    {"cityKanji": "市内", "url": "https://tenki.jp/amedas/6/30/62078.html"}, 
    {"cityKanji": "豊中", "url": "https://tenki.jp/amedas/6/30/62051.html"}, 
  ];

  let sendText = "";

  for (let i = 0; i < rainTargets.length; i++) {
    let cityKanji = rainTargets[i]["cityKanji"];
    let url = rainTargets[i]["url"];
    let isPrevRainy = PropertiesService.getScriptProperties().getProperty(cityKanji);

    let html = UrlFetchApp.fetch(url).getContentText("UTF-8");
    let rainfall = html.match(/\d*\.\d*mm/).toString();
    if (rainfall !== "0.0mm") {
      PropertiesService.getScriptProperties().setProperty(cityKanji, "Rain");
      if (isPrevRainy !== "Rain") sendText += `${cityKanji}：${rainfall}\n`;
    }
    else {
      PropertiesService.getScriptProperties().setProperty(cityKanji, "NotRain");
      if (isPrevRainy === "Rain") sendText += `${cityKanji}の雨はやみました！\n`;
    }
  }
  
  if (sendText !== "") {
    SlackPost("お天気情報", ":umbrella:", sendText);
    LinePost("お天気情報", ":umbrella:", sendText);
  }
}
