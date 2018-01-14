var config = require("../config.json").gitlab;

var GitLab = require("node-gitlab");
var gitlab = GitLab.createPromise({
  api: "https://gitlab.com/api/v3",
  privateToken: config.privateToken
});

module.exports = {
  getSummaries: (subjects) => {
    var promises = [];
    subjects.forEach(subject => {
      if (subject.summaryUrl){ // only query if there is a url to query
        promises.push(gitlab.repositoryFiles.get({
          id: config.schoolProjectId,
          file_path: subject.summaryUrl,
          ref: 'master'
        }).then(resp => {
          var content = Buffer.from(resp.content, 'base64').toString();
          var dates = content.match(new RegExp("- ([0-9]{2}/[0-9]{2}/[0-9]{4}) -", "g"))
            .map(date => {
              return date.replace(/- | -/g, '');
            });

          return {
            [subject.subject]: dates
          }
        }))
      }
    })

    return Promise.all(promises).then(subjects => {
      return subjects.reduce((accumulator, subject) => {
        return Object.assign(accumulator, subject);
      })
    })
   
  }
};
