const SLACK_URL = PropertiesService.getScriptProperties().getProperty("SLACK_URL");
const LINE_URL = "https://api.line.me/v2/bot/message/push";
const LINE_TOKEN = PropertiesService.getScriptProperties().getProperty("LINE_TOKEN");
const LINE_MY_ID = PropertiesService.getScriptProperties().getProperty("LINE_MY_ID");

function SlackPost(username, icon_emoji, text) {
  const payload = {
    username: username,
    icon_emoji: icon_emoji, 
    text: text,
  };
  UrlFetchApp.fetch(SLACK_URL, {method: "POST", payload: JSON.stringify(payload)});
}

function LinePost(username, icon_emoji, text) {
  if (text[text.length -1] === "\n") text = text.substring(0, text.length - 1);
  const data = {
    to: LINE_MY_ID,
    messages: [
      {
        type: 'text',
        text: `【${username}】\n${text}`, 
      },
    ],
  };
  UrlFetchApp.fetch(LINE_URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + LINE_TOKEN,
    },
    payload: JSON.stringify(data),
  });
}
