import { AzureMapsProvider } from "react-azure-maps";
import { MapTelegram } from "./MapTelegram.tsx";

export function TelegramBox() {
  return (
    <>
      <AzureMapsProvider>
        <MapTelegram />
      </AzureMapsProvider>
    </>
  );
}
