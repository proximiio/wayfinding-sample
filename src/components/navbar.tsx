import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav style={{
            position: "fixed",
            zIndex: 10,
            padding: "1rem"
        }}>
            <Link to="/" style={{
                backgroundColor: "white",
                color: "black",
                textDecoration: "none",
                padding: ".5rem 1rem",
                borderRadius: "0.5rem",
            }}>
                Back
            </Link>
        </nav>
    );
}