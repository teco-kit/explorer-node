# explorer-node
![Tests](https://github.com/teco-kit/explorer-node/actions/workflows/nodeTest.yml/badge.svg)

Node library for https://github.com/teco-kit/explorer. Can be used to upload datasets as whole or incrementally.


## How to use

#### Upload datasets as a whole

```js
const sendDataset = require("./index").sendDataset;

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
const datasetCollector = require("./index").datasetCollector;

// Generate collector function
const collector = await sendDataset(
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
collector(timeSeriesName="sensorName", datapoint=1.23, timestamp=1618760114)
.then(() => 
  // Success case
).catch(err => 
  // Error case
  console.log(err));
```
