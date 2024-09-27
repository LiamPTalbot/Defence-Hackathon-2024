import React, { useState, useEffect } from "react";
import {
  AzureMap,
  AuthenticationType,
  useAzureMaps,
  AzureMapHtmlMarker,
  AzureMapPopup,
  IAzureMapControls,
} from "react-azure-maps";
import atlas, {
  CameraOptions,
  ControlPosition,
  HtmlMarker,
  TargetedEvent,
} from "azure-maps-control";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import "./Map.css";

const UKRAINE_COORDINATES = [31.1656, 48.3794];
const UKRAINE_MAX_BOUNDS = [21.049805, 43.580391, 41.748047, 53.041213];

const option = {
  authOptions: {
    authType: AuthenticationType.subscriptionKey,
    subscriptionKey:
      "BdgCf1UNudRCECmqzzme1pJyug4bIrKaCXVEgRdowUUX2cPexeyRJQQJ99AIAC5RqLJyKBrLAAAgAZMPrXlN",
  },
};

const controls: IAzureMapControls = {
  controlName: "StyleControl",
  controlOptions: { mapStyles: "all" },
  options: { position: ControlPosition.BottomRight },
};

type PowerPlant = {
  id: string;
  Type: string;
  "Power Plant": string;
  Status: string;
  "Output (kW)": number;
  Latitude: number;
  Longitude: number;
  reportedAttacks: Array<object>;
};

type MapPoint = {
  id: string;
  latitude: number;
  longitude: number;
  shortLocationName: string;
  title: string;
  type: string;
  status: string;
  output: number;
  colour: string;
  reportedAttackCount: number;
};

interface MapProps {
  view: string;
  isDecommissioned: boolean;
  reportedAttacks: boolean;
}

const Marker = (id: string, colour: string) => {
  return (
    <div
      className="circle-marker"
      style={{
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        backgroundColor: colour,
        border: "3px solid white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
      }}
      data-id={id}
    >
      <div
        className="circle-marker"
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: "white",
        }}
      ></div>
    </div>
  );
};

const Map = ({ view, isDecommissioned, reportedAttacks }: MapProps) => {
  const [mapCamera, setMapCamera] = useState(() => {
    const { search } = window.location;
    const searchParams = new URLSearchParams(search);

    const latitude = Number(searchParams.get("latitude"));
    const longitude = Number(searchParams.get("longitude"));
    const zoom = Number(searchParams.get("zoom"));

    const camera: CameraOptions = {
      zoom: 5,
      center: UKRAINE_COORDINATES,
      bearing: 0,
      pitch: 0,
      maxBounds: UKRAINE_MAX_BOUNDS,
    };

    if (latitude && longitude) {
      camera.center = [longitude, latitude];
    }

    if (zoom) {
      camera.zoom = zoom;
    }

    return camera;
  });

  const { mapRef, isMapReady } = useAzureMaps();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState([0, 0]);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint>();
  const [mapPoints, setmapPoints] = useState<MapPoint[]>([]);

  const MarkerPoints = (): React.ReactNode => {
    return mapPoints.map((point) => {
      return (
        <AzureMapHtmlMarker
          id={point.id}
          key={point.id}
          options={{
            position: [point.longitude, point.latitude],
            anchor: "center",
          }}
          markerContent={Marker(point.id, point.colour)}
          events={[
            {
              eventName: "click",
              callback: handleClick,
            },
          ]}
        />
      );
    });
  };

  useEffect(() => {
    const getMarkerColours = (status: string, reportedAttackCount: number) => {
      if (isDecommissioned && status === "Decommissioned") {
        return "red";
      }
      if (reportedAttacks && reportedAttackCount > 1) {
        return "red";
      }
      if (reportedAttacks && reportedAttackCount > 0) {
        return "gold";
      }
      if (reportedAttacks) {
        return "green";
      }
      return "green";
    };

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/cni");
        const data: PowerPlant[] = await response.json();

        const filteredData =
          view === "All" ? data : data.filter((plant) => plant.Type === view);

        const points = filteredData.map((plant) => {
          return {
            id: plant.id,
            latitude: plant.Latitude,
            longitude: plant.Longitude,
            shortLocationName:
              plant["Power Plant"].length <= 20
                ? plant["Power Plant"]
                : `${plant["Power Plant"].substring(0, 20)}...`,
            title: plant["Power Plant"],
            type: plant.Type,
            status: plant.Status,
            output: plant["Output (kW)"],
            colour: getMarkerColours(
              plant.Status,
              plant.reportedAttacks?.length
            ),
            reportedAttackCount: plant.reportedAttacks?.length || 0,
          };
        });

        setmapPoints(points);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [view, isDecommissioned, reportedAttacks]);

  const resetView = () => {
    setMapCamera({
      ...mapCamera,
      center: UKRAINE_COORDINATES,
      zoom: 5,
      pitch: 0,
      bearing: 0,
    });
  };

  useEffect(() => {
    if (isMapReady && mapRef) mapRef.setCamera(mapCamera);
  }, [isMapReady, mapCamera, mapRef]);

  const handleClick = (e: TargetedEvent) => {
    console.log(e);

    const selectedMarker = e.target as HtmlMarker;

    const markerHtml = selectedMarker.getElement().firstElementChild;

    console.log(selectedMarker.getOptions().position);

    const position = selectedMarker.getOptions()
      .position as atlas.data.Position;

    const markerId = markerHtml?.getAttribute("data-id");

    console.log(markerId);

    setSelectedPoint(mapPoints.find((element) => element.id === markerId));
    setPopupVisible(true);
    setPopupPosition(position);
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  const displayPointData = () => {
    if (selectedPoint) {
      return (
        <>
          <p>Type: {selectedPoint.type}</p>
          <p>Power Plant: {selectedPoint.title}</p>
          <p>Status: {selectedPoint.status}</p>
          <p>Output (kW): {selectedPoint.output}</p>
          <p>Longitude: {selectedPoint.longitude}</p>
          <p>Latitude: {selectedPoint.latitude}</p>
          <p>Reported Attack Count: {selectedPoint.reportedAttackCount}</p>
        </>
      );
    }
  };

  return (
    <>
      <div className="map-controls">
        <Button
          variant="contained"
          onClick={resetView}
          className="reset-button"
        >
          Reset to Default View
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              onChange={(e) => {
                setMapCamera({
                  ...mapCamera,
                  maxBounds: e.target.checked ? UKRAINE_MAX_BOUNDS : undefined,
                });
              }}
            />
          }
          label="Constrain bounds"
        />
      </div>
      <div style={{ height: "100%", overflow: "hidden" }}>
        <AzureMap options={option} controls={[controls]}>
          <MarkerPoints />
          <AzureMapPopup
            isVisible={popupVisible}
            options={{ position: popupPosition }}
            popupContent={
              <div
                style={{
                  padding: "20px",
                  textAlign: "left",
                  maxWidth: "250px",
                  color: "black",
                  textWrap: "wrap",
                }}
              >
                {displayPointData()}
              </div>
            }
            events={[
              {
                eventName: "close",
                callback: handlePopupClose,
              },
            ]}
          />
        </AzureMap>
      </div>
    </>
  );
};

export default Map;
