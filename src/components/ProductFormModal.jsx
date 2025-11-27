import { useEffect, useState } from 'react';

const CATEGORY_OPTIONS = ['Fruta', 'Legume', 'Verdura'];

const toInputValue = (value) => {
  if (value === null || value === undefined) return '';
  return String(value);
};

const getInitialFormState = (produto) => ({
  titulo: produto?.titulo || '',
  descricao: produto?.descricao || '',
  preco: toInputValue(produto?.preco),
  categoria: produto?.categoria || CATEGORY_OPTIONS[0],
  estoque: toInputValue(produto?.estoque),
  dataCriacao: produto?.dataCriacao || ''
});

const ProductFormModal = ({ isOpen, onClose, produto, onSubmit }) => {
  const [formValues, setFormValues] = useState(getInitialFormState(produto));
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverErrors, setServerErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormValues(getInitialFormState(produto));
      setFieldErrors({});
      setServerErrors([]);
    }
  }, [produto, isOpen]);

  if (!isOpen) {
    return null;
  }

  const updateValue = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!formValues.titulo || formValues.titulo.trim().length < 5) {
      errors.titulo = 'Título deve ter pelo menos 5 caracteres.';
    }

    if (formValues.descricao && typeof formValues.descricao !== 'string') {
      errors.descricao = 'Descrição precisa ser um texto válido.';
    }

    const price = Number(formValues.preco);
    if (!formValues.preco || Number.isNaN(price) || price <= 0) {
      errors.preco = 'Informe um preço maior que zero.';
    }

    if (!CATEGORY_OPTIONS.includes(formValues.categoria)) {
      errors.categoria = 'Categoria inválida.';
    }

    if (formValues.estoque !== '' && Number(formValues.estoque) < 0) {
      errors.estoque = 'Estoque não pode ser negativo.';
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length) {
      return;
    }

    setIsSubmitting(true);
    setServerErrors([]);

    try {
      await onSubmit(formValues);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      if (err?.validationErrors?.length) {
        setServerErrors(err.validationErrors);
      } else {
        setServerErrors(['Não foi possível salvar o produto. Tente novamente.']);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal__header">
          <div>
            <p className="badge" style={{ display: 'inline-flex', background: '#eef2ff', color: '#4338ca' }}>
              {produto ? 'Editar produto' : 'Novo produto'}
            </p>
            <h2 className="modal__title">
              {produto ? 'Editar Produto' : 'Adicionar Produto'}
            </h2>
          </div>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Fechar
          </button>
        </div>

        {serverErrors.length > 0 && (
          <div className="error-state" style={{ padding: '1rem' }}>
            <ul>
              {serverErrors.map((errorMessage, index) => (
                <li key={`${errorMessage}-${index}`}>{errorMessage}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label htmlFor="titulo">Título *</label>
            <input
              id="titulo"
              className="input-control"
              value={formValues.titulo}
              onChange={(event) => updateValue('titulo', event.target.value)}
              placeholder="Ex.: Alface Crespa"
            />
            {fieldErrors.titulo && <span className="field-error">{fieldErrors.titulo}</span>}
          </div>

          <div className="form-section">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              className="input-control"
              value={formValues.descricao}
              onChange={(event) => updateValue('descricao', event.target.value)}
              placeholder="Descreva brevemente o produto"
            />
            {fieldErrors.descricao && <span className="field-error">{fieldErrors.descricao}</span>}
          </div>

          <div className="form-grid">
            <div className="form-section">
              <label htmlFor="preco">Preço *</label>
              <input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                className="input-control"
                value={formValues.preco}
                onChange={(event) => updateValue('preco', event.target.value)}
                placeholder="0,00"
              />
              {fieldErrors.preco && <span className="field-error">{fieldErrors.preco}</span>}
            </div>

            <div className="form-section">
              <label htmlFor="categoria">Categoria *</label>
              <select
                id="categoria"
                className="input-control"
                value={formValues.categoria}
                onChange={(event) => updateValue('categoria', event.target.value)}
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {fieldErrors.categoria && <span className="field-error">{fieldErrors.categoria}</span>}
            </div>

            <div className="form-section">
              <label htmlFor="estoque">Estoque</label>
              <input
                id="estoque"
                type="number"
                min="0"
                className="input-control"
                value={formValues.estoque}
                onChange={(event) => updateValue('estoque', event.target.value)}
                placeholder="Opcional"
              />
              {fieldErrors.estoque && <span className="field-error">{fieldErrors.estoque}</span>}
            </div>
          </div>

          <div className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : produto ? 'Salvar alterações' : 'Criar produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
