//import { sendDataset } from "./index.js";
const sendDataset = require("./index").sendDataset;
const datasetCollector = require("./index").datasetCollector;

const axios = require("axios");
jest.mock("axios");

const fakeDataset_One = {
  start: 1595506316,
  end: 1595506319,
  name: "fakeDataset_One",
  timeSeries: [
    {
      data: [
        { timestamp: 1595506316, datapoint: 1 },
        { timestamp: 1595506317, datapoint: 2 },
        { timestamp: 1595506318, datapoint: 3 },
        { timestamp: 1595506319, datapoint: 4 },
      ],
      offset: 0,
      name: "u1",
      unit: "t1",
      start: 1595506316,
      end: 1595506319,
      samplingRate: 2,
    },
  ],
};

afterEach(() => {
  jest.resetAllMocks();
});

it("Sending whole dataset", async () => {
  axios.post.mockImplementation(() =>
    Promise.resolve({ data: { message: "Generated dataset" } })
  );
  var collector = await sendDataset(
    "fakeURL",
    "vHyedy6rmackO+Iz1T5+Hoznxvy+hVYq/Rwb6pFboeJxi9mioR+Evoz9KEOmSm2Avlv/HkQeZinrwqK0GlDp+Q==",
    fakeDataset_One
  );
  expect(collector).toEqual("Generated dataset");
});

describe("sending dataset in increments", () => {
  axios.post.mockImplementation(() => Promise.reject({ error: "fakeError" }));
  it("Error creating datasetCollector", async () => {
    var collector = await datasetCollector(
      "fakeURL",
      "Y8JCElwgmcFmDctyT3pV5OGnZU/nWIMF4EQLhLkYSQ6ZTaOhUD7ijVCln8KKU++B57XsmX1uQd/U76vpdIsHow=?",
      "testDataset",
      false
    );
    expect(collector.error).not.toEqual(undefined);
  });

  it("Error sending single datapoints", async () => {
    axios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: { datasetKey: "fakeDeviceKey" } })
    );

    var collector = await datasetCollector(
      "fakeURL",
      "Y8JCElwgmcFmDctyT3pV5OGnZU/nWIMF4EQLhLkYSQ6ZTaOhUD7ijVCln8KKU++B57XsmX1uQd/U76vpdIsHow==",
      false
    );
    expect(collector.error).toEqual(undefined);
    axios.post.mockReturnValue(Promise.reject("fakeError"));
    try {
      const response = await collector("accX", 1, 1618760114);
    } catch (e) {
      expect(e).toMatch("fakeError");
    }
  });

  it("Everything works as expected", async () => {
    axios.post.mockImplementationOnce(() =>
      Promise.resolve({ data: { datasetKey: "fakeDeviceKey" } })
    );

    var collector = await datasetCollector(
      "fakeURL",
      "Y8JCElwgmcFmDctyT3pV5OGnZU/nWIMF4EQLhLkYSQ6ZTaOhUD7ijVCln8KKU++B57XsmX1uQd/U76vpdIsHow==",
      false
    );
    expect(collector.error).toEqual(undefined);
    axios.post.mockImplementation(() =>
      Promise.resolve({ data: { message: "Added data" } })
    );

    try {
      for (var i = 0; i < 10; i++) {
        collector("accX", 1, 1618760114).then((data) => {
          expect(data).toEqual(undefined);
        });
      }
    } catch (e) {
      fail(e)
    }
  });
});
