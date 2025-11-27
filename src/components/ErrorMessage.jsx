const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-state">
      <div className="error-state__icon" role="img" aria-label="Alerta">
        ⚠️
      </div>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
