const Badge = ({ label, variant }) => {
  const className = variant ? `badge badge--${variant}` : 'badge';
  return <span className={className}>{label}</span>;
};

export default Badge;
