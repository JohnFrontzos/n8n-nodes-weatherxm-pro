import { INodeType, INodeTypeDescription, IExecuteFunctions, IDataObject, INodeProperties, NodeConnectionType } from 'n8n-workflow';

/**
 * WeatherXM Pro n8n Community Node
 * Interacts with the WeatherXM Pro API.
 * @author John Frontzos
 */
class WeatherXMPro implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'WeatherXM Pro',
        name: 'weatherXmPro',
        group: ['transform'],
        version: 2,
        description: 'Interact with the WeatherXM Pro API',
        icon: 'file:wxm-icon-60x60.png', // Use PNG icon for n8n custom node
        defaults: {
            name: 'WeatherXM Pro',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'weatherXMProApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Action',
                name: 'action',
                type: 'options',
                options: [
                    {
                        name: 'Observation: Get Latest Observation',
                        value: 'getLatestObservation',
                        description: 'Fetch the latest observation data for a station'

																								action: 'Fetch the latest observation data for a station',                    },
                    {
                        name: 'Observation: Get Historical Observations',
                        value: 'getHistoricalObservations',
                        description: 'Fetch historical observations for a station and date'

																								action: 'Fetch historical observations for a station and date',                    },
                    {
                        name: 'Stations: Get Stations Near',
                        value: 'getStationsNear',
                        description: 'Get stations within a radius from a location'

																								action: 'Get stations within a radius from a location',                    },
                    {
                        name: 'Stations: Get Stations in Bounding Box',
                        value: 'getStationsBounds',
                        description: 'Get stations within a bounding box'

																								action: 'Get stations within a bounding box',                    },
                    {
                        name: 'Stations: Get All Stations',
                        value: 'getAllStations',
                        description: 'Get all available stations'

																								action: 'Get all available stations',                    }
                ],
                default: 'getStationsNear',
           },
            {
                displayName: 'Station ID',
                name: 'station_id',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        action: ['getLatestObservation', 'getHistoricalObservations']
                    }
                },
                description: 'The unique identifier of the station'
            },
            {
                displayName: 'Date',
                name: 'date',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        action: ['getHistoricalObservations']
                    }
                },
                description: 'Date (YYYY-MM-DD) for historical observations'
            },
            {
                displayName: 'Latitude',
                name: 'lat',
                type: 'number',
                default: 0,
                displayOptions: {
                    show: {
                        action: ['getStationsNear']
                    }
                },
                description: 'Latitude of the center of the area'
            },
            {
                displayName: 'Longitude',
                name: 'lon',
                type: 'number',
                default: 0,
                displayOptions: {
                    show: {
                        action: ['getStationsNear']
                    }
                },
                description: 'Longitude of the center of the area'
            },
            {
                displayName: 'Radius',
                name: 'radius',
                type: 'number',
                default: 1000,
                displayOptions: {
                    show: {
                        action: ['getStationsNear']
                    }
                },
                description: 'Radius (in meters) for which stations are queried'
            },
            {
                displayName: 'Min Latitude',
                name: 'min_lat',
                type: 'number',
                default: 0,
                displayOptions: {
                    show: {
                        action: ['getStationsBounds']
                    }
                },
                description: 'Minimum latitude of the bounding box'
            },
            {
                displayName: 'Min Longitude',
                name: 'min_lon',
                type: 'number',
                default: 0,
                displayOptions: {
                    show: {
                        action: ['getStationsBounds']
                    }
                },
                description: 'Minimum longitude of the bounding box'
            },
            {
                displayName: 'Max Latitude',
                name: 'max_lat',
                type: 'number',
                default: 0,
                displayOptions: {
                    show: {
                        action: ['getStationsBounds']
                    }
                },
                description: 'Maximum latitude of the bounding box'
            },
            {
                displayName: 'Max Longitude',
                name: 'max_lon',
                type: 'number',
                default: 0,
                displayOptions: {
                    show: {
                        action: ['getStationsBounds']
                    }
                },
                description: 'Maximum longitude of the bounding box'
            }
        ],
    };

    async execute(this: IExecuteFunctions): Promise<any> {
        const action = this.getNodeParameter('action', 0) as string;
        const params = this.getNode().parameters as IDataObject;
        const credentials = await this.getCredentials('weatherXMProApi');
        if (!credentials) {
            throw new Error('No credentials returned!');
        }
        const apiKey = credentials.apiKey as string;
        const baseUrl = 'https://pro.weatherxm.com/api';
        let responseData;
        try {
            if (action === 'getStationsNear') {
                if (typeof params.lat !== 'number' || typeof params.lon !== 'number' || typeof params.radius !== 'number') {
                    throw new Error('Latitude, longitude, and radius must be numbers.');
                }
                responseData = await this.helpers.request({
                    method: 'GET',
                    url: `${baseUrl}/stations/near`,
                    qs: {
                        lat: params.lat,
                        lon: params.lon,
                        radius: params.radius,
                    },
                    headers: {
                        'X-API-KEY': apiKey,
                    },
                    json: true,
                });
            } else if (action === 'getStationsBounds') {
                if (typeof params.min_lat !== 'number' || typeof params.min_lon !== 'number' || typeof params.max_lat !== 'number' || typeof params.max_lon !== 'number') {
                    throw new Error('Bounding box coordinates must be numbers.');
                }
                responseData = await this.helpers.request({
                    method: 'GET',
                    url: `${baseUrl}/stations/bounds`,
                    qs: {
                        min_lat: params.min_lat,
                        min_lon: params.min_lon,
                        max_lat: params.max_lat,
                        max_lon: params.max_lon,
                    },
                    headers: {
                        'X-API-KEY': apiKey,
                    },
                    json: true,
                });
            } else if (action === 'getAllStations') {
                responseData = await this.helpers.request({
                    method: 'GET',
                    url: `${baseUrl}/stations`,
                    headers: {
                        'X-API-KEY': apiKey,
                    },
                    json: true,
                });
            } else if (action === 'getLatestObservation') {
                if (!params.station_id || typeof params.station_id !== 'string') throw new Error('Station ID is required and must be a string.');
                responseData = await this.helpers.request({
                    method: 'GET',
                    url: `${baseUrl}/stations/${params.station_id}/latest`,
                    headers: {
                        'X-API-KEY': apiKey,
                    },
                    json: true,
                });
            } else if (action === 'getHistoricalObservations') {
                if (!params.station_id || typeof params.station_id !== 'string' || !params.date || typeof params.date !== 'string') {
                    throw new Error('Station ID and Date are required and must be strings.');
                }
                responseData = await this.helpers.request({
                    method: 'GET',
                    url: `${baseUrl}/stations/${params.station_id}/history`,
                    qs: {
                        date: params.date,
                    },
                    headers: {
                        'X-API-KEY': apiKey,
                    },
                    json: true,
                });
            } else {
                throw new Error(`Unknown action: ${action}`);
            }
            return this.prepareOutputData([{ json: responseData }]);
        } catch (error) {
            return this.prepareOutputData([
                { json: { error: error instanceof Error ? error.message : String(error) } as IDataObject }
            ]);
        }
    }
}

declare var module: any;
module.exports = { WeatherXMPro };
