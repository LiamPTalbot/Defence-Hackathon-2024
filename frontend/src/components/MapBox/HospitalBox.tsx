import { AzureMapsProvider } from "react-azure-maps";
import MapHospital from "./MapHospital.tsx";

export function HospitalBox() {
  return (
    <>
      <AzureMapsProvider>
        <MapHospital />
      </AzureMapsProvider>
    </>
  );
}
