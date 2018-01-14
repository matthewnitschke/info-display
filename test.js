var req = require('./apis/classSummary.js')

var subjects = [
    {
      "subject": "CS Theory",
      "color": "green",
      "meetingDays": "Mon,Wed,Fri",
      "summaryUrl": "/Computer-Science-Theory/summaries.txt",
      "assignments": [{"name":"Reading - [pg. 1-10]","due":"01/12/2018"},{"name":"Reading - [pg. 10-13]","due":"01/17/2018"},{"name":"Reading - [pg. 13-16]","due":"01/19/2018"},{"name":"Reading - [pg. 17-25]","due":"01/22/2018"},{"name":"Reading - [pg. 31-40]","due":"01/24/2018"},{"name":"Reading - [pg. 40-47]","due":"01/26/2018"},{"name":"Reading - [pg. 47-54]","due":"01/29/2018"},{"name":"Reading - [pg. 54-62]","due":"01/31/2018"},{"name":"Reading - [pg. 62-76]","due":"02/02/2018"}]
    },
    {
      "subject": "ESof Applications",
      "color": "cyan",
      "meetingDays": "Mon,Wed,Fri",
      "summaryUrl": "",
      "assignments": []
    },
    {
      "subject": "Robotics",
      "color": "yellow",
      "meetingDays": "Mon,Wed,Fri",
      "assignments": []
    },
    {
      "subject": "Holograms",
      "color": "blue",
      "meetingDays": "Tues,Thurs",
      "assignments": [
        { "name": "Complete pre course info", "due": "01/15/2017" }
      ]
    }
  ]

req.getSummaries(subjects).then(e => {
    console.log(e);
})