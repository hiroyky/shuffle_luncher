const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync; 

const input = process.argv[2];
const tableName = 'shuffle_luncher_members';

const body = fs.readFileSync(path.join(__dirname, input)).toString();
body.split(`\n`).map(createUser).forEach(arg => {
    const cmd = new Array();
    cmd.push(`aws dynamodb put-item`);
    cmd.push(`--table-name ${tableName}`);
    cmd.push(`--item`);
    cmd.push("'" + arg + "'");
    const val = cmd.join(' ');
    console.log(val);
    execSync(val);
});

function createUser(line) {
    const vals = line.split(',');
    const slackId = vals[0];
    const name = vals[1];
    const displayName = vals.length >= 3 ? vals[2] : undefined;
    const arg = {
        slack_id: { S: slackId },
        name: { S: name }
    };
    if(displayName) {
        arg.display_name = {S: displayName};
    }
    return JSON.stringify(arg);
}
