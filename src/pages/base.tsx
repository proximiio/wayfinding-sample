import { useEffect, useRef } from 'react'
import Proximiio from "proximiio-js-library";

export default function BaseDemo() {
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
                        initPolygons: false,
                    });

                    map.getMapLoadListener().subscribe(() => {
                        console.log("map prepared");
                    });

                    map.getMapReadyListener().subscribe((ready) => {
                        console.log("map ready", ready);

                        map.getMapboxInstance().on('click', function (e) {
                            // Get all features at the clicked point
                            const features = map.getMapboxInstance().queryRenderedFeatures(e.point);
                            const firstFeature = features[0];

                            if (firstFeature && firstFeature.id && firstFeature.layer.id.includes('proximiio-parking')) {
                                const availability = firstFeature.properties.type === 'available' ? 'occupied' : 'available';
                                map.updateFeature({ id: firstFeature.id as string, properties: { type: availability } });
                            }
                        });
                    });

                    map.getDataFetchedListener().subscribe(() => {
                        console.log("data fetched listener");
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