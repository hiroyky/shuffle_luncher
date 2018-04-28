#!/bin/bash
DYNAMO_DB_TABLE_NAME='shuffle_luncher_members'
pwd=`(cd $(dirname $0) && pwd)`
deploy_bucket=$1
slack_channel=$2

aws cloudformation package --template-file ${pwd}/sam.yml --s3-bucket ${deploy_bucket} --output-template-file ${pwd}/../artifacts/sam.yml
aws cloudformation deploy --template-file ${pwd}/../artifacts/sam.yml \
--stack-name hiroyky-shuffle-luncher \
--capabilities CAPABILITY_IAM \
--parameter-overrides \
    DynamoDBTableName=${DYNAMO_DB_TABLE_NAME} \
    SlackChannelId=${slack_channel}
