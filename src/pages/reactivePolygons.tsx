import { useEffect, useRef } from 'react'
import Proximiio from "proximiio-js-library";
import type Feature from 'proximiio-js-library/lib/models/feature';

export default function ReactivePolygonsDemo() {
    const mapInitiated = useRef(false);

    useEffect(() => {
        if (mapInitiated.current) return;
        mapInitiated.current = true;

        const initMap = () => {
            // Authenticate Proximiio.js library and create map instance with provided constructor options
            Proximiio.Auth.setToken(import.meta.env.VITE_PROXIMIIO_TOKEN)
                .then(() => {
                    // when authenticated create a map instance with provided constuctor options, check out library readme https://github.com/proximiio/proximiio-js-library#map-component
                    const map = new Proximiio.Map({
                        mapboxOptions: {
                            zoom: 18,
                        },
                        kioskSettings: {
                            coordinates: [0, 0],
                            level: 0,
                            pointColor: "192,55,65",
                        },
                        useRasterTiles: true,
                        apiPaginate: true,
                        defaultFloorLevel: 5,
                        initPolygons: true,
                        polygonsOptions: {
                            defaultPolygonColor: "#66C474",
                            hoverPolygonColor: "#66C474",
                            selectedPolygonColor: "#66C474",
                            defaultPolygonHeight: 1,
                            hoverPolygonHeight: 2,
                            handleDisabledPolygons: false
                        },
                        polygonLayers: [{
                            featureType: 'available'
                        }, {
                            featureType: 'occupied',
                            defaultPolygonColor: "#EC4646",
                            hoverPolygonColor: "#EC4646",
                            selectedPolygonColor: "#EC4646"
                        }]
                    });

                    map.getMapLoadListener().subscribe(() => {
                        console.log("map prepared");
                    });

                    map.getMapReadyListener().subscribe((ready) => {
                        console.log("map ready", ready);
                    });

                    map.getDataFetchedListener().subscribe(() => {
                        console.log("data fetched listener");
                    });

                    map.getPolygonClickListener().subscribe(async (feature) => {
                        const features = map.getMapState().allFeatures.features;
                        const polygon = features.find((f: Feature) => f.id.includes(feature.properties._dynamic?.polygon_id));
                        const availability = polygon.properties.type === 'available' ? 'occupied' : 'available';
                        map.updateFeature({ id: polygon.id, properties: { type: availability } });
                    });
                })
                .catch((err) => {
                    console.error("LOGIN FAILED", err);
                    setTimeout(initMap, 120e3);
                });
        };

        initMap();
    })

    return (
        <>
            <div
                id="proximiioMap"
            ></div>
        </>
    )
}