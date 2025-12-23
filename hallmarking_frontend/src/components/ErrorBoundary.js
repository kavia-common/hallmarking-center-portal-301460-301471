import { Component } from "react";

// PUBLIC_INTERFACE
export class ErrorBoundary extends Component {
  /** Catches render-time errors to avoid crashing the entire app. */
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || "Something went wrong." };
  }
  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <main className="main">
          <div className="container" style={{ padding: "1.5rem 0" }}>
            <div className="status error" role="alert">
              {this.state.errorMessage}
            </div>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
