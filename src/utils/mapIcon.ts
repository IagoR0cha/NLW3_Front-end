import mapMarkerImg from '../images/marker.svg';
import L from 'leaflet';

const mapIcon = L.icon({
    iconUrl: mapMarkerImg,
    iconSize: [58, 68],
    iconAnchor: [29, 68],
    popupAnchor: [170, 2]
})

export default mapIcon;