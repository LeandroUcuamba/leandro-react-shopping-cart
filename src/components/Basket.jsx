import React from 'react';

export default function Basket(props) {
  const { cartItems, onAdd, onRemove } = props;
  const itemsPrice = cartItems.reduce((a, c) => a + c.qty * c.price, 0);
  const totalPrice = itemsPrice;
  return (
    <aside className="block col-2">
      <h2>Pedidos</h2>
      <div>
        {cartItems.length === 0 && <div>Nenhum produto adicionado</div>}
        {cartItems.map((item) => (
          <div key={item.id} className="row">
            <div className="col-2">{item.name}</div>
            <div className="col-2">
              <button onClick={() => onRemove(item)} className="remove">
                -
              </button>{' '}
              <button onClick={() => onAdd(item)} className="add">
                +
              </button>
            </div>

            <div className="col-2 text-right">
              {item.qty} x {item.price.toFixed(2)}Kz
            </div>
          </div>
        ))}

        {cartItems.length !== 0 && (
          <>
            <hr></hr>

            <div className="row">
              <div className="col-2">
                <strong>Preço Total</strong>
              </div>
              <div className="col-1 text-right">
                <strong>{totalPrice.toFixed(2)}Kz</strong>
              </div>
            </div>
            <hr />
            <div className="row">
              <button onClick={() => alert('Implement Checkout!')} id='btn-solicitar'>
                Solicitar Pedido
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
