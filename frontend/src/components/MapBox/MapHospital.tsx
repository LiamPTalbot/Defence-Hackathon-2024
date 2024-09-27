import { useState, useEffect } from "react";
import {
  AzureMap,
  AzureMapLayerProvider,
  AuthenticationType,
  AzureMapDataSourceProvider,
  IAzureMapControls,
  IAzureMapOptions,
} from "react-azure-maps";
import atlas, { ControlPosition } from "azure-maps-control";
import hospitalData from "../../data/telegramDataCleaned.json";

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

const controls: IAzureMapControls = {
  controlName: "StyleControl",
  controlOptions: { mapStyles: "all" },
  options: { position: ControlPosition.BottomRight },
};

type Hospital = {
  Name: string;
  Longitude: number;
  Latitude: number;
};

const MapHospital = () => {
  const [layerData, setLayerData] = useState<
    atlas.data.Feature<atlas.data.Point, Hospital>[]
  >([]);

  useEffect(() => {
    const loadData = () => {
      // @ts-ignore
      const points = hospitalData.map((hospital: Hospital) => {
        return new atlas.data.Feature(
          new atlas.data.Point([hospital.Longitude, hospital.Latitude]),
          {
            Name: hospital.Name,
          }
        );
      });
      // @ts-ignore
      setLayerData(points);
    };

    loadData();
  }, []);

  return (
    <div style={{ height: "600px" }}>
      <AzureMap options={option} controls={[controls]}>
        <AzureMapDataSourceProvider
          id="hospitalDataSource"
          collection={layerData}
        >
          <AzureMapLayerProvider
            type="SymbolLayer"
            options={{
              iconOptions: {
                image: "pin-round-blue",
                size: 1.3,
                anchor: "center",
                offset: [0, 0],
              },
            }}
          />
        </AzureMapDataSourceProvider>
      </AzureMap>
    </div>
  );
};

export default MapHospital;
