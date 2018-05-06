以下のようにすると手っ取り早い．

```
curl https://slack.com/api/users.list?token=<TOKEN> > users.json
cat users.json | jq '.members[] | [.id, .name, .real_name] | @csv' > users.csv
node ./register.js users.csv
```
