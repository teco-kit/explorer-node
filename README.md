# explorer-node

Node library for https://github.com/teco-kit/explorer. Can be used to upload datasets as whole or incrementally.

![Tests](https://github.com/teco-kit/explorer-node/actions/workflows/nodeTest.yml/badge.svg)

## How to use

#### Installation
The library can be installed from npm
```bash
npm i explorer-node
```

#### Upload datasets as a whole

```js
const sendDataset = require("explorer-node").sendDataset;

sendDataset(
url="explorerBackendUrl",
key="deviceApiKey",
dataset=dataset)
.then(msg => 
  // Handle success
  console.log(msg))
.catch(err => 
 // Handle error
 console.log(err));
```

#### Upload datasets in increments

###### 1. Generate collector-function
```js
const datasetCollector = require("explorer-node").datasetCollector;

// Generate collector function
const collector = await datasetCollector(
url="explorerBackendUrl", key="deviceApiKey",
useServerTime=false // true if you want to use servertime
);
if (!collector.error) {
  // Error occurred, cannot use the collector as a function to upload datasetincrements
  console.log(collector.error);
  return;
}
```
###### 2. Use collector function to upload data

```js
// Timestamp will be ignored if you specified serverTime=true in datasetCollector 
collector(timeSeriesName="sensorName", datapoint=1.23, timestamp=1618760114)
.then(() => 
  // Success case
).catch(err => 
  // Error case
  console.log(err));
```


