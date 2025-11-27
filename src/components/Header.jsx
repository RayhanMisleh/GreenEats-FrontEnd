const Header = () => {
  return (
    <header className="app-header">
      <div className="app-header__icon" role="img" aria-label="Folha verde">
        🌱
      </div>
      <h1 className="app-header__title">GreenEats – Catálogo de Produtos</h1>
      <p className="app-header__subtitle">
        Gerencie os produtos dos agricultores de forma simples e sustentável.
      </p>
    </header>
  );
};

export default Header;
