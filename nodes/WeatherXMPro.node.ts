import { INodeType, INodeTypeDescription, IExecuteFunctions, IDataObject, INodeProperties, NodeConnectionType } from 'n8n-workflow';

export class WeatherXMPro implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'WeatherXM Pro',
        name: 'weatherXMPro',
        group: ['transform', 'aiTools'], // Added aiTools group for AI discoverability
        version: 2,
        description: 'Interact with the WeatherXM Pro API.\n\nThis node is AI Tool enabled: it exposes all WeatherXM Pro API endpoints as actions, making it easy for AI agents to fetch weather data, station info, and forecasts.\n\nExample usage:\n- Get the latest observation for a station\n- Find stations near a location\n- Get weather forecast for a cell',
        icon: 'file:weatherxm.svg',
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
                        description: 'Fetch the latest weather observation for a specific station. Useful for real-time weather monitoring and dashboards.'
                    },
                    {
                        name: 'Observation: Get Historical Observations',
                        value: 'getHistoricalObservations',
                        description: 'Fetch historical weather observations for a station and date. Useful for analytics, reporting, and trend analysis.'
                    },
                    {
                        name: 'Stations: Get Stations Near',
                        value: 'getStationsNear',
                        description: 'Get stations within a radius from a location (latitude/longitude). Useful for finding the nearest weather stations to a point of interest.'
                    },
                    {
                        name: 'Stations: Get Stations in Bounding Box',
                        value: 'getStationsBounds',
                        description: 'Get stations within a bounding box (min/max latitude/longitude). Useful for mapping and regional analysis.'
                    },
                    {
                        name: 'Stations: Get All Stations',
                        value: 'getAllStations',
                        description: 'Get all available stations in the WeatherXM Pro network. Useful for listing or indexing all stations.'
                    },
                    {
                        name: 'Stations: Get Stations in Cell',
                        value: 'getStationsInCell',
                        description: 'Get all stations in a specific H3 cell. Useful for spatial queries and grid-based analysis.'
                    },
                    {
                        name: 'Cells: Search for Cell in Region',
                        value: 'searchCellsInRegion',
                        description: 'Search for H3 cells by region name (e.g., city, state). Useful for finding cells covering a named region.'
                    },
                    {
                        name: 'Forecast: Get Forecast for a Cell',
                        value: 'getForecastForCell',
                        description: 'Get weather forecast (daily/hourly) for a specific H3 cell. Useful for predictive analytics and planning.'
                    },
                ],
                default: 'getStationsNear',
                description: 'Select an action to perform. Each action corresponds to a WeatherXM Pro API endpoint.'
            },
            {
                displayName: 'Station ID',
                name: 'station_id',
                type: 'string',
                default: '1234567890abcdef',
                displayOptions: {
                    show: {
                        action: ['getLatestObservation', 'getHistoricalObservations']
                    }
                },
                description: 'The unique identifier of the station. Example: "1234567890abcdef"'
            },
            {
                displayName: 'Date',
                name: 'date',
                type: 'string',
                default: '2024-04-01',
                displayOptions: {
                    show: {
                        action: ['getHistoricalObservations']
                    }
                },
                description: 'Date (YYYY-MM-DD) for historical observations. Example: "2024-04-01"'
            },
            {
                displayName: 'Latitude',
                name: 'lat',
                type: 'number',
                default: 51.5074,
                displayOptions: {
                    show: {
                        action: ['getStationsNear']
                    }
                },
                description: 'Latitude of the center of the area. Example: 51.5074 (London, UK)'
            },
            {
                displayName: 'Longitude',
                name: 'lon',
                type: 'number',
                default: -0.1278,
                displayOptions: {
                    show: {
                        action: ['getStationsNear']
                    }
                },
                description: 'Longitude of the center of the area. Example: -0.1278 (London, UK)'
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
                description: 'Radius (in meters) for which stations are queried. Example: 1000 (1km)'
            },
            {
                displayName: 'Min Latitude',
                name: 'min_lat',
                type: 'number',
                default: 37.9,
                displayOptions: {
                    show: {
                        action: ['getStationsBounds']
                    }
                },
                description: 'Minimum latitude of the bounding box. Example: 37.9'
            },
            {
                displayName: 'Min Longitude',
                name: 'min_lon',
                type: 'number',
                default: 23.7,
                displayOptions: {
                    show: {
                        action: ['getStationsBounds']
                    }
                },
                description: 'Minimum longitude of the bounding box. Example: 23.7'
            },
            {
                displayName: 'Max Latitude',
                name: 'max_lat',
                type: 'number',
                default: 38.0,
                displayOptions: {
                    show: {
                        action: ['getStationsBounds']
                    }
                },
                description: 'Maximum latitude of the bounding box. Example: 38.0'
            },
            {
                displayName: 'Max Longitude',
                name: 'max_lon',
                type: 'number',
                default: 23.8,
                displayOptions: {
                    show: {
                        action: ['getStationsBounds']
                    }
                },
                description: 'Maximum longitude of the bounding box. Example: 23.8'
            },
            {
                displayName: 'Region Name',
                name: 'region_query',
                type: 'string',
                default: 'London',
                displayOptions: {
                    show: {
                        action: ['searchCellsInRegion']
                    }
                },
                description: 'The name of the region to search for cells. Example: "London"'
            },
            {
                displayName: 'Cell Index',
                name: 'cell_index',
                type: 'string',
                default: '8928308280fffff',
                displayOptions: {
                    show: {
                        action: ['getStationsInCell']
                    }
                },
                description: 'The H3 index of the cell to return stations for. Example: "8928308280fffff"'
            },
            {
                displayName: 'Forecast Cell Index',
                name: 'forecast_cell_index',
                type: 'string',
                default: '8928308280fffff',
                displayOptions: {
                    show: {
                        action: ['getForecastForCell']
                    }
                },
                description: 'The H3 index of the cell to get forecast for. Example: "8928308280fffff"'
            },
            {
                displayName: 'From Date',
                name: 'forecast_from',
                type: 'string',
                default: '2024-04-01',
                displayOptions: {
                    show: {
                        action: ['getForecastForCell']
                    }
                },
                description: 'The first day for which to get forecast data (YYYY-MM-DD). Example: "2024-04-01"'
            },
            {
                displayName: 'To Date',
                name: 'forecast_to',
                type: 'string',
                default: '2024-04-07',
                displayOptions: {
                    show: {
                        action: ['getForecastForCell']
                    }
                },
                description: 'The last day for which to get forecast data (YYYY-MM-DD). Example: "2024-04-07"'
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
                description: 'Types of forecast to include. Choose "daily" for daily summaries or "hourly" for detailed hourly forecasts.'
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