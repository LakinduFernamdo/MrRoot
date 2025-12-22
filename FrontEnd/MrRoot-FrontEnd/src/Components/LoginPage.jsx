import "../Leaflet/Loginpage.css";

export default function LoginPage() {

  const connectToGoogleServer = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  }

  return (
    <div className="full-page">
      <div className="signin-part">
        <h1>Sign in with Google</h1>
      </div>

      <div className="login-part">
        <button className="login-button" onClick={connectToGoogleServer}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
            className="google-icon"
          />
          Login with Google
        </button>

      </div>
      <footer class="footer">
        <p>© 2025 Lakindu Fernando. This is an individual project.</p>
      </footer>

    </div>
  );
}
