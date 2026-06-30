import { useEffect, useRef } from 'react';
import Proximiio from 'proximiio-js-library';
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
						defaultPlaceId: '341a38ae-41d1-4951-96d4-23e18d439487',
						apiPaginate: true, // Enable paginated API requests for better performance with large datasets
						useRasterTiles: false,
						// isKiosk: kioskMode, // if enabled starting point for routing will be based on values defined in kioskSettings, if disabled findRoute methods will expect start point to be send.
						kioskSettings: {
							coordinates: [0, 0],
							level: 0,
							pointColor: '192,55,65',
						},
						customPositionOptions: {
							arrivalThreshold: 3,
							aggregationResult: 'center',
							animationMinDuration: 1500,
							animationDurationPerMeter: 500,
							animationMaxDuration: 10000,
							aggregateFloorChange: false,
						},
						// fitBoundsPadding: mapPadding, // setting the padding option to use for zooming into the bounds when route is drawn,
						handleUrlParams: true, // enable handling url params, this way you can load map with predefined route generated
						hiddenAmenities: [
							'd7e6622e-78c0-4d9d-93ec-174f2566d053:5e9fb0ec-4db3-4b09-8bdd-85b495467f11',
							'd7e6622e-78c0-4d9d-93ec-174f2566d053:bbfe62f6-7fef-4a1d-8b47-20f883491296',
							'd7e6622e-78c0-4d9d-93ec-174f2566d053:bc4806dd-4532-4f7a-bb66-f720ecbfca95',
						],
						// language: currentLang, // init with predefined language setting
						// useGpsLocation: gpsMode, // if enabled your location will be detected with geolocation API and used as a starting point for routing
						geolocationControlOptions: {
							autoTrigger: true, // if enabled map will automatically enable geolocation
							autoLocate: false, // if enabled map will automatically focus on user location
							position: 'top-right', //  position on the map to which the control will be added.
						},
						showLevelDirectionIcon: true, // if enabled arrow icon will be shown at the levelchanger indicating direction of level change along the found route
						initPolygons: true,
						polygonsOptions: {
							defaultPolygonHeight: 2,
							hoverPolygonHeight: 2,
							disabledPolygonHeight: 2,
							selectedPolygonHeight: 2,
							activePolygonHeight: 2,
							maxZoom: 40,
							labelMaxZoom: 40,
							iconMaxZoom: 40,
							opacity: 0.5,
							labelFontSize: [
								'interpolate',
								['exponential', 1.75],
								['zoom'],
								17, // Zoom level 18
								[
									'interpolate',
									['linear'],
									[
										'/',
										['get', 'length', ['get', '_dynamic']],
										['/', ['length', ['get', 'title']], 1.5],
									],
									3,
									7, // was 8
									6,
									9, // was 10
									10,
									24, // was 28
								],
								22, // Zoom level 22
								[
									'interpolate',
									['linear'],
									[
										'/',
										['get', 'length', ['get', '_dynamic']],
										['/', ['length', ['get', 'title']], 1.5],
									],
									3,
									18, // was 23
									6,
									28, // was 35
									10,
									35, // was 45
								],
							],
						},
						poiIconSize: 0.4,
						// landmarkTBTNavigation: enableLandmarkTBT,
						polygonLayers: [
							{
								featureType: 'roof',
								defaultPolygonColor: '#79c386',
								selectedPolygonColor: '#79c386',
								hoverPolygonColor: '#5da86bff',
								disabledPolygonColor: '#79c386',
								selectedLabelColor: '#ffffff',
								defaultLabelColor: '#ffffff',
							},
							{
								featureType: 'roof-occupied',
								defaultPolygonColor: '#c38179ff',
								selectedPolygonColor: '#c38179ff',
								hoverPolygonColor: '#c38179ff',
								disabledPolygonColor: '#c38179ff',
								selectedLabelColor: '#ffffff',
								defaultLabelColor: '#ffffff',
							},
							{
								featureType: 'meeting_available',
								defaultPolygonColor: '#79c386',
								selectedPolygonColor: '#5da86bff',
								hoverPolygonColor: '#5da86bff',
								disabledPolygonColor: '#79c386',
								selectedLabelColor: '#ffffff',
								defaultLabelColor: '#ffffff',
								labelFontSize: 0,
							},
							{
								featureType: 'meeting_reserved',
								defaultPolygonColor: '#c38179ff',
								selectedPolygonColor: '#a26c66ff',
								hoverPolygonColor: '#a26c66ff',
								disabledPolygonColor: '#c38179ff',
								selectedLabelColor: '#ffffff',
								defaultLabelColor: '#ffffff',
							},
						],
						routeAnimation: {
							enabled: true,
							durationMultiplier: 10,
							duration: 60,
							lineColor: '#e37259',
							type: 'point',
							pointIconSize: 0.07,
							// pointIconUrl: user,
							looping: true,
							followRoute: true,
							followRouteAngle: false,
							autoContinue: false,
						},
						blockFeatureClickWhileRouting: true,
						defaultFloorLevel: 4,
						zoomIntoPlace: false,
						autoLevelChange: false,
						bundleUrl:
							'https://proximiio.ams3.cdn.digitaloceanspaces.com/d7e6622e-78c0-4d9d-93ec-174f2566d053',
						pmTilesUrl:
							'https://mafd.ams3.cdn.digitaloceanspaces.com/gcc.pmtiles',
						bundlePaginate: true,
						considerVisibilityParam: true,
						stepsNavigation: 'simple',
					});

					map.getMapLoadListener().subscribe(() => {
						console.log('map prepared');
					});

					map.getMapReadyListener().subscribe((ready) => {
						console.log('map ready', ready);

						setTimeout(() => {
							// discovery poi id - 80f96259-ba7a-4ce0-957c-ce436af7a207
							const features = map.getMapState().allFeatures.features;
							const poi = features.find((f: Feature) =>
								f.id.includes('80f96259-ba7a-4ce0-957c-ce436af7a207'),
							);
							const polygon = features.find((f: Feature) =>
								f.id.includes(poi.properties.metadata?.polygon_id),
							);
							const availability =
								polygon.properties.type === 'meeting_available'
									? 'meeting_reserved'
									: 'meeting_available';
							map.updateFeature({
								id: polygon.id,
								properties: { type: availability },
							});
						}, 10000);
					});

					map.getDataFetchedListener().subscribe(() => {
						console.log('data fetched listener');
					});

					map.getPolygonClickListener().subscribe(async (feature) => {
						console.log('feature clicked', feature);
						const features = map.getMapState().allFeatures.features;
						const polygon = features.find((f: Feature) =>
							f.id.includes(feature.properties.metadata?.polygon_id),
						);
						const availability =
							polygon.properties.type === 'meeting_available'
								? 'meeting_reserved'
								: 'meeting_available';
						map.updateFeature({
							id: polygon.id,
							properties: { type: availability },
						});
					});
				})
				.catch((err) => {
					console.error('LOGIN FAILED', err);
					setTimeout(initMap, 120e3);
				});
		};

		initMap();
	});

	return (
		<>
			<div id='proximiioMap'></div>
		</>
	);
}
