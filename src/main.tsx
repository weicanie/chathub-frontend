import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import APP from './views/APP';

createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<APP></APP>
	</BrowserRouter>
);
