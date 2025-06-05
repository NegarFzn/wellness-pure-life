// components/ads/AdSidebar.js
import AdBlock from "./AdBlock";

export default function AdSidebar({ adSlots = [] }) {
  return (
    <div className={classes.adSidebar}>
      {adSlots.map((slot, index) => (
        <div key={index} style={{ marginBottom: "1.5rem" }}>
          <AdBlock adSlot={slot} />
        </div>
      ))}
    </div>
  );
}
