import { SSM } from 'aws-sdk';

export default class {
    protected ssm = new SSM();

    async getParameter(key: string, withDecryption=false): Promise<string> {
        const param = await this._getParameter(key, withDecryption);
        if(param === undefined || param.Value === undefined) {
            throw new Error(`failed to get param: ${key} from parameter store`);
        }
        return param.Value;
    }

    protected async _getParameter(key: string, withDecryption=false): Promise<SSM.Parameter|undefined> {
        const res = await this.ssm.getParameter({
            Name: key, 
            WithDecryption: withDecryption
        }).promise();
        return res.Parameter;
    }
}
