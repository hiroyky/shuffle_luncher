const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync; 

const input = process.argv[2];
const tableName = 'shuffle_luncher_members';

const body = fs.readFileSync(path.join(__dirname, input)).toString();
body.split(`\r\n`).forEach(line => {
    const vals = line.split(',');
    const slackId = vals[0];
    const name = vals[1];
    const displayName = vals[2];

    const cmd = new Array();
    cmd.push(`aws dynamodb put-item`);
    cmd.push(`--table-name ${tableName}`);
    cmd.push(`--item`);
    cmd.push("'" + JSON.stringify(
        {
            slack_id: { S: slackId },
            name: { S: name },
            display_name: { S:displayName },
            "2018_5_1-attendance": { BOOL: true },
            "2018_5_8-attendance": { BOOL: true },
            "2018_5_15-attendance": { BOOL: true },
            "2018_5_22-attendance": { BOOL: true },
            "2018_5_29-attendance": { BOOL: true },
        }
    ) + "'");
    const val = cmd.join(' ');
    console.log(val);
    execSync(val);
});
