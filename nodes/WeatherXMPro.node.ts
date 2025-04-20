import { INodeType, INodeTypeDescription, IExecuteFunctions, IDataObject, INodeProperties, NodeConnectionType } from 'n8n-workflow';

export class WeatherXMPro implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'WeatherXM Pro',
        name: 'weatherXMPro',
        group: ['transform'],
        version: 2,
        description: 'Interact with the WeatherXM Pro API',
        icon: 'file:wxmWhite.png',
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
            {
                displayName: 'Action',
                name: 'action',
                type: 'options',
                options: [
                    {
                        name: 'Observation: Get Latest Observation',
                        value: 'getLatestObservation',
                        description: 'Fetch the latest observation data for a station'
                    },
                    {
                        name: 'Observation: Get Historical Observations',
                        value: 'getHistoricalObservations',
                        description: 'Fetch historical observations for a station and date'
                    },
                    {
                        name: 'Stations: Get Stations Near',
                        value: 'getStationsNear',
                        description: 'Get stations within a radius from a location'
                    },
                    {
                        name: 'Stations: Get Stations in Bounding Box',
                        value: 'getStationsBounds',
                        description: 'Get stations within a bounding box'
                    },
                    {
                        name: 'Stations: Get All Stations',
                        value: 'getAllStations',
                        description: 'Get all available stations'
                    },
                    {
                        name: 'Stations: Get Stations in Cell',
                        value: 'getStationsInCell',
                        description: 'Get all stations in a H3 cell'
                    },
                    {
                        name: 'Cells: Search for Cell in Region',
                        value: 'searchCellsInRegion',
                        description: 'Search for cells by region name'
                    },
                    {
                        name: 'Forecast: Get Forecast for a Cell',
                        value: 'getForecastForCell',
                        description: 'Get weather forecast for a cell (daily/hourly)'
                    },
                ],
                default: 'getStationsNear',
                description: 'Select an action to perform.'
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
                description: 'The unique identifier of the station.'
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
                description: 'Date (YYYY-MM-DD) for historical observations.'
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
                description: 'Latitude of the center of the area.'
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
                description: 'Longitude of the center of the area.'
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
                description: 'Radius (in meters) for which stations are queried.'
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
                description: 'Minimum latitude of the bounding box.'
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
                description: 'Minimum longitude of the bounding box.'
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
                description: 'Maximum latitude of the bounding box.'
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
                description: 'Maximum longitude of the bounding box.'
            },
            {
                displayName: 'Region Name',
                name: 'region_query',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        action: ['searchCellsInRegion']
                    }
                },
                description: 'The name of the region to search for cells.'
            },
            {
                displayName: 'Cell Index',
                name: 'cell_index',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        action: ['getStationsInCell']
                    }
                },
                description: 'The H3 index of the cell to return stations for.'
            },
            {
                displayName: 'Forecast Cell Index',
                name: 'forecast_cell_index',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        action: ['getForecastForCell']
                    }
                },
                description: 'The H3 index of the cell to get forecast for.'
            },
            {
                displayName: 'From Date',
                name: 'forecast_from',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        action: ['getForecastForCell']
                    }
                },
                description: 'The first day for which to get forecast data (YYYY-MM-DD).'
            },
            {
                displayName: 'To Date',
                name: 'forecast_to',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        action: ['getForecastForCell']
                    }
                },
                description: 'The last day for which to get forecast data (YYYY-MM-DD).'
            },
            {
                displayName: 'Include',
                name: 'forecast_include',
                type: 'options',
                options: [
                    { name: 'Daily', value: 'daily' },
                    { name: 'Hourly', value: 'hourly' }
                ],
                default: 'daily',
                displayOptions: {
                    show: {
                        action: ['getForecastForCell']
                    }
                },
                description: 'Types of forecast to include.'
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
        const baseUrl = 'https://pro.weatherxm.com/api/v1';
        let responseData;
        try {
            if (action === 'getStationsNear') {
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
                if (!params.station_id) throw new Error('Station ID is required');
                responseData = await this.helpers.request({
                    method: 'GET',
                    url: `${baseUrl}/stations/${params.station_id}/latest`,
                    headers: {
                        'X-API-KEY': apiKey,
                    },
                    json: true,
                });
            } else if (action === 'getHistoricalObservations') {
                if (!params.station_id || !params.date) throw new Error('Station ID and Date are required');
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
            } else if (action === 'searchCellsInRegion') {
                if (!params.region_query) throw new Error('Region Name is required');
                responseData = await this.helpers.request({
                    method: 'GET',
                    url: `${baseUrl}/cells/search`,
                    qs: {
                        query: params.region_query,
                    },
                    headers: {
                        'X-API-KEY': apiKey,
                    },
                    json: true,
                });
            } else if (action === 'getStationsInCell') {
                if (!params.cell_index) throw new Error('Cell Index is required');
                responseData = await this.helpers.request({
                    method: 'GET',
                    url: `${baseUrl}/cells/${params.cell_index}/stations`,
                    headers: {
                        'X-API-KEY': apiKey,
                    },
                    json: true,
                });
            } else if (action === 'getForecastForCell') {
                if (!params.forecast_cell_index) throw new Error('Forecast Cell Index is required');
                if (!params.forecast_from) throw new Error('From Date is required');
                if (!params.forecast_to) throw new Error('To Date is required');
                if (!params.forecast_include) throw new Error('Include (daily/hourly) is required');
                responseData = await this.helpers.request({
                    method: 'GET',
                    url: `${baseUrl}/cells/${params.forecast_cell_index}/forecast`,
                    qs: {
                        from: params.forecast_from,
                        to: params.forecast_to,
                        include: params.forecast_include,
                    },
                    headers: {
                        'X-API-KEY': apiKey,
                    },
                    json: true,
                });
            }
            return this.prepareOutputData([{ json: responseData }]);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`WeatherXM Pro API error: ${error.message}`);
            }
            throw error;
        }
    }
}