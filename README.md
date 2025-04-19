# WeatherXM Pro API Community n8n Node

This is a community node for [n8n](https://n8n.io/) that integrates with the [WeatherXM Pro API](https://pro.weatherxm.com/docs). It allows you to interact with WeatherXM Pro services to retrieve weather data and perform other API operations.

## Features

- Fetch real-time weather data.
- Access historical weather information.
- Integrate WeatherXM Pro API with your n8n workflows.

## Requirements

- API key from WeatherXM Pro.

## Installation

1. Clone this repository into your n8n custom nodes directory:
   ```bash
   git clone https://github.com/JohnFrontzos/n8n-nodes-wxm-pro.git
   ```
2. Install dependencies and build the node:
   ```bash
   cd /path/to/n8n/custom/nodes/wxm-pro
   npm install
   npm run build
   ```
3. Restart your n8n instance.

## Configuration

1. Obtain your API key from the [WeatherXM Pro API dashboard](https://pro.weatherxm.com/api-management).
2. Configure the node in your n8n workflow with the API key and other required parameters.

## Usage

1. Add the WeatherXM Pro node to your n8n workflow.
2. Configure the node with the required inputs, such as API key and endpoint parameters.
3. Execute the workflow to interact with the WeatherXM Pro API.

### Example Workflow

```
{
  "nodes": [
    {
      "parameters": {
        "action": "getStationsNear",
        "lat": 40.76,
        "lon": -73.98,
        "radius": 1000
      },
      "name": "WeatherXM Pro",
      "type": "n8n-nodes-weatherxm-pro.WeatherXMPro",
      "typeVersion": 1,
      "position": [450, 300],
      "credentials": {
        "weatherXMProApi": {
          "apiKey": "YOUR_API_KEY"
        }
      }
    }
  ]
}
```

## Build

To build the node after making changes:

```bash
npm install
npm run build
```

## Documentation

For detailed API documentation, visit the [WeatherXM Pro API Docs](https://pro.weatherxm.com/docs).


## License

This project is licensed under the MIT License.