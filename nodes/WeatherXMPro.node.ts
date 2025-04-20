import { INodeType, INodeTypeDescription, IExecuteFunctions, IDataObject, INodeProperties, NodeConnectionType } from 'n8n-workflow';

/**
 * WeatherXM Pro n8n Community Node
 * Interacts with the WeatherXM Pro API.
 * @author John Frontzos
 */
class WeatherXMPro implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'WeatherXM Pro',
        name: 'weatherXMPro',
        group: ['transform'],
        version: 2,
        description: 'Interact with the WeatherXM Pro API',
        icon: 'file:wxm-icon-60x60.png',
        defaults: {
            name: 'WeatherXM Pro',
        },
        inputs: ['main' as NodeConnectionType],
        outputs: ['main' as NodeConnectionType],
        credentials: [
            {
                name: 'weatherXMProApi',
                required: true,
            },
        ],
        properties: [
            // ...existing properties...
        ],
    };

    async execute(this: IExecuteFunctions): Promise<any> {
        // ...existing code...
    }
}

declare var module: any;
module.exports = { WeatherXMPro };
