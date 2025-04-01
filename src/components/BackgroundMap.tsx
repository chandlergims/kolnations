'use client';

import React, { useState, useEffect } from "react";
import { 
  ComposableMap, 
  Geographies, 
  Geography
} from "react-simple-maps";

// US States GeoJSON data URL
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Pre-loaded static GeoJSON for immediate rendering
const staticGeoJson = {
  "type": "Topology",
  "objects": {
    "states": {
      "type": "GeometryCollection",
      "geometries": [
        {
          "type": "Polygon",
          "properties": { "name": "Placeholder" },
          "arcs": [[0, 1, 2, 3]]
        }
      ]
    }
  },
  "arcs": [
    [[0, 0], [100, 0]],
    [[100, 0], [100, 100]],
    [[100, 100], [0, 100]],
    [[0, 100], [0, 0]]
  ]
};

interface Nation {
  _id: string;
  name: string;
  founderAddress: string;
  memberCount: number;
  members: string[];
  territory?: string;
  createdAt: string;
  updatedAt: string;
}

export default function BackgroundMap() {
  const [claimedTerritories, setClaimedTerritories] = useState<{[key: string]: Nation}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [geoData, setGeoData] = useState(staticGeoJson);
  const [geoDataLoaded, setGeoDataLoaded] = useState(false);

  // Preload the GeoJSON data
  useEffect(() => {
    fetch(geoUrl)
      .then(response => response.json())
      .then(data => {
        setGeoData(data);
        setGeoDataLoaded(true);
      })
      .catch(error => {
        console.error("Error loading GeoJSON:", error);
      });
  }, []);

  // Fetch all nations and claimed territories
  useEffect(() => {
    const fetchNations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/nations");
        const data = await response.json();

        if (data.success) {
          // Build claimed territories map
          const territoriesMap: {[key: string]: Nation} = {};
          data.nations.forEach((nation: Nation) => {
            if (nation.territory) {
              territoriesMap[nation.territory] = nation;
            }
          });
          setClaimedTerritories(territoriesMap);
        }
      } catch (error) {
        console.error("Error fetching nations for background map:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNations();
  }, []);

  // Render a placeholder map while loading
  const renderPlaceholderMap = () => {
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
        <div className="w-full h-full bg-[#1a1520]">
          {/* Grid lines for visual interest */}
          <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)]">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={`v-${i}`} className="h-full border-r border-[#2d2f39] opacity-20" />
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-[repeat(20,1fr)]">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={`h-${i}`} className="w-full border-b border-[#2d2f39] opacity-20" />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // If neither GeoJSON nor API data is loaded, show a placeholder
  if (!geoDataLoaded) {
    return renderPlaceholderMap();
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
      <ComposableMap projection="geoAlbersUsa" style={{ width: "100%", height: "100%" }}>
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map(geo => {
              const stateName = geo.properties.name;
              
              // If still loading API data, show a blank map with default styling
              if (isLoading) {
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: "#1a1520", // Dark fill that blends with background
                        stroke: "#2d2f39",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      hover: {
                        fill: "#1a1520",
                        stroke: "#2d2f39",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      pressed: {
                        fill: "#1a1520",
                        stroke: "#2d2f39",
                        strokeWidth: 0.5,
                        outline: "none",
                      }
                    }}
                  />
                );
              }
              
              // If data is loaded, show the map with claimed territories
              const isClaimed = !!claimedTerritories[stateName];
              
              // Determine fill color based on claim status
              let fillColor = "#2d2f39"; // Dark grey for unclaimed
              if (isClaimed) {
                // Check if this is a user's nation by checking if it's claimed
                // Since we don't have user context here, we'll just use different colors
                const nationIndex = Object.keys(claimedTerritories).indexOf(stateName);
                if (nationIndex % 2 === 0) {
                  fillColor = "#166534"; // Darker green for some nations
                } else {
                  fillColor = "#991b1b"; // Darker red for other nations
                }
              }
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: fillColor,
                      stroke: "#2d2f39",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: fillColor,
                      stroke: "#2d2f39",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    pressed: {
                      fill: fillColor,
                      stroke: "#2d2f39",
                      strokeWidth: 0.5,
                      outline: "none",
                    }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
