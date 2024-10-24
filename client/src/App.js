import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChartComponent from './components/Chartcomponent';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './App.css';

const App = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (shortUrl) {
      fetchAnalytics();
    }
  }, [shortUrl]);

  const shortenUrl = async () => {
    try {
      const response = await axios.post('/url', { url, expiresAt });
      const fullShortUrl = `http://localhost:8001/${response.data.id}`;
      setShortUrl(fullShortUrl);
      setQrCode(response.data.qrCode);
      setAnalytics(null);
    } catch (error) {
      console.error('Error shortening URL:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const shortId = shortUrl.split('/').pop();
      const response = await axios.get(`/url/analytics/${shortId}`);
      setAnalytics(response.data);
      const originalLinkResponse = await axios.get(`/${shortId}`);
      setOriginalUrl(originalLinkResponse.data.redirectURL);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    try {
      const response = await axios.post('http://localhost:8001/user/login', { username: email, password });
      console.log(response);
      setUser({ name: email }); 
      setShowLogin(false);
      setAuthError('');
    } catch (error) {
      setAuthError('Invalid email or password');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    // Add your signup logic here
    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await axios.post('http://localhost:8001/user/register', { username: email, password });
      setShowSignup(false);
      setAuthError('');
    } catch (error) {
      setAuthError('Error signing up, please try again');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark  shadow">
        <div className="container">
          <a className="navbar-brand" href="#">URL Shortener</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="ms-auto">
              {!user ? (
                <>
                  <button onClick={() => setShowLogin(true)} className="btn  loginbtn btn-link" >Login</button>
                  <button onClick={() => setShowSignup(true)} className="btn btn-primary">Sign Up</button>
                </>
              ) : (
                <div className="d-flex align-items-center">
                  <span className="me-3">Welcome, {user.name}</span>
                  <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container my-4">
        <div className="max-w-3xl mx-auto">
          {/* URL Shortener Form */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Shorten Your URL</h5>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Enter URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="form-control"
                />
              </div>
              <button onClick={shortenUrl} className="btn btn-primary">Shorten URL</button>
            </div>
          </div>

          {/* Shortened URL Display */}
          {shortUrl && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Shortened URL:</h5>
                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-primary">{shortUrl}</a>
              </div>
            </div>
          )}

          {/* QR Code Display */}
          {qrCode && (
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">QR Code:</h5>
                <img src={qrCode} alt="QR Code" className="img-fluid mx-auto" />
              </div>
            </div>
          )}

          {/* Analytics Section */}
          {shortUrl && (
            <button onClick={fetchAnalytics} className="btn btn-secondary mb-4">Show Analytics</button>
          )}

          {analytics && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Total Clicks: {analytics.totalClicks}</h5>
                <h5 className="card-title">
                  Original URL:{" "}
                  <a href={originalUrl} target="_blank" rel="noopener noreferrer" className="text-primary">
                    {originalUrl}
                  </a>
                </h5>
                <ChartComponent data={analytics.analytics.map((visit, index) => ({
                  timestamp: new Date(visit.timestamp).toLocaleString(),
                  clicks: index + 1,
                }))} />
                <h6 className="mt-4">Visit History:</h6>
                <ul className="list-group">
                  {analytics.analytics.map((visit, index) => (
                    <li key={index} className="list-group-item">
                      {new Date(visit.timestamp).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login</h5>
                <button type="button" className="btn-close" onClick={() => setShowLogin(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" required className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" name="password" required className="form-control" />
                  </div>
                  {authError && (
                    <div className="text-danger">{authError}</div>
                  )}
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowLogin(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Login</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sign Up</h5>
                <button type="button" className="btn-close" onClick={() => setShowSignup(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSignup}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" name="fullName" required className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" required className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" name="password" required className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input type="password" name="confirmPassword" required className="form-control" />
                  </div>
                  {authError && (
                    <div className="text-danger">{authError}</div>
                  )}
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowSignup(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
