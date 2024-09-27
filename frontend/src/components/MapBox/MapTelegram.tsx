import React, { useState, useEffect } from "react";
import {
  AzureMap,
  AzureMapDataSourceProvider,
  AzureMapLayerProvider,
  AzureMapsProvider,
  IAzureMapOptions,
} from "react-azure-maps";
import atlas, { AuthenticationType, TargetedEvent } from "azure-maps-control";
import telegramData from "../../data/telegramDataCleaned.json";

const UKRAINE_COORDINATES = [31.1656, 48.3794];

const option: IAzureMapOptions = {
  authOptions: {
    authType: AuthenticationType.subscriptionKey,
    subscriptionKey:
      "BdgCf1UNudRCECmqzzme1pJyug4bIrKaCXVEgRdowUUX2cPexeyRJQQJ99AIAC5RqLJyKBrLAAAgAZMPrXlN",
  },
  center: UKRAINE_COORDINATES,
  zoom: 5,
  style: "grayscale_light",
  view: "Auto",
};

const collection = generatePoints();

const getDamageColor = (damageAssessment: string) => {
  switch (damageAssessment) {
    case "Minor":
      return "rgba(255,255,0,0.8)"; // Yellow
    case "Medium":
      return "rgba(255,165,0,0.8)"; // Orange
    case "Major":
      return "rgba(255,0,0,0.8)"; // Red
    case "Other":
      return "rgba(0,0,255,0.8)"; // Blue
    case "None":
      return "rgba(0,255,0,0.8)"; // Green
    default:
      return "rgba(128,128,128,0.8)"; // Gray
  }
};

const bubbleLayerOptions = {
  radius: ["step", ["get", "point_count"], 20, 10, 30, 50, 40],
  color: [
    "step",
    ["get", "point_count"],
    "rgba(0,255,0,0.8)",
    10,
    "rgba(255,255,0,0.8)",
    50,
    "rgba(255,0,0,0.8)",
  ],
  strokeWidth: 0,
  filter: ["has", "point_count"],
};

export const MapTelegram: React.FC = () => {
  const [eventsData, setEventsData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const events = telegramData;
      setEventsData(events);
    };

    loadData();
  }, []);

  const filteredEvents = eventsData.filter(
    (event) => event.Longitude !== "N/A" && event.Latitude !== "N/A"
  );

  const handleClick = (e: TargetedEvent) => {
    console.log(e);
  };

  return (
    <div style={{ height: "100%" }}>
      <AzureMapsProvider>
        <div style={{ height: "100%" }}>
          <AzureMap options={option}>
            <AzureMapDataSourceProvider
              id="BubbleLayer DataSourceProvider"
              options={{
                cluster: true,
                clusterRadius: 3,
                clusterMaxZoom: 8,
              }}
              collection={collection}
            >
              {filteredEvents.map((event, index) => (
                <AzureMapLayerProvider
                  key={index}
                  id={`BubbleLayer-${index + 1}`}
                  options={{
                    radius: 30,
                    color: getDamageColor(event.DamageAssessment),
                  }}
                  type="BubbleLayer"
                />
              ))}
              <AzureMapLayerProvider
                id="BubbleLayer Clustered"
                options={bubbleLayerOptions}
                type="BubbleLayer"
              />
              <AzureMapLayerProvider
                id="BubbleLayer Symbols"
                options={{
                  iconOptions: {
                    image: "none",
                  },
                  textOptions: {
                    textField: ["get", "point_count_abbreviated"],
                    offset: [0, 0.4],
                  },
                }}
                type="SymbolLayer"
                events={{
                  click: handleClick,
                }}
              />
            </AzureMapDataSourceProvider>
          </AzureMap>
        </div>
      </AzureMapsProvider>
    </div>
  );
};

function generatePoints() {
  const layerData = [];

  for (const event of telegramData) {
    layerData.push(
      new atlas.data.Feature(
        new atlas.data.Point([Number(event.Longitude), Number(event.Latitude)]),
        {
          damageAssessment: event.DamageAssessment,
        }
      )
    );
  }

  return layerData;
}
