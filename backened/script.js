const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let paths = {
  today: [
    {
      latitude: 17.385044,
      longitude: 78.486671,
      timestamp: "2024-08-20T10:00:00Z",
    },
    {
      latitude: 17.385045,
      longitude: 78.486672,
      timestamp: "2024-08-20T10:00:05Z",
    },
  ],
  yesterday: [
    {
      latitude: 30.704649,
      longitude: 76.717873,
      timestamp: "2024-08-20T00:00:00Z",
    },
    {
      latitude: 30.706512659547602,
      longitude: 76.72076798308807,
      timestamp: "2024-08-20T00:00:08Z",
    },
    {
      latitude: 30.708384408345022,
      longitude:76.72374375433532,
      timestamp: "2024-08-20T00:00:19Z",
    },
     {
      latitude: 30.705951270601304,
      longitude: 76.72573187846916,
      timestamp: "2024-08-20T00:00:01Z",
    },
    {
      latitude: 30.705499380663756,
      longitude: 76.72605987221932,
      timestamp: "2024-08-20T00:00:02Z",
    },
    {
      latitude: 30.704614040141298,
      longitude: 76.72634954317255,
      timestamp: "2024-08-20T00:00:03Z",
    },
    {
      latitude: 30.704058767741717,
      longitude: 76.72659575265452,
      timestamp: "2024-08-20T00:00:05Z",
    },
    {
      latitude: 30.701635520827814,
      longitude: 76.72864598909281,
      timestamp: "2024-08-20T00:00:04Z",
    },
    {
      latitude: 30.69830540642442,
      longitude: 76.7232582946609,
      timestamp: "2024-08-20T00:00:06Z",
    },
    {
      latitude: 30.704308145897446,
      longitude: 76.71814148064209,
      timestamp: "2024-08-20T00:00:07Z",
    },
    
    // {
    //   latitude: 30.706449,
    //   longitude: 76.719673,
    //   timestamp: "2024-08-20T00:00:09Z",
    // },
    // {
    //   latitude: 30.706649,
    //   longitude: 76.719873,
    //   timestamp: "2024-08-20T00:00:10Z",
    // },
    // {
    //   latitude: 30.706849,
    //   longitude: 76.720073,
    //   timestamp: "2024-08-20T00:00:11Z",
    // },
    // {
    //   latitude: 30.707049,
    //   longitude: 76.720273,
    //   timestamp: "2024-08-20T00:00:12Z",
    // },
    // {
    //   latitude: 30.707249,
    //   longitude: 76.720473,
    //   timestamp: "2024-08-20T00:00:13Z",
    // },
    // {
    //   latitude: 30.707449,
    //   longitude: 76.720673,
    //   timestamp: "2024-08-20T00:00:14Z",
    // },
    // {
    //   latitude: 30.707649,
    //   longitude: 76.720873,
    //   timestamp: "2024-08-20T00:00:15Z",
    // },
    // {
    //   latitude: 30.707849,
    //   longitude: 76.721073,
    //   timestamp: "2024-08-20T00:00:16Z",
    // },
    // {
    //   latitude: 30.708049,
    //   longitude: 76.721273,
    //   timestamp: "2024-08-20T00:00:17Z",
    // },
    // {
    //   latitude: 30.708249,
    //   longitude: 76.721473,
    //   timestamp: "2024-08-20T00:00:18Z",
    // },
  ],
};

app.get("/get-path", (req, res) => {
  const dateRange = req.query.dateRange;
  const path = paths[dateRange] || [];
  res.json({ path });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
