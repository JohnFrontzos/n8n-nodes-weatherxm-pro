import { ICredentialType, INodeProperties } from 'n8n-workflow';

class WeatherXMProApi implements ICredentialType {
    name = 'weatherXMProApi';
    displayName = 'WeatherXM Pro API';
    documentationUrl = 'https://pro.weatherxm.com/api';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
			typeOptions: { password: true },
            default: '',
            required: true,
            description: 'Your WeatherXM Pro API key',
        },
    ];
}

declare var module: any;
module.exports = { WeatherXMProApi };
