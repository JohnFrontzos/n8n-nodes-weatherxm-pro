import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class WeatherXMProApi implements ICredentialType {
    name = 'weatherXMProApi';
    displayName = 'WeatherXM Pro API';
    documentationUrl = 'https://pro.weatherxm.com/api';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            default: '',
            required: true,
            description: 'Your WeatherXM Pro API key',
        },
    ];
}
