import { Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import BaseDemo from './pages/base';
import ReactivePolygonsDemo from './pages/reactivePolygons';
import MultipleSelectDemo from './pages/multipleSelect';
import Navbar from './components/navbar';

function App() {
	function Layout() {
		return (
			<>
				<Navbar />
				<Outlet /> {/* Renders the active page */}
			</>
		);
	}

	return (
		<Routes>
			<Route>
				<Route path='/' element={<Home />} />
			</Route>
			<Route element={<Layout />}>
				<Route path='/base' element={<BaseDemo />} />
				<Route path='/reactive-polygons' element={<ReactivePolygonsDemo />} />
				<Route path='/multiple-select' element={<MultipleSelectDemo />} />
			</Route>
		</Routes>
	);
}

export default App;
