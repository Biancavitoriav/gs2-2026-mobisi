export const API_LOADING_GIF =
  "https://prodigits.co.uk/pthumbs/screensavers/down/misc/loading_noehu7zw.gif";

export function ApiLoadingImage({ className = "" }) {
  return (
    <img
      className={`api-loading-gif ${className}`.trim()}
      src={API_LOADING_GIF}
      alt=""
      aria-hidden="true"
    />
  );
}

export default function ApiLoading({ message }) {
  return (
    <div className="api-loading" role="status" aria-live="polite">
      <ApiLoadingImage />
      <p>{message}</p>
    </div>
  );
}
