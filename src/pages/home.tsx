import { Link } from "react-router-dom";

export default function Home() {

    return (
        <div>
            <h1>Proximi.io samples:</h1>
            <ul>
                <li><Link to="/base">Base Demo</Link></li>
                <li><Link to="/reactive-polygons">Reactive Polygons Demo</Link></li>
            </ul>
        </div>
    );
}