import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import cloudflareLogo from './assets/Cloudflare_Logo.svg'
import './App.css'

function App() {
	// WebSocket Counter (Real-time)
	const [wsCount, setWsCount] = useState(0)
	const [socket, setSocket] = useState<WebSocket | null>(null)
	const [wsStatus, setWsStatus] = useState('connecting...')

	// HTTP Counter (Traditional REST)
	const [httpCount, setHttpCount] = useState(0)
	const [httpLoading, setHttpLoading] = useState(false)

	// API info
	const [apiInfo, setApiInfo] = useState('unknown')

	useEffect(() => {
		// Setup WebSocket for real-time counter
		const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
		const wsUrl = `${wsProtocol}//${window.location.host}/api/counter/ws`
		const ws = new WebSocket(wsUrl)

		ws.onopen = () => {
			console.log('WebSocket connected')
			setSocket(ws)
			setWsStatus('connected')
		}

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data)
			if (data.type === 'update') {
				setWsCount(data.value)
			}
		}

		ws.onclose = () => {
			console.log('WebSocket disconnected')
			setSocket(null)
			setWsStatus('disconnected')
		}

		ws.onerror = () => {
			setWsStatus('error')
		}

		// Load initial HTTP counter value
		loadHttpCounter()

		return () => {
			ws.close()
		}
	}, [])

	const loadHttpCounter = async () => {
		try {
			const response = await fetch('/api/counter2/value')
			const data = await response.json()
			setHttpCount(data.value)
		} catch (error) {
			console.error('Failed to load HTTP counter:', error)
		}
	}

	const incrementWs = () => {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify({ type: 'increment' }))
		}
	}

	const incrementHttp = async () => {
		setHttpLoading(true)
		try {
			const response = await fetch('/api/counter2/increment')
			const data = await response.json()
			setHttpCount(data.value)
		} catch (error) {
			console.error('Failed to increment HTTP counter:', error)
		} finally {
			setHttpLoading(false)
		}
	}

	const decrementHttp = async () => {
		setHttpLoading(true)
		try {
			const response = await fetch('/api/counter2/decrement')
			const data = await response.json()
			setHttpCount(data.value)
		} catch (error) {
			console.error('Failed to decrement HTTP counter:', error)
		} finally {
			setHttpLoading(false)
		}
	}

	const resetHttp = async () => {
		setHttpLoading(true)
		try {
			const response = await fetch('/api/counter2/reset')
			const data = await response.json()
			setHttpCount(data.currentValue)
		} catch (error) {
			console.error('Failed to reset HTTP counter:', error)
		} finally {
			setHttpLoading(false)
		}
	}

	return (
		<>
			<div>
				<a href='https://vite.dev' target='_blank'>
					<img src={viteLogo} className='logo' alt='Vite logo' />
				</a>
				<a href='https://react.dev' target='_blank'>
					<img src={reactLogo} className='logo react' alt='React logo' />
				</a>
				<a href='https://workers.cloudflare.com/' target='_blank'>
					<img src={cloudflareLogo} className='logo cloudflare' alt='Cloudflare logo' />
				</a>
			</div>
			<h1>Hono + Durable Objects Counter Showcase</h1>
			<p className='read-the-docs'>
				Compare WebSocket vs HTTP counter patterns
			</p>

			<div className="counter-showcase">
				{/* WebSocket Counter */}
				<div className='card counter-card' style={{ 
					background: 'linear-gradient(135deg, #4ade80, #22c55e)', 
					border: '2px solid #16a34a', 
					color: '#fff' 
				}}>
					<h2>WebSocket Counter (Real-time)</h2>
					<p style={{ 
						fontSize: '1.1em', 
						color: '#fff', 
						fontWeight: 'bold'
					}}>
						<span className={`status-indicator ${socket?.readyState === WebSocket.OPEN ? 'status-connected' : 'status-disconnected'}`}></span>
						{wsStatus}
					</p>
					<div className="counter-value" style={{ 
						color: '#fff',
						fontSize: '3rem',
						fontWeight: 'bold'
					}}>
						{wsCount}
					</div>
					<button
						onClick={incrementWs}
						disabled={!socket || socket.readyState !== WebSocket.OPEN}
						className="counter-button"
						style={{ 
							backgroundColor: socket?.readyState === WebSocket.OPEN ? '#fff' : '#666',
							color: socket?.readyState === WebSocket.OPEN ? '#16a34a' : '#ccc',
							fontSize: '1.1rem',
							fontWeight: 'bold',
							border: '2px solid #fff',
							boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
						}}
					>
						+1
					</button>
					<div style={{ 
						marginTop: '1rem', 
						fontSize: '1em', 
						color: '#fff'
					}}>
						<strong style={{ fontSize: '1.1em' }}>Behavior:</strong>
						<ul className="behavior-list" style={{ fontSize: '1em' }}>
							<li>Real-time updates</li>
							<li>Broadcasts to all connected clients</li>
							<li>Persistent WebSocket connection</li>
							<li>Updates automatically from other clients</li>
						</ul>
					</div>
				</div>

				{/* HTTP Counter */}
				<div className='card counter-card' style={{ 
					background: 'linear-gradient(135deg, #f97316, #ea580c)', 
					border: '2px solid #c2410c', 
					color: '#fff' 
				}}>
					<h2>HTTP Counter (Traditional REST)</h2>
					<p style={{ 
						fontSize: '1.1em', 
						color: '#fff', 
						fontWeight: 'bold'
					}}>
						<span className={`status-indicator ${httpLoading ? 'status-disconnected' : 'status-connected'}`}></span>
						{httpLoading ? 'Loading...' : 'Ready'}
					</p>
					<div className="counter-value" style={{ 
						color: '#fff',
						fontSize: '3rem',
						fontWeight: 'bold'
					}}>
						{httpCount}
					</div>
					<div className="button-group">
						<button
							onClick={incrementHttp}
							disabled={httpLoading}
							className="counter-button"
							style={{ 
								backgroundColor: '#fff',
								color: '#c2410c',
								fontWeight: 'bold',
								border: '2px solid #fff',
								boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
							}}
						>
							+1
						</button>
						<button
							onClick={decrementHttp}
							disabled={httpLoading}
							className="counter-button"
							style={{ 
								backgroundColor: '#dc2626',
								color: '#fff',
								fontWeight: 'bold',
								border: '2px solid #fff',
								boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
							}}
						>
							-1
						</button>
						<button
							onClick={resetHttp}
							disabled={httpLoading}
							className="counter-button"
							style={{ 
								backgroundColor: '#374151',
								color: '#fff',
								fontWeight: 'bold',
								border: '2px solid #fff',
								boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
							}}
						>
							Reset
						</button>
					</div>
					<div style={{ 
						marginTop: '1rem', 
						fontSize: '1em', 
						color: '#fff'
					}}>
						<strong style={{ fontSize: '1.1em' }}>Behavior:</strong>
						<ul className="behavior-list" style={{ fontSize: '1em' }}>
							<li>Request-response pattern</li>
							<li>Manual refresh needed</li>
							<li>Stateless HTTP calls</li>
							<li>Traditional REST API</li>
						</ul>
					</div>
				</div>
			</div>

			{/* API Info */}
			<div className='card' style={{ marginTop: '2rem' }}>
				<button
					onClick={() => {
						fetch('/api/')
							.then((res) => res.json() as Promise<{ name: string; timestamp: string }>)
							.then((data) => setApiInfo(`${data.name} - ${data.timestamp}`))
					}}
					aria-label='get api info'
				>
					API Info: {apiInfo}
				</button>
				<p style={{ fontSize: '0.9em', color: '#888', marginTop: '0.5rem' }}>
					Test the structured Hono pattern with Variables
				</p>
			</div>

			<div className="test-instructions" style={{ fontSize: '1.1em' }}>
				<h3 style={{ fontSize: '1.3em' }}>Test Instructions:</h3>
				<ol style={{ fontSize: '1.05em' }}>
					<li>Open this page in multiple browser tabs</li>
					<li>Click "Increment WebSocket" in one tab → Watch all tabs update automatically</li>
					<li>Click HTTP counter buttons → Only current tab updates</li>
					<li>Refresh page → HTTP counter persists, WebSocket reconnects</li>
					<li>Check browser console for request tracking logs (with unique IDs)</li>
				</ol>
			</div>
		</>
	)
}

export default App
